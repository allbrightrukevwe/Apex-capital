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

  const deposits = await prisma.deposit.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    take: 200,
  });

  return NextResponse.json({ success: true, count: deposits.length, data: deposits });
}