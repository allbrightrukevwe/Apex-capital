import { prisma } from '../prisma';
import { startBotInstance, stopBotInstance, pauseBotInstance, resumeBotInstance, getBotStatus } from './bot-manager';
import { BotInstanceConfig } from './bot-manager';

export interface BotAdapterConfig {
  botId: string;
  userId: number;
  tradingPair: string;
  amount: number;
  sessionDuration: string;
  strategy?: string;
  leverage?: number;
}

export class BotEngineAdapter {
  private botId: string;
  private userId: number;
  private isRunning: boolean = false;
  private statusCheckInterval: NodeJS.Timeout | null = null;

  constructor(botId: string, userId: number) {
    this.botId = botId;
    this.userId = userId;
  }

  async startBot(config: BotAdapterConfig): Promise<{ success: boolean; message: string }> {
    try {
      const bot = await prisma.bot.findUnique({
        where: { id: config.botId },
        include: { user: true },
      });

      if (!bot) {
        return { success: false, message: 'Bot not found' };
      }

      const durationMap: Record<string, number> = {
        '30 Seconds': 30,
        '1 Minute': 60,
        '2 Minutes': 120,
        '5 Minutes': 300,
        '10 Minutes': 600,
        '15 Minutes': 900,
        '30 Minutes': 1800,
        '1 Hour': 3600,
      };

      const sessionSeconds = durationMap[config.sessionDuration] || 60;

      // ✅ botDatabaseId must be the actual database bot ID
      const botConfig: BotInstanceConfig = {
        id: bot.id,
        userId: config.userId,
        name: bot.name || 'Trading Bot',
        strategy: bot.strategy || 'sma_crossover',
        tradeAmount: config.amount,
        tradeInterval: sessionSeconds,
        // Keep full symbol for UI (e.g. XAU/USD)
        asset: config.tradingPair || 'XAU/USD',
        stopLoss: 0.10,
        takeProfit: 0.15,
        maxDailyLoss: 1000,
        maxTradesPerDay: 20,
        sessionDuration: sessionSeconds,
        botDatabaseId: bot.id, // ✅ This is the database ID
        leverage: config.leverage || 1,
      };

      // ✅ Pass the database bot.id to startBotInstance
      await startBotInstance(bot.id, botConfig);

      await prisma.bot.update({
        where: { id: bot.id },
        data: {
          status: 'running',
          lastRunAt: new Date(),
        },
      });

      this.isRunning = true;
      this.startStatusMonitoring();

      return { success: true, message: 'Bot started successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to start bot' };
    }
  }

  async pauseBot(): Promise<{ success: boolean; message: string }> {
    try {
      await pauseBotInstance(this.botId);
      this.isRunning = false;
      return { success: true, message: 'Bot paused' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to pause bot' };
    }
  }

  async resumeBot(): Promise<{ success: boolean; message: string }> {
    try {
      await resumeBotInstance(this.botId);
      this.isRunning = true;
      this.startStatusMonitoring();
      return { success: true, message: 'Bot resumed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to resume bot' };
    }
  }

  async stopBot(): Promise<{ success: boolean; message: string }> {
    try {
      await stopBotInstance(this.botId);
      this.isRunning = false;
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval);
        this.statusCheckInterval = null;
      }
      return { success: true, message: 'Bot stopped' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to stop bot' };
    }
  }

