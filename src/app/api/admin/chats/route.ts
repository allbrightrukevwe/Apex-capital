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

  const messages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    take: 200,
  });

  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId, message, senderType } = await req.json();

  const admin = await prisma.user.findUnique({ where: { id: adminId } });

  const chatMessage = await prisma.chatMessage.create({
    data: {
      userId: parseInt(userId),
      message,
      senderType: senderType || 'admin',
      senderName: `${admin?.firstName} ${admin?.lastName}` || 'Admin',
      isRead: true,
    },
  });

  return NextResponse.json({ success: true, message: chatMessage });
}

export async function PATCH(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messageId, isRead } = await req.json();

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { isRead, readAt: isRead ? new Date() : null },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get('id');

  if (!messageId) return NextResponse.json({ error: 'Missing message ID' }, { status: 400 });

  await prisma.chatMessage.delete({ where: { id: messageId } });

  return NextResponse.json({ success: true });
}