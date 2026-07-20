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
  const adminId = verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { depositId } = await req.json();

  const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
  if (!deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
  if (deposit.status === 'confirmed') return NextResponse.json({ error: 'Already confirmed' }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.deposit.update({ where: { id: depositId }, data: { status: 'confirmed' } });
    await tx.user.update({ where: { id: deposit.userId }, data: { balance: { increment: deposit.amount } } });
  });

  return NextResponse.json({ success: true, message: 'Deposit confirmed' });
}