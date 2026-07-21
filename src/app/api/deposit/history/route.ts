import { NextRequest, NextResponse } from 'next/server';
import { DepositService } from '@/lib/services/deposit.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await DepositService.getUserDeposits(userId);

    return NextResponse.json({ ...result, success: true });
    
  } catch (error) {
    console.error('Error fetching deposit history:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch deposits'
      },
      { status: 500 }
    );
  }
}