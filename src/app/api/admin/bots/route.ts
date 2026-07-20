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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const type = searchParams.get('type') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 50;

  const where: any = { isDeleted: false };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { tradingPair: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status) where.status = status;
  if (type) where.type = type;

  const [bots, total] = await Promise.all([
    prisma.bot.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.bot.count({ where }),
  ]);

  return NextResponse.json({ success: true, bots, total, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { botId, name, type, tradingPair, amount, sessionDuration, status } = await req.json();

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (type !== undefined) data.type = type;
  if (tradingPair !== undefined) data.tradingPair = tradingPair;
  if (amount !== undefined) data.amount = parseFloat(amount);
  if (sessionDuration !== undefined) data.sessionDuration = sessionDuration;
  if (status !== undefined) data.status = status;

  await prisma.bot.update({ where: { id: botId }, data });

  return NextResponse.json({ success: true, message: 'Bot updated' });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { botId } = await req.json();

  // Soft delete
  await prisma.bot.update({
    where: { id: botId },
    data: { isDeleted: true, deletedAt: new Date(), status: 'stopped' },
  });

  return NextResponse.json({ success: true, message: 'Bot deleted' });
}