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

    const { amount, currency, walletAddress, code } = await req.json();

    if (!amount || !currency || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the withdrawal code
    const verification = await prisma.emailVerification.findFirst({
      where: { email: `withdraw:${user.email}` },
    });

    if (!verification) {
      return NextResponse.json({ error: 'No verification code found. Please request a new code.' }, { status: 400 });
    }
    if (verification.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    if (new Date() > verification.expiresAt) {
      await prisma.emailVerification.delete({ where: { id: verification.id } });
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // Delete used code
    await prisma.emailVerification.delete({ where: { id: verification.id } });

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (user.balance < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: withdrawAmount } },
      });

      const record = await tx.withdrawal.create({
        data: {
          userId,
          amount: withdrawAmount,
          coin: currency,
          network: currency,
          address: walletAddress,
          status: 'pending',
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'withdrawal',
          amount: -withdrawAmount,
          currency: 'USD',
          asset: currency,
          status: 'completed',
          description: `Withdrawal of ${withdrawAmount} ${currency} to ${walletAddress}`,
          completedAt: new Date(),
        },
      });

      return record;
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal processed successfully',
      withdrawal: { id: withdrawal.id, amount: withdrawAmount, coin: currency, status: 'pending' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process withdrawal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get withdrawals' },
      { status: 500 }
    );
  }
}