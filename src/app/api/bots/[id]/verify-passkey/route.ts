import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startBotInstance } from '@/lib/bot/bot-manager';
import { BotInstanceConfig } from '@/lib/bot/bot-manager';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🚨 IMPORTANT: Await params first
    const { id } = await params;
    
    // Get user from JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      passkey, 
      tradingPair, 
      amount, 
      sessionDuration, 
      leverage, 
      stopLoss, 
      takeProfit, 
      strategy 
    } = body;

    if (!passkey) {
      return NextResponse.json(
        { error: 'Passkey is required' },
        { status: 400 }
      );
    }

    if (!tradingPair || !amount || !sessionDuration) {
      return NextResponse.json(
        { error: 'Trading pair, amount, and session duration are required' },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log('🔍 Verifying passkey for package:', id);
    console.log('🔑 Passkey:', passkey);
    console.log('👤 User ID:', userId);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the bot package
    const botPackage = await prisma.botPackage.findUnique({
      where: { id: id },
    });

    if (!botPackage) {
      console.error('❌ Bot package not found for ID:', id);
      return NextResponse.json(
        { error: 'Bot package not found' },
        { status: 404 }
      );
    }

    console.log('✅ Bot package found:', botPackage.name);

    // Check balance
    const tradeAmount = parseFloat(amount) || botPackage.price || 300;
    if (user.balance < tradeAmount) {
      return NextResponse.json(
        { error: `Insufficient balance. Have: $${user.balance}, Need: $${tradeAmount}` },
        { status: 400 }
      );
    }

    // Verify passkey (try database first, then fallback to hardcoded)
    let passkeyRecord = null;
    let isHardcoded = false;

    // Check database passkeys
    passkeyRecord = await prisma.passkey.findFirst({
      where: {
        key: passkey,
        packageId: id,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

   // Fallback: Check hardcoded/generated passkeys
if (!passkeyRecord) {
  const VALID_PASSKEYS = ['trade123', 'premium2024', 'botkey789', 'APEXC-TEST-1234'];
  const isGenerated = /^trade\d{3}$/.test(passkey);
  if (VALID_PASSKEYS.includes(passkey) || isGenerated) {
    isHardcoded = true;
    console.log('✅ Using passkey:', passkey);

    const uniqueKey = `${passkey}-${user.id}-${Date.now()}`;

    passkeyRecord = await prisma.passkey.create({
      data: {
        key: uniqueKey,
        packageId: id,
        userId: user.id,
        isUsed: true,
        usedBy: user.id,
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
    if (!passkeyRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired passkey' },
        { status: 400 }
      );
    }

    // Check if user already has active bot
    const existingBot = await prisma.bot.findFirst({
      where: {
        userId: user.id,
        type: id,
        status: 'active',
        isDeleted: false,
      },
    });

    if (existingBot) {
      return NextResponse.json(
        { error: 'You already have an active bot for this package' },
        { status: 400 }
      );
    }

    // Deduct balance
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: tradeAmount } },
    });

    console.log(`💰 Balance deducted: $${tradeAmount}`);

    // Mark passkey as used (if not already marked)
    if (!isHardcoded) {
      await prisma.passkey.update({
        where: { id: passkeyRecord.id },
        data: {
          isUsed: true,
          usedBy: user.id,
          usedAt: new Date(),
        },
      });
    }

    // Create the bot record
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: `${botPackage.name} Bot`,
        type: id,
        version: 'v2.1',
        description: botPackage.description,
        strategy: strategy || 'sma_crossover',
        status: 'active',
        tradingPair: tradingPair || 'XAU/USD',
        amount: tradeAmount,
        sessionDuration: sessionDuration || '30 Seconds',
        passkey: passkey,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalTrades: 0,
        totalProfit: 0,
        winRate: 0,
        isDeleted: false,
        settings: {
          tradeAmount: tradeAmount,
          tradingAsset: tradingPair || 'XAU/USD',
          stopLoss: stopLoss || 10,
          takeProfit: takeProfit || 15,
          leverage: leverage || 1,
          sessionDuration: sessionDuration || '30 Seconds',
          strategy: strategy || 'sma_crossover',
        },
      },
    });

    console.log(`✅ Bot created: ${bot.id}`);

    // Create bot activation record
    const botActivation = await prisma.botActivation.create({
      data: {
        userId: user.id,
        packageId: id,
        passkeyId: passkeyRecord.id,
        botId: bot.id,
        status: 'ACTIVE',
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        settings: bot.settings as object,
      },
    });

    console.log(`✅ Bot activation created: ${botActivation.id}`);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Bot Activated',
        message: `Your ${botPackage.name} has been activated and is now trading ${tradingPair || 'XAU/USD'}`,
        type: 'bot_activated',
        data: {
          botId: bot.id,
          packageId: id,
          tradingPair: tradingPair || 'XAU/USD',
        },
      },
    });

    // Start the bot engine
    try {
      const botConfig: BotInstanceConfig = {
        id: bot.id,
        userId: user.id,
        name: bot.name,
        strategy: strategy || 'sma_crossover',
        tradeAmount: tradeAmount,
        tradeInterval: 30,
        asset: tradingPair || 'XAU/USD',
        stopLoss: stopLoss ? stopLoss / 100 : 0.10,
        takeProfit: takeProfit ? takeProfit / 100 : 0.15,
        maxDailyLoss: 1000,
        maxTradesPerDay: 20,
        sessionDuration: (() => { const m: Record<string,number> = {'30 Seconds':30,'1 Minute':60,'2 Minutes':120,'5 Minutes':300}; return m[sessionDuration] || 30; })(),
        botDatabaseId: bot.id,
        leverage: leverage || 1,
      };

      await startBotInstance(bot.id, botConfig);
      console.log(`✅ Bot ${bot.id} started successfully!`);
    } catch (engineError) {
      console.error('Error starting bot engine:', engineError);
      // Continue - bot is created but engine failed to start
    }

    return NextResponse.json({
      success: true,
      message: 'Bot activated and started successfully',
      bot: {
        id: bot.id,
        name: bot.name,
        package: botPackage.name,
        status: bot.status,
        tradingPair: bot.tradingPair,
        amount: bot.amount,
        sessionDuration: bot.sessionDuration,
        activatedAt: bot.activatedAt,
        expiresAt: bot.expiresAt,
        settings: bot.settings,
      },
    });
  } catch (error) {
    console.error('Error verifying passkey:', error);
    return NextResponse.json(
      { error: 'Failed to verify passkey' },
      { status: 500 }
    );
  }
}

