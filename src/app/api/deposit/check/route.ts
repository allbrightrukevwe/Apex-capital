import { NextRequest, NextResponse } from 'next/server';
import { DepositService } from '@/lib/services/deposit.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    const result = await DepositService.checkAndRecordDeposits(address);

    return NextResponse.json({ ...result, success: true });
    
  } catch (error) {
    console.error('Error checking deposits:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check deposits'
      },
      { status: 500 }
    );
  }
}