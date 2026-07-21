'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/lib/contexts/UserContext';

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

// LiveTradingHeader Component
const LiveTradingHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-4 lg:px-6 h-13 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/" className="lg:hidden text-sm font-bold tracking-wider">
          <span className="text-white">APE</span>
          <span className="text-teal-400 text-xl">X</span>
          <span className="text-white"> CAPITA</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">
            Dashboard
          </Link>
          <span className="text-slate-600">→</span>
          <span className="text-white font-semibold">Live Trading</span>
        </nav>
      </div>
      <Link
        href="/dashboard/notifications"
        className="relative w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-teal-500/40 hover:text-teal-400 transition"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
      </Link>
    </header>
  );
};

// Chart Component
const ChartComponent = ({ symbol = 'BTCUSDT' }: { symbol?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setKey(prev => prev + 1);
  }, [symbol]);

  const embedUrl = `https://s.tradingview.com/widgetembed/?hideideas=1&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en#%7B%22symbol%22%3A%22BINANCE%3A${symbol}%22%2C%22interval%22%3A%2215%22%2C%22hide_top_toolbar%22%3A%221%22%2C%22hide_legend%22%3A%221%22%2C%22save_image%22%3A%220%22%2C%22studies%22%3A%22%5B%5D%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22studies_overrides%22%3A%22%7B%7D%22%2C%22utm_source%22%3A%22apextradercorp.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22chart%22%2C%22utm_term%22%3A%22BINANCE%3A${symbol}%22%7D`;

  return (
    <div className="w-full h-[500px] bg-slate-900/50 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-400 text-sm mt-3">Loading {symbol} chart...</span>
          </div>
        </div>
      )}
      
      <iframe
        key={key}
        src={embedUrl}
        className="w-full h-full border-0"
        allowTransparency={true}
        scrolling="no"
        allowFullScreen={true}
        title={`${symbol} Trading Chart`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
          <div className="text-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-slate-400 text-sm">Unable to load {symbol} chart</p>
            <button 
              onClick={() => {
                setError(false);
                setIsLoading(true);
                setKey(prev => prev + 1);
              }}
              className="mt-3 text-teal-400 text-xs hover:text-teal-300 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Funded Accounts Component
const FundedAccounts = () => {
  const accounts = [
    { size: '10K', amount: '$10,000', fee: '$99', split: '80%', evaluation: '2-Step', popular: false },
    { size: '25K', amount: '$25,000', fee: '$199', split: '80%', evaluation: '2-Step', popular: false },
    { size: '50K', amount: '$50,000', fee: '$299', split: '85%', evaluation: '1-Step', popular: true },
    { size: '100K', amount: '$100,000', fee: '$499', split: '85%', evaluation: '1-Step', popular: false },
    { size: '200K', amount: '$200,000', fee: '$999', split: '90%', evaluation: '1-Step', popular: false },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      {accounts.map((account) => (
        <div key={account.size} className={`rounded-xl border bg-slate-900 overflow-hidden ${account.popular ? 'border-teal-500' : 'border-slate-800'}`}>
          {account.popular && (
            <div className="bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-widest text-center py-1.5">MOST POPULAR</div>
          )}
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-white font-bold text-base">{account.size} Account</div>
                <div className="text-teal-400 font-black text-2xl">{account.amount}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs">Fee</div>
                <div className="text-white font-bold text-xl">{account.fee}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <div className="text-slate-400 text-[10px] font-semibold mb-0.5">Profit Split</div>
                <div className="text-teal-400 font-bold text-sm">{account.split}</div>
              </div>
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <div className="text-slate-400 text-[10px] font-semibold mb-0.5">Evaluation</div>
                <div className="text-white font-bold text-sm">{account.evaluation}</div>
              </div>
            </div>
            <Link href={`/dashboard/deposit?plan=${account.size}&fee=${account.fee.replace('$', '')}`} className="block w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition text-center">
              Buy
            </Link>
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-white font-bold text-sm mb-4">Challenge Rules</h3>
        <div className="space-y-2">
          {[
            ['Profit Target (Phase 1)', '8% of account size'],
            ['Profit Target (Phase 2 / 1-step)', '5% of account size'],
            ['Max Daily Loss', '5% of account balance'],
            ['Max Total Drawdown', '10% of starting balance'],
            ['Minimum Trading Days', '5 calendar days'],
            ['Trading Style', 'All styles (including EA)'],
            ['Weekend & News Trading', 'Allowed'],
            ['Payout Frequency', 'On-demand after first 14 days'],
            ['Profit Split', 'Up to 90% to the trader'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
              <span className="text-slate-400 text-xs">{label}</span>
              <span className="text-white text-xs font-semibold text-right ml-4">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Live Trading Page
const LiveTradingPage = () => {
  const { user, loading, refresh } = useUserContext();
  const [activeTab, setActiveTab] = useState('live');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [lotSize, setLotSize] = useState('0.1');
  const [customLot, setCustomLot] = useState('');
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState('');

  const symbols = [
    { symbol: 'BTC', name: 'Bitcoin', price: '63,306.00', change: '+2.01%', isUp: true },
    { symbol: 'ETH', name: 'Ethereum', price: '3,284.10', change: '+1.57%', isUp: true },
    { symbol: 'BNB', name: 'BNB', price: '572.42', change: '+1.13%', isUp: true },
    { symbol: 'SOL', name: 'Solana', price: '78.09', change: '+1.00%', isUp: true },
    { symbol: 'XRP', name: 'XRP', price: '1.10', change: '+0.69%', isUp: true },
    { symbol: 'DOGE', name: 'Dogecoin', price: '0.0731', change: '+0.55%', isUp: true },
    { symbol: 'XAU', name: 'Gold', price: '2,654.20', change: '-0.84%', isUp: false },
  ];

  const lotSizes = ['0.01', '0.1', '0.5', '1', '2'];

  // ✅ Place trade function with balance validation
  const handlePlaceTrade = async (type: 'BUY' | 'SELL') => {
    const size = customLot || lotSize;
    if (!size) {
      setTradeError('Please select a lot size');
      setTimeout(() => setTradeError(''), 3000);
      return;
    }

    setTradeLoading(true);
    setTradeError('');
    setTradeSuccess('');

    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          type,
          lotSize: parseFloat(size),
          leverage: 100,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setTradeError(data.error || 'Trade failed');
        setTimeout(() => setTradeError(''), 5000);
        return;
      }

      setTradeSuccess(`${type} order placed successfully!`);
      setTimeout(() => setTradeSuccess(''), 3000);
      
      // Refresh user context to update balance
      if (refresh) refresh();
    } catch (err: any) {
      setTradeError(err.message || 'Failed to place trade');
      setTimeout(() => setTradeError(''), 5000);
    } finally {
      setTradeLoading(false);
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleLotSelect = (size: string) => {
    setLotSize(size);
    setCustomLot('');
  };

  const handleCustomLotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLot(e.target.value);
    setLotSize('');
  };

  const selectedSymbolData = symbols.find(s => s.symbol === selectedSymbol);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="lg:ml-60">
        <LiveTradingHeader />
        <main className="px-3 py-3 lg:px-6 lg:py-4">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1">
              <button onClick={() => setActiveTab('live')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition border-b-2 -mb-3 ${activeTab === 'live' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>Live Trading
              </button>
              <button onClick={() => setActiveTab('funded')} className={`px-3 py-1.5 text-sm font-semibold transition border-b-2 -mb-3 ${activeTab === 'funded' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                Funded Accounts
              </button>
            </div>
            <span className="text-amber-400 font-bold text-sm">{loading ? '$...' : `$${user?.balance?.toFixed(2) || '0.00'}`}</span>
          </div>

          {activeTab === 'live' ? (
            <>
              {/* Account Selector */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 mb-3">
                <button className="w-full flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <span className="text-white text-sm font-semibold">Personal Account · ${loading ? '' : (user?.balance?.toFixed(2) || '0.00')}</span>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </div>

              {/* Alerts */}
              {tradeError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-3 animate-fade-in">
                  <p className="text-red-400 text-xs font-bold">❌ {tradeError}</p>
                </div>
              )}
              {tradeSuccess && (
                <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 mb-3 animate-fade-in">
                  <p className="text-teal-400 text-xs font-bold">✅ {tradeSuccess}</p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-0 rounded-xl border border-slate-800 bg-teal-950/30 mb-3 overflow-hidden">
                <div className="flex flex-col items-center py-2 px-1.5 border-r border-slate-800">
                  <span className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">BAL</span>
                  <span className="font-bold text-xs text-white">${loading ? '' : (user?.balance?.toFixed(2) || '0.00')}</span>
                </div>
                <div className="flex flex-col items-center py-2 px-1.5 border-r border-slate-800">
                  <span className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">EQUITY</span>
                  <span className="font-bold text-xs text-teal-400">${loading ? '' : (user?.balance?.toFixed(2) || '0.00')}</span>
                </div>
                <div className="flex flex-col items-center py-2 px-1.5 border-r border-slate-800">
                  <span className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">P/L</span>
                  <span className="font-bold text-xs text-teal-400">+$0.00</span>
                </div>
                <div className="flex flex-col items-center py-2 px-1.5">
                  <span className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">MARGIN</span>
                  <span className="font-bold text-xs text-white">$0.00</span>
                </div>
              </div>

              {/* Symbol Selector */}
              <div className="overflow-x-auto mb-2.5">
                <div className="flex items-center gap-1.5 min-w-max">
                  {symbols.map((item) => (
                    <button key={item.symbol} onClick={() => handleSymbolSelect(item.symbol)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${selectedSymbol === item.symbol ? 'bg-teal-500 border-teal-500 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-500/50'}`}>
                      {item.symbol}
                      <span className={`text-[9px] font-semibold ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>{item.isUp ? '▲' : '▼'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-4 lg:items-start">
                <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden mb-3 lg:mb-4">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                    <div>
                      <div className="font-bold text-white text-sm">{selectedSymbolData?.name || 'Bitcoin'}</div>
                      <div className="text-slate-500 text-[10px]">{selectedSymbol}USDT</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-base">${selectedSymbolData?.price || '63,306.00'}</div>
                      <div className={`text-xs font-semibold flex items-center gap-1 justify-end ${selectedSymbolData?.isUp ? 'text-teal-400' : 'text-red-400'}`}>
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points={selectedSymbolData?.isUp ? '22 7 13.5 15.5 8.5 10.5 2 17' : '22 17 13.5 8.5 8.5 13.5 2 7'} />
                          <polyline points={selectedSymbolData?.isUp ? '16 7 22 7 22 13' : '16 17 22 17 22 11'} />
                        </svg>
                        {selectedSymbolData?.isUp ? '+' : ''}{selectedSymbolData?.change || '+2.01%'}
                      </div>
                    </div>
                  </div>
                  <ChartComponent symbol={`${selectedSymbol}USDT`} />
                </div>

                {/* Trading Panel */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-white text-sm">Place Trade</span>
                      <span className="text-slate-400 text-xs">Margin: <span className="text-white font-semibold">$10.00</span></span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs">Lot Size</span>
                      <span className="text-slate-400 text-xs">P&L /1% move: <span className="text-white font-semibold">$10.00</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {lotSizes.map((size) => (
                        <button key={size} onClick={() => handleLotSelect(size)} className={`flex-1 min-w-0 py-1.5 rounded-lg text-xs font-bold border transition ${lotSize === size ? 'bg-teal-500 border-teal-500 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-500/50'}`}>{size}</button>
                      ))}
                    </div>
                    <input type="number" placeholder="Custom lot (e.g. 0.25)" value={customLot} onChange={handleCustomLotChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 mb-3" />
                    <div className="flex items-center gap-2 mb-3">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                      </svg>
                      <span className="text-slate-300 text-xs font-semibold flex-1">Stop Loss & Take Profit</span>
                      <button onClick={() => setStopLossEnabled(!stopLossEnabled)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${stopLossEnabled ? 'bg-teal-500' : 'bg-slate-700'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${stopLossEnabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{stopLossEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handlePlaceTrade('BUY')} disabled={tradeLoading} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition disabled:opacity-50">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        {tradeLoading ? '...' : 'BUY'}
                      </button>
                      <button onClick={() => handlePlaceTrade('SELL')} disabled={tradeLoading} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition disabled:opacity-50">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>
                        {tradeLoading ? '...' : 'SELL'}
                      </button>
                    </div>
                  </div>

                  {/* Trades */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.53" /></svg>
                      <span className="font-semibold text-white text-sm">Trades</span>
                    </div>
                    <p className="text-slate-500 text-xs text-center py-4">No trades yet</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-5">
                <h2 className="text-white font-bold text-lg">Get Funded</h2>
                <p className="text-slate-400 text-sm mt-0.5">Pass the evaluation to trade our capital and keep up to 90% of profits.</p>
              </div>
              <FundedAccounts />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LiveTradingPage;