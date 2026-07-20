import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(req: NextRequest): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const admin = await prisma.user.findUnique({
      where: { id: decoded.id || decoded.userId },
      select: { isAdmin: true }
    });
    
    if (!admin?.isAdmin) return null;
    return decoded.id || decoded.userId;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }

  const withdrawals = await prisma.withdrawal.findMany({
    where,
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, balance: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ success: true, withdrawals });
}