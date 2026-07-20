'use client';

import { useUserContext } from '@/lib/contexts/UserContext';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  color: 'teal' | 'amber';
}

const StatsCards = () => {
  const { user, loading } = useUserContext();

  const stats: StatCard[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        </svg>
      ),
      label: 'Total Profit',
      value: loading ? '$...' : `$${user?.totalProfit?.toFixed(2) || '0.00'}`,
      subtitle: 'All time',
      color: 'teal'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Total Trades',
      value: loading ? '...' : (user?.totalTrades?.toString() || '0'),
      subtitle: 'Executed',
      color: 'amber'
    }
  ];

  const getColorClasses = (color: string) => {
    if (color === 'teal') {
      return {
        text: 'text-teal-400',
        iconBg: 'text-teal-400'
      };
    }
    return {
      text: 'text-amber-400',
      iconBg: 'text-amber-400'
    };
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-4"
          >
            <div className="flex items-center gap-1.5 mb-2">
              {stat.icon}
              <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${colors.text}`}>
              {stat.value}
            </div>
            <div className="text-slate-600 text-xs mt-1">{stat.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;