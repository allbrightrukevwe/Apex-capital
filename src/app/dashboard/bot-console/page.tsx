'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/lib/contexts/UserContext';
import { Trash2 } from 'lucide-react';

// ============ SIDEBAR COMPONENT ============
const Sidebar = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>), label: 'Dashboard' },
    { href: '/dashboard/deposit', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v13M5 14l7 7 7-7" /><path d="M3 21h18" /></svg>), label: 'Deposit' },
    { href: '/dashboard/withdraw', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V8M5 10l7-7 7 7" /><path d="M3 21h18" /></svg>), label: 'Withdraw' },
    { href: '/dashboard/bot-console', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>), label: 'Bot Console' },
    { href: '/dashboard/live-trading', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>), label: 'Live Trading' },
    { href: '/dashboard/market', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>), label: 'Market Data' },
    { href: '/dashboard/platform', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>), label: 'Live Platform' },
    { href: '/dashboard/history', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>), label: 'History' },
    { href: '/dashboard/profile', icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>), label: 'Profile' }
  ];
  const isActive = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 z-40 bg-slate-900 border-r border-teal-500/10">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-5 py-4 border-b border-teal-500/10 flex-shrink-0">
          <Link href="/" className="text-base font-bold tracking-wider"><span className="text-white">APE</span><span className="text-teal-400 text-2xl">X</span><span className="text-white"> CAPITA</span></Link>
        </div>
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{item.icon}<span className="truncate">{item.label}</span></Link>;
          })}
        </nav>
        <div className="px-2.5 py-3 border-t border-teal-500/10 flex-shrink-0 space-y-0.5">
          <a href="mailto:support@apexcapita.io" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-teal-500/8 transition w-full">Email Support</a>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition w-full">Sign Out</button>
        </div>
      </div>
    </aside>
  );
};

// ============ HEADER COMPONENT ============
const BotConsoleHeader = () => {
  const { user, loading } = useUserContext();
  const formatBal = loading ? '...' : `$${user?.balance?.toFixed(2) || '0.00'}`;
  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-4 lg:px-6 h-13 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <nav className="hidden lg:flex items-center gap-1.5 text-sm"><Link href="/dashboard" className="text-slate-400 hover:text-teal-400">Dashboard</Link><span className="text-slate-600">→</span><span className="text-white font-semibold">Bot Console</span></nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5"><span className="text-slate-500 text-xs">Balance</span><span className="text-teal-400 font-bold text-sm">{formatBal}</span></div>
      </div>
    </header>
  );
};

// ============ INTERFACES ============
interface BotPackage { id: string; name: string; price: number; description: string; tags: string[]; features: string[]; }
interface TradingPair { label: string; value: string; category: string; }

