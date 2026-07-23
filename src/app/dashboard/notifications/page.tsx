'use client';

import { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import MobileHeader from '../components/MobileHeader';
import Sidebar from '../components/Sidebar';

const typeIcon: Record<string, ReactElement> = {
  deposit: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v13M5 14l7 7 7-7" /><path d="M3 21h18" />
    </svg>
  ),
  withdrawal: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21V8M5 10l7-7 7 7" /><path d="M3 21h18" />
    </svg>
  ),
  bot_profit: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  bot_activated: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const typeColor: Record<string, string> = {
  deposit: 'text-teal-400 bg-teal-500/10',
  withdrawal: 'text-red-400 bg-red-500/10',
  bot_profit: 'text-green-400 bg-green-500/10',
  bot_activated: 'text-blue-400 bg-blue-500/10',
  security: 'text-amber-400 bg-amber-500/10',
  system: 'text-slate-400 bg-slate-500/10',
  promotion: 'text-purple-400 bg-purple-500/10',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="lg:ml-60">
        <MobileHeader />
        <header className="hidden lg:flex sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-6 h-13 items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">Dashboard</Link>
            <span className="text-slate-600">→</span>
            <span className="text-white font-semibold">Notifications</span>
          </nav>
        </header>

        <main className="px-4 py-5 lg:px-6 lg:py-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <h1 className="text-white font-bold text-xl">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-teal-400 hover:text-teal-300 transition">
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16"><p className="text-slate-500 text-sm">Loading...</p></div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center rounded-xl border border-slate-800 bg-slate-900">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <p className="text-slate-400 font-semibold text-sm">No notifications</p>
              <p className="text-slate-600 text-xs mt-1">Deposit updates, bot results, and withdrawals will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => {
                const color = typeColor[n.type] || typeColor.system;
                const icon = typeIcon[n.type] || typeIcon.system;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markOneRead(n.id)}
                    className={`bg-slate-900 border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition ${
                      n.isRead ? 'border-slate-800' : 'border-teal-500/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white text-xs font-semibold truncate">{n.title}</p>
                        {!n.isRead && <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                      <p className="text-slate-600 text-[10px] mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
