import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBotAdapter } from '@/lib/bot/bot-engine-adapter';
import { createBotActivation } from '@/lib/bot/utils';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const bots = await prisma.bot.findMany({
      where: {
        userId: user.id,
        isDeleted: false,
      },
      include: {
        trades: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get real-time status for each bot
    const botsWithStatus = await Promise.all(
      bots.map(async (bot) => {
        try {
          const adapter = getBotAdapter(bot.id, user.id);
          const status = await adapter.getBotStatus();
          return {
            ...bot,
            realtimeStatus: status,
          };
        } catch (error) {
          return {
            ...bot,
            realtimeStatus: null,
          };
        }
      })
    );

    return NextResponse.json({ 
      success: true,
      bots: botsWithStatus 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { packageId, passkey, tradingPair, amount, sessionDuration, strategy, leverage } = body;

    if (!packageId || !passkey || !tradingPair || !amount || !sessionDuration) {
      return NextResponse.json(
        { error: 'All fields are required: packageId, passkey, tradingPair, amount, sessionDuration' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has enough balance
    const tradeAmount = parseFloat(amount);
    if (user.balance < tradeAmount) {
      return NextResponse.json(
        { error: `Insufficient balance. Have: $${user.balance}, Need: $${tradeAmount}` },
        { status: 400 }
      );
    }

    // Check if package exists
    const botPackage = await prisma.botPackage.findUnique({
      where: { id: packageId },
    });

    if (!botPackage) {
      return NextResponse.json(
        { error: 'Bot package not found' },
        { status: 404 }
      );
    }

    // Create bot activation (this creates the bot record)
    const result = await createBotActivation(
      user.id,
      packageId,
      passkey,
      tradingPair,
      tradeAmount,
      sessionDuration
    );

    // Start the bot engine
    try {
      const adapter = getBotAdapter(result.bot.id, user.id);
      const startResult = await adapter.startBot({
        botId: result.bot.id,
        userId: user.id,
        tradingPair,
        amount: tradeAmount,
        sessionDuration,
        strategy: strategy || 'sma_crossover',
        leverage: leverage || 1,
      });

      if (!startResult.success) {
        // If engine fails to start, still return the bot but with a warning
        return NextResponse.json({
          success: true,
          message: `Bot created but engine start failed: ${startResult.message}`,
          bot: result.bot,
          activation: result.activation,
          warning: startResult.message,
        });
      }
    } catch (engineError) {
      // Bot is created but engine failed - still return success with warning
      return NextResponse.json({
        success: true,
        message: 'Bot created but engine failed to start. Please try restarting.',
        bot: result.bot,
        activation: result.activation,
        warning: 'Engine failed to start',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Bot activated and started successfully',
      bot: {
        id: result.bot.id,
        name: result.bot.name,
        type: result.bot.type,
        status: result.bot.status,
        tradingPair: result.bot.tradingPair,
        amount: result.bot.amount,
        sessionDuration: result.bot.sessionDuration,
        activatedAt: result.bot.activatedAt,
        expiresAt: result.bot.expiresAt,
      },
      activation: result.activation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}