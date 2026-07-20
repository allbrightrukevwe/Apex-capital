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

  const [totalUsers, activeBots, totalDeposits, totalWithdrawals, totalTrades, totalBotProfit] = await Promise.all([
    prisma.user.count(),
    prisma.bot.count({ where: { status: { in: ['active', 'running'] }, isDeleted: false } }),
    prisma.deposit.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
    prisma.withdrawal.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
    prisma.trade.count(),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'bot_profit', status: 'completed' } }),
  ]);

  return NextResponse.json({
    totalUsers,
    activeBots,
    totalDeposits: totalDeposits._sum.amount || 0,
    totalWithdrawals: totalWithdrawals._sum.amount || 0,
    totalTrades,
    totalBotProfit: totalBotProfit._sum.amount || 0,
  });
}