import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(req: NextRequest): Promise<{ id: number; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const admin = await prisma.user.findUnique({
      where: { id: decoded.id || decoded.userId },
      select: { id: true, isAdmin: true, firstName: true, lastName: true }
    });
    if (!admin?.isAdmin) return null;
    return { id: admin.id, name: `${admin.firstName} ${admin.lastName}` };
  } catch { return null; }
}

// GET - Admin fetch all messages (oldest first)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    take: 200,
  });

  return NextResponse.json({ success: true, messages });
}

// POST - Admin reply to user
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId, message } = await req.json();
  if (!userId || !message?.trim()) {
    return NextResponse.json({ error: 'User ID and message required' }, { status: 400 });
  }

  const chatMessage = await prisma.chatMessage.create({
    data: {
      userId: parseInt(userId),
      message: message.trim(),
      senderType: 'admin',
      senderName: admin.name,
      isRead: true,
    },
  });

  return NextResponse.json({ success: true, data: chatMessage }, { status: 201 });
}

// PATCH - Mark message as read
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messageId, isRead } = await req.json();
  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { isRead, readAt: isRead ? new Date() : null },
  });

  return NextResponse.json({ success: true });
}

// DELETE - Delete message
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get('id');
  if (!messageId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  await prisma.chatMessage.delete({ where: { id: messageId } });
  return NextResponse.json({ success: true });
}