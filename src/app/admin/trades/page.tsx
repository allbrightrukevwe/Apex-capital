"use client";

import { useEffect, useState } from "react";
import { 
  Search, RefreshCw, Eye, TrendingUp, TrendingDown, 
  Calendar, DollarSign, ArrowUpDown, ArrowUp, ArrowDown,
  Activity, User, Bot, Filter
} from "lucide-react";

interface TradeData {
  id: string;
  asset: string;
  type: string;
  amount: number;
  price: number;
  profit: number;
  status: string;
  reason: string;
  entryTime: string;
  exitTime: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  bot: {
    id: string;
    name: string;
  } | null;
}

export default function AdminTrades() {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState<keyof TradeData>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [selectedTrade, setSelectedTrade] = useState<TradeData | null>(null);

  useEffect(() => {
    fetchTrades();
  }, [page, search, typeFilter, statusFilter]);

  const fetchTrades = async () => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', page.toString());
      
      const response = await fetch(`/api/admin/trades?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTrades(data.trades || []);
        setTotalPages(data.pages || 1);
      } else {
        setError("Failed to fetch trades");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTrades();
  };

  const handleSort = (field: keyof TradeData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof TradeData) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-teal-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-teal-400" />;
  };

  const filteredTrades = trades.filter(
    (trade) =>
      trade.asset?.toLowerCase().includes(search.toLowerCase()) ||
      trade.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      trade.user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    let aVal: any = a[sortField as keyof TradeData];
    let bVal: any = b[sortField as keyof TradeData];
    
    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.profit > 0).length;
  const losses = trades.filter(t => t.profit < 0).length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchTrades} className="mt-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trades</h1>
          <p className="text-slate-400 mt-1">Monitor all trading activity across the platform</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Trades</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalTrades}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Wins</span>
          </div>
          <p className="text-2xl font-bold text-teal-400">{wins}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-slate-400 text-sm">Losses</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{losses}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Profit</span>
          </div>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-teal-400">{winRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset, user email, or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">All Types</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Trades Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400">User</th>
                <th className="text-left p-3 text-sm text-slate-400">Bot</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("asset")}>
                  <div className="flex items-center">Asset {getSortIcon("asset")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center">Type {getSortIcon("type")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className="flex items-center">Amount {getSortIcon("amount")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("price")}>
                  <div className="flex items-center">Price {getSortIcon("price")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("profit")}>
                  <div className="flex items-center">Profit {getSortIcon("profit")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">Status {getSortIcon("status")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">Date {getSortIcon("createdAt")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
                <tr key={trade.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-slate-500" />
                      <div>
                        <span className="text-sm text-white">{trade.user?.firstName} {trade.user?.lastName}</span>
                        <p className="text-xs text-slate-500">{trade.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {trade.bot ? (
                      <div className="flex items-center gap-1.5">
                        <Bot className="h-3 w-3 text-teal-400" />
                        <span className="text-sm text-slate-300">{trade.bot.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Manual</span>
                    )}
                  </td>
                  <td className="p-3 text-white font-medium">{trade.asset}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      trade.type === 'buy' 
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {trade.type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-white">${trade.amount?.toFixed(2)}</td>
                  <td className="p-3 text-white">${trade.price?.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1 font-mono text-sm ${trade.profit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                      {trade.profit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {trade.profit >= 0 ? '+' : ''}{trade.profit?.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      trade.status === 'completed' 
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                        : trade.status === 'open'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(trade.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-teal-400"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {sortedTrades.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    No trades found
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
            className="px-3 py-1.5 bg-slate-800 rounded-lg text-white disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg ${page === i + 1 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 bg-slate-800 rounded-lg text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* View Trade Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Trade Details</h2>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTrade.asset}</h3>
                  <p className="text-sm text-slate-400">{selectedTrade.type?.toUpperCase()} • {selectedTrade.status}</p>
                </div>
              </div>
              <span className={`text-xl font-bold ${selectedTrade.profit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                {selectedTrade.profit >= 0 ? '+' : ''}{selectedTrade.profit?.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">User</p>
                <p className="text-sm text-white">{selectedTrade.user?.firstName} {selectedTrade.user?.lastName}</p>
                <p className="text-xs text-slate-500">{selectedTrade.user?.email}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Bot</p>
                <p className="text-sm text-white">{selectedTrade.bot?.name || 'Manual Trade'}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Amount</p>
                <p className="text-sm text-white">${selectedTrade.amount?.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-sm text-white">${selectedTrade.price?.toFixed(2)}</p>
              </div>
              {selectedTrade.entryTime && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Entry Time</p>
                  <p className="text-sm text-white">{new Date(selectedTrade.entryTime).toLocaleString()}</p>
                </div>
              )}
              {selectedTrade.exitTime && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Exit Time</p>
                  <p className="text-sm text-white">{new Date(selectedTrade.exitTime).toLocaleString()}</p>
                </div>
              )}
            </div>

            {selectedTrade.reason && (
              <div className="bg-slate-800/30 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-500 mb-1">Reason</p>
                <p className="text-sm text-slate-300">{selectedTrade.reason}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedTrade(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}