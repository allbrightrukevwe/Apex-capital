import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { isValidAddress, createRealWallet, generateQRCodeForAddress } from '../../../../lib/blockchain/tron';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // ✅ REQUIRE AUTHENTICATION
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Verify and extract user ID from token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Please login again.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { address, privateKey } = body;
    
    // Use authenticated user's ID, don't accept userId from request body
    const userId = decoded.id;
    
    if (!address && !privateKey) {
      return NextResponse.json(
        { success: false, error: 'Either address or privateKey is required' },
        { status: 400 }
      );
    }
    
    let finalAddress = address as string | undefined;
    let finalPrivateKey = privateKey as string | undefined;

    // Only create a new on-chain wallet when an address wasn't provided by the client
    if (!finalAddress) {
      const created = await createRealWallet();
      finalAddress = created.address;
      finalPrivateKey = created.privateKey;
    }

    if (!finalAddress) {
      return NextResponse.json(
        { success: false, error: 'Failed to determine address' },
        { status: 500 }
      );
    }

    if (!isValidAddress(finalAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address format' },
        { status: 400 }
      );
    }
    
    // User is already authenticated, just fetch/ensure they exist
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: body.email || 'user@example.com',
          firstName: body.firstName || 'User',
          lastName: body.lastName || 'Unknown',
          password: body.password || crypto.randomBytes(8).toString('hex'),
          balance: 0,
        },
      });
    }
    
    // Encrypt private key before storing
    function encryptPrivateKey(key: string): string {
      try {
        const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
        if (ENCRYPTION_KEY.length !== 32) {
          return `plain:${key}`;
        }

        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(key, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const tag = cipher.getAuthTag();
        return `${iv.toString('base64')}:${encrypted}:${tag.toString('base64')}`;
      } catch (err) {
        return `plain:${key}`;
      }
    }

    const encryptedKey = finalPrivateKey ? encryptPrivateKey(finalPrivateKey) : null;

    // Add address to database
    const wallet = await prisma.wallet.create({
      data: {
        id: randomUUID(),
        userId: userId,
        address: finalAddress,
        privateKey: encryptedKey ?? null,
        currency: body.currency || 'USDT',
        network: body.network || 'nile',
        isActive: true,
        updatedAt: new Date(),
      },
    });

    // Generate a QR code for the address
    let qrCode: string | null = null;
    try {
      qrCode = await generateQRCodeForAddress(finalAddress);
    } catch (err) {
    }

    return NextResponse.json({
      success: true,
      message: 'Address added to database',
      wallet: {
        id: wallet.id,
        address: wallet.address,
        network: wallet.network,
        currency: wallet.currency,
        isActive: wallet.isActive,
        qrCode,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}