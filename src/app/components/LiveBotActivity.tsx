'use client';

import { useEffect, useRef } from 'react';

interface Trade {
  id: number;
  pair: string;
  type: 'LONG' | 'SHORT';
  price: string;
  time: string;
  profit: string;
}

const LiveBotActivity = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const trades: Trade[] = [
    {
      id: 1,
      pair: 'GBP/JPY',
      type: 'SHORT',
      price: '198.42',
      time: '00:01:22',
      profit: '+$142.80'
    },
    {
      id: 2,
      pair: 'SOL/USDT',
      type: 'LONG',
      price: '218.4',
      time: '00:01:55',
      profit: '+$198.60'
    },
    {
      id: 3,
      pair: 'NAS100',
      type: 'LONG',
      price: '21,048',
      time: '00:02:41',
      profit: '+$387.20'
    },
    {
      id: 4,
      pair: 'EUR/USD',
      type: 'SHORT',
      price: '1.084',
      time: '00:01:48',
      profit: '+$184.20'
    },
    {
      id: 5,
      pair: 'XAU/USD',
      type: 'LONG',
      price: '2,654.2',
      time: '00:03:09',
      profit: '+$421.50'
    },
    {
      id: 6,
      pair: 'ETH/USDT',
      type: 'LONG',
      price: '3,284.1',
      time: '00:02:33',
      profit: '+$256.40'
    },
    {
      id: 7,
      pair: 'USD/JPY',
      type: 'SHORT',
      price: '154.18',
      time: '00:01:36',
      profit: '+$168.30'
    },
    {
      id: 8,
      pair: 'BTC/USDT',
      type: 'LONG',
      price: '96,420',
      time: '00:02:14',
      profit: '+$312.80'
    }
  ];

  // Duplicate trades for seamless scrolling
  const duplicatedTrades = [...trades, ...trades, ...trades];

  useEffect(() => {
    // Optional: Pause animation on hover
    const marquee = marqueeRef.current;
    if (marquee) {
      const handleMouseEnter = () => {
        marquee.style.animationPlayState = 'paused';
      };
      const handleMouseLeave = () => {
        marquee.style.animationPlayState = 'running';
      };

      marquee.addEventListener('mouseenter', handleMouseEnter);
      marquee.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        marquee.removeEventListener('mouseenter', handleMouseEnter);
        marquee.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <section className="bg-slate-950 py-12 border-t border-teal-500/20 overflow-hidden">
      <h2 className="text-2xl font-semibold mb-8 text-white text-center px-4">
        Live Bot Activity
      </h2>
      
      <div className="overflow-hidden">
        <div 
          ref={marqueeRef}
          className="marquee-track flex gap-3 w-max animate-scroll"
        >
          {duplicatedTrades.map((trade, index) => (
            <div
              key={`${trade.id}-${index}`}
              className="flex-shrink-0 bg-slate-800/70 border border-slate-700/60 rounded-lg px-4 py-3 flex items-center gap-3 min-w-[220px]"
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
                trade.type === 'SHORT' ? 'bg-red-900/50' : 'bg-teal-900/50'
              }`}>
                <svg 
                  viewBox="0 0 24 24" 
                  className={`w-5 h-5 ${trade.type === 'SHORT' ? 'text-red-400' : 'text-teal-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <polyline points={trade.type === 'SHORT' ? '3 7 9 13 13 9 21 17' : '3 17 9 11 13 15 21 7'} />
                </svg>
              </div>

              {/* Trade Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-bold text-sm">{trade.pair}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    trade.type === 'SHORT' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-teal-500/20 text-teal-400'
                  }`}>
                    {trade.type}
                  </span>
                </div>
                <div className="text-gray-500 text-[10px]">
                  @ {trade.price} • {trade.time}
                </div>
              </div>

              {/* Profit */}
              <span className="text-teal-400 font-bold text-sm whitespace-nowrap">
                {trade.profit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveBotActivity;