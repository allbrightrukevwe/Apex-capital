'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DepositHeader from './components/DepositHeader';

// Sidebar Component
const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      href: '/dashboard/deposit',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v13M5 14l7 7 7-7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Deposit'
    },
    {
      href: '/dashboard/withdraw',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21V8M5 10l7-7 7 7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Withdraw'
    },
    {
      href: '/dashboard/bot-console',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      ),
      label: 'Bot Console'
    },
    {
      href: '/dashboard/live-trading',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Live Trading'
    },
    {
      href: '/dashboard/market',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      label: 'Market Data'
    },
    {
      href: '/dashboard/platform',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      label: 'Live Platform'
    },
    {
      href: '/dashboard/history',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: 'History'
    },
    {
      href: '/dashboard/profile',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: 'Profile'
    },
    {
      href: '/dashboard/support',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: 'Support'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 z-40 bg-slate-900 border-r border-teal-500/10">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-5 py-4 border-b border-teal-500/10 flex-shrink-0">
          <Link href="/" className="text-base font-bold tracking-wider">
            <span className="text-white">APE</span>
            <span className="text-teal-400 text-2xl">X</span>
            <span className="text-white"> CAPITA</span>
          </Link>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2.5 py-3 border-t border-teal-500/10 flex-shrink-0 space-y-0.5">
          <a
            href="mailto:support@apexcapita.io"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-teal-500/8 transition w-full"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Support
          </a>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition w-full">
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

// SVG Coin Icons
const CoinIcons: Record<string, React.ReactNode> = {
  BTC: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#f7931a" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">₿</text>
    </svg>
  ),
  ETH: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#627eea" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">⟠</text>
    </svg>
  ),
  USDT: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#26a17b" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">₮</text>
    </svg>
  ),
  USDC: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#2775ca" />
      <text x="20" y="26" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">USDC</text>
    </svg>
  ),
  SOL: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#9945ff" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">◎</text>
    </svg>
  ),
  BNB: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#f3ba2f" />
      <text x="20" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">BNB</text>
    </svg>
  ),
  DOGE: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#c2a633" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">Ð</text>
    </svg>
  ),
  LTC: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#bfbbbb" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">Ł</text>
    </svg>
  ),
  TRX: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#ef0027" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">TRX</text>
    </svg>
  ),
  XRP: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#00aae4" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">XRP</text>
    </svg>
  ),
  TRC20: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#ef0027" />
      <text x="20" y="26" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">TRC20</text>
    </svg>
  ),
  BSC: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#f3ba2f" />
      <text x="20" y="26" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">BSC</text>
    </svg>
  ),
};

// Main Deposit Page
interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string | React.ReactNode;
  networks: Network[];
}

interface Network {
  id: string;
  name: string;
  icon: string;
}

interface GeneratedAddress {
  address: string;
  qrCode: string;
  privateKey: string;
}

