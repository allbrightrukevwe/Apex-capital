"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, RefreshCw, Eye, Pencil, Trash2, Bot, 
  TrendingUp, TrendingDown, Calendar, DollarSign,
  ArrowUpDown, ArrowUp, ArrowDown, Power, Pause,
  Play, Activity, User, ShieldCheck
} from "lucide-react";

interface BotData {
  id: string;
  name: string;
  type: string;
  tradingPair: string;
  amount: number;
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  status: string;
  isDeleted: boolean;
  sessionDuration: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface EditBotForm {
  name: string;
  type: string;
  tradingPair: string;
  amount: string;
  sessionDuration: string;
  status: string;
}

export default function AdminBots() {
  const router = useRouter();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState<keyof BotData>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Modals
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [editBot, setEditBot] = useState<BotData | null>(null);
  const [editForm, setEditForm] = useState<EditBotForm | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteBot, setDeleteBot] = useState<BotData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      
      const response = await fetch(`/api/admin/bots?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBots(data.bots || []);
      } else {
        setError("Failed to fetch bots");
      }
    } catch (error) {
      console.error("Failed to fetch bots:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [search, statusFilter, typeFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBots();
  };

  const handleSort = (field: keyof BotData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openEdit = (bot: BotData) => {
    setEditBot(bot);
    setEditForm({
      name: bot.name,
      type: bot.type,
      tradingPair: bot.tradingPair,
      amount: bot.amount.toString(),
      sessionDuration: bot.sessionDuration,
      status: bot.status,
    });
    setEditError("");
  };

  const handleEditSave = async () => {
    if (!editBot || !editForm) return;
    setEditLoading(true);
    setEditError("");
    
    try {
      const response = await fetch(`/api/admin/bots`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: editBot.id,
          name: editForm.name,
          type: editForm.type,
          tradingPair: editForm.tradingPair,
          amount: parseFloat(editForm.amount),
          sessionDuration: editForm.sessionDuration,
          status: editForm.status,
        }),
      });
      
      if (response.ok) {
        setEditBot(null);
        setEditForm(null);
        fetchBots();
      } else {
        const data = await response.json();
        setEditError(data.error || "Failed to update bot");
      }
    } catch {
      setEditError("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBot) return;
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/admin/bots', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId: deleteBot.id }),
      });
      if (response.ok) {
        setDeleteBot(null);
        fetchBots();
      }
    } catch (error) {
      console.error("Failed to delete bot:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getSortIcon = (field: keyof BotData) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-teal-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-teal-400" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', icon: Play, label: 'Running' };
      case 'active':
        return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', icon: Activity, label: 'Active' };
      case 'paused':
        return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Pause, label: 'Paused' };
      case 'stopped':
        return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: Power, label: 'Stopped' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: Activity, label: status };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'bronze': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'silver': return 'bg-slate-300/10 text-slate-300 border-slate-300/30';
      case 'gold': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const filteredBots = bots.filter(
    (bot) =>
      bot.name?.toLowerCase().includes(search.toLowerCase()) ||
      bot.tradingPair?.toLowerCase().includes(search.toLowerCase()) ||
      bot.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedBots = [...filteredBots].sort((a, b) => {
    let aVal: any = a[sortField as keyof BotData];
    let bVal: any = b[sortField as keyof BotData];
    
    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalProfit = bots.reduce((sum, b) => sum + (b.totalProfit || 0), 0);
  const totalTrades = bots.reduce((sum, b) => sum + (b.totalTrades || 0), 0);
  const activeBots = bots.filter(b => b.status === 'running' || b.status === 'active').length;

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
          <button onClick={fetchBots} className="mt-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">
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
          <h1 className="text-3xl font-bold text-white">Trading Bots</h1>
          <p className="text-slate-400 mt-1">Monitor and manage all active trading bots</p>
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
            <Bot className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Bots</span>
          </div>
          <p className="text-2xl font-bold text-white">{bots.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Active Bots</span>
          </div>
          <p className="text-2xl font-bold text-teal-400">{activeBots}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Profit</span>
          </div>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Trades</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalTrades}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search bots by name, pair, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">All Status</option>
          <option value="running">Running</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="stopped">Stopped</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">All Types</option>
          <option value="basic">Basic</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </select>
      </div>

      {/* Bots Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">Bot Name {getSortIcon("name")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Owner</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center">Type {getSortIcon("type")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Pair</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className="flex items-center">Amount {getSortIcon("amount")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("totalProfit")}>
                  <div className="flex items-center">Profit {getSortIcon("totalProfit")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("totalTrades")}>
                  <div className="flex items-center">Trades {getSortIcon("totalTrades")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("winRate")}>
                  <div className="flex items-center">Win Rate {getSortIcon("winRate")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">Status {getSortIcon("status")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">Created {getSortIcon("createdAt")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBots.map((bot) => {
                const statusBadge = getStatusBadge(bot.status);
                const StatusIcon = statusBadge.icon;
                const typeColors = getTypeBadge(bot.type);
                
                return (
                  <tr key={bot.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-teal-400" />
                        <span className="font-medium text-white">{bot.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{bot.sessionDuration}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-500" />
                        <div>
                          <span className="text-sm text-white">{bot.user?.firstName} {bot.user?.lastName}</span>
                          <p className="text-xs text-slate-500">{bot.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${typeColors}`}>
                        {bot.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-white">{bot.tradingPair}</td>
                    <td className="p-3 text-white">${bot.amount?.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 font-mono ${bot.totalProfit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                        {bot.totalProfit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {bot.totalProfit >= 0 ? '+' : ''}{bot.totalProfit?.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-white">{bot.totalTrades}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${Math.min(bot.winRate || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">{(bot.winRate || 0).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(bot.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedBot(bot)}
                          className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(bot)}
                          className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-teal-400"
                          title="Edit Bot"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteBot(bot)}
                          className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-red-400"
                          title="Delete Bot"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedBots.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    No bots found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Bot Details</h2>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Bot className="h-7 w-7 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedBot.name}</h3>
                <p className="text-sm text-slate-400">{selectedBot.tradingPair} • {selectedBot.type?.toUpperCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Amount</p>
                <p className="text-lg font-bold text-teal-400">${selectedBot.amount?.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Total Profit</p>
                <p className={`text-lg font-bold ${selectedBot.totalProfit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                  ${selectedBot.totalProfit?.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Win Rate</p>
                <p className="text-lg font-bold text-teal-400">{(selectedBot.winRate || 0).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Trades</p>
                <p className="text-lg font-bold text-white">{selectedBot.totalTrades}</p>
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Owner:</span>
                  <span className="text-white ml-2">{selectedBot.user?.firstName} {selectedBot.user?.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <span className="text-white ml-2">{selectedBot.user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <span className="text-teal-400 ml-2">{selectedBot.status}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-white ml-2">{selectedBot.sessionDuration}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedBot(null)}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Bot Modal */}
      {editBot && editForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Edit Bot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="basic">Basic</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Trading Pair</label>
                <input
                  type="text"
                  value={editForm.tradingPair}
                  onChange={(e) => setEditForm({ ...editForm, tradingPair: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Session Duration</label>
                <input
                  type="text"
                  value={editForm.sessionDuration}
                  onChange={(e) => setEditForm({ ...editForm, sessionDuration: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="active">Active</option>
                  <option value="running">Running</option>
                  <option value="paused">Paused</option>
                  <option value="stopped">Stopped</option>
                </select>
              </div>
              {editError && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{editError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditBot(null); setEditForm(null); }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-slate-950"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm border border-slate-800">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Delete Bot</h2>
            <p className="text-slate-400 text-sm text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{deleteBot.name}</span>
              ? This bot will be soft-deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteBot(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-white"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}