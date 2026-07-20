'use client';

interface Strategy {
  id: number;
  name: string;
  timeframe: string;
  winRate: string;
  target: string;
  icon: React.ReactNode;
  features: string[];
}

const StrategyEngine = () => {
  const strategies: Strategy[] = [
    {
      id: 1,
      name: 'Scalper Pro',
      timeframe: 'M1 — M5',
      winRate: '82%',
      target: '0.3 – 0.8% per trade',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      features: [
        'RSI + MACD + EMA confluence on micro-trends',
        '30-second to 4-minute holding window',
        'Best for crypto and major FX pairs in active sessions'
      ]
    },
    {
      id: 2,
      name: 'Trend Follower',
      timeframe: 'M15 — H1',
      winRate: '78%',
      target: '1.5 – 3.5% per trade',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      features: [
        'Ichimoku cloud + 200-EMA trend filter',
        'Pyramiding entries on retests of key support',
        'Optimised for indices NAS100, US30 and gold'
      ]
    },
    {
      id: 3,
      name: 'Breakout Hunter',
      timeframe: 'H1 — H4',
      winRate: '71%',
      target: '2 – 6% per trade',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
      features: [
        'Volatility-contraction pattern detection',
        'Volume + ATR expansion confirmation',
        'Captures news-driven moves on major pairs'
      ]
    },
    {
      id: 4,
      name: 'Mean Reversion AI',
      timeframe: 'M5 — M30',
      winRate: '85%',
      target: '0.8 – 2% per trade',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h4l3-9 4 18 3-9h4" />
        </svg>
      ),
      features: [
        'Bollinger band fade + Z-score statistical edge',
        'Exits at VWAP or 50% Fibonacci retracement',
        'Tuned for ranging crypto and FX markets'
      ]
    }
  ];

  return (
    <section className="bg-slate-950 py-20 px-4 lg:px-12 border-t border-teal-500/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-amber-500/8 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            Strategy Engine
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-2">
          One Bot. Four Strategies.
        </h2>
        
        <p className="text-gray-400 text-center text-sm mb-14 max-w-lg mx-auto">
          Every account runs all four algorithms simultaneously. Profits compound across strategies in real time.
        </p>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-slate-900/70 border border-teal-500/20 rounded-xl p-6 hover:border-teal-400/50 transition-all duration-300 hover:bg-slate-900/90 group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-500/15 text-teal-400 group-hover:bg-teal-500/25 transition-colors duration-300">
                    {strategy.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm group-hover:text-teal-400 transition-colors duration-300">
                      {strategy.name}
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      {strategy.timeframe}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    {strategy.winRate}
                  </div>
                  <div className="text-gray-500 text-[9px] uppercase tracking-wider">
                    Win Rate
                  </div>
                </div>
              </div>

              {/* Target */}
              <div className="bg-slate-800/80 rounded px-3 py-1.5 mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span className="text-gray-500 text-[10px] uppercase tracking-wider">Avg Target:</span>
                <span className="text-teal-400 text-[10px] font-semibold ml-auto">
                  {strategy.target}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {strategy.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-400 text-xs leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategyEngine;