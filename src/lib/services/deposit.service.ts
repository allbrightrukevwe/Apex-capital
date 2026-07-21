import { prisma } from '@/lib/prisma';
import { checkAddressForDeposits } from '@/lib/blockchain/tron';
import nodemailer from 'nodemailer';

const MINIMUM_DEPOSIT = 300;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

export class DepositService {
  /**
   * Check for new deposits and record them in database
   */
  static async checkAndRecordDeposits(address: string) {
    try {
      // Find userId from Wallet or DepositAddress
      const wallet = await prisma.wallet.findUnique({ where: { address } });
      const depositAddr = !wallet
        ? await prisma.depositAddress.findUnique({ where: { address } })
        : null;

      const userId = wallet?.userId ?? depositAddr?.userId;

      if (!userId) {
        return { success: false, error: 'Address not found' };
      }

      // Check blockchain for transactions
      const result = await checkAddressForDeposits(address);

      if (!result.hasDeposits) {
        return { success: true, message: 'No new deposits', deposits: [] };
      }

      // Process each transaction
      const newDeposits = [];
      for (const tx of result.transactions) {
        const existingDeposit = await prisma.deposit.findUnique({ 
          where: { txHash: tx.txHash || '' } 
        });
        if (existingDeposit) continue;

        const txTo = tx.to || '';
        const txFrom = tx.from || '';
        const txHash = tx.txHash || '';

        // Ensure depositAddress row exists
        let depositAddressRow = await prisma.depositAddress.findUnique({ 
          where: { address: txTo } 
        });
        if (!depositAddressRow) {
          depositAddressRow = await prisma.depositAddress.create({
            data: {
              userId,
              address: txTo,
              network: tx.network || 'nile',
              isActive: true,
            },
          });
        }

        // Create deposit record
        const deposit = await prisma.deposit.create({
          data: {
            userId,
            addressId: depositAddressRow.id,
            walletId: wallet?.id ?? null,
            txHash: txHash,
            fromAddress: txFrom,
            toAddress: txTo,
            amount: tx.amount,
            currency: tx.currency || 'USDT',
            status: 'confirmed',
            blockNumber: tx.blockNumber || 0,
            confirmations: tx.confirmations || 1,
          },
        });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const isBelowMinimum = tx.amount < MINIMUM_DEPOSIT;

        // Find the single pending transaction tied to this exact deposit (by reference)
        const pendingTx = await prisma.transaction.findFirst({
          where: { userId, status: 'pending', type: 'deposit', reference: deposit.id },
        });

        // If found by reference, update just that one; otherwise fall back to txHash match
        if (pendingTx) {
          await prisma.transaction.update({
            where: { id: pendingTx.id },
            data: {
              amount: tx.amount,
              description: `Deposit ${tx.amount} ${tx.currency || 'USDT'} via ${tx.network || 'TRC20'}`,
              status: 'completed',
              txHash: txHash,
            },
          });
        } else {
          // Create a new completed transaction record for this confirmed deposit
          await prisma.transaction.create({
            data: {
              userId,
              type: 'deposit',
              amount: tx.amount,
              currency: 'USD',
              asset: tx.currency || 'USDT',
              status: 'completed',
              description: `Deposit ${tx.amount} ${tx.currency || 'USDT'} via ${tx.network || 'TRC20'}`,
              reference: deposit.id,
              txHash: txHash,
            },
          });
        }

        // Always credit balance and notify — trading restriction is handled separately
        await prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: tx.amount } },
        });

        await prisma.notification.create({
          data: {
            userId,
            title: 'Deposit Confirmed ✅',
            message: `Your deposit of $${tx.amount} ${tx.currency || 'USDT'} has been confirmed`,
            type: 'DEPOSIT',
            data: { depositId: deposit.id },
          },
        });

        if (isBelowMinimum) {
          // Notify admin of below-minimum deposit
          try {
            await transporter.sendMail({
              from: `"Apex Capita" <${process.env.SMTP_FROM}>`,
              to: process.env.SMTP_USER,
              subject: `Below Minimum Deposit — $${tx.amount} ${tx.currency || 'USDT'} from ${user?.firstName || 'Unknown'} ${user?.lastName || ''}`,
              html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#fff;padding:32px;border-radius:16px">
                  <h2 style="color:#f59e0b;margin-bottom:8px">⚠️ Below Minimum Deposit</h2>
                  <p style="color:#94a3b8;margin-bottom:16px">A deposit was received but is below the $${MINIMUM_DEPOSIT} minimum.</p>
                  <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px">
                    <p style="color:#64748b;font-size:12px;margin:0 0 4px">User</p>
                    <p style="color:#fff;font-size:14px;margin:0 0 12px">${user?.firstName || 'Unknown'} ${user?.lastName || ''} &lt;${user?.email || 'N/A'}&gt;</p>
                    <p style="color:#64748b;font-size:12px;margin:0 0 4px">Amount Deposited</p>
                    <p style="color:#f59e0b;font-size:20px;font-weight:700;margin:0 0 12px">$${tx.amount} ${tx.currency || 'USDT'}</p>
                    <p style="color:#64748b;font-size:12px;margin:0 0 4px">Minimum Required</p>
                    <p style="color:#ef4444;font-size:14px;margin:0 0 12px">$${MINIMUM_DEPOSIT}</p>
                    <p style="color:#64748b;font-size:12px;margin:0 0 4px">TX Hash</p>
                    <p style="color:#e2e8f0;font-size:12px;font-family:monospace;word-break:break-all;margin:0">${txHash}</p>
                  </div>
                  <p style="color:#94a3b8;font-size:12px;margin-top:16px">Balance credited but trading restricted until minimum is met.</p>
                </div>
              `,
            });
          } catch (emailErr) {
            console.error('Below-minimum admin email failed:', emailErr);
          }
        }

        newDeposits.push(deposit);
      }

      return {
        success: true,
        message: `Found ${newDeposits.length} new deposits`,
        deposits: newDeposits,
      };
    } catch (error) {
      console.error('Error checking deposits:', error);
      return { success: false, error: 'Failed to check deposits' };
    }
  }

  /**
   * Generate new wallet address and save to database
   */
  static async generateAddress(userId: number, email: string = '') {
    try {
      const { createRealWallet } = await import('@/lib/blockchain/tron');
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        throw new Error(`User not found. Please ensure you are logged in.`);
      }

      // Create wallet on blockchain
      let dbWallet = null;
      let attempts = 0;
      while (attempts < 3 && !dbWallet) {
        attempts += 1;
        const wallet = await createRealWallet();
        try {
          dbWallet = await prisma.wallet.create({
            data: {
              userId: user.id,
              address: wallet.address,
              privateKey: wallet.privateKey,
              currency: 'USDT',
              network: wallet.network || 'nile',
              isActive: true,
            },
          });
        } catch (err: unknown) {
          const prismaError = err as { code?: string; meta?: { target?: string | string[] } };
          if (prismaError?.code === 'P2002' && prismaError?.meta?.target && 
              String(prismaError.meta.target).includes('address')) {
            continue;
          }
          throw err;
        }
      }

      if (!dbWallet) throw new Error('Failed to generate unique wallet address');

      return {
        success: true,
        address: dbWallet.address,
        privateKey: dbWallet.privateKey,
        walletId: dbWallet.id,
        userId: user.id,
      };
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate deposit address: ${errorMsg}`);
    }
  }

  /**
   * Get all deposits for a user
   */
  static async getUserDeposits(userId: string | number) {
    try {
      const id = parseInt(String(userId), 10);
      const deposits = await prisma.deposit.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        include: { wallet: true, address: true },
      });
      const total = deposits.reduce((sum, d) => sum + d.amount, 0);
      return { 
        success: true, 
        deposits, 
        total, 
        count: deposits.length 
      };
    } catch (error) {
      console.error('Error getting user deposits:', error);
      return { 
        success: false, 
        error: 'Failed to get deposits', 
        deposits: [], 
        total: 0 
      };
    }
  }

  /**
   * Get user's balance
   */
  static async getUserBalance(userId: string | number) {
    try {
      const id = parseInt(String(userId), 10);
      const user = await prisma.user.findUnique({
        where: { id },
        select: { balance: true },
      });

      return {
        success: true,
        balance: user?.balance || 0,
      };
    } catch (error) {
      console.error('Error getting user balance:', error);
      return { success: false, error: 'Failed to get balance' };
    }
  }

  /**
   * Scan all wallets for new deposits (for cron job)
   */
  static async scanAllWallets() {
    try {
      const wallets = await prisma.wallet.findMany({
        where: { isActive: true },
      });

      let totalNewDeposits = 0;
      const results = [];

      for (const wallet of wallets) {
        const result = await this.checkAndRecordDeposits(wallet.address);
        if (result.deposits && result.deposits.length > 0) {
          totalNewDeposits += result.deposits.length;
        }
        results.push({
          address: wallet.address,
          ...result,
        });
      }

      return {
        success: true,
        results: results,
        totalNewDeposits: totalNewDeposits,
      };
    } catch (error) {
      console.error('Error scanning wallets:', error);
      return { success: false, error: 'Failed to scan wallets' };
    }
  }
}