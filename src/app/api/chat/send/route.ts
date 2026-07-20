import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - Please login first' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: number };
    const userId = decoded.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const message = formData.get('message') as string;
    const imageFile = formData.get('image') as File | null;

    if (!message?.trim() && !imageFile) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId,
        message: message?.trim() || '',
        imageUrl,
        senderType: 'user',
        senderName: `${user.firstName} ${user.lastName}`,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    // Notify admin by email
    try {
      await transporter.sendMail({
        from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_USER,
        subject: `New support message from ${user.firstName} ${user.lastName}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
            <h2 style="color:#2dd4bf;margin-bottom:8px">New Support Message</h2>
            <p style="color:#94a3b8;margin-bottom:16px">A user has sent a support message.</p>
            <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:16px">
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">From</p>
              <p style="color:#fff;font-size:14px;margin:0 0 12px">${user.firstName} ${user.lastName} &lt;${user.email}&gt;</p>
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">Message</p>
              <p style="color:#e2e8f0;font-size:14px;margin:0">${message?.trim() || '[image attached]'}</p>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/admin/chat" style="display:inline-block;background:#2dd4bf;color:#0f172a;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">View in Admin Panel</a>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Admin notification email failed:', emailErr);
    }

    return NextResponse.json({ success: true, message: 'Message sent', data: chatMessage }, { status: 201 });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}