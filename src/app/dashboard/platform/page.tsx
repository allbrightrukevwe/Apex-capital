'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sidebar Component (same as before)
const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      href: '/dashboard/deposit',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v13M5 14l7 7 7-7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Deposit'
    },
    {
      href: '/dashboard/withdraw',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21V8M5 10l7-7 7 7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Withdraw'
    },
    {
      href: '/dashboard/bot-console',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      ),
      label: 'Bot Console'
    },
    {
      href: '/dashboard/live-trading',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Live Trading'
    },
    {
      href: '/dashboard/market',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      label: 'Market Data'
    },
    {
      href: '/dashboard/platform',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      label: 'Live Platform'
    },
    {
      href: '/dashboard/history',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: 'History'
    },
    {
      href: '/dashboard/profile',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: 'Profile'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 z-40 bg-slate-900 border-r border-teal-500/10">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-5 py-4 border-b border-teal-500/10 flex-shrink-0">
          <Link href="/" className="text-base font-bold tracking-wider">
            <span className="text-white">APE</span>
            <span className="text-teal-400 text-2xl">X</span>
            <span className="text-white"> CAPITA</span>
          </Link>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2.5 py-3 border-t border-teal-500/10 flex-shrink-0 space-y-0.5">
          <a
            href="mailto:support@apexcapita.io"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-teal-500/8 transition w-full"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Support
          </a>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition w-full">
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

// Platform Header Component
const PlatformHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-4 lg:px-6 h-13 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/" className="lg:hidden text-sm font-bold tracking-wider">
          <span className="text-white">APE</span>
          <span className="text-teal-400 text-xl">X</span>
          <span className="text-white"> CAPITA</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">
            Dashboard
          </Link>
          <span className="text-slate-600">→</span>
          <span className="text-white font-semibold">Live Platform</span>
        </nav>
      </div>
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
    </header>
  );
};

// Activity Item Interface
interface Activity {
  id: number;
  name: string;
  initials: string;
  country: string;
  type: 'deposit' | 'withdrawal';
  asset: string;
  amount: string;
  numericAmount: number;
  time: string;
  date: string;
  color: string;
}

// Sample data pool for generating random activities
const sampleNames = [
  { name: 'Mateo O.', initials: 'MO', country: 'KR', color: 'rgb(49, 130, 206)' },
  { name: 'Nour H.', initials: 'NH', country: 'LB', color: 'rgb(49, 151, 149)' },
  { name: 'Carter L.', initials: 'CL', country: 'IN', color: 'rgb(56, 161, 105)' },
  { name: 'Nadia B.', initials: 'NB', country: 'DZ', color: 'rgb(221, 107, 32)' },
  { name: 'Felix K.', initials: 'FK', country: 'GH', color: 'rgb(213, 63, 140)' },
  { name: 'Ibrahim T.', initials: 'IT', country: 'VN', color: 'rgb(107, 70, 193)' },
  { name: 'Isaac O.', initials: 'IO', country: 'IT', color: 'rgb(107, 70, 193)' },
  { name: 'Ravi P.', initials: 'RP', country: 'LK', color: 'rgb(44, 122, 123)' },
  { name: 'Kevin L.', initials: 'KL', country: 'TW', color: 'rgb(221, 107, 32)' },
  { name: 'Viktor H.', initials: 'VH', country: 'UA', color: 'rgb(221, 107, 32)' },
  { name: 'Nina P.', initials: 'NP', country: 'RS', color: 'rgb(214, 158, 46)' },
  { name: 'Ryan O.', initials: 'RO', country: 'IE', color: 'rgb(49, 130, 206)' },
  { name: 'Sophia M.', initials: 'SM', country: 'FR', color: 'rgb(213, 63, 140)' },
  { name: 'Liam W.', initials: 'LW', country: 'UK', color: 'rgb(49, 130, 206)' },
  { name: 'Emma T.', initials: 'ET', country: 'DE', color: 'rgb(56, 161, 105)' },
  { name: 'Noah S.', initials: 'NS', country: 'US', color: 'rgb(107, 70, 193)' },
];

const sampleAssets = [
  'USDT (ERC20)', 'BTC Wallet', 'ETH Wallet', 'DOGE Wallet', 'SOL Wallet', 
  'XRP Wallet', 'BNB Chain', 'USDC (ERC20)', 'LTC Wallet', 'ADA Wallet'
];

// PLAN AMOUNTS - CHANGE THESE VALUES TO UPDATE PLAN PRICES
const planAmounts = [400, 700, 1000]; // Bronze, Silver, Gold

