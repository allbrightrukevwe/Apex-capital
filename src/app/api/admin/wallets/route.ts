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

  const wallets = await prisma.wallet.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      currency: true,
      network: true,
      address: true,
      isActive: true,
      createdAt: true,
      // ✅ NEVER select privateKey
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
    take: 200,
  });

  return NextResponse.json({ success: true, count: wallets.length, data: wallets });
}