  async getBotStatus() {
    try {
      const status = await getBotStatus(this.botId);

      const trades = await prisma.trade.findMany({
        where: { botId: this.botId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const dbTotalTrades = trades.length;
      const dbWins = trades.filter(t => t.profit != null && t.profit > 0).length;
      const dbLosses = trades.filter(t => t.profit != null && t.profit < 0).length;
      const dbTotalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
      const dbWinRate = dbTotalTrades > 0 ? (dbWins / dbTotalTrades) * 100 : 0;
      // Most recent trade's amount is the best DB-only guess at amountPerTrade
      const dbAmountPerTrade = trades[0]?.amount || 0;

      const dbRecentTrades = trades
        .filter(t => t.type !== 'pending' && Math.abs(t.profit ?? 0) > 0.01)
        .map((t, i) => ({
        id: dbTotalTrades - i,
        sessionNum: dbTotalTrades - i,
        type: (t.type || 'SELL').toUpperCase(),
        pair: t.asset || 'XAU/USD',
        time: t.createdAt
          ? new Date(t.createdAt).toLocaleTimeString('en-US', { hour12: false })
          : '',
        profit: t.profit ?? 0,
        isWin: (t.profit ?? 0) > 0,
      }));

      // ✅ FIX: The old version mixed engine-derived stats and DB-derived stats
      // field-by-field with `||` fallbacks. Some fields (totalTrades, wins,
      // losses, totalProfit, winRate) had a DB fallback; others
      // (sessionsCompleted, amountPerTrade) had NONE and just hardcoded to 0.
      // That produced impossible combinations like "Total Trades: 1" sitting
      // next to "Amt/Trade: $0" and "0/10 sessions" — numbers from two
      // different sources, stitched together inconsistently.
      //
      // Fix: pick ONE coherent source of truth. If the live engine is actually
      // running right now, trust its numbers completely. If it isn't (e.g. the
      // in-memory engine was lost to a hot-reload, or hasn't been created yet),
      // fall back to a complete, self-consistent set of numbers computed from
      // the database instead — never a mix of both.
      const engineIsLive = status?.isRunning === true;

      const stats = engineIsLive
        ? {
            totalTrades: status.stats?.totalTrades ?? 0,
            wins: status.stats?.wins ?? 0,
            losses: status.stats?.losses ?? 0,
            totalProfit: status.stats?.totalProfit ?? 0,
            winRate: status.stats?.winRate ?? 0,
            sessionsCompleted: status.stats?.sessionsCompleted ?? 0,
            totalSessions: status.stats?.totalSessions ?? 10,
            amountPerTrade: status.stats?.amountPerTrade ?? 0,
          }
        : {
            totalTrades: dbTotalTrades,
            wins: dbWins,
            losses: dbLosses,
            totalProfit: dbTotalProfit,
            winRate: dbWinRate,
            sessionsCompleted: dbTotalTrades,
            totalSessions: 10,
            amountPerTrade: dbAmountPerTrade,
          };

      const recentTrades =
        engineIsLive && status?.recentTrades?.length
          ? status.recentTrades
          : dbRecentTrades.map((t, i) => ({ ...t, id: dbRecentTrades.length - i, sessionNum: dbRecentTrades.length - i }));

      return {
        ...status,
        stats,
        recentTrades,
        isRunning: status?.isRunning || false,
        isPaused: status?.isPaused || false,
        status: status?.botStatus || 'stopped',
      };
    } catch (error) {
      return {
        isRunning: false,
        isPaused: false,
        status: 'stopped',
        stats: {
          totalTrades: 0,
          wins: 0,
          losses: 0,
          totalProfit: 0,
          winRate: 0,
          sessionsCompleted: 0,
          totalSessions: 10,
          amountPerTrade: 0,
        },
        recentTrades: [],
      };
    }
  }

  private startStatusMonitoring() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }

    this.statusCheckInterval = setInterval(async () => {
      if (!this.isRunning) return;

      try {
        const status = await getBotStatus(this.botId);
        if (status && status.isRunning) {
          await prisma.bot.update({
            where: { id: this.botId },
            data: {
              totalTrades: status.stats?.totalTrades || 0,
              totalProfit: status.stats?.totalProfit || 0,
              winRate: status.stats?.winRate || 0,
              lastRunAt: new Date(),
            },
          });
        }
      } catch (error) {
      }
    }, 10000);
  }
}

// ✅ FIX: This Map was also a plain module-level variable — the same
// hot-reload wipe problem as bot-manager.ts's activeBots/pausedBots. Pinning
// it to globalThis keeps adapter instances (and their isRunning flag /
// statusCheckInterval) alive across Next.js dev-mode hot-reloads too.
const globalForAdapters = globalThis as unknown as {
  __botInstances?: Map<string, BotEngineAdapter>;
};

const botInstances = globalForAdapters.__botInstances ?? new Map<string, BotEngineAdapter>();
globalForAdapters.__botInstances = botInstances;

export function getBotAdapter(botId: string, userId: number): BotEngineAdapter {
  if (!botInstances.has(botId)) {
    botInstances.set(botId, new BotEngineAdapter(botId, userId));
  }
  return botInstances.get(botId)!;
}