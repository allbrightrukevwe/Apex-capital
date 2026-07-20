'use client';

interface Activity {
  id: number;
  email: string;
  amount: string;
  time: string;
  isProfit: boolean;
}

interface ActivityFeedProps {
  variant: 'desktop' | 'mobile';
}

const ActivityFeed = ({ variant }: ActivityFeedProps) => {
  const activities: Activity[] = [
    { id: 1, email: 'ch***@outlook.com', amount: '$162,136', time: '51m ago', isProfit: false },
    { id: 2, email: 'h****@gmail.com', amount: '$25,539', time: '14m ago', isProfit: true },
    { id: 3, email: 'd****@msn.com', amount: '$162,942', time: '32m ago', isProfit: true },
    { id: 4, email: 's***@aol.com', amount: '$145,184', time: '12m ago', isProfit: false },
    { id: 5, email: 'ma***@yahoo.com', amount: '$22,943', time: '30m ago', isProfit: true },
    { id: 6, email: 'j***@proton.me', amount: '$8,871', time: '5m ago', isProfit: true },
    { id: 7, email: 'k****@gmail.com', amount: '$31,204', time: '22m ago', isProfit: false },
    { id: 8, email: 'tr***@icloud.com', amount: '$54,329', time: '8m ago', isProfit: true },
  ];

  const items = [...activities, ...activities];
  const duration = variant === 'desktop' ? '32s' : '30s';

  if (variant === 'desktop') {
    return (
      <div className="hidden lg:block bg-slate-950 border-b border-teal-500/[0.07] overflow-hidden">
        <div className="ticker-track items-center gap-2.5 py-1.5" style={{ animationDuration: duration }}>
          {items.map((activity, index) => (
            <div
              key={`${activity.id}-${index}`}
              className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex-shrink-0 mx-1.5 whitespace-nowrap"
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activity.isProfit ? 'bg-teal-400' : 'bg-red-400'}`} />
              <span className="text-slate-400 text-[11px]">{activity.email}</span>
              <span className={`text-[11px] font-bold ${activity.isProfit ? 'text-teal-400' : 'text-red-400'}`}>
                {activity.isProfit ? '+' : '−'}{activity.amount}
              </span>
              <span className="text-slate-600 text-[10px]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden overflow-hidden">
      <div className="ticker-track items-center gap-2 py-1.5" style={{ animationDuration: duration }}>
        {items.map((activity, index) => (
          <div
            key={`${activity.id}-${index}`}
            className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 flex-shrink-0 mx-1"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${activity.isProfit ? 'bg-teal-500/20' : 'bg-red-500/20'}`}>
              <svg viewBox="0 0 24 24" className={`w-3 h-3 ${activity.isProfit ? 'text-teal-400' : 'text-red-400'}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points={activity.isProfit ? '22 7 13.5 15.5 8.5 10.5 2 17' : '22 17 13.5 8.5 8.5 13.5 2 7'} />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] w-[88px] truncate">{activity.email}</div>
              <div className={`text-[11px] font-bold ${activity.isProfit ? 'text-teal-400' : 'text-red-400'}`}>
                {activity.isProfit ? '+' : '−'}{activity.amount}
              </div>
            </div>
            <div className="text-slate-600 text-[10px] flex-shrink-0">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;