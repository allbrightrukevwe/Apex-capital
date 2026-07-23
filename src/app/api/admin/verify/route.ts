import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
 // ✅ Add this
 // ✅ Add this
    
    const userId = decoded.id || decoded.userId;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
 // ✅ Add this
    
    if (!user?.isAdmin) return NextResponse.json({ error: 'Not admin' }, { status: 403 });

    return NextResponse.json({ isAdmin: true, userId });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}