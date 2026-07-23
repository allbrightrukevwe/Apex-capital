import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const packages = [
      {
        id: 'basic',
        name: 'BASIC BOT',
        description: 'Conservative single-pair scalper with 1% risk per trade and ATR-based stop-loss — built for steady entry-level growth.',
        price: 300,
        currency: 'USD',
        tags: ['80% Win Rate', '~45% Monthly'],
        features: ['1 active bot', '1-min signal cycle', 'Up to $500 / trade', 'Fixed 1% risk per trade', 'ATR-based stop-loss', 'Daily loss cap'],
        activeBots: 1,
        winRate: '80%',
        monthlyReturn: '~45%',
        signalCycle: '1-min',
        tradeSize: 'Up to $500',
        riskManagement: 'Fixed 1% risk',
        isActive: true,
        sortOrder: 1,
      },
      {
        id: 'bronze',
        name: 'BRONZE BOT',
        description: 'Adaptive momentum + mean-reversion engine with 30-sec cycles, dynamic position sizing, and daily drawdown caps.',
        price: 700,
        currency: 'USD',
        tags: ['85% Win Rate', '~65% Monthly'],
        features: ['2 active bots', '30-sec signal cycle', 'Up to $2,000 / trade', 'Dynamic position sizing', 'Trend + reversal models', 'Daily drawdown lock'],
        activeBots: 2,
        winRate: '85%',
        monthlyReturn: '~65%',
        signalCycle: '30-sec',
        tradeSize: 'Up to $2,000',
        riskManagement: 'Dynamic sizing',
        isActive: true,
        sortOrder: 2,
      },
      {
        id: 'silver',
        name: 'SILVER BOT',
        description: 'Multi-asset AI ensemble across forex, gold and crypto with real-time volatility scaling and 4-layer risk control.',
        price: 1000,
        currency: 'USD',
        tags: ['95% Win Rate', '~85% Monthly'],
        features: ['5 active bots', 'All signal cycles', 'Up to $10,000 / trade', 'Multi-asset AI ensemble', 'Volatility-scaled sizing', '4-layer risk control'],
        activeBots: 5,
        winRate: '95%',
        monthlyReturn: '~85%',
        signalCycle: 'All cycles',
        tradeSize: 'Up to $10,000',
        riskManagement: '4-layer risk control',
        isActive: true,
        sortOrder: 3,
      },
      {
        id: 'gold',
        name: 'GOLD BOT',
        description: 'Institutional-grade execution: order-flow analytics, latency-optimised entries, hedged exposure and dedicated profit tuning.',
        price: 1500,
        currency: 'USD',
        tags: ['100% Win Rate', '~120% Monthly'],
        features: ['Unlimited bots', 'Sub-second execution', 'Unlimited trade size', 'Order-flow analytics', 'Hedged exposure engine', 'Dedicated profit tuning'],
        activeBots: 999,
        winRate: '100%',
        monthlyReturn: '~120%',
        signalCycle: 'Sub-second',
        tradeSize: 'Unlimited',
        riskManagement: 'Hedged exposure',
        isActive: true,
        sortOrder: 4,
      },
    ];

    const results = [];
    for (const pkg of packages) {
      const existing = await prisma.botPackage.findUnique({
        where: { id: pkg.id },
      });

      if (!existing) {
        const created = await prisma.botPackage.create({
          data: pkg,
        });
        results.push({ id: created.id, name: created.name, status: 'created' });
      } else {
        results.push({ id: existing.id, name: existing.name, status: 'already exists' });
      }
    }

    // Create test passkey
    const passkey = await prisma.passkey.create({
      data: {
        key: 'APEXC-TEST-1234',
        packageId: 'basic',
        userId: null,
        isUsed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Packages created successfully',
      packages: results,
      testPasskey: passkey.key,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create packages' },
      { status: 500 }
    );
  }
}