import { NextRequest, NextResponse } from 'next/server';
import { verifyTxHash } from '@/lib/blockchain/tron';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    userId = decoded.id;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { txHash, address } = await req.json();

    if (!txHash || !address) {
      return NextResponse.json({ success: false, error: 'txHash and address are required' }, { status: 400 });
    }

    // Check if already processed
    const existing = await prisma.deposit.findUnique({ where: { txHash } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'This transaction has already been processed' }, { status: 400 });
    }

    // Verify on-chain
    const verification = await verifyTxHash(txHash, address);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Transaction could not be verified on-chain' },
        { status: 400 }
      );
    }

    const { amount, currency, network } = verification;

    // Ensure depositAddress row exists
    let depositAddressRow = await prisma.depositAddress.findUnique({ where: { address } });
    if (!depositAddressRow) {
      depositAddressRow = await prisma.depositAddress.create({
        data: { userId, address, network: network || 'nile', isActive: true },
      });
    }

    const wallet = await prisma.wallet.findUnique({ where: { address } });

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId,
        addressId: depositAddressRow.id,
        walletId: wallet?.id ?? null,
        txHash,
        fromAddress: '',
        toAddress: address,
        amount: amount!,
        currency: currency || 'USDT',
        status: 'confirmed',
        blockNumber: 0,
        confirmations: 1,
      },
    });

    // Update or create transaction record
    const pendingTx = await prisma.transaction.findFirst({
      where: { userId, status: 'pending', type: 'deposit' },
      orderBy: { createdAt: 'desc' },
    });

    if (pendingTx) {
      await prisma.transaction.update({
        where: { id: pendingTx.id },
        data: {
          amount: amount!,
          description: `Deposit ${amount} ${currency || 'USDT'} via ${network || 'TRC20'}`,
          status: 'completed',
          txHash,
          reference: deposit.id,
        },
      });
    } else {
      await prisma.transaction.create({
        data: {
          userId,
          type: 'deposit',
          amount: amount!,
          currency: 'USD',
          asset: currency || 'USDT',
          status: 'completed',
          description: `Deposit ${amount} ${currency || 'USDT'} via ${network || 'TRC20'}`,
          reference: deposit.id,
          txHash,
        },
      });
    }

    // Credit balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount! } },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Deposit Confirmed ✅',
        message: `Your deposit of $${amount} ${currency || 'USDT'} has been confirmed`,
        type: 'DEPOSIT',
        data: { depositId: deposit.id },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deposit of $${amount} ${currency} verified and credited to your account`,
      amount,
      currency,
    });
  } catch (error) {
    console.error('verify-tx error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify transaction' }, { status: 500 });
  }
}
