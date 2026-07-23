import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getBotAdapter } from '@/lib/bot/bot-engine-adapter';

const JWT_SECRET = process.env.JWT_SECRET!;

// GET - Get specific bot details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: userId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        version: true,
        description: true,
        strategy: true,
        status: true,
        tradingPair: true,
        amount: true,
        sessionDuration: true,
        activatedAt: true,
        expiresAt: true,
        totalTrades: true,
        totalProfit: true,
        winRate: true,
        settings: true,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // Real-time bot status (logs/trades/timer/etc) for the bot console UI
    const adapter = getBotAdapter(id, userId);
    const status = await adapter.getBotStatus();

    return NextResponse.json({
      success: true,
      bot: {
        ...bot,
        realtimeStatus: status,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update bot status (pause/stop/resume)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const { status } = body;

    if (!status || !['ACTIVE', 'PAUSED', 'STOPPED', 'RUNNING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE, PAUSED, STOPPED, or RUNNING' },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: userId,
        isDeleted: false,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: {
        status: status.toLowerCase(),
        ...(status === 'STOPPED' ? { lastRunAt: new Date() } : {}),
      },
    });

    await prisma.botActivation.updateMany({
      where: { botId: id },
      data: {
        status: status,
        ...(status === 'STOPPED' ? { stoppedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Bot ${status.toLowerCase()} successfully`,
      bot: {
        id: updatedBot.id,
        name: updatedBot.name,
        status: updatedBot.status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Hard delete bot (permanently remove from database)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Find the bot (including soft-deleted ones)
    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // HARD DELETE - Remove all related records
    await prisma.trade.deleteMany({
      where: { botId: id },
    });

    await prisma.botActivation.deleteMany({
      where: { botId: id },
    });

    await prisma.bot.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Bot permanently deleted successfully',
      deleted: {
        id: bot.id,
        name: bot.name,
        type: bot.type,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}