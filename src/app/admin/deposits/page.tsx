'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Copy, Search, RefreshCw } from 'lucide-react';

interface Deposit {
  id: string;
  userId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  currency: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  status: string;
  confirmations: number;
  createdAt: string;
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<Deposit | null>(null);
  const [actualAmount, setActualAmount] = useState<string>('');

  useEffect(() => {
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/admin/deposits');
      if (response.ok) {
        const data = await response.json();
        setDeposits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDeposits();
  };

  const handleConfirmDeposit = async (depositId: string) => {
    const parsed = parseFloat(actualAmount);
    if (!actualAmount || isNaN(parsed) || parsed <= 0) {
      alert('Please enter the actual amount received');
      return;
    }
    setConfirming(depositId);
    try {
      const response = await fetch('/api/admin/deposits/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, actualAmount: parsed }),
      });

      if (response.ok) {
        setConfirmModal(null);
        setActualAmount('');
        fetchDeposits();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error confirming deposit:', error);
      alert('Failed to confirm deposit');
    } finally {
      setConfirming(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const filteredDeposits = deposits.filter((d) => {
    const matchesFilter = filter === 'all' || d.status === filter;
    const matchesSearch = !search || 
      d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      d.txHash?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = deposits.filter((d) => d.status === 'pending').length;
  const confirmedCount = deposits.filter((d) => d.status === 'confirmed').length;
  const failedCount = deposits.filter((d) => d.status === 'failed').length;
  const totalAmount = deposits.reduce((sum, d) => sum + (d.amount || 0), 0);

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
          <h1 className="text-3xl font-bold text-white">Deposits</h1>
          <p className="text-slate-400 mt-1">Manage and monitor all user deposits</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Total Deposits</p>
          <p className="text-2xl font-bold text-white">{deposits.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Total Amount</p>
          <p className="text-2xl font-bold text-teal-400">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-teal-400">{confirmedCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
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
            placeholder="Search by user, email, or TX hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {filteredDeposits.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No deposits found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-3 text-left text-sm text-slate-400">User</th>
                  <th className="p-3 text-left text-sm text-slate-400">Amount</th>
                  <th className="p-3 text-left text-sm text-slate-400">Currency</th>
                  <th className="p-3 text-left text-sm text-slate-400">Status</th>
                  <th className="p-3 text-left text-sm text-slate-400">TX Hash</th>
                  <th className="p-3 text-left text-sm text-slate-400">Date</th>
                  <th className="p-3 text-left text-sm text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 text-sm">
                      <p className="font-medium text-white">
                        {deposit.user?.firstName} {deposit.user?.lastName}
                      </p>
                      <p className="text-slate-500 text-xs">{deposit.user?.email}</p>
                    </td>
                    <td className="p-3 text-sm text-white font-mono">
                      {deposit.amount?.toFixed(6)}
                    </td>
                    <td className="p-3 text-sm text-white">{deposit.currency}</td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                        deposit.status === 'confirmed'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                          : deposit.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {deposit.status === 'confirmed' ? <CheckCircle className="h-3 w-3" /> :
                         deposit.status === 'pending' ? <Clock className="h-3 w-3" /> :
                         <AlertCircle className="h-3 w-3" />}
                        {deposit.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                          {deposit.txHash?.substring(0, 16)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(deposit.txHash)}
                          className="text-slate-500 hover:text-teal-400 transition"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-slate-400">
                      {formatDate(deposit.createdAt)}
                    </td>
                    <td className="p-3 text-sm">
                      {deposit.status === 'pending' ? (
                        <button
                          onClick={() => { setConfirmModal(deposit); setActualAmount(''); }}
                          disabled={confirming === deposit.id}
                          className="px-4 py-2 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 transition disabled:opacity-50 font-medium text-xs"
                        >
                          {confirming === deposit.id ? 'Confirming...' : 'Confirm'}
                        </button>
                      ) : deposit.status === 'confirmed' ? (
                        <span className="px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-lg text-xs font-medium">
                          ✓ Confirmed
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Deposit</h2>
            
            <div className="space-y-3 mb-6 bg-slate-800/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-slate-400">User</p>
                <p className="font-medium text-white">
                  {confirmModal.user?.firstName} {confirmModal.user?.lastName}
                </p>
                <p className="text-xs text-slate-500">{confirmModal.user?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Requested Amount</p>
                  <p className="font-bold text-lg text-slate-400 line-through">
                    {confirmModal.amount} {confirmModal.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Currency</p>
                  <p className="font-medium text-white">{confirmModal.currency}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Actual Amount Received</p>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter amount actually received"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-teal-500/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <p className="text-sm text-slate-400">Transaction Hash</p>
                <code className="text-xs bg-slate-800 p-2 rounded border border-slate-700 block truncate text-slate-300">
                  {confirmModal.txHash}
                </code>
              </div>
            </div>

            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 mb-6">
              <p className="text-sm text-teal-400">
                {actualAmount && parseFloat(actualAmount) > 0
                  ? `$${parseFloat(actualAmount).toFixed(2)} ${confirmModal.currency} will be credited to the user's balance.`
                  : 'Enter the actual amount received above.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDeposit(confirmModal.id)}
                disabled={confirming === confirmModal.id}
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-slate-950"
              >
                {confirming === confirmModal.id ? 'Confirming...' : 'Confirm Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}