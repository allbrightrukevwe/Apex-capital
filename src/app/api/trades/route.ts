import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserIdFromToken(req: NextRequest): number | null {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      const cookieToken = req.cookies.get('token')?.value;
      if (!cookieToken) return null;
      const decoded = jwt.verify(cookieToken, JWT_SECRET) as any;
      return decoded.id || decoded.userId;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id || decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, type, lotSize, leverage: reqLeverage, stopLoss, takeProfit } = await req.json();

    if (!symbol || !type || !lotSize) {
      return NextResponse.json({ error: 'Missing required fields (symbol, type, lotSize)' }, { status: 400 });
    }

    if (!['BUY', 'SELL'].includes(type.toUpperCase())) {
      return NextResponse.json({ error: 'Type must be BUY or SELL' }, { status: 400 });
    }

    const lot = parseFloat(lotSize);
    if (isNaN(lot) || lot <= 0) {
      return NextResponse.json({ error: 'Invalid lot size' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const leverageValue = reqLeverage || 100;
    const marginRequired = (lot * 100000) / leverageValue;

    if (user.balance < marginRequired) {
      return NextResponse.json({
        error: `Insufficient balance. Required margin: $${marginRequired.toFixed(2)}, Available: $${user.balance.toFixed(2)}`,
        required: marginRequired,
        available: user.balance,
      }, { status: 400 });
    }

    // ✅ Create trade WITHOUT botId for manual trades
    const trade = await prisma.trade.create({
      data: {
        userId,
        asset: symbol,
        type: type.toUpperCase() === 'BUY' ? 'buy' : 'sell',
        amount: lot,
        price: 0,
        status: 'open',
        reason: `Manual ${type.toUpperCase()} trade - ${lot} lots`,
        profit: 0,
        entryTime: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${type.toUpperCase()} order placed successfully`,
      trade: {
        id: trade.id,
        symbol,
        type: type.toUpperCase(),
        lotSize: lot,
        margin: marginRequired,
        status: 'open',
      },
    });
  } catch (error: any) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place trade' },
      { status: 500 }
    );
  }
}

// Get trades
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Get trades where botId is null (manual trades)
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        botId: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      trades,
    });
  } catch (error: any) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get trades' },
      { status: 500 }
    );
  }
}