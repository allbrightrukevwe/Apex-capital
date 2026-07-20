import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const { amount, currency, network, address, status } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Minimum deposit amount is $50' }, { status: 400 });
    }

    if (!currency) {
      return NextResponse.json({ error: 'Currency is required' }, { status: 400 });
    }

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    // Find deposit address
    let depositAddress = await prisma.depositAddress.findFirst({ 
      where: { 
        userId: decoded.id,
        address: address,
      } 
    });

    if (!depositAddress) {
      depositAddress = await prisma.depositAddress.create({
        data: {
          id: `addr_${decoded.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          userId: decoded.id,
          address: address,
          network: network || 'TRC20',
          isActive: true,
          updatedAt: new Date(),
        },
      });
    }

    const deposit = await prisma.deposit.create({
      data: {
        id: `dep_${decoded.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId: decoded.id,
        addressId: depositAddress.id,
        amount: parseFloat(amount),
        status: status || 'pending',
        txHash: `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        fromAddress: '',
        toAddress: address,
        currency: currency,
        network: network || 'TRC20',
        confirmations: 0,
      },
    });

    await prisma.transaction.create({
      data: {
        id: `txn_${decoded.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId: decoded.id,
        type: 'deposit',
        amount: parseFloat(amount),
        currency: 'USD',
        asset: currency,
        status: 'pending',
        description: `Deposit ${amount} ${currency} via ${network || 'TRC20'}`,
        reference: deposit.id,
        txHash: deposit.txHash,
      },
    });

    // Email user deposit confirmation + notify admin
    if (user?.email) {
      try {
        await transporter.sendMail({
          from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
          to: user.email,
          subject: 'Deposit Request Received — Apex Capita',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
              <h2 style="color:#2dd4bf;margin-bottom:8px">Deposit Request Received</h2>
              <p style="color:#94a3b8;margin-bottom:24px">Hi ${user.firstName || 'there'}, we have received your deposit request.</p>
              <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px">
                <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                  <span style="color:#64748b;font-size:13px">Amount</span>
                  <span style="color:#2dd4bf;font-weight:700;font-size:16px">$${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                  <span style="color:#64748b;font-size:13px">Currency</span>
                  <span style="color:#fff;font-size:13px">${currency}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                  <span style="color:#64748b;font-size:13px">Network</span>
                  <span style="color:#fff;font-size:13px">${network || 'TRC20'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                  <span style="color:#64748b;font-size:13px">Deposit Address</span>
                  <span style="color:#fff;font-size:12px;font-family:monospace;word-break:break-all">${address}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#64748b;font-size:13px">Status</span>
                  <span style="color:#f59e0b;font-size:13px;font-weight:600">Pending</span>
                </div>
              </div>
              <p style="color:#94a3b8;font-size:13px">Send your crypto to the address above. Your balance will be credited once confirmed.</p>
              <p style="color:#64748b;font-size:11px;margin-top:16px">If you did not initiate this deposit, please contact support immediately.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Deposit user email failed:', emailErr);
      }

      // Notify admin
      try {
        await transporter.sendMail({
          from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
          to: process.env.SMTP_USER,
          subject: `New Deposit Request — ${user.firstName} ${user.lastName} ($${parseFloat(amount).toFixed(2)} ${currency})`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
              <h2 style="color:#2dd4bf;margin-bottom:8px">New Deposit Request</h2>
              <p style="color:#94a3b8;margin-bottom:16px">A user has initiated a deposit.</p>
              <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:16px">
                <p style="color:#64748b;font-size:12px;margin:0 0 4px">User</p>
                <p style="color:#fff;font-size:14px;margin:0 0 12px">${user.firstName} ${user.lastName} &lt;${user.email}&gt;</p>
                <p style="color:#64748b;font-size:12px;margin:0 0 4px">Amount</p>
                <p style="color:#2dd4bf;font-size:20px;font-weight:700;margin:0 0 12px">$${parseFloat(amount).toFixed(2)} ${currency}</p>
                <p style="color:#64748b;font-size:12px;margin:0 0 4px">Network</p>
                <p style="color:#fff;font-size:13px;margin:0 0 12px">${network || 'TRC20'}</p>
                <p style="color:#64748b;font-size:12px;margin:0 0 4px">Deposit Address</p>
                <p style="color:#e2e8f0;font-size:12px;font-family:monospace;word-break:break-all;margin:0">${address}</p>
              </div>
              <a href="${process.env.NEXTAUTH_URL}/admin/deposits" style="display:inline-block;background:#2dd4bf;color:#0f172a;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">View in Admin Panel</a>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Deposit admin email failed:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      depositId: deposit.id,
      amount: deposit.amount,
      currency: deposit.currency,
      status: deposit.status,
      address: deposit.toAddress,
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json({ error: 'Failed to create deposit' }, { status: 500 });
  }
}