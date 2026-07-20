'use client';

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WhyApexAI = () => {
  const features: Feature[] = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
      title: 'Multi-Timeframe Confluence',
      description: 'Simultaneously scans M1 through W1 charts. Entries only trigger when momentum, structure, and volume align across three or more timeframes, eliminating low-probability noise trades.'
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Sub-50ms Execution',
      description: 'Order placement completes in under 50 milliseconds. By the time a human reads a candle close and clicks confirm, Apex AI has already entered, set stop loss, and calculated take profit levels.'
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Dynamic Risk Allocation',
      description: 'Position sizing adjusts in real time based on current volatility index and account drawdown thresholds. Risk per trade never exceeds 1.5% regardless of signal confidence, protecting capital systematically.'
    },
    {
      id: 4,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'Zero Emotional Bias',
      description: 'No revenge trading after losses. No premature profit-taking from fear. No overexposure from greed. Every decision is governed by pre-validated logic that executes identically at 3am on Sunday as it does at market open.'
    },
    {
      id: 5,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: 'Correlation-Aware Portfolio',
      description: 'Live correlation matrix prevents stacking directional exposure across correlated instruments. When BTC and ETH are highly correlated, the bot reduces combined position size to keep portfolio delta neutral.'
    },
    {
      id: 6,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      title: 'Adaptive Regime Detection',
      description: 'Classifies market conditions as trending, ranging, or volatile using ADX, Bollinger Band width, and ATR ratio. Strategy parameters shift automatically so breakout logic runs in trends and mean-reversion logic runs in ranges.'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-amber-500/8 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            AI Advantage
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-semibold mb-3 text-white text-center">
          Why Apex AI Beats Human Trading
        </h2>
        
        <p className="text-gray-400 text-center text-sm mb-14 max-w-xl mx-auto">
          Six institutional-grade edges running in parallel every millisecond of every day
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-teal-500/40 transition-all duration-300 hover:bg-slate-900/80 group"
            >
              {/* Icon */}
              <div className="w-11 h-11 bg-teal-500/15 rounded-lg flex items-center justify-center text-teal-400 mb-4 group-hover:bg-teal-500/25 transition-colors duration-300">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-white font-semibold text-base mb-3 group-hover:text-teal-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyApexAI;