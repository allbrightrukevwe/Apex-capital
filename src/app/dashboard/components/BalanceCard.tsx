// src/app/dashboard/components/BalanceCard.tsx
'use client';

import { useState } from 'react';

interface BalanceCardProps {
  balance: number;
  loading?: boolean;
}

const BalanceCard = ({ balance = 0, loading = false }: BalanceCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Current Balance
          </span>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-slate-500 hover:text-slate-300 transition"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </button>
      </div>
      <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <span className="inline-block w-32 h-8 bg-slate-800 rounded-lg animate-pulse"></span>
          </div>
        ) : isVisible ? (
          `$${balance.toFixed(2)}`
        ) : (
          '••••••'
        )}
      </div>
    </div>
  );
};

export default BalanceCard;