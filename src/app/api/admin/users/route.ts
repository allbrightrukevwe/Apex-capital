import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyAdmin(req: NextRequest): number | null {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) return null;
    return decoded.id;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true,
      balance: true, isAdmin: true, isActive: true, totalProfit: true,
      totalTrades: true, totalDeposits: true, totalWithdrawals: true,
      createdAt: true, updatedAt: true,
      _count: { select: { bots: true, trades: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = users.map(u => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    phone: u.phone,
    balance: u.balance,
    isAdmin: u.isAdmin,
    isActive: u.isActive,
    deposits: u.totalDeposits,
    withdrawals: u.totalWithdrawals,
    totalPnL: u.totalProfit,
    bots: u._count.bots,
    trades: u._count.trades,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return NextResponse.json({ success: true, users: formatted });
}