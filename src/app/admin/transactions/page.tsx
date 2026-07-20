"use client";

import { useEffect, useState } from "react";
import { 
  Search, RefreshCw, TrendingUp, TrendingDown, 
  Calendar, DollarSign, ArrowUpDown, ArrowUp, ArrowDown,
  User, Filter
} from "lucide-react";

interface Transaction {
  id: string;
  userId: number;
  type: string;
  amount: number;
  currency: string;
  asset: string;
  status: string;
  description: string;
  completedAt: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState<keyof Transaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [page, search, typeFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (typeFilter !== 'all') params.set('filter', typeFilter);
      params.set('page', page.toString());
      
      const response = await fetch(`/api/admin/transactions?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-teal-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-teal-400" />;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'withdrawal':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'bot_profit':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'referral_bonus':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalBotProfit = transactions.filter(t => t.type === 'bot_profit').reduce((s, t) => s + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 mt-1">View all financial transactions across the platform</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Deposits</span>
          </div>
          <p className="text-2xl font-bold text-teal-400">${totalDeposits.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-slate-400 text-sm">Total Withdrawals</span>
          </div>
          <p className="text-2xl font-bold text-red-400">${totalWithdrawals.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-400 text-sm">Bot Profit</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">${totalBotProfit.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Count</span>
          </div>
          <p className="text-2xl font-bold text-white">{transactions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'deposit', label: 'Deposits' },
            { value: 'withdrawal', label: 'Withdrawals' },
            { value: 'bot_profit', label: 'Bot Profit' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setTypeFilter(f.value); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                typeFilter === f.value
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user, description, or asset..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400">User</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center">Type {getSortIcon("type")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className="flex items-center">Amount {getSortIcon("amount")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Asset</th>
                <th className="text-left p-3 text-sm text-slate-400">Description</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">Status {getSortIcon("status")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">Date {getSortIcon("createdAt")}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-slate-500" />
                      <div>
                        <span className="text-sm text-white">{tx.user?.firstName} {tx.user?.lastName}</span>
                        <p className="text-xs text-slate-500">{tx.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-mono text-sm ${tx.amount >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency || 'USD'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-white">{tx.asset || '-'}</td>
                  <td className="p-3 text-sm text-slate-400 max-w-[200px] truncate">{tx.description || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tx.status === 'completed'
                        ? 'bg-teal-500/10 text-teal-400'
                        : tx.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(tx.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 bg-slate-800 rounded-lg text-white disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm ${page === i + 1 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 bg-slate-800 rounded-lg text-white disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}