import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const record = await prisma.emailVerification.findFirst({
      where: { email, code },
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please register again.' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    await prisma.emailVerification.deleteMany({ where: { email } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
