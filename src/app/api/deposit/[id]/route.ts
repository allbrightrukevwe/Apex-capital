import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const depositId = params.id;

    // First, get the deposit without including relations
    const deposit = await prisma.deposit.findFirst({
      where: { 
        id: depositId, 
        userId: decoded.id 
      },
    });

    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    // Get the wallet separately if walletId exists
    let wallet = null;
    if (deposit.walletId) {
      wallet = await prisma.wallet.findUnique({
        where: { id: deposit.walletId },
      });
    }

    // Get the deposit address separately if addressId exists
    let depositAddress = null;
    if (deposit.addressId) {
      depositAddress = await prisma.depositAddress.findUnique({
        where: { id: deposit.addressId },
      });
    }

    return NextResponse.json({
      deposit: {
        id: deposit.id,
        address: wallet?.address || depositAddress?.address || deposit.toAddress,
        amount: deposit.amount,
        currency: deposit.currency,
        network: wallet?.network || deposit.network || null,
        status: deposit.status,
        txHash: deposit.txHash,
        fromAddress: deposit.fromAddress,
        toAddress: deposit.toAddress,
        createdAt: deposit.createdAt,
        processedAt: deposit.processedAt,
        confirmations: deposit.confirmations,
        blockNumber: deposit.blockNumber,
      }
    });
  } catch (error) {
    console.error('Error fetching deposit:', error);
    return NextResponse.json({ error: 'Failed to fetch deposit' }, { status: 500 });
  }
}