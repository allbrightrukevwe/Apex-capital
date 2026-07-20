"use client";

import { useEffect, useState } from "react";
import { 
  Search, Eye, CheckCircle, XCircle, RefreshCw, Clock, 
  Download, TrendingUp, DollarSign, Copy, Check, AlertCircle
} from "lucide-react";

interface Withdrawal {
  id: string;
  amount: number;
  coin: string;
  network: string;
  address: string;
  fee: number;
  status: string;
  transactionHash?: string;
  notes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    balance: number;
  };
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch("/api/admin/withdrawals");
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWithdrawals();
  };

  const handleUpdateStatus = async (withdrawalId: string, status: string) => {
    setProcessingId(withdrawalId);
    try {
      const response = await fetch("/api/admin/withdrawals/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, status, notes, transactionHash }),
      });
      if (response.ok) {
        await fetchWithdrawals();
        setSelectedWithdrawal(null);
        setNotes("");
        setTransactionHash("");
      }
    } catch (error) {
      console.error("Failed to update withdrawal:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFilteredWithdrawals = () => {
    return withdrawals.filter(w => {
      const matchesSearch = !search || 
        w.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        w.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        w.address?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || w.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredWithdrawals = getFilteredWithdrawals();
  const pendingCount = withdrawals.filter(w => w.status === "pending").length;
  const completedCount = withdrawals.filter(w => w.status === "completed").length;
  const failedCount = withdrawals.filter(w => w.status === "failed").length;
  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);

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
          <h1 className="text-3xl font-bold text-white">Withdrawals</h1>
          <p className="text-slate-400 mt-1">Track and manage all withdrawal requests</p>
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
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-teal-400">{completedCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Amount</p>
          <p className="text-2xl font-bold text-teal-400">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Requests</p>
          <p className="text-2xl font-bold text-white">{withdrawals.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === status
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by email, name, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400">User</th>
                <th className="text-left p-3 text-sm text-slate-400">Amount</th>
                <th className="text-left p-3 text-sm text-slate-400">Coin/Network</th>
                <th className="text-left p-3 text-sm text-slate-400">Address</th>
                <th className="text-left p-3 text-sm text-slate-400">Fee</th>
                <th className="text-left p-3 text-sm text-slate-400">Status</th>
                <th className="text-left p-3 text-sm text-slate-400">Date</th>
                <th className="text-left p-3 text-sm text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <p className="font-medium text-sm text-white">{withdrawal.user?.firstName} {withdrawal.user?.lastName}</p>
                    <p className="text-xs text-slate-500">{withdrawal.user?.email}</p>
                    <p className="text-xs text-slate-600">Balance: ${withdrawal.user?.balance?.toFixed(2)}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-teal-400">${withdrawal.amount.toFixed(2)}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-white">{withdrawal.coin}</p>
                    <p className="text-xs text-slate-500">{withdrawal.network}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 max-w-[120px] truncate">
                        {withdrawal.address}
                      </span>
                      <button
                        onClick={() => copyToClipboard(withdrawal.address)}
                        className="p-1 hover:bg-slate-700 rounded transition"
                      >
                        {copied ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-white">${withdrawal.fee.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                      withdrawal.status === 'completed'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                        : withdrawal.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {withdrawal.status === 'completed' ? <CheckCircle className="h-3 w-3" /> :
                       withdrawal.status === 'pending' ? <Clock className="h-3 w-3" /> :
                       <XCircle className="h-3 w-3" />}
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-400">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {withdrawal.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(withdrawal.id, "completed")}
                            disabled={processingId === withdrawal.id}
                            className="p-1.5 hover:bg-teal-500/20 rounded transition text-teal-400"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(withdrawal.id, "failed")}
                            disabled={processingId === withdrawal.id}
                            className="p-1.5 hover:bg-red-500/20 rounded transition text-red-400"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredWithdrawals.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No withdrawal requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Withdrawal Details</h2>
              <button onClick={() => setSelectedWithdrawal(null)} className="text-slate-400 hover:text-white transition">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-2">User</p>
                <p className="font-medium text-white">{selectedWithdrawal.user?.firstName} {selectedWithdrawal.user?.lastName}</p>
                <p className="text-xs text-slate-400">{selectedWithdrawal.user?.email}</p>
                <p className="text-xs text-teal-400 mt-1">Balance: ${selectedWithdrawal.user?.balance?.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-2">Transaction</p>
                <p className="font-bold text-teal-400">${selectedWithdrawal.amount.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{selectedWithdrawal.coin} ({selectedWithdrawal.network})</p>
                <p className="text-xs text-slate-500">Fee: ${selectedWithdrawal.fee.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
              <code className="text-xs text-slate-300 break-all">{selectedWithdrawal.address}</code>
            </div>

            {selectedWithdrawal.processedBy && (
              <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-500 mb-1">Processing Info</p>
                <p className="text-sm text-slate-300">By: {selectedWithdrawal.processedBy}</p>
                <p className="text-xs text-slate-400">{new Date(selectedWithdrawal.processedAt!).toLocaleString()}</p>
                {selectedWithdrawal.transactionHash && (
                  <p className="text-xs text-slate-400 mt-1">TX: {selectedWithdrawal.transactionHash}</p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {selectedWithdrawal.status === "pending" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, "completed")}
                    disabled={processingId === selectedWithdrawal.id}
                    className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 rounded-lg transition disabled:opacity-50 text-slate-950 font-medium text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, "failed")}
                    disabled={processingId === selectedWithdrawal.id}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition disabled:opacity-50 text-white font-medium text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}