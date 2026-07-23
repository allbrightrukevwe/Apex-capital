import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { DepositService } from '@/lib/services/deposit.service';
import { generateQRCodeForAddress } from '@/lib/blockchain/tron';

const JWT_SECRET = process.env.JWT_SECRET!;

// Static addresses from env for non-USDT coins
const STATIC_ADDRESSES: Record<string, string> = {
  BTC:  process.env.BITCOIN_DEPOSIT_ADDRESS  || '',
  ETH:  process.env.ETHEREUM_RPC_URL         || '', // not an address — handled below
  SOL:  process.env.SOLANA_DEPOSIT_ADDRESS   || '',
  BNB:  process.env.BNB_DEPOSIT_ADDRESS      || '',
  DOGE: process.env.DOGECOIN_DEPOSIT_ADDRESS || '',
  LTC:  process.env.LITECOIN_DEPOSIT_ADDRESS || '',
  TRX:  process.env.TRX_DEPOSIT_ADDRESS      || '',
  XRP:  process.env.XRP_DEPOSIT_ADDRESS      || '',
  USDC: process.env.ETHEREUM_RPC_URL         || '', // not an address — handled below
};

// Proper env mapping
function getStaticAddress(coin: string): string | null {
  const map: Record<string, string | undefined> = {
    BTC:  process.env.BITCOIN_DEPOSIT_ADDRESS,
    SOL:  process.env.SOLANA_DEPOSIT_ADDRESS,
    BNB:  process.env.BNB_DEPOSIT_ADDRESS,
    DOGE: process.env.DOGECOIN_DEPOSIT_ADDRESS,
    LTC:  process.env.LITECOIN_DEPOSIT_ADDRESS,
    TRX:  process.env.TRX_DEPOSIT_ADDRESS,
    XRP:  process.env.XRP_DEPOSIT_ADDRESS,
  };
  return map[coin] || null;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please login first.' }, { status: 401 });
    }

    let decoded: { id: number; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token. Please login again.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const coin = (body.coin || 'USDT').toUpperCase();

    // For USDT (and USDC via ERC20) — generate a dynamic Tron address
    if (coin === 'USDT' || coin === 'USDC') {
      const result = await DepositService.generateAddress(decoded.id, decoded.email);
      if (!result.address) {
        return NextResponse.json({ success: false, error: 'Failed to generate address' }, { status: 400 });
      }
      const qrCode = await generateQRCodeForAddress(result.address);
      return NextResponse.json({
        success: true,
        address: result.address,
        privateKey: result.privateKey,
        qrCode,
        walletId: result.walletId,
        userId: result.userId,
      });
    }

    // For all other coins — return static address from env
    const staticAddress = getStaticAddress(coin);
    if (!staticAddress) {
      return NextResponse.json({ success: false, error: `No deposit address configured for ${coin}` }, { status: 400 });
    }

    const qrCode = await generateQRCodeForAddress(staticAddress);
    return NextResponse.json({
      success: true,
      address: staticAddress,
      privateKey: null,
      qrCode,
      walletId: null,
      userId: decoded.id,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate address' },
      { status: 500 }
    );
  }
}
