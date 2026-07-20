'use client';

import Link from 'next/link';
import { useState } from 'react';

interface WithdrawHeaderProps {
  breadcrumb?: {
    parent: string;
    parentHref: string;
    current: string;
  };
}

const WithdrawHeader = ({ 
  breadcrumb = { parent: 'Dashboard', parentHref: '/dashboard', current: 'Withdraw Crypto' }
}: WithdrawHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-4 lg:px-6 h-13 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden text-sm font-bold tracking-wider">
          <span className="text-white">APE</span>
          <span className="text-teal-400 text-xl">X</span>
          <span className="text-white"> CAPITA</span>
        </Link>

        {/* Breadcrumb Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          <Link href={breadcrumb.parentHref} className="text-slate-400 hover:text-teal-400 transition-colors">
            {breadcrumb.parent}
          </Link>
          <span className="text-slate-600">→</span>
          <span className="text-white font-semibold">{breadcrumb.current}</span>
        </nav>
      </div>

      {/* Notification Bell */}
      <Link 
        href="/dashboard/notifications" 
        className="relative w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-teal-500/40 hover:text-teal-400 transition"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
      </Link>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-13 left-0 right-0 bg-slate-950 border-b border-teal-500/10 lg:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="text-slate-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/deposit" 
              className="text-slate-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Deposit
            </Link>
            <Link 
              href="/dashboard/withdraw" 
              className="text-teal-400 hover:text-teal-300 transition px-3 py-2 rounded-lg bg-teal-500/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Withdraw
            </Link>
            <Link 
              href="/dashboard/bot-console" 
              className="text-slate-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bot Console
            </Link>
            <Link 
              href="/dashboard/support" 
              className="text-slate-400 hover:text-teal-400 transition px-3 py-2 rounded-lg hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Support
            </Link>
            <a
              href="mailto:support@apexcapita.io"
              className="text-slate-400 hover:text-teal-400 transition px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              Email Support
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default WithdrawHeader;