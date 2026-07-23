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

function verifyAdmin(req: NextRequest): number | null {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.slice(7);
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) return null;
    return decoded.id;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const adminId = verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { depositId, actualAmount } = await req.json();

  if (!actualAmount || isNaN(actualAmount) || actualAmount <= 0)
    return NextResponse.json({ error: 'actualAmount is required' }, { status: 400 });

  const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
  if (!deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
  if (deposit.status === 'confirmed') return NextResponse.json({ error: 'Already confirmed' }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.deposit.update({ where: { id: depositId }, data: { status: 'confirmed', amount: actualAmount } });
    await tx.user.update({ where: { id: deposit.userId }, data: { balance: { increment: actualAmount } } });
    await tx.transaction.updateMany({
      where: { reference: depositId },
      data: { status: 'completed', amount: actualAmount },
    });
  });

  const user = await prisma.user.findUnique({ where: { id: deposit.userId } });

  if (user?.email) {
    const amountStr = `$${actualAmount.toFixed(2)}`;
    const coinStr = deposit.currency;

    try {
      await transporter.sendMail({
        from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject: `Deposit Confirmed — ${amountStr} ${coinStr}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
            <h2 style="color:#2dd4bf;margin-bottom:8px">Deposit Confirmed ✓</h2>
            <p style="color:#94a3b8;margin-bottom:24px">Hi ${user.firstName || 'there'}, your deposit has been confirmed and credited to your account.</p>
            <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px">
              <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                <span style="color:#64748b;font-size:13px">Amount Deposited</span>
                <span style="color:#2dd4bf;font-weight:700;font-size:18px">${amountStr}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                <span style="color:#64748b;font-size:13px">Currency</span>
                <span style="color:#fff;font-size:13px">${coinStr}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                <span style="color:#64748b;font-size:13px">Network</span>
                <span style="color:#fff;font-size:13px">${deposit.network}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="color:#64748b;font-size:13px">Status</span>
                <span style="color:#22c55e;font-size:13px;font-weight:600">Confirmed</span>
              </div>
            </div>
            <p style="color:#94a3b8;font-size:13px">Your account balance has been updated. Thank you for depositing with Apex Capita.</p>
          </div>
        `,
      });
    } catch { /* silent */ }

    try {
      await transporter.sendMail({
        from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_USER,
        subject: `Deposit Confirmed — ${user.firstName} ${user.lastName} (${amountStr} ${coinStr})`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
            <h2 style="color:#2dd4bf;margin-bottom:8px">Deposit Confirmed</h2>
            <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:16px">
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">User</p>
              <p style="color:#fff;font-size:14px;margin:0 0 12px">${user.firstName} ${user.lastName} &lt;${user.email}&gt;</p>
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">Amount</p>
              <p style="color:#2dd4bf;font-size:20px;font-weight:700;margin:0 0 12px">${amountStr} ${coinStr}</p>
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">Network</p>
              <p style="color:#fff;font-size:13px;margin:0">${deposit.network}</p>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/admin/deposits" style="display:inline-block;background:#2dd4bf;color:#0f172a;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">View in Admin Panel</a>
          </div>
        `,
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ success: true, message: 'Deposit confirmed' });
}
