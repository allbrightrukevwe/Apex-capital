'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

// History Header Component
const HistoryHeader = () => {
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
          <span className="text-white font-semibold">Transaction History</span>
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

// Transaction History Component
const TransactionHistory = () => {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bot_profit'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalDeposits: 0, totalWithdrawals: 0, totalBotProfit: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('filter', filter === 'bot_profit' ? 'bot_profit' : filter);
      if (searchTerm) params.set('search', searchTerm);
      
      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        setSummary(data.summary || { totalDeposits: 0, totalWithdrawals: 0, totalBotProfit: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter, searchTerm]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'bot_profit': return 'Bot Profit';
      case 'referral_bonus': return 'Referral Bonus';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-teal-400';
      case 'withdrawal': return 'text-red-400';
      case 'bot_profit': return 'text-green-400';
      case 'referral_bonus': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="lg:ml-60">
        <HistoryHeader />

        <main className="px-4 py-5 lg:px-6 lg:py-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <h1 className="text-white font-bold text-xl">Transaction History</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-500 text-[10px] uppercase">Deposits</p>
              <p className="text-teal-400 font-bold text-sm">${summary.totalDeposits.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-500 text-[10px] uppercase">Withdrawals</p>
              <p className="text-red-400 font-bold text-sm">${summary.totalWithdrawals.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-500 text-[10px] uppercase">Bot Profit</p>
              <p className="text-green-400 font-bold text-sm">${summary.totalBotProfit.toFixed(2)}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  filter === 'all'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  filter === 'deposit'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setFilter('withdrawal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  filter === 'withdrawal'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Withdrawal
              </button>
              <button
                onClick={() => setFilter('bot_profit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  filter === 'bot_profit'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Bot Profit
              </button>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">Loading...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center rounded-xl border border-slate-800 bg-slate-900">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-slate-400 font-semibold text-sm">No transactions yet</p>
              <p className="text-slate-600 text-xs mt-1">Your deposit and withdrawal history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-bold ${getTypeColor(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-0.5">
                      {tx.description || `${tx.asset || ''}`}
                    </p>
                    <p className="text-slate-600 text-[10px]">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency || 'USD'}
                    </p>
                    <p className={`text-[10px] ${
                      tx.status === 'completed' ? 'text-teal-400' :
                      tx.status === 'pending' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TransactionHistory;