// Live Platform Component
const LivePlatform = () => {
  const [filter, setFilter] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const withdrawalCounter = useRef(1000);
  const depositCounter = useRef(0);

  // Generate a random activity
  const generateActivity = (): Activity => {
    const person = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const isDeposit = Math.random() > 0.5; // 50% chance of deposit, 50% withdrawal
    
    let amount: number;
    let asset: string;
    
    if (isDeposit) {
      // DEPOSITS: Exact plan amounts - 400, 700, 1000 (cycling)
      depositCounter.current = (depositCounter.current + 1) % planAmounts.length;
      amount = planAmounts[depositCounter.current]; // EXACT VALUES: 400, 700, or 1000
      asset = 'Plan Subscription';
    } else {
      // Withdrawals: $10,000 - $200,000 (increasing)
      withdrawalCounter.current += Math.floor(Math.random() * 3000 + 1000);
      amount = withdrawalCounter.current;
      asset = sampleAssets[Math.floor(Math.random() * sampleAssets.length)];
    }
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(now.getHours() % 12 || 12).padStart(2, '0');
    
    return {
      id: Date.now() + Math.random(),
      name: person.name,
      initials: person.initials,
      country: person.country,
      type: isDeposit ? 'deposit' : 'withdrawal',
      asset: asset,
      amount: isDeposit ? `+$${amount.toLocaleString()}` : `-$${amount.toLocaleString()}`,
      numericAmount: amount,
      time: `${hours12}:${minutes} ${ampm} · Just now`,
      date: `${hours12}:${minutes} ${ampm}`,
      color: person.color,
    };
  };

  // Add new activity to the feed
  const addActivity = () => {
    const newActivity = generateActivity();
    setActivities(prev => [newActivity, ...prev].slice(0, 30));
    updateStats();
  };

  // Update stats
  const updateStats = () => {
    const deposits = activities.filter(a => a.type === 'deposit');
    const withdrawals = activities.filter(a => a.type === 'withdrawal');
    const totalDeposits = deposits.reduce((sum, a) => sum + a.numericAmount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, a) => sum + a.numericAmount, 0);
    setStats({ totalDeposits, totalWithdrawals });
  };

  // Update stats whenever activities change
  useEffect(() => {
    updateStats();
  }, [activities]);

  // Initialize with sample data
  useEffect(() => {
    const initialActivities: Activity[] = [];
    let wdCounter = 50000;
    let depCounter = 0;
    
    for (let i = 0; i < 12; i++) {
      const isDeposit = i < 4; // 4 deposits in initial load
      let amount: number;
      
      if (isDeposit) {
        depCounter = (depCounter + 1) % planAmounts.length;
        amount = planAmounts[depCounter]; // EXACT VALUES: 400, 700, or 1000
      } else {
        wdCounter += Math.floor(Math.random() * 5000 + 2000);
        amount = wdCounter;
      }
      
      const person = sampleNames[i % sampleNames.length];
      const asset = isDeposit ? 'Plan Subscription' : sampleAssets[i % sampleAssets.length];
      const minsAgo = i * 3 + 1;
      const date = new Date(Date.now() - minsAgo * 60000);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      const hours12 = String(date.getHours() % 12 || 12).padStart(2, '0');
      
      initialActivities.push({
        id: Date.now() + i,
        name: person.name,
        initials: person.initials,
        country: person.country,
        type: isDeposit ? 'deposit' : 'withdrawal',
        asset: asset,
        amount: isDeposit ? `+$${amount.toLocaleString()}` : `-$${amount.toLocaleString()}`,
        numericAmount: amount,
        time: `${hours12}:${minutes} ${ampm} · ${minsAgo}m ago`,
        date: `${hours12}:${minutes} ${ampm}`,
        color: person.color,
      });
    }
    
    // Set the counters
    withdrawalCounter.current = wdCounter;
    depositCounter.current = depCounter;
    setActivities(initialActivities);

    // Start the live feed interval
    intervalRef.current = setInterval(() => {
      addActivity();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Live clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === (filter === 'deposits' ? 'deposit' : 'withdrawal'));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="lg:ml-60">
        <PlatformHeader />

        <main className="px-3 py-4 lg:px-6 lg:py-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-lg">Live Platform</h1>
                <span className="flex items-center gap-1 text-[9px] font-bold text-teal-400 bg-teal-500/15 border border-teal-500/25 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-slate-400 text-xs">Real-time deposit and withdrawal activity across the platform</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 21V8M5 10l7-7 7 7" />
                </svg>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Deposits</span>
              </div>
              <div className="text-2xl font-bold text-teal-400">
                +${stats.totalDeposits.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 3v13M5 14l7 7 7-7" />
                </svg>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Withdrawals</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                -${stats.totalWithdrawals.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Activity</span>
              </div>
              <div className="text-2xl font-bold text-white">{activities.length}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('deposits')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
                filter === 'deposits'
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilter('withdrawals')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
                filter === 'withdrawals'
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              Withdrawals
            </button>
          </div>

          {/* Activity Feed with Animation */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900 transition-all duration-500 ${
                  index === 0 ? 'animate-slide-in border-teal-500/30 bg-slate-900/80' : ''
                } hover:bg-slate-800/60`}
                style={{ animationDelay: index < 3 ? `${index * 150}ms` : '0ms' }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: activity.color }}
                  >
                    {activity.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-slate-300">{activity.country}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-white text-sm font-semibold truncate">{activity.name}</span>
                    <span className="text-slate-600 text-[10px] font-bold">{activity.country}</span>
                    {activity.type === 'deposit' && (
                      <span className="text-[9px] font-bold text-teal-400 bg-teal-500/15 px-1.5 py-0.5 rounded">DEPOSIT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    {activity.type === 'deposit' ? (
                      <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 21V8M5 10l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 3v13M5 14l7 7 7-7" />
                      </svg>
                    )}
                    <span className="text-slate-400">{activity.type === 'deposit' ? 'Deposit' : 'Withdrawal'} · {activity.asset}</span>
                  </div>
                  <div className="text-slate-600 text-[10px] mt-0.5">{activity.time}</div>
                </div>

                {/* Amount */}
                <div className={`text-sm font-bold flex-shrink-0 ${
                  activity.type === 'deposit' ? 'text-teal-400' : 'text-red-400'
                }`}>
                  {activity.amount}
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p>No {filter === 'deposits' ? 'deposits' : filter === 'withdrawals' ? 'withdrawals' : ''} yet</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LivePlatform;