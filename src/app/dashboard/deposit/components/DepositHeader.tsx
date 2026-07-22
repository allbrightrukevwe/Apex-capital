'use client';

import Link from 'next/link';
import MobileHeader from '../../components/MobileHeader';

const DepositHeader = () => (
  <>
    <MobileHeader />
    <header className="hidden lg:flex sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-6 h-13 items-center justify-between">
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">Dashboard</Link>
        <span className="text-slate-600">→</span>
        <span className="text-white font-semibold">Deposit Crypto</span>
      </nav>
      <Link href="/dashboard/notifications" className="relative w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-teal-500/40 hover:text-teal-400 transition">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full" />
      </Link>
    </header>
  </>
);

export default DepositHeader;
