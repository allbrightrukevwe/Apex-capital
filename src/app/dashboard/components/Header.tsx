'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUserContext } from '@/lib/contexts/UserContext';

const Header = () => {
  const { user } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.fullName || user?.firstName || 'User';

  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10">
      <div className="flex items-center justify-between px-4 lg:px-5 h-13 py-3">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden text-base font-bold tracking-wider">
          <span className="text-white">APE</span>
          <span className="text-teal-400 text-2xl">X</span>
          <span className="text-white"> CAPITA</span>
        </Link>

        {/* Desktop Greeting */}
        <div className="hidden lg:block text-sm text-slate-400">
          {getGreeting()},&nbsp;
          <span className="text-white font-semibold">{displayName}</span> 👋
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 hover:border-teal-500/40 text-slate-400 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
          </Link>

          {/* Sign Out (Desktop) */}
          <button className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;