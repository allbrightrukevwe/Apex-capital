import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(req: NextRequest): Promise<{ id: number; name: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const admin = await prisma.user.findUnique({
      where: { id: decoded.id || decoded.userId },
      select: { id: true, isAdmin: true, firstName: true, lastName: true, email: true }
    });
    
    if (!admin?.isAdmin) return null;
    return { id: admin.id, name: `${admin.firstName} ${admin.lastName}`, email: admin.email };
  } catch { return null; }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { withdrawalId, status, notes, transactionHash } = await req.json();

  if (!withdrawalId || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
    include: { user: true }
  });

  if (!withdrawal) {
    return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
  }

  // If rejecting, refund the user
  if (status === 'failed' && withdrawal.status === 'pending') {
    await prisma.user.update({
      where: { id: withdrawal.userId },
      data: { balance: { increment: withdrawal.amount } }
    });
  }

  const updated = await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status,
      processedBy: `${admin.name} (${admin.email})`,
      processedAt: new Date(),
      notes: notes || null,
      transactionHash: transactionHash || null,
    }
  });

  return NextResponse.json({ success: true, withdrawal: updated });
}