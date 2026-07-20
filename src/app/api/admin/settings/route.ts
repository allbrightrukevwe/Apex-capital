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

  const settings = await prisma.setting.findMany();
  
  const settingsMap: any = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.type === 'number' ? parseFloat(s.value) : 
                         s.type === 'boolean' ? s.value === 'true' : s.value;
  });

  return NextResponse.json({ success: true, settings: settingsMap });
}

export async function PUT(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();

  const updates = Object.entries(data).map(([key, value]) => {
    const type = typeof value === 'number' ? 'number' : 
                 typeof value === 'boolean' ? 'boolean' : 'string';
    return prisma.setting.upsert({
      where: { key },
      update: { value: String(value), type },
      create: { key, value: String(value), type },
    });
  });

  await Promise.all(updates);

  return NextResponse.json({ success: true, message: 'Settings updated' });
}