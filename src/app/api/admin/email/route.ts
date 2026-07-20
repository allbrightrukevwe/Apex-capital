import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

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

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userIds, subject, message } = await req.json();

  if (!userIds?.length || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Get users
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { email: true, firstName: true },
    });

    // Send emails
    const emailPromises = users.map(user => {
      const personalizedMessage = `Hello ${user.firstName || 'User'},\n\n${message}\n\nBest regards,\nApex Capita Team`;
      
      return transporter.sendMail({
        from: `"Apex Capita" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: subject,
        text: personalizedMessage,
      }).catch(err => {
        console.error(`Failed to send to ${user.email}:`, err.message);
        return null;
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${users.length} user(s)`,
      sent: users.length,
    });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send emails' }, { status: 500 });
  }
}