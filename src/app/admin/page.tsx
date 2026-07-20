'use client';

import { useState, useEffect } from 'react';
import { Users, Bot, TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Active Bots', value: stats.activeBots || 0, icon: Bot, color: 'text-emerald-400' },
    { label: 'Total Deposits', value: `$${(stats.totalDeposits || 0).toFixed(2)}`, icon: TrendingDown, color: 'text-emerald-400' },
    { label: 'Total Withdrawals', value: `$${(stats.totalWithdrawals || 0).toFixed(2)}`, icon: TrendingUp, color: 'text-red-400' },
    { label: 'Total Trades', value: stats.totalTrades || 0, icon: Activity, color: 'text-amber-400' },
    { label: 'Bot Profit', value: `$${(stats.totalBotProfit || 0).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`h-6 w-6 ${card.color}`} />
              <span className="text-gray-400 text-sm">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}