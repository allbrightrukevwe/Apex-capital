import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { DepositService } from '@/lib/services/deposit.service';
import { generateQRCodeForAddress } from '@/lib/blockchain/tron';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // Require authentication via cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token. Please login again.' },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const userEmail = decoded.email;

    console.log('🔄 Generating wallet for authenticated user:', userId);

    const result = await DepositService.generateAddress(userId, userEmail);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const qrCode = await generateQRCodeForAddress(result.address);

    return NextResponse.json({
      success: true,
      address: result.address,
      privateKey: result.privateKey,
      qrCode: qrCode,
      walletId: result.walletId,
      userId: result.userId,
      message: 'Deposit address generated successfully',
    });

  } catch (error) {
    console.error('Error generating address:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate address'
      },
      { status: 500 }
    );
  }
}