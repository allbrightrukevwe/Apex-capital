import { TradingBotEngine, BotConfig, TradeSignal, TradeHistory } from './bot-engine';
import { getSimplePriceFeed } from './price-feed-simple';
import { prisma } from '../prisma';

export interface BotInstanceConfig extends BotConfig {
  userId: number;
  botDatabaseId: string;
  leverage?: number;
  sessionDuration?: number;
}

// ✅ FIX: In Next.js dev mode, saving any server-side file can trigger a
// hot-reload that re-executes this module from scratch. Plain module-level
// variables get recreated as empty — wiping out every bot's in-memory engine
// even though the database still says it's "running" and the frontend still
// has its botId. That's what forced you to delete + recreate the bot after
// every code change: the old bot's engine was gone from memory, so
// getBotStatus() could never find it again.
//
// Attaching the Maps to `globalThis` survives module re-execution, because
// globalThis itself isn't torn down between hot-reloads the way local module
// state is. This is the same trick used for Prisma clients in Next.js dev.
const globalForBots = globalThis as unknown as {
  __activeBots?: Map<string, TradingBotEngine>;
  __pausedBots?: Map<string, boolean>;
};

const activeBots = globalForBots.__activeBots ?? new Map<string, TradingBotEngine>();
const pausedBots = globalForBots.__pausedBots ?? new Map<string, boolean>();

globalForBots.__activeBots = activeBots;
globalForBots.__pausedBots = pausedBots;

export async function startBotInstance(botId: string, config: BotInstanceConfig): Promise<void> {
  if (activeBots.has(botId)) {
    return;
  }

  const databaseBotId = config.botDatabaseId || botId;

  const bot = await prisma.bot.findUnique({
    where: { id: databaseBotId },
    select: { isDeleted: true }
  });

  if (bot?.isDeleted) {
    return;
  }

  const priceFeed = getSimplePriceFeed();
  const engine = new TradingBotEngine(config, priceFeed);

  engine.setTradeCallback(async (trade: TradeHistory) => {
    const currentBot = await prisma.bot.findUnique({
      where: { id: databaseBotId },
      select: { isDeleted: true, status: true }
    });

    if (currentBot?.isDeleted || currentBot?.status === 'stopped') {
      await stopBotInstance(botId);
      return;
    }

    if (trade.action !== 'sell') return;

    try {
      await prisma.trade.create({
        data: {
          userId: config.userId,
          botId: databaseBotId,
          asset: config.asset,
          type: trade.action,
          amount: trade.amount,
          price: Math.round(trade.price * 100) / 100,
          status: 'completed',
          reason: trade.reason,
          profit: trade.profit ? Math.round(trade.profit * 100) / 100 : 0,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: config.userId } });
      if (user) {
        const newBalance = Math.round((user.balance + (trade.profit || 0)) * 100) / 100;
        await prisma.user.update({
          where: { id: config.userId },
          data: { 
            balance: newBalance,
            totalProfit: { increment: trade.profit || 0 },
            totalTrades: { increment: 1 },
          },
        });

        // ✅ Create transaction record for history page
        await prisma.transaction.create({
          data: {
            userId: config.userId,
            type: 'bot_profit',
            amount: trade.profit || 0,
            currency: 'USD',
            asset: config.asset,
            status: 'completed',
            description: `Bot trade - ${(trade.profit || 0) >= 0 ? 'WIN' : 'LOSS'} $${Math.abs(trade.profit || 0).toFixed(2)}`,
            completedAt: new Date(),
          },
        });
      }

      // Check if all 10 sessions are done — stop the bot in DB
      const completedSells = engine.getTradeHistory().filter(t => t.action === 'sell' && Math.abs(t.profit) > 0.01);
      if (completedSells.length >= 10) {
        activeBots.delete(botId);
        pausedBots.delete(botId);
        try {
          await prisma.bot.update({ where: { id: databaseBotId }, data: { status: 'stopped', lastRunAt: new Date() } });
        } catch (e) {}
      }
    } catch (error) {
    }
  });

  engine.start(async (signal: TradeSignal) => {
    if (pausedBots.get(botId) === true) return;
  });

  activeBots.set(botId, engine);
  pausedBots.set(botId, false);
}

