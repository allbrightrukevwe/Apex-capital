import QRCode from 'qrcode';

import { TronWeb } from 'tronweb';

const NETWORK = process.env.TRON_NETWORK || 'nile';
const API_KEY = process.env.TRONGRID_API_KEY || '';

const API_URLS: Record<string, string> = {
  nile: 'https://nile.trongrid.io',
  shasta: 'https://api.shasta.trongrid.io',
  mainnet: 'https://api.trongrid.io',
};

const EXPLORER_URLS: Record<string, string> = {
  nile: 'https://nile.tronscan.org',
  shasta: 'https://shasta.tronscan.org',
  mainnet: 'https://tronscan.org',
};

const API_BASE_URL = API_URLS[NETWORK] || API_URLS.nile;
export const EXPLORER_URL = EXPLORER_URLS[NETWORK] || EXPLORER_URLS.nile;

const tronWeb = new TronWeb({
  fullHost: API_BASE_URL,
  headers: { 'TRON-PRO-API-KEY': API_KEY },
});

export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  if (address.length !== 34) return false;
  if (!address.startsWith('T')) return false;
  return true;
}

export async function createRealWallet() {
  try {
    const account = await tronWeb.createAccount();
    return {
      address: account.address.base58,
      hex: account.address.hex,
      privateKey: account.privateKey,
      network: NETWORK,
      explorer: `${EXPLORER_URL}/#/address/${account.address.base58}`,
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create TRON wallet');
  }
}

export async function generateQRCodeForAddress(address: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(address, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

export async function checkUSDTTransactions(address: string, limit: number = 20) {
  try {
    if (!isValidAddress(address)) return [];
    if (!API_KEY) {
      console.warn('⚠️ TRONGRID_API_KEY not set. Skipping transaction check.');
      return [];
    }

    const baseUrl = API_URLS[NETWORK] || API_URLS.nile;
    const url = `${baseUrl}/v1/accounts/${address}/transactions/trc20?limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'TRON-PRO-API-KEY': API_KEY
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch transactions: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.data || data.data.length === 0) return [];

    // Filter for USDT transactions
    const usdtContract = NETWORK === 'mainnet'
      ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // Mainnet USDT
      : 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'; // Nile testnet USDT

    const usdtTransactions = data.data.filter((tx: any) =>
      tx.token_info?.symbol === 'USDT' ||
      tx.contract_address === usdtContract
    );

    return usdtTransactions.map((tx: any) => ({
      txHash: tx.transaction_id,
      from: tx.from,
      to: tx.to,
      amount: parseFloat(tx.value || '0') / 1e6, // USDT has 6 decimals
      currency: 'USDT',
      network: NETWORK,
      blockNumber: tx.block_number || 0,
      confirmations: 1,
      status: 'confirmed',
    }));
  } catch (error) {
    console.error('Error checking USDT transactions:', error);
    return [];
  }
}

export async function checkAddressForDeposits(address: string) {
  try {
    if (!isValidAddress(address)) {
      return { total: 0, transactions: [], hasDeposits: false };
    }

    const transactions = await checkUSDTTransactions(address);
    const total = transactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

    return {
      total,
      transactions: transactions || [],
      hasDeposits: transactions && transactions.length > 0,
      totalDeposits: transactions ? transactions.length : 0,
      address,
    };
  } catch (error) {
    console.error('Error checking address for deposits:', error);
    return { total: 0, transactions: [], hasDeposits: false };
  }
}

export async function verifyTxHash(txHash: string, expectedAddress: string) {
  try {
    if (!txHash || !API_KEY) return { valid: false, error: 'Missing tx hash or API key' };

    const baseUrl = API_URLS[NETWORK] || API_URLS.nile;
    const url = `${baseUrl}/v1/transactions/${txHash}/events`;

    const response = await fetch(url, {
      headers: { 'TRON-PRO-API-KEY': API_KEY },
      cache: 'no-store',
    });

    if (!response.ok) return { valid: false, error: `TronGrid error: ${response.status}` };

    const data = await response.json();
    if (!data.data || data.data.length === 0) return { valid: false, error: 'Transaction not found' };

    // Look for a Transfer event to the expected address
    const usdtContract = NETWORK === 'mainnet'
      ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      : 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

    for (const event of data.data) {
      if (event.contract_address !== usdtContract) continue;
      const toAddr = event.result?.to ? tronWeb.address.fromHex(event.result.to) : null;
      if (!toAddr || toAddr !== expectedAddress) continue;
      const amount = parseFloat(event.result?.value || '0') / 1e6;
      if (amount <= 0) continue;
      return { valid: true, amount, currency: 'USDT', network: NETWORK, txHash };
    }

    return { valid: false, error: 'No matching USDT transfer to your address found in this transaction' };
  } catch (error) {
    console.error('Error verifying tx hash:', error);
    return { valid: false, error: 'Failed to verify transaction' };
  }
}

export { tronWeb };
export default tronWeb;