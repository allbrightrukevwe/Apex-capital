'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileHeader from '../components/MobileHeader';
import Sidebar from '../components/Sidebar';

// History Header Component
const HistoryHeader = () => (
  <>
    <MobileHeader />
    <header className="hidden lg:flex sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-6 h-13 items-center justify-between">
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">Dashboard</Link>
        <span className="text-slate-600">→</span>
        <span className="text-white font-semibold">Transaction History</span>
      </nav>
      <Link href="/dashboard/notifications" className="relative w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-teal-500/40 hover:text-teal-400 transition">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full" />
      </Link>
    </header>
  </>
);

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
      <div className="lg:ml-64">
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