export async function pauseBotInstance(botId: string): Promise<void> {
  const engine = activeBots.get(botId);
  if (!engine) return;
  pausedBots.set(botId, true);
  try {
    await prisma.bot.update({ where: { id: botId }, data: { status: 'paused' } });
  } catch (e) {}
}

export async function resumeBotInstance(botId: string): Promise<void> {
  const engine = activeBots.get(botId);
  if (!engine) return;
  pausedBots.set(botId, false);
  try {
    await prisma.bot.update({ where: { id: botId }, data: { status: 'running' } });
  } catch (e) {}
}

export async function stopBotInstance(botId: string): Promise<void> {
  const engine = activeBots.get(botId);
  if (engine) {
    engine.stop();
    activeBots.delete(botId);
    pausedBots.delete(botId);
    try {
      await prisma.bot.update({ where: { id: botId }, data: { status: 'stopped' } });
    } catch (e) {}
  }
}

export async function getBotStatus(botId: string) {
  const engine = activeBots.get(botId);
  const isPaused = pausedBots.get(botId) || false;
  
  if (engine) {
    const status = engine.getStatus();
    const trades = engine.getTradeHistory();
    
    const completedTrades = trades.filter((t: TradeHistory) =>
      t.action === 'sell' && Math.abs(t.profit) > 0.01
    );
    const totalTrades = completedTrades.length;
    const wins = completedTrades.filter((t: TradeHistory) => t.profit > 0).length;
    const losses = completedTrades.filter((t: TradeHistory) => t.profit < 0).length;
    const totalProfit = completedTrades.reduce((sum: number, t: TradeHistory) => sum + (t.profit || 0), 0);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    // One row per session — odd sessions show BUY, even sessions show SELL
    const recentTrades: any[] = completedTrades
      .slice()
      .reverse()
      .map((sell, i) => {
        const sessionNum = completedTrades.length - i;
        const isWin = sell.profit > 0;
        const pair = engine['config']?.asset || 'XAU/USD';
        const time = sell.timestamp ? new Date(sell.timestamp).toLocaleTimeString('en-US', { hour12: false }) : '';
        const type = sessionNum % 2 !== 0 ? 'BUY' : 'SELL';
        return { id: sessionNum, sessionNum, type, pair, time, profit: sell.profit ?? 0, isWin };
      });

    const engineStatus = engine.getStatus();

    return {
      ...engineStatus,
      isPaused,
      botStatus: isPaused ? 'paused' : (engineStatus.isRunning ? 'running' : 'stopped'),
      stats: {
        totalTrades,
        wins,
        losses,
        totalProfit,
        winRate,
        sessionsCompleted: totalTrades,
        totalSessions: 10,
        amountPerTrade: engine['config']?.tradeAmount || 0,
      },
      recentTrades,
      logs: (engineStatus.logs && engineStatus.logs.length > 0)
        ? engineStatus.logs
        : (status as any)?.logs || [],
      pair: engine['config']?.asset || 'XAU/USD',
      session: engineStatus.session || `Session ${totalTrades}/10`,
      timer: engineStatus.sessionTimer ?? 30,
      confidence: Math.floor(70 + Math.random() * 20),
      nextTrade: engine['config']?.asset || 'XAU/USD',
    };
  }
  
  return getDefaultStatus();
}

function getDefaultStatus() {
  return { 
    isRunning: false, isPaused: false, botStatus: 'stopped',
    trades: [], recentTrades: [],
    stats: { totalTrades: 0, wins: 0, losses: 0, totalProfit: 0, winRate: 0, sessionsCompleted: 0, totalSessions: 10, amountPerTrade: 0 },
    logs: ['Waiting for bot to start...'],
    pair: 'XAU/USD', session: 'Session 0/10', timer: 30, confidence: 70, nextTrade: 'XAU/USD',
  };
}