const DepositPage = () => {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState<string>('usdt');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('trc20');
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [generatedAddress, setGeneratedAddress] = useState<GeneratedAddress | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [depositDetected, setDepositDetected] = useState(false);

  const coins: Coin[] = [
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: 'BTC',
      networks: [
        { id: 'btc', name: 'Bitcoin (BTC)', icon: 'BTC' }
      ]
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: 'ETH',
      networks: [
        { id: 'erc20', name: 'Ethereum (ERC20)', icon: 'ETH' }
      ]
    },
    { 
      id: 'usdt', 
      name: 'Tether', 
      symbol: 'USDT', 
      icon: 'USDT',
      networks: [
        { id: 'trc20', name: 'Tron (TRC20)', icon: 'TRC20' },
        { id: 'erc20', name: 'Ethereum (ERC20)', icon: 'ETH' }
      ]
    },
    { 
      id: 'usdc', 
      name: 'USD Coin', 
      symbol: 'USDC', 
      icon: 'USDC',
      networks: [
        { id: 'erc20', name: 'Ethereum (ERC20)', icon: 'ETH' }
      ]
    },
    { 
      id: 'sol', 
      name: 'Solana', 
      symbol: 'SOL', 
      icon: 'SOL',
      networks: [
        { id: 'sol', name: 'Solana', icon: 'SOL' }
      ]
    },
    { 
      id: 'bnb', 
      name: 'BNB', 
      symbol: 'BNB', 
      icon: 'BNB',
      networks: [
        { id: 'bsc', name: 'BSC (BEP20)', icon: 'BSC' }
      ]
    },
    { 
      id: 'doge', 
      name: 'Dogecoin', 
      symbol: 'DOGE', 
      icon: 'DOGE',
      networks: [
        { id: 'doge', name: 'Dogecoin', icon: 'DOGE' }
      ]
    },
    { 
      id: 'ltc', 
      name: 'Litecoin', 
      symbol: 'LTC', 
      icon: 'LTC',
      networks: [
        { id: 'ltc', name: 'Litecoin', icon: 'LTC' }
      ]
    },
    { 
      id: 'trx', 
      name: 'Tron', 
      symbol: 'TRX', 
      icon: 'TRX',
      networks: [
        { id: 'trc20', name: 'Tron (TRC20)', icon: 'TRC20' }
      ]
    },
    { 
      id: 'xrp', 
      name: 'Ripple', 
      symbol: 'XRP', 
      icon: 'XRP',
      networks: [
        { id: 'xrp', name: 'Ripple (XRP)', icon: 'XRP' }
      ]
    },
  ];

  const presetAmounts = [300, 500, 1000];

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // 🔄 Auto-poll for deposit detection while on Step 3
  useEffect(() => {
    if (currentStep !== 3 || !generatedAddress?.address || !isTimerActive || depositDetected) {
      return;
    }

    const pollForDeposit = async () => {
      setIsAutoChecking(true);
      try {
        const response = await fetch('/api/deposit/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ address: generatedAddress.address }),
        });

        const data = await response.json();

        if (data.success && data.deposits && data.deposits.length > 0) {
          setDepositDetected(true);
          setIsTimerActive(false);
          alert('✅ Deposit detected and confirmed automatically!');
          router.push('/dashboard/history');
        }
      } catch (err) {
        console.error('Auto-check polling error:', err);
      } finally {
        setIsAutoChecking(false);
      }
    };

    // Check immediately, then every 8 seconds
    pollForDeposit();
    const pollInterval = setInterval(pollForDeposit, 8000);

    return () => clearInterval(pollInterval);
  }, [currentStep, generatedAddress, isTimerActive, depositDetected, router]);

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId);
    const coin = coins.find(c => c.id === coinId);
    if (coin && coin.networks.length > 0) {
      setSelectedNetwork(coin.networks[0].id);
    }
  };

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
  };

  const handleContinue = () => {
    if (selectedCoin && selectedNetwork) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setIsTimerActive(false);
      setGeneratedAddress(null);
      setDepositDetected(false);
    }
  };

  const handleGenerateAddress = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter an amount');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/deposit/generate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ coin: selectedCoinData?.symbol || 'USDT' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate address');
      }

      setGeneratedAddress({
        address: data.address,
        qrCode: data.qrCode,
        privateKey: data.privateKey,
      });

      const depositResponse = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: selectedCoinData?.symbol || 'USDT',
          network: selectedNetworkData?.name.split(' ')[0] || 'TRC20',
          address: data.address,
          status: 'pending',
        }),
      });

      const depositData = await depositResponse.json();

      if (!depositResponse.ok) {
        console.error('Failed to create deposit record:', depositData);
      }

      setDepositDetected(false);
      setCurrentStep(3);
      setTimeLeft(3600);
      setIsTimerActive(true);

    } catch (err: any) {
      setError(err.message || 'Failed to generate address');
      console.error('Generate address error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!txnId || !generatedAddress) {
      setError('Please enter a transaction ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/deposit/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          txHash: txnId,
          address: generatedAddress.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit transaction');
      }

      alert('✅ Transaction submitted successfully! We will confirm your deposit shortly.');
      router.push('/dashboard/history');

    } catch (err: any) {
      setError(err.message || 'Failed to submit transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const renderCoinIcon = (coin: Coin) => {
    // If it's a string key in CoinIcons
    if (typeof coin.icon === 'string' && CoinIcons[coin.icon]) {
      return CoinIcons[coin.icon];
    }
    
    // Fallback for any other icons
    return (
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
        {coin.symbol.substring(0, 2)}
      </div>
    );
  };

  const renderNetworkIcon = (icon: string) => {
    if (CoinIcons[icon]) {
      return CoinIcons[icon];
    }
    return (
      <div className="w-3.5 h-3.5 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-[6px]">
        {icon.substring(0, 2)}
      </div>
    );
  };

  const selectedCoinData = coins.find(c => c.id === selectedCoin);
  const selectedNetworkData = selectedCoinData?.networks.find(n => n.id === selectedNetwork);

  // QR Code with actual generated address
  const QRCodeSVG = () => {
    const address = generatedAddress?.address || '';

    // If we have a QR code from the API, use it
    if (generatedAddress?.qrCode) {
      return (
        <div className="bg-white p-3 rounded-xl">
          <img 
            src={generatedAddress.qrCode} 
            alt="QR Code" 
            className="w-32 h-32"
            onError={(e) => {
               console.error('QR Code image failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }

    // If we have an address, use QR code API
    if (address) {
      return (
        <div className="bg-white p-3 rounded-xl">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`}
            alt="QR Code"
            className="w-32 h-32"
            onError={(e) => {
              console.error('QR Code API failed, using fallback');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }

    // Fallback: Show placeholder
    return (
      <div className="bg-white p-3 rounded-xl">
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-xs text-gray-500 text-center">QR Code<br/>Will Appear<br/>Here</span>
        </div>
      </div>
    );
  };

  // Step 3: Payment Details
  const renderStep3 = () => {
    const displayAmount = amount || '0.00';
    const address = generatedAddress?.address || '';

    return (
      <div>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* QR Code */}
        <div className="flex justify-center mb-3">
          <QRCodeSVG />
        </div>

        {/* Auto-check status indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className={`w-1.5 h-1.5 rounded-full ${isAutoChecking ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`}></span>
          <span className="text-slate-500 text-[10px]">
            {isAutoChecking ? 'Checking for your deposit...' : 'Waiting for deposit — checks automatically'}
          </span>
        </div>

        {/* Payment Instructions */}
        <p className="text-center text-slate-300 text-xs mb-4">
          Send <span className="text-white font-bold">${displayAmount}</span> in{' '}
          <span className="text-teal-400 font-bold">{selectedCoinData?.symbol}</span> via{' '}
          <span className="text-teal-400 font-bold">{selectedNetworkData?.name.split(' ')[0]}</span>
        </p>

        {/* Payment Address */}
        <div className="mb-2.5">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">
            Payment Address
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={address || 'Generate an address first'}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs min-w-0"
              placeholder="No address generated yet"
            />
            {address && (
              <button
                onClick={() => handleCopy(address)}
                className="p-2 rounded-lg border transition flex-shrink-0 border-slate-700 hover:border-teal-500/50 text-slate-400 hover:text-teal-400"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Amount to Send */}
        <div className="mb-4">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">
            Amount to Send
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={`${displayAmount} ${selectedCoinData?.symbol}`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs min-w-0"
            />
            <button
              onClick={() => handleCopy(`${displayAmount} ${selectedCoinData?.symbol}`)}
              className="p-2 rounded-lg border transition flex-shrink-0 border-slate-700 hover:border-teal-500/50 text-slate-400 hover:text-teal-400"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* TXN ID Section (manual fallback) */}
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-teal-500/20">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <div className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">
                  Time Remaining
                </div>
                <div className="text-slate-500 text-[10px]">
                  We'll detect it automatically once sent
                </div>
              </div>
            </div>
            <div className="text-xl font-bold tabular-nums text-teal-400">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="px-4 py-3">
            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-2">
              Already sent? Confirm manually (optional)
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Paste your TXN hash here"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-teal-500 transition placeholder-slate-600 min-w-0"
                type="text"
              />
              <button
                onClick={handleSubmitTransaction}
                disabled={!txnId || timeLeft <= 0 || isLoading}
                className={`flex-shrink-0 font-bold text-xs px-4 py-2.5 rounded-lg transition ${
                  txnId && timeLeft > 0 && !isLoading
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                  </svg>
                ) : (
                  'Check Now'
                )}
              </button>
            </div>
            <p className="text-slate-600 text-[10px] mt-1.5">
              We automatically check every few seconds — this button just checks immediately.
            </p>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="w-full border border-slate-700 hover:border-teal-500/40 text-white font-semibold py-2.5 rounded-lg transition text-xs"
        >
          ← Go Back
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="lg:ml-60">
        <DepositHeader />

        <main className="px-3 py-4 lg:px-6 lg:py-6 flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 lg:p-5">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white font-bold text-base">Deposit Crypto</h1>
                  <p className="text-slate-400 text-xs">Fund your trading account</p>
                </div>
              </div>

              {/* Error Display */}
              {error && currentStep !== 3 && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}

              {/* Steps */}
              <div className="flex items-center mb-5">
                <div className="flex items-center flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    currentStep >= 1 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    1
                  </div>
                  <div className={`flex-1 h-px mx-1 ${currentStep >= 2 ? 'bg-teal-500' : 'bg-slate-700'}`}></div>
                </div>
                <div className="flex items-center flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    currentStep >= 2 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    2
                  </div>
                  <div className={`flex-1 h-px mx-1 ${currentStep >= 3 ? 'bg-teal-500' : 'bg-slate-700'}`}></div>
                </div>
                <div className="flex items-center flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    currentStep >= 3 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Step 1: Select Coin & Network */}
              {currentStep === 1 && (
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    Select Coin
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {coins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => handleCoinSelect(coin.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition ${
                          selectedCoin === coin.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="w-8 h-8">
                          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                            {renderCoinIcon(coin)}
                          </div>
                        </div>
                        <div className={`text-xs font-bold ${
                          selectedCoin === coin.id ? 'text-teal-400' : 'text-white'
                        }`}>
                          {coin.symbol}
                        </div>
                        <div className="text-slate-500 text-[10px]">{coin.name}</div>
                      </button>
                    ))}
                  </div>

                  {selectedCoinData && selectedCoinData.networks.length > 0 && (
                    <>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        Network
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {selectedCoinData.networks.map((network) => (
                          <button
                            key={network.id}
                            onClick={() => handleNetworkSelect(network.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                              selectedNetwork === network.id
                                ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                                : 'border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex-shrink-0">
                              {renderNetworkIcon(network.icon)}
                            </div>
                            {network.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleContinue}
                    disabled={!selectedCoin || !selectedNetwork}
                    className={`w-full font-bold py-3 rounded-xl transition text-sm tracking-wide ${
                      selectedCoin && selectedNetwork
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-700 disabled:cursor-not-allowed text-slate-500'
                    }`}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Enter Amount */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                    <div className="w-7 h-7 flex-shrink-0">
                      {selectedCoinData && renderCoinIcon(selectedCoinData)}
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold">
                        {selectedCoinData?.symbol} — {selectedNetworkData?.name}
                      </div>
                      <button 
                        onClick={handleBack}
                        className="text-teal-400 text-[10px] hover:text-teal-300"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        Amount (USD)
                      </label>
                      <span className="text-teal-400 text-[10px] font-semibold">Any amount</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500/50 rounded-lg px-3 py-2.5 text-white text-lg placeholder-slate-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handlePresetAmount(preset)}
                        className={`py-2 rounded-lg border text-xs font-semibold transition ${
                          amount === preset.toString()
                            ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 border border-slate-700 hover:border-slate-600 text-white font-semibold py-2.5 rounded-lg transition text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleGenerateAddress}
                      disabled={!amount || parseFloat(amount) < 300 || isGenerating}
                      className={`flex-1 font-bold py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2 ${
                        amount && parseFloat(amount) > 0 && !isGenerating
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-slate-700 disabled:cursor-not-allowed text-slate-500'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate Address'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="text-slate-500 text-[10px] mb-2">OR PAY WITH FIAT</div>
                    <button className="w-full border border-slate-600 hover:border-teal-500/40 text-slate-300 font-semibold py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      Pay with Card / Bank / Mobile Money
                    </button>
                    <p className="text-slate-600 text-[10px] mt-1.5">
                      Powered by Flutterwave — secure checkout in USD.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Details */}
              {currentStep === 3 && renderStep3()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepositPage;