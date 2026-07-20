import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBotAdapter } from '@/lib/bot/bot-engine-adapter';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams;
    const botId = searchParams.get('botId');

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID is required' },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
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

    const adapter = getBotAdapter(botId, userId);
    const status = await adapter.getBotStatus();

    return NextResponse.json({
      success: true,
      bot: {
        ...bot,
        realtimeStatus: status,
      },
    });
  } catch (error) {
    console.error('Error fetching bot status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { botId, action } = body;

    if (!botId || !action) {
      return NextResponse.json(
        { error: 'Bot ID and action are required' },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
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

    const adapter = getBotAdapter(botId, userId);
    let result;

    switch (action) {
      case 'pause':
        result = await adapter.pauseBot();
        break;
      case 'resume':
        result = await adapter.resumeBot();
        break;
      case 'stop':
        result = await adapter.stopBot();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use pause, resume, or stop' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Error controlling bot:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}