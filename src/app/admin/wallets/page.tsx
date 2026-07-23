'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, Search, RefreshCw, EyeOff } from 'lucide-react';

interface WalletData {
  id: string;
  userId: number;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  currency: string;
  network: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/admin/wallets');
      if (response.ok) {
        const data = await response.json();
        // ✅ Remove privateKey from data before storing
        const safeWallets = (data.data || []).map((w: any) => {
          const { privateKey, ...safe } = w;
          return safe;
        });
        setWallets(safeWallets);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWallets();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredWallets = wallets.filter(w =>
    !search ||
    w.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    w.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    w.address?.toLowerCase().includes(search.toLowerCase()) ||
    w.currency?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = wallets.filter(w => w.isActive).length;
  const inactiveCount = wallets.filter(w => !w.isActive).length;

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
          <h1 className="text-3xl font-bold text-white">Wallets</h1>
          <p className="text-slate-400 mt-1">View and manage all user wallet addresses</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Total Wallets</p>
          <p className="text-2xl font-bold text-white">{wallets.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-teal-400">{activeCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Inactive</p>
          <p className="text-2xl font-bold text-red-400">{inactiveCount}</p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
        <p className="text-sm text-teal-400">
          🔒 <strong>Security:</strong> Private keys are encrypted and never displayed. Wallet addresses only are shown for monitoring purposes.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user, address, or currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {filteredWallets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No wallets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-3 text-left text-sm text-slate-400">User</th>
                  <th className="p-3 text-left text-sm text-slate-400">Currency</th>
                  <th className="p-3 text-left text-sm text-slate-400">Network</th>
                  <th className="p-3 text-left text-sm text-slate-400">Public Address</th>
                  <th className="p-3 text-left text-sm text-slate-400">Status</th>
                  <th className="p-3 text-left text-sm text-slate-400">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 text-sm">
                      <p className="font-medium text-white">
                        {wallet.user?.firstName} {wallet.user?.lastName}
                      </p>
                      <p className="text-slate-500 text-xs">{wallet.user?.email}</p>
                    </td>
                    <td className="p-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                        {wallet.currency}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-white">{wallet.network}</td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 max-w-[180px] truncate">
                          {wallet.address}
                        </code>
                        <button
                          onClick={() => copyToClipboard(wallet.address, wallet.id + '-address')}
                          className="text-slate-500 hover:text-teal-400 transition"
                          title="Copy address"
                        >
                          {copied === wallet.id + '-address' ? (
                            <Check size={14} className="text-teal-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        wallet.isActive
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {wallet.isActive ? <Check className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-400">
                      {formatDate(wallet.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-sm text-slate-400">
          💡 <strong>Tip:</strong> Wallet addresses are for deposit monitoring. Private keys are stored encrypted and never exposed in the admin panel.
        </p>
      </div>
    </div>
  );
}