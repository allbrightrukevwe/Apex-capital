'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sidebar Component (same as before - kept for brevity)
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

// Market Header Component
const MarketHeader = () => {
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
          <span className="text-white font-semibold">Market Data</span>
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

// Market Data Types
interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
  changeValue: string;
  high: string;
  low: string;
  isUp: boolean;
  category: string;
}

// Market Data Component
const MarketData = () => {
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState('');

  // Live clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const hours12 = String(now.getHours() % 12 || 12).padStart(2, '0');
      setCurrentTime(`${hours12}:${minutes}:${seconds} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const marketData: MarketItem[] = [
    { symbol: 'EUR', name: 'EUR/USD', price: '1.08902', changePercent: '0.14%', changeValue: '0.00152', high: '1.0902', low: '1.0801', isUp: true, category: 'forex' },
    { symbol: 'GBP', name: 'GBP/USD', price: '1.34020', changePercent: '0.06%', changeValue: '0.00077', high: '1.3463', low: '1.3343', isUp: false, category: 'forex' },
    { symbol: 'USD', name: 'USD/JPY', price: '149.864', changePercent: '0.12%', changeValue: '0.18', high: '150.4500', low: '149.2000', isUp: false, category: 'forex' },
    { symbol: 'AUD', name: 'AUD/USD', price: '0.65382', changePercent: '0.13%', changeValue: '0.00088', high: '0.65600', low: '0.64700', isUp: false, category: 'forex' },
    { symbol: 'USD', name: 'USD/CAD', price: '1.36149', changePercent: '0.09%', changeValue: '0.00119', high: '1.3680', low: '1.3560', isUp: true, category: 'forex' },
    { symbol: 'EUR', name: 'EUR/GBP', price: '0.85772', changePercent: '0.05%', changeValue: '0.00044', high: '0.86200', low: '0.85400', isUp: false, category: 'forex' },
    { symbol: 'BTC', name: 'BTC/USD', price: '63,861.08', changePercent: '0.98%', changeValue: '619.07', high: '64,692.83', low: '62,926.01', isUp: true, category: 'crypto' },
    { symbol: 'ETH', name: 'ETH/USD', price: '1,788.30', changePercent: '2.22%', changeValue: '38.9', high: '1,812.00', low: '1,737.68', isUp: true, category: 'crypto' },
    { symbol: 'SOL', name: 'SOL/USD', price: '77.80000', changePercent: '0.4%', changeValue: '0.31', high: '79.6800', low: '77.0700', isUp: false, category: 'crypto' },
    { symbol: 'BNB', name: 'BNB/USD', price: '575.37000', changePercent: '0.73%', changeValue: '4.15', high: '578.3100', low: '568.0200', isUp: true, category: 'crypto' },
    { symbol: 'XRP', name: 'XRP/USD', price: '1.10130', changePercent: '0.61%', changeValue: '0.01', high: '1.1183', low: '1.0891', isUp: true, category: 'crypto' },
    { symbol: 'ADA', name: 'ADA/USD', price: '0.16700', changePercent: '0.54%', changeValue: '0.0009', high: '0.16980', low: '0.16520', isUp: true, category: 'crypto' },
    { symbol: 'DOGE', name: 'DOGE/USD', price: '0.07412', changePercent: '1.28%', changeValue: '0.00094', high: '0.07468', low: '0.07266', isUp: true, category: 'crypto' },
    { symbol: 'LTC', name: 'LTC/USD', price: '44.54000', changePercent: '1.07%', changeValue: '0.47', high: '44.8000', low: '43.5900', isUp: true, category: 'crypto' },
    { symbol: 'XAU', name: 'XAU/USD', price: '4,388.61', changePercent: '0.05%', changeValue: '2.18', high: '4396.6', low: '4380.6', isUp: false, category: 'commodity' },
    { symbol: 'US30', name: 'US30', price: '38,430.036', changePercent: '0.18%', changeValue: '71.03', high: '38,700', low: '38,200', isUp: false, category: 'index' },
  ];

  const filteredData = filter === 'all' 
    ? marketData 
    : marketData.filter(item => item.category === filter);

  const categories = ['all', 'forex', 'crypto', 'commodity', 'index'];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="lg:ml-60">
        <MarketHeader />

        <main className="px-3 py-4 lg:px-6 lg:py-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-2xl">Live Markets</h1>
          </div>

          {/* AI Sentiment */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 bg-slate-900 mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">AI Sentiment:</span>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgb(20, 184, 166)' }}></span>
            <span className="text-[11px] font-bold" style={{ color: 'rgb(20, 184, 166)' }}>Greed</span>
          </div>

          {/* Category Filter with Live Clock */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1 mb-5 flex items-center gap-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                  filter === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="hidden lg:block ml-2 text-slate-600 text-[9px] whitespace-nowrap font-mono tabular-nums">
              {currentTime}
            </span>
          </div>

          {/* Market Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900">
            {/* Table Headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-4 px-4 py-2.5 border-b border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Instrument</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-right">Price</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-right">24H Change</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-right hidden lg:block">24H High</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-right hidden lg:block">24H Low</span>
            </div>

            {/* Table Rows */}
            {filteredData.map((item, index) => (
              <div
                key={`${item.symbol}-${index}`}
                className={`grid grid-cols-[1fr_auto_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-4 px-4 py-3.5 items-center ${
                  index > 0 ? 'border-t border-slate-800' : ''
                } hover:bg-slate-800/40 transition-colors`}
              >
                {/* Instrument */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-7 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-[9px] font-black">{item.symbol}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-semibold">{item.name}</div>
                    <div className="text-slate-500 text-[11px] truncate">
                      {item.name.includes('/') ? item.name.split('/')[1] : 'US Dollar'}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-white text-sm font-semibold text-right tabular-nums">
                  {item.price}
                </div>

                {/* Change */}
                <div className={`text-right ${item.isUp ? 'text-teal-400' : 'text-red-400'}`}>
                  <div className="flex items-center justify-end gap-0.5 text-sm font-bold">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points={item.isUp ? '23 6 13.5 15.5 8.5 10.5 1 18' : '23 18 13.5 8.5 8.5 13.5 1 6'} />
                    </svg>
                    {item.isUp ? '+' : ''}{item.changePercent}
                  </div>
                  <div className="text-[10px] tabular-nums">
                    {item.isUp ? '+' : ''}{item.changeValue}
                  </div>
                </div>

                {/* 24H High - Desktop only */}
                <div className="text-slate-300 text-sm text-right tabular-nums hidden lg:block">
                  {item.high}
                </div>

                {/* 24H Low - Desktop only */}
                <div className="text-slate-300 text-sm text-right tabular-nums hidden lg:block">
                  {item.low}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketData;