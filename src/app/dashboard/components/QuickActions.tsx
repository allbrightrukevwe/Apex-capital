'use client';

import Link from 'next/link';

interface QuickAction {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
}

const QuickActions = () => {
  const actions: QuickAction[] = [
    {
      href: '/dashboard/deposit',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      label: 'Deposit',
      variant: 'primary'
    },
    {
      href: '/dashboard/withdraw',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 3v13M5 14l7 7 7-7" />
        </svg>
      ),
      label: 'Withdraw',
      variant: 'secondary'
    },
    {
      href: '/dashboard/bot-console',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      label: 'Trade',
      variant: 'secondary'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-colors select-none ${
            action.variant === 'primary'
              ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
        >
          {action.icon}
          <span className="text-xs uppercase tracking-wide">{action.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;