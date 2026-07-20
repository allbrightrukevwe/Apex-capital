'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface Transaction {
  id: number;
  time: string;
  asset: string;
  amount: string;
  status: string;
  icon: string;
  isActive?: boolean;
}

const HeroSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      time: 'Just now',
      asset: 'BTC',
      amount: '$42,000',
      status: 'Completed',
      icon: '/Bitcoin.png',
      isActive: true
    },
    {
      id: 2,
      time: '4s ago',
      asset: 'SOL',
      amount: '$17,500',
      status: 'Completed',
      icon: '/Solana.jpeg'
    },
    {
      id: 3,
      time: '7s ago',
      asset: 'SOL',
      amount: '$17,500',
      status: 'Completed',
      icon: '/Solana.jpeg'
    },
    {
      id: 4,
      time: '10s ago',
      asset: 'SOL',
      amount: '$17,500',
      status: 'Completed',
      icon: '/Solana.jpeg'
    },
    {
      id: 5,
      time: '13s ago',
      asset: 'USDT',
      amount: '$20,000',
      status: 'Completed',
      icon: 'USDT'
    },
    {
      id: 6,
      time: '16s ago',
      asset: 'SOL',
      amount: '$42,000',
      status: 'Completed',
      icon: '/Solana.jpeg'
    },
    {
      id: 7,
      time: '19s ago',
      asset: 'BTC',
      amount: '$42,000',
      status: 'Completed',
      icon: '/Bitcoin.png'
    },
    {
      id: 8,
      time: '22s ago',
      asset: 'BTC',
      amount: '$7,000',
      status: 'Completed',
      icon: '/Bitcoin.png'
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filters = ['ALL', 'BTC', 'ETH', 'USDT', 'SOL'];

  // Sample new transactions to add
  const newTransactions: Transaction[] = [
    {
      id: 9,
      time: '2s ago',
      asset: 'ETH',
      amount: '$32,500',
      status: 'Completed',
      icon: '/Ethereum.png'
    },
    {
      id: 10,
      time: '5s ago',
      asset: 'BTC',
      amount: '$28,000',
      status: 'Completed',
      icon: '/Bitcoin.png'
    },
    {
      id: 11,
      time: '8s ago',
      asset: 'SOL',
      amount: '$15,200',
      status: 'Completed',
      icon: '/Solana.jpeg'
    },
    {
      id: 12,
      time: '11s ago',
      asset: 'USDT',
      amount: '$45,000',
      status: 'Completed',
      icon: 'USDT'
    }
  ];

  // Auto-scroll transactions
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTransactions(prev => {
        // Remove the oldest transaction (index 1, keeping the first active one)
        const newList = [...prev];
        const removed = newList.splice(1, 1);
        
        // Add a new transaction at the end
        const newTx = {
          ...newTransactions[Math.floor(Math.random() * newTransactions.length)],
          id: Date.now(),
          time: 'Just now',
          isActive: false
        };
        
        // Update times for existing transactions
        const updatedList = newList.map((tx, index) => {
          if (index === 0) {
            return { ...tx, isActive: true };
          }
          // Update time strings
          const timeParts = tx.time.split(' ');
          if (timeParts.length === 2 && timeParts[1] === 'ago') {
            const seconds = parseInt(timeParts[0]);
            if (!isNaN(seconds)) {
              return { ...tx, time: `${seconds + 3}s ago` };
            }
          }
          return tx;
        });
        
        return [...updatedList, newTx];
      });
    }, 3000); // Update every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
      {/* Left Section - Text Content */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-6 text-white">
          Trade Smartly. Let the trading bot do the work for you
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-5 leading-relaxed">
          Apex AI executes with sub-50ms latency and runs four institutional strategies in parallel scanning 200 plus markets every second
        </p>
        
        {/* Stats */}
        <div className="flex gap-5 justify-center lg:justify-start mb-8">
          <div className="text-center">
            <div className="stat-gradient font-bold text-base text-teal-400">52,443</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Signals</div>
          </div>
          <div className="w-px bg-slate-700/60 self-stretch"></div>
          <div className="text-center">
            <div className="stat-gradient font-bold text-base text-teal-400">2,158,909</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Trades</div>
          </div>
          <div className="w-px bg-slate-700/60 self-stretch"></div>
          <div className="text-center">
            <div className="stat-gradient font-bold text-base text-teal-400">$8,910k</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Profit</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-3 justify-center lg:justify-start mb-12">
          <button className="btn-heartbeat bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2 rounded text-sm whitespace-nowrap transition duration-200">
            ACTIVATE THE BOT
          </button>
          <Link 
            href="/signup" 
            className="glow-amber border border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500/10 font-bold px-6 py-2 rounded transition text-sm whitespace-nowrap"
          >
            GET STARTED
          </Link>
        </div>
      </div>

      {/* Right Section - Live Payout Transactions */}
      <div className="w-full lg:w-5/12 sticky top-24">
        <div 
          className="bg-[rgba(2,6,23,0.38)] border border-teal-500/25 rounded-2xl overflow-hidden backdrop-blur-sm"
          style={{
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header */}
          <div className="p-4 pb-3 border-b border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-bold text-[11px] tracking-[0.08em] uppercase m-0">
                  LIVE PAYOUT TRANSACTIONS
                </p>
                <p className="text-slate-500 text-[10px] mt-1 m-0">
                  Real-time wallet payout feed across BTC, USDT, ETH, and SOL.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-pulse"></span>
                <span className="text-teal-500 text-[9px] font-bold uppercase">Live</span>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${
                    selectedFilter === filter
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-[72px_1fr_auto_auto] gap-3 px-4 py-2 border-b border-white/5">
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.08em]">Time</span>
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.08em]">Asset</span>
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.08em]">Payout</span>
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.08em]">Status</span>
          </div>

          {/* Transactions List with Animation */}
          <div className="border-t border-white/5 max-h-[400px] overflow-y-auto relative">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`grid grid-cols-[72px_1fr_auto_auto] gap-3 px-4 py-2.5 items-center border-b border-white/5 transition-all duration-500 ${
                  tx.isActive ? 'border-l-2 border-teal-500 bg-teal-500/5' : 'border-l-2 border-transparent'
                } ${
                  index === 0 ? 'animate-slide-in' : ''
                }`}
              >
                <span className={`text-[10px] ${tx.isActive ? 'text-teal-400 font-semibold' : 'text-slate-500'}`}>
                  {tx.time}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-slate-700 flex items-center justify-center">
                    {tx.icon === 'USDT' ? (
                      <svg viewBox="0 0 22 22" className="w-5 h-5">
                        <circle cx="11" cy="11" r="11" fill="#26a17b" />
                        <text x="11" y="15.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">₮</text>
                      </svg>
                    ) : (
                      <Image
                        src={tx.icon}
                        alt={tx.asset}
                        width={20}
                        height={20}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className={`font-semibold text-[11px] ${tx.isActive ? 'text-teal-400' : 'text-white'}`}>
                    {tx.asset}
                  </span>
                </div>
                <span className="text-teal-500 font-bold text-[11px]">{tx.amount}</span>
                <span className="bg-teal-500/15 text-teal-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {tx.status}
                </span>
              </div>
            ))}
            
            {/* Scroll indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 text-center text-slate-600 text-[9px]">
            Showing {transactions.length} of 15 transactions • Auto-updating
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;