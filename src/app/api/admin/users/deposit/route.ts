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

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId, amount, description, currency, network } = await req.json();

  if (!userId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount },
        totalDeposits: { increment: amount },
      },
    });

    await tx.deposit.create({
      data: {
        userId,
        amount,
        currency: currency || 'USDT',
        network: network || 'TRC20',
        txHash: `admin_deposit_${Date.now()}`,
        fromAddress: 'admin',
        toAddress: 'user_account',
        status: 'completed',
        confirmations: 1,
        processedAt: new Date(),
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: 'deposit',
        amount,
        currency: 'USD',
        asset: currency || 'USDT',
        status: 'completed',
        description: description && !description.toLowerCase().includes('admin') ? description : `${currency || 'USDT'} deposit`,
        completedAt: new Date(),
      },
    });
  });

  return NextResponse.json({ success: true, message: 'Deposit processed' });
}