'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUserContext } from '@/lib/contexts/UserContext';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
  { href: '/dashboard/deposit', label: 'Deposit', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v13M5 14l7 7 7-7" /><path d="M3 21h18" /></svg> },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V8M5 10l7-7 7 7" /><path d="M3 21h18" /></svg> },
  { href: '/dashboard/bot-console', label: 'Bot Console', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg> },
  { href: '/dashboard/live-trading', label: 'Live Trading', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
  { href: '/dashboard/market', label: 'Market Data', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
  { href: '/dashboard/platform', label: 'Live Platform', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { href: '/dashboard/history', label: 'History', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
  { href: '/dashboard/profile', label: 'Profile', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  { href: '/dashboard/support', label: 'Support', icon: <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
];

const Header = () => {
  const { user } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isActive = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.clear();
    sessionStorage.clear();
    router.push('/login');
  };

  const displayName = user?.fullName || user?.firstName || 'User';

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10">
        <div className="flex items-center justify-between px-4 lg:px-5 h-13 py-3">
          <Link href="/" className="lg:hidden text-base font-bold tracking-wider">
            <span className="text-white">APE</span>
            <span className="text-teal-400 text-2xl">X</span>
            <span className="text-white"> CAPITA</span>
          </Link>
          <div className="hidden lg:block text-sm text-slate-400">
            {getGreeting()},&nbsp;<span className="text-white font-semibold">{displayName}</span> 👋
          </div>
          <div className="flex items-center gap-1">
            <Link href="/dashboard/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 hover:border-teal-500/40 text-slate-400 hover:text-white transition">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white transition"
            >
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
          {/* Drawer */}
          <div className="relative w-64 h-full bg-slate-900 border-r border-teal-500/10 flex flex-col z-10">
            <div className="px-5 py-4 border-b border-teal-500/10 flex items-center justify-between">
              <Link href="/" className="text-base font-bold tracking-wider" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-white">APE</span>
                <span className="text-teal-400 text-2xl">X</span>
                <span className="text-white"> CAPITA</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="px-2.5 py-3 border-t border-teal-500/10 space-y-0.5">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition w-full"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;