import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

function getUserIdFromToken(req: NextRequest): number | null {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies.get('token')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id || decoded.userId;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Generate 8-digit code
  const code = String(Math.floor(10000000 + Math.random() * 90000000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Reuse EmailVerification table with a prefixed key to avoid collision with email verify codes
  await prisma.emailVerification.deleteMany({ where: { email: `withdraw:${user.email}` } });
  await prisma.emailVerification.create({ data: { email: `withdraw:${user.email}`, code, expiresAt } });

  try {
    await transporter.sendMail({
      from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: 'Withdrawal Verification Code — Apex Capita',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
          <h2 style="color:#2dd4bf;margin-bottom:8px">Withdrawal Verification</h2>
          <p style="color:#94a3b8;margin-bottom:24px">Hi ${user.firstName || 'there'}, use the code below to confirm your withdrawal.</p>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="color:#94a3b8;font-size:13px;margin-bottom:8px">Your verification code</p>
            <p style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2dd4bf;margin:0">${code}</p>
            <p style="color:#64748b;font-size:11px;margin-top:8px">Expires in 15 minutes</p>
          </div>
          <p style="color:#f59e0b;font-size:13px">If you did not request a withdrawal, please contact support immediately.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Withdrawal code email failed:', err);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Verification code sent to your email' });
}
