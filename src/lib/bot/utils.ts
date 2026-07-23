import { prisma } from '../prisma';

export interface BotActivationResult {
  activation: any;
  bot: any;
}

export async function createBotActivation(
  userId: number,
  packageId: string,
  passkey: string,
  tradingPair: string,
  amount: number,
  sessionDuration: string
): Promise<BotActivationResult> {
  try {
    // 1. Get the package
    const botPackage = await prisma.botPackage.findUnique({
      where: { id: packageId },
    });

    if (!botPackage) {
      throw new Error(`Bot package not found: ${packageId}`);
    }

    // 2. Verify passkey exists and is not used
    const passkeyRecord = await prisma.passkey.findFirst({
      where: {
        key: passkey,
        packageId: packageId,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!passkeyRecord) {
      throw new Error('Invalid or expired passkey');
    }

    // 3. Check if user already has an active bot for this package
    const existingBot = await prisma.bot.findFirst({
      where: {
        userId: userId,
        type: packageId,
        status: 'active',
        isDeleted: false,
      },
    });

    if (existingBot) {
      throw new Error('You already have an active bot for this package');
    }

    // 4. Mark passkey as used
    await prisma.passkey.update({
      where: { id: passkeyRecord.id },
      data: {
        isUsed: true,
        usedBy: userId,
        usedAt: new Date(),
      },
    });

    // 5. Create the bot record
    const bot = await prisma.bot.create({
      data: {
        userId: userId,
        name: `${botPackage.name} Bot`,
        type: packageId,
        version: 'v2.1',
        description: botPackage.description,
        strategy: 'ai-driven',
        status: 'active',
        tradingPair: tradingPair,
        amount: amount,
        sessionDuration: sessionDuration,
        passkey: passkey,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        totalTrades: 0,
        totalProfit: 0,
        winRate: 0,
        isDeleted: false,
      },
    });

    // 6. Create bot activation record
    const activation = await prisma.botActivation.create({
      data: {
        userId: userId,
        packageId: packageId,
        passkeyId: passkeyRecord.id,
        botId: bot.id,
        status: 'ACTIVE',
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        settings: {
          tradingPair,
          amount,
          sessionDuration,
        },
      },
    });

    // 7. Create initial trade record for this bot
    await prisma.trade.create({
      data: {
        userId: userId,
        botId: bot.id,
        asset: tradingPair,
        type: 'pending',
        amount: amount,
        price: 0,
        status: 'pending',
        profit: 0,
        profitPercent: 0,
      },
    });

    // 8. Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: userId,
        title: 'Bot Activated',
        message: `Your ${botPackage.name} has been activated and is now trading ${tradingPair}`,
        type: 'bot_activated',
        data: {
          botId: bot.id,
          packageId: packageId,
          tradingPair: tradingPair,
        },
      },
    });

    return {
      activation,
      bot,
    };

  } catch (error) {
    throw error;
  }
}

export async function generatePasskey(packageId: string, userId?: number): Promise<string> {
  // Generate a unique passkey
  const prefix = 'APEXC';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const passkey = `${prefix}-${random}`;
  
  // Check if it already exists
  const exists = await prisma.passkey.findUnique({
    where: { key: passkey },
  });
  
  if (exists) {
    return generatePasskey(packageId, userId);
  }
  
  return passkey;
}

export async function verifyPasskey(passkey: string, packageId: string): Promise<boolean> {
  const key = await prisma.passkey.findFirst({
    where: {
      key: passkey,
      packageId: packageId,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  
  return !!key;
}

export function calculateBotStats(trades: any[]): {
  totalTrades: number;
  wins: number;
  losses: number;
  totalProfit: number;
  winRate: number;
} {
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.profit && t.profit > 0).length;
  const losses = trades.filter(t => t.profit && t.profit < 0).length;
  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  return {
    totalTrades,
    wins,
    losses,
    totalProfit,
    winRate,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getBotSession(botId: string, totalSessions: number = 10): any {
  // This would normally fetch from database or real-time data
  return {
    botId,
    pair: 'XAU/USD',
    version: 'v2.1',
    session: `Session 1/${totalSessions}`,
    totalTrades: 1,
    amountPerTrade: 1000,
    profit: 414.51,
    winRate: 100.0,
    wins: 1,
    losses: 0,
    sessionsCompleted: 1,
    totalSessions,
    timer: 9,
    confidence: 70,
    isPaused: false,
    nextTrade: 'XAU/USD',
    logs: [
      'pressure dominant (60%)',
      '[19:05:00] Entry signal CONFIRMED direction: SELL - confidence: 94%',
      '[19:05:10] Placing market order: SELL XAU/USD @ $2331.45',
      '[19:05:14] Order filled ✓ - stop-loss: $2314.89 - take-profit: +1.78%',
    ],
  };
}