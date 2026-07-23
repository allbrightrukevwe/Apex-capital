import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, country, phone, password, currency } = body;

    if (!fullName || !email || !country || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        fullName,
        firstName: fullName?.split(' ')[0] || '',
        lastName: fullName?.split(' ').slice(1).join(' ') || '',
        password: hashedPassword,
        phone,
        country,
        currency: currency || "USD",
        emailVerified: false,
        accounts: {
          create: {
            balance: 0,
            totalDeposits: 0,
            totalWithdrawals: 0,
            totalProfit: 0,
            totalTrades: 0,
          }
        }
      }
    });

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any previous codes for this email
    await prisma.emailVerification.deleteMany({ where: { email } });
    await prisma.emailVerification.create({ data: { email, code, expiresAt } });

    // Send verification email
    await transporter.sendMail({
      from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Verify your Apex Capita account',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
          <h2 style="color:#2dd4bf;margin-bottom:8px">Apex Capita</h2>
          <p style="color:#94a3b8;margin-bottom:24px">Welcome, ${fullName}! Confirm your email to activate your account.</p>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="color:#94a3b8;font-size:13px;margin-bottom:8px">Your verification code</p>
            <p style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2dd4bf;margin:0">${code}</p>
            <p style="color:#64748b;font-size:11px;margin-top:8px">Expires in 15 minutes</p>
          </div>
          <p style="color:#64748b;font-size:12px">If you didn't create this account, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, requiresVerification: true, email }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}