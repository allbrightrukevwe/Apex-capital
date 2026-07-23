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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';

    const where: any = { userId };

    if (filter !== 'all') {
      where.type = filter;
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { asset: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const summary = {
      totalDeposits: transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
      totalWithdrawals: transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0),
      totalBotProfit: transactions
        .filter(t => t.type === 'bot_profit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    return NextResponse.json({
      success: true,
      transactions,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get transactions' },
      { status: 500 }
    );
  }
}