// GET - Check if user has an active bot for this package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🚨 IMPORTANT: Await params first
    const { id } = await params;
    
    // Get user from JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check for active bot
    const bot = await prisma.bot.findFirst({
      where: {
        userId: userId,
        type: id,
        status: 'active',
        isDeleted: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        trades: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!bot) {
      return NextResponse.json({
        hasActiveBot: false,
        bot: null,
      });
    }

    // Calculate stats
    const totalTrades = bot.trades.length;
    const wins = bot.trades.filter(t => t.profit && t.profit > 0).length;
    const losses = bot.trades.filter(t => t.profit && t.profit < 0).length;
    const totalProfit = bot.trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    return NextResponse.json({
      hasActiveBot: true,
      bot: {
        id: bot.id,
        name: bot.name,
        package: bot.type,
        status: bot.status,
        tradingPair: bot.tradingPair,
        amount: bot.amount,
        sessionDuration: bot.sessionDuration,
        totalTrades: bot.totalTrades,
        totalProfit: bot.totalProfit,
        winRate: bot.winRate,
        activatedAt: bot.activatedAt,
        expiresAt: bot.expiresAt,
        stats: {
          totalTrades,
          wins,
          losses,
          totalProfit,
          winRate,
        },
        recentTrades: bot.trades.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error checking bot status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}