// ============ MAIN COMPONENT ============
const BotConsolePage = () => {
  const [selectedPair, setSelectedPair] = useState('XAU/USD (Gold)');
  const [selectedPackageId, setSelectedPackageId] = useState('basic');
  const [amount, setAmount] = useState('');
  const [sessionDuration, setSessionDuration] = useState('30 Seconds');
  const [passkey, setPasskey] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  
  const [botActive, setBotActive] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  
  const [status, setStatus] = useState<any>({
    stats: { totalTrades: 0, wins: 0, losses: 0, totalProfit: 0, winRate: 0, sessionsCompleted: 0, totalSessions: 10, amountPerTrade: 0 },
    recentTrades: [],
    logs: ['Waiting for bot to start...', 'System ready', 'Enter passkey to begin trading'],
    pair: 'XAU/USD',
    session: 'Session 0/10',
    timer: 30,
    confidence: 70,
    isPaused: false,
    isRunning: false,
  });

  const [showProfitAlert, setShowProfitAlert] = useState(false);
  const [lastProfit, setLastProfit] = useState<any>({
    profit: 0, pair: '', pct: 0, sessionNum: 0, totalSessions: 10, isFinalSession: false, tradeSnapshot: [],
  });

  const [showBotHistory, setShowBotHistory] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTradeIdRef = useRef<number>(0);
  const isInitialLoad = useRef(true);
  const pendingTradesRef = useRef<any[]>([]);
  const pendingStatsRef = useRef<any>(null);
  const alertPendingRef = useRef(false);

  const tradingPairs: TradingPair[] = [
    { label: 'BTC/USD (Bitcoin)', value: 'BTC/USD', category: 'Crypto' },
    { label: 'ETH/USD (Ethereum)', value: 'ETH/USD', category: 'Crypto' },
    { label: 'XAU/USD (Gold)', value: 'XAU/USD', category: 'Commodity' },
    { label: 'GBP/USD (Forex)', value: 'GBP/USD', category: 'Forex' },
  ];

  const botPackages: BotPackage[] = [
    { id: 'basic', name: 'BASIC BOT', price: 300, description: 'Conservative single-pair scalper.', tags: ['80% Win Rate', '~45% Monthly'], features: ['1 active bot', '30-sec cycle', 'Up to $500/trade'] },
    { id: 'bronze', name: 'BRONZE BOT', price: 700, description: 'Adaptive momentum engine.', tags: ['85% Win Rate', '~65% Monthly'], features: ['2 active bots', '30-sec cycle', 'Up to $2,000/trade'] },
    { id: 'silver', name: 'SILVER BOT', price: 1000, description: 'Multi-asset AI ensemble.', tags: ['95% Win Rate', '~85% Monthly'], features: ['5 active bots', '30-sec cycle', 'Up to $10,000/trade'] },
    { id: 'gold', name: 'GOLD BOT', price: 1500, description: 'Institutional-grade execution.', tags: ['100% Win Rate', '~120% Monthly'], features: ['Unlimited bots', '30-sec cycle', 'Unlimited size'] },
  ];

  const pkgMinAmount: Record<string, number> = { basic: 200, bronze: 500, silver: 800, gold: 1200 };
  const pkgMaxAmount: Record<string, number> = { basic: 500, bronze: 2000, silver: 10000, gold: 999999 };
  const [pkgAmounts, setPkgAmounts] = useState<Record<string, string>>({ basic: '', bronze: '', silver: '', gold: '' });

  // ============ POLL BACKEND FOR STATUS ============
  const pollStatus = useCallback(async (targetBotId: string) => {
    try {
      const res = await fetch(`/api/bots/${targetBotId}`);
      const data = await res.json();
      
      if (data.bot) {
        const bot = data.bot;
        const realtime = bot.realtimeStatus || bot;
        const stats = realtime.stats || {};
        const trades = realtime.recentTrades || [];
        const logs = realtime.logs || [];
        const pair = realtime.pair || bot.tradingPair || 'XAU/USD';
        const session = realtime.session || 'Session 0/10';
        const confidence = realtime.confidence || 70;
        const isPaused = realtime.isPaused || false;
        const isRunning = realtime.isRunning || realtime.botStatus === 'running' || realtime.status === 'running';
        const backendTimer = realtime.timer ?? null;

        const newStatus = {
          stats: {
            totalTrades: Number(stats.totalTrades) || 0,
            wins: Number(stats.wins) || 0,
            losses: Number(stats.losses) || 0,
            totalProfit: Number(stats.totalProfit) || 0,
            winRate: Number(stats.winRate) || 0,
            sessionsCompleted: Number(stats.sessionsCompleted) || 0,
            totalSessions: Number(stats.totalSessions) || 10,
            amountPerTrade: Number(stats.amountPerTrade) || 0,
          },
          recentTrades: Array.isArray(trades) ? trades : [],
          logs: Array.isArray(logs) ? logs : [],
          pair,
          session,
          confidence: Number(confidence),
          isPaused: Boolean(isPaused),
          isRunning: Boolean(isRunning),
        };

        // Detect new completed trade — show alert immediately, hold back trades+stats
        if (newStatus.stats.totalTrades > lastTradeIdRef.current && newStatus.recentTrades.length > 0) {
          lastTradeIdRef.current = newStatus.stats.totalTrades;
          if (!isInitialLoad.current) {
            const latestTrade = newStatus.recentTrades[0];
            if (latestTrade && Math.abs(Number(latestTrade.profit) || 0) > 0.01) {
              const sessionNum = newStatus.stats.sessionsCompleted || newStatus.stats.totalTrades;
              const totalSessions = newStatus.stats.totalSessions || 10;
              pendingTradesRef.current = newStatus.recentTrades;
              pendingStatsRef.current = newStatus.stats;
              alertPendingRef.current = true;
              // Fire alert immediately from poll — don't wait for frontend timer
              setLastProfit({
                profit: Number(latestTrade.profit) || 0,
                pair: newStatus.pair,
                pct: newStatus.stats.amountPerTrade > 0 ? ((Number(latestTrade.profit) || 0) / newStatus.stats.amountPerTrade) * 100 : 0,
                sessionNum,
                totalSessions,
                isFinalSession: sessionNum >= totalSessions,
              });
              setShowProfitAlert(true);
            }
          }
        }

        isInitialLoad.current = false;
        setStatus((prev: any) => ({
          ...newStatus,
          // Hold back trades AND stats until alert is dismissed
          recentTrades: alertPendingRef.current ? prev.recentTrades : newStatus.recentTrades,
          stats: alertPendingRef.current ? prev.stats : newStatus.stats,
          // Don't sync backend timer while alert is showing — keep counting down to 0
          timer: alertPendingRef.current ? prev.timer : (backendTimer !== null ? backendTimer : prev.timer),
        }));

        // Auto-stop and show history when all 10 sessions are done
        if (
          !isInitialLoad.current &&
          newStatus.stats.sessionsCompleted >= newStatus.stats.totalSessions &&
          newStatus.stats.totalSessions > 0 &&
          !newStatus.isRunning
        ) {
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          setBotActive(false);
          setBotId(null);
          setShowBotHistory(true);
          setTimeout(() => document.getElementById('bot-history-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
        }
      }
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/bots');
        const data = await res.json();
        if (data.success && data.bots?.length > 0) {
          const active = data.bots.find((b: any) => b.status === 'active' || b.status === 'running');
          if (active) {
            isInitialLoad.current = true;
            setBotId(active.id);
            setBotActive(true);
            lastTradeIdRef.current = 0;
            await pollStatus(active.id);
          }
        }
      } catch (err) {}
    })();
  }, [pollStatus]);

  useEffect(() => {
    if (!botActive || !botId) {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    
    pollStatus(botId);
    pollRef.current = setInterval(() => pollStatus(botId), 2000);
    
    return () => { 
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [botActive, botId, pollStatus]);

  useEffect(() => {
    if (!botActive || status.isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStatus((prev: any) => {
        if (!prev.isRunning || prev.isPaused) return prev;
        const newTimer = prev.timer > 0 ? prev.timer - 1 : 0;
        return { ...prev, timer: newTimer };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [botActive, status.isPaused]);

  const handleActivateBot = async () => {
    if (!amount || parseFloat(amount) < 200) { alert('Please enter a valid amount (minimum $200)'); return; }
    if (!passkey) { alert('Please enter your passkey'); return; }
    setIsActivating(true);
    try {
      const res = await fetch(`/api/bots/${selectedPackageId}/verify-passkey`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey, tradingPair: selectedPair, amount: parseFloat(amount), sessionDuration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to activate bot');
      isInitialLoad.current = true;
      setBotId(data.bot.id); setBotActive(true);
      lastTradeIdRef.current = 0;
      setAmount(''); setPasskey('');
      setTimeout(() => document.getElementById('bot-status-box')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) { alert('❌ ' + err.message); }
    finally { setIsActivating(false); }
  };

  const handlePause = async () => {
    if (!botId) return;
    try {
      const action = status.isPaused ? 'resume' : 'pause';
      await fetch('/api/bots/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, action }) });
      setStatus((prev: any) => ({ ...prev, isPaused: !prev.isPaused }));
    } catch (err) {}
  };

  const handleStop = async () => {
    if (!botId) return;
    try {
      await fetch('/api/bots/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, action: 'stop' }) });
      setBotActive(false); setBotId(null);
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!botId) return;
    if (!confirm('Delete this bot? This cannot be undone.')) return;
    try {
      await fetch(`/api/bots/${botId}`, { method: 'DELETE' });
      setBotActive(false); setBotId(null);
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {}
  };

  const flushPendingTrades = () => {
    alertPendingRef.current = false;
    const trades = pendingTradesRef.current.length > 0 ? pendingTradesRef.current : undefined;
    const stats = pendingStatsRef.current;
    pendingTradesRef.current = [];
    pendingStatsRef.current = null;
    setStatus((prev: any) => ({
      ...prev,
      ...(trades ? { recentTrades: trades } : {}),
      ...(stats ? { stats } : {}),
    }));
  };

  const handleContinueTrading = () => {
    setShowProfitAlert(false);
    flushPendingTrades();
  };

  const handleViewFinalResults = () => {
    setShowProfitAlert(false);
    flushPendingTrades();
    setShowBotHistory(true);
    setBotActive(false); setBotId(null);
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => document.getElementById('bot-history-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleBuyPackage = async (pkg: BotPackage) => {
    const pkgAmt = parseFloat(pkgAmounts[pkg.id] || '');
    const min = pkgMinAmount[pkg.id];
    const max = pkgMaxAmount[pkg.id];
    if (!pkgAmounts[pkg.id] || isNaN(pkgAmt)) {
      alert(`Please enter a trade amount for ${pkg.name}`);
      return;
    }
    if (pkgAmt < min) {
      alert(`Minimum trade amount for ${pkg.name} is $${min.toLocaleString()}`);
      return;
    }
    if (pkgAmt > max) {
      alert(`Maximum trade amount for ${pkg.name} is $${max.toLocaleString()}`);
      return;
    }
    const generated = `trade${Math.floor(100 + Math.random() * 900)}`;
    setSelectedPackageId(pkg.id);
    setAmount(String(pkgAmt));
    setIsActivating(true);
    try {
      const res = await fetch(`/api/bots/${pkg.id}/verify-passkey`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: generated, tradingPair: selectedPair, amount: pkgAmt, sessionDuration: '30 Seconds' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to activate bot');
      isInitialLoad.current = true;
      setBotId(data.bot.id); setBotActive(true);
      lastTradeIdRef.current = 0;
      setPkgAmounts(prev => ({ ...prev, [pkg.id]: '' }));
      setAmount('');
      setTimeout(() => document.getElementById('bot-status-box')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) { alert('❌ ' + err.message); }
    finally { setIsActivating(false); }
  };

  const getSelectedPackage = () => botPackages.find(p => p.id === selectedPackageId) || botPackages[0];
  const s = status.stats;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="lg:ml-60">
        <BotConsoleHeader />
        <main className="px-3 py-4 lg:px-6 lg:py-5">
          
          <h1 className="text-white font-bold text-xl mb-5">Trading Bots</h1>

          {/* ====== ACTIVATE FORM ====== */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mb-4">
            <div className="flex items-center gap-2 mb-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              <span className="text-white font-bold text-sm">Activate Trading Bot</span>
            </div>
            <p className="text-slate-500 text-xs mb-5">Choose your market, set amount, enter passkey — start immediately</p>

            <div className="mb-4">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Trading Pair</label>
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white text-left focus:outline-none focus:border-teal-500 flex items-center justify-between transition hover:border-slate-600">
                  <span>{selectedPair}</span>
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl max-h-80 overflow-y-auto">
                    {tradingPairs.map(p => (
                      <button key={p.value} onClick={() => { setSelectedPair(p.label); setIsDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 text-sm transition hover:bg-slate-700 ${selectedPair === p.label ? 'text-teal-400 font-semibold bg-teal-500/10' : 'text-white'}`}>{p.label}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Trade Amount (USD) <span className="text-slate-600 normal-case font-normal">— min $200</span></label>
              <div className="relative">
                <input type="number" min="200" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 pr-16" />
                <button onClick={() => setAmount('1000')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-teal-400 bg-teal-500/15 border border-teal-500/25 px-2 py-0.5 rounded hover:bg-teal-500/25 transition">MAX</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Session Duration</label>
              <select value={sessionDuration} onChange={e => setSessionDuration(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 appearance-none">
                <option value="30 Seconds">30 Seconds</option>
                <option value="1 Minute">1 Minute</option>
                <option value="2 Minutes">2 Minutes</option>
                <option value="5 Minutes">5 Minutes</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Enter Passkey</label>
              <div className="relative">
                <input type="text" placeholder="APEXC-XXXX-XXXX" value={passkey} onChange={e => setPasskey(e.target.value)} className="w-full bg-slate-800 border rounded-lg pl-3 pr-36 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 border-slate-700" />
                <button onClick={() => setPasskey('APEXC-TEST-1234')} className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded-lg hover:bg-amber-500/25 transition whitespace-nowrap">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                  Buy Passkey ↓
                </button>
              </div>
              <p className="text-slate-600 text-xs mt-1">Each passkey can only be used for one bot</p>
            </div>

            <button onClick={handleActivateBot} disabled={isActivating || botActive} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isActivating ? '⏳ Activating...' : botActive ? '✅ Bot Already Active' : '🚀 Activate Bot Now'}
            </button>
          </div>

          {/* ====== BOT STATUS ====== */}
          <div id="bot-status-box" className="mb-6 scroll-mt-20">
            {botActive ? (
              <div className="rounded-xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Bots</p>
                    <p className="text-white font-bold text-xl">{status.pair}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-500 text-xs">v2.1</span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{sessionDuration || '30 Seconds'}</span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{status.session}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.isPaused ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-teal-500/20 text-teal-400 border-teal-500/30'}`}>{status.isPaused ? 'PAUSED' : 'ACTIVE'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Trades</p>
                    <p className="text-white font-bold text-xl">{s.totalTrades}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700"><p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Amt/Trade</p><p className="text-white font-bold text-sm">${(s.amountPerTrade || 0).toLocaleString()}</p></div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700"><p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Profit</p><p className={`font-bold text-sm ${(s.totalProfit || 0) >= 0 ? 'text-teal-400' : 'text-red-400'}`}>{(s.totalProfit || 0) >= 0 ? '+' : ''}{(s.totalProfit || 0).toFixed(2)}</p></div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700"><p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Win Rate</p><p className="text-teal-400 font-bold text-sm">{(s.winRate || 0).toFixed(1)}%</p></div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700"><p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">W/L</p><div className="flex items-center gap-1"><span className="text-teal-400 font-bold text-sm">{s.wins || 0}</span><span className="text-slate-500 text-xs">/</span><span className="text-red-400 font-bold text-sm">{s.losses || 0}</span></div></div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3 px-1">
                  <span className="text-slate-400">Wins: <span className="text-teal-400 font-bold">{s.wins || 0}</span></span>
                  <span className="text-slate-400">{s.sessionsCompleted || 0}/{s.totalSessions || 10} sessions</span>
                  <span className="text-slate-400">Losses: <span className="text-red-400 font-bold">{s.losses || 0}</span></span>
                </div>

                <div className="flex gap-2 mb-3">
                  <button onClick={handlePause} className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${status.isPaused ? 'bg-teal-500 hover:bg-teal-400 text-slate-950' : 'bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30'}`}>{status.isPaused ? 'Resume' : 'Pause'}</button>
                  <button onClick={handleStop} className="flex-1 py-2 rounded-lg font-bold text-xs bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition">Stop</button>
                  <button onClick={handleDelete} className="flex items-center justify-center px-3 py-2 rounded-lg font-bold text-xs bg-slate-800 border border-slate-700 text-slate-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition" title="Delete bot"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700 mb-3">
                  <div className="flex items-center justify-between">
                    <div><p className="text-teal-400 text-xs font-bold">Trading Active</p><p className="text-slate-400 text-[10px]">NEXT TRADE: {status.pair}</p></div>
                    <div className="text-right"><p className="text-slate-400 text-[10px]">{status.session} TIMER</p><div className="flex items-center gap-2"><p className={`text-2xl font-bold tabular-nums ${status.timer <= 3 ? 'text-red-400' : 'text-white'}`}>{formatTimer(status.timer)}</p><span className="text-sm font-bold text-teal-400">{status.confidence}%</span></div></div>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700 mb-3">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Live Execution Logs</p>
                  <div className="max-h-48 overflow-y-auto font-mono space-y-0.5">
                    {(status.logs || []).slice(-10).map((log: string, i: number) => (
                      <p key={i} className={`text-[10px] ${(log||'').includes('PROFIT')||(log||'').includes('WIN')?'text-teal-400 font-bold':(log||'').includes('LOSS')?'text-red-400':(log||'').includes('CONFIRMED')||(log||'').includes('filled')?'text-teal-300':(log||'').includes('RSI')||(log||'').includes('pressure')?'text-amber-400':'text-slate-300'}`}>{log}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Live Trade Log</p>
                  <div className="space-y-1.5 font-mono max-h-48 overflow-y-auto">
                    {(status.recentTrades||[]).length>0?<>
                      {(status.recentTrades||[]).slice(0,10).map((t:any,i:number)=>(
                        <div key={i} className="flex items-center justify-between text-[10px] border-b border-slate-700/50 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">#{t.sessionNum||t.id||i+1}</span>
                            <span className={`font-bold ${t.isWin?'text-teal-400':'text-red-400'}`}>{t.type||(t.isWin?'BUY':'SELL')}</span>
                            <span className="text-slate-300">{t.pair||status.pair}</span>
                            <span className="text-slate-500">{t.time||''}</span>
                          </div>
                          <span className={`font-bold ${t.isWin?'text-teal-400':'text-red-400'}`}>{t.isWin?'+':''}{(Number(t.profit)||0).toFixed(2)}</span>
                        </div>
                      ))}
                      {(s.totalProfit||0)!==0&&<div className="flex items-center justify-between pt-1.5 mt-1 border-t border-teal-500/20"><span className="text-slate-400 text-[10px] font-bold">Total Profit</span><span className={`text-sm font-bold ${(s.totalProfit||0)>=0?'text-teal-400':'text-red-400'}`}>{(s.totalProfit||0)>=0?'+':''}{(s.totalProfit||0).toFixed(2)}</span></div>}
                    </>:<p className="text-slate-500 text-[10px] text-center py-2">No trades yet. Waiting for first trade...</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex flex-col items-center py-8 text-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
                  <p className="text-slate-500 text-sm font-semibold">No bots yet.</p>
                  <p className="text-slate-600 text-xs mt-0.5">Select a market, set your amount, enter a passkey.</p>
                </div>
              </div>
            )}
          </div>

          {/* ====== BOT ACTIVITY HISTORY ====== */}
          {showBotHistory && (
            <div id="bot-history-section" className="mb-6 scroll-mt-20">
              <div className="rounded-xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    <p className="text-white font-bold text-sm">Bot Activity History</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded border border-teal-500/25">COMPLETED</span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-700 mb-4">
                  <div>
                    <p className="text-white font-bold text-sm">{status.pair}</p>
                    <p className="text-slate-400 text-xs">{s.sessionsCompleted || s.totalTrades} sessions • ${(s.amountPerTrade || 0).toLocaleString()} trade amount</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${(s.totalProfit || 0) >= 0 ? 'text-teal-400' : 'text-red-400'}`}>{(s.totalProfit || 0) >= 0 ? '+' : ''}{(s.totalProfit || 0).toFixed(2)}</p>
                    <p className="text-slate-500 text-[10px]">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">LIVE TRADE LOG</p>
                  <div className="space-y-1.5 font-mono max-h-48 overflow-y-auto">
                    {(status.recentTrades || []).length > 0 ? (
                      (status.recentTrades || []).map((trade: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[10px] border-b border-slate-700/50 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">#{trade.sessionNum || trade.id || i + 1}</span>
                            <span className={`font-bold ${trade.isWin ? 'text-teal-400' : 'text-red-400'}`}>{trade.type || (trade.isWin ? 'BUY' : 'SELL')}</span>
                            <span className="text-slate-300">{trade.pair || status.pair}</span>
                            <span className="text-slate-500">{trade.time || ''}</span>
                          </div>
                          <span className={`font-bold ${trade.isWin ? 'text-teal-400' : 'text-red-400'}`}>{trade.isWin ? '+' : ''}{(Number(trade.profit) || 0).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-[10px] text-center py-2">No trades recorded.</p>
                    )}
                  </div>
                  {(s.totalProfit || 0) !== 0 && (
                    <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-teal-500/20">
                      <span className="text-slate-400 text-[10px] font-bold">Total Profit</span>
                      <span className={`text-sm font-bold ${(s.totalProfit || 0) >= 0 ? 'text-teal-400' : 'text-red-400'}`}>{(s.totalProfit || 0) >= 0 ? '+' : ''}{(s.totalProfit || 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <button onClick={() => window.location.href = '/dashboard/history'} className="w-full mt-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  View Full History
                </button>
              </div>
            </div>
          )}

          {/* ====== AVAILABLE PACKAGES ====== */}
          <div>
            <div className="mb-4"><h2 className="text-white font-bold text-base">Available Packages</h2><p className="text-slate-500 text-xs mt-0.5">Pay via crypto — your passkey is delivered instantly after payment confirms</p></div>
            <div className="space-y-4">
              {botPackages.map(pkg => (
                <div key={pkg.id} onClick={() => setSelectedPackageId(pkg.id)} className={`rounded-xl border p-5 transition cursor-pointer hover:border-teal-500/50 ${selectedPackageId === pkg.id ? 'border-teal-500 bg-teal-500/5' : 'border-slate-800 bg-slate-900'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div><p className="font-black text-sm tracking-wide text-teal-400">{pkg.name}</p><p className="text-slate-400 text-xs mt-0.5 max-w-lg">{pkg.description}</p></div>
                    <div className="text-right flex-shrink-0 ml-4"><p className="text-white font-black text-lg">${pkg.price}</p><p className="text-slate-500 text-[10px]">one-time</p></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4 mt-3">
                    {pkg.tags.map(tag=><span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-teal-500/15 border-teal-500/25 text-teal-400">{tag}</span>)}
                    {pkg.features.map(feature=><span key={feature} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-slate-800 border-slate-700 text-slate-400">{feature}</span>)}
                  </div>
                  <button onClick={(e)=>{e.stopPropagation(); handleBuyPackage(pkg);}} disabled={isActivating || botActive} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    {isActivating && selectedPackageId === pkg.id ? '⏳ Activating...' : botActive ? '✅ Bot Active' : `Buy — $${pkg.price}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* ====== PROFIT ALERT MODAL ====== */}
      {showProfitAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl animate-pop-in relative">
            <button onClick={lastProfit.isFinalSession ? handleViewFinalResults : handleContinueTrading} className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition" aria-label="Close">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-16 h-16 rounded-full border-2 border-teal-400 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-slate-300 text-sm font-medium mb-3">Session {lastProfit.sessionNum} Complete</p>
              <p className={`text-3xl sm:text-4xl font-bold mb-1 ${lastProfit.profit>=0?'text-teal-400':'text-red-400'}`}>{lastProfit.profit>=0?'+':''}${Math.abs(lastProfit.profit).toFixed(2)}</p>
              <p className={`text-base font-semibold mb-3 ${lastProfit.pct>=0?'text-teal-400':'text-red-400'}`}>{lastProfit.pct>=0?'+':''}{lastProfit.pct.toFixed(2)}%</p>
              <p className="text-slate-500 text-xs mb-6">Profit added to your balance</p>
              {lastProfit.isFinalSession ? (
                <button onClick={handleViewFinalResults} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  View Final Results
                </button>
              ) : (
                <button onClick={handleContinueTrading} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition">Continue Trading</button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop-in { from { transform: scale(0.95) translateY(8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-pop-in { animation: pop-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default BotConsolePage;