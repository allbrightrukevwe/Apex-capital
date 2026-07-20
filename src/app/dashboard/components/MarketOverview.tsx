'use client';

import Link from 'next/link';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MarketOverview = () => {
  const cryptos: Crypto[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$63,039.99',
      change: '1.29%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#f7931a" />
          <path d="M27.5 17.5c.4-2.5-1.5-3.8-4.1-4.7l.8-3.3-2-.5-.8 3.2c-.5-.1-1-.3-1.6-.4l.8-3.2-2-.5-.8 3.3c-.4-.1-.8-.2-1.2-.3l-2.8-.7-.5 2.1s1.5.3 1.4.4c.8.2 1 .7.9 1.1l-2.2 8.8c-.1.3-.5.8-1.2.6.0.0-1.4-.4-1.4-.4l-1 2.2 2.6.7c.5.1 1 .3 1.4.4l-.9 3.4 2 .5.9-3.3c.5.1 1.1.3 1.6.4l-.9 3.3 2 .5.9-3.4c3.6.7 6.3.4 7.4-2.9.9-2.6-.1-4.1-1.9-5.1 1.4-.3 2.4-1.2 2.6-3zm-4.7 6.6c-.6 2.5-4.9 1.2-6.3.8l1.1-4.5c1.4.3 5.8 1 5.2 3.7zm.7-6.6c-.6 2.3-4.1 1.1-5.3.8l1-4.1c1.2.3 4.9.9 4.3 3.3z" fill="white" />
        </svg>
      )
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$1,749.41',
      change: '0.57%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#627eea" />
          <polygon points="20,6 28.5,20.5 20,25 11.5,20.5" fill="#eff2fc" />
          <polygon points="20,25 28.5,20.5 20,34" fill="#b0c0f5" />
          <polygon points="20,25 11.5,20.5 20,34" fill="#8899dd" />
          <polygon points="20,6 20,25 11.5,20.5" fill="#99aaee" />
        </svg>
      )
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: '$78.09',
      change: '1.00%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#9945ff" />
          <path d="M11 26.5h16l2.5-3H13.5z M11 13.5h16l2.5 3H13.5z M13.5 20h16l-2.5 3H11z" fill="white" />
        </svg>
      )
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      price: '$572.42',
      change: '1.13%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#f3ba2f" />
          <polygon points="20,29 23,26 20,23 17,26" fill="#3a2807" />
          <polygon points="20,11 23,14 20,17 17,14" fill="#3a2807" />
          <polygon points="11,20 14,17 17,20 14,23" fill="#3a2807" />
          <polygon points="29,20 26,17 23,20 26,23" fill="#3a2807" />
          <polygon points="17,20 20,17 23,20 20,23" fill="#50390c" />
        </svg>
      )
    },
    {
      id: 'xrp',
      name: 'XRP',
      symbol: 'XRP',
      price: '$1.10',
      change: '0.69%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#1c1c2e" />
          <path d="M10 9h4l6 6.5L26 9h4l-8 8.7 8 8.7h-4l-6-6.5-6 6.5h-4l8-8.7z" fill="white" />
          <path d="M28 27.5l-8-8.7-8 8.7h4l4-4.3 4 4.3z" fill="#087fae" />
        </svg>
      )
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: '$0.1666',
      change: '0.18%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#0033ad" />
          <circle cx="20" cy="20" r="5" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="20" cy="10" r="2" fill="white" />
          <circle cx="20" cy="30" r="2" fill="white" />
          <circle cx="10" cy="20" r="2" fill="white" />
          <circle cx="30" cy="20" r="2" fill="white" />
          <circle cx="13" cy="13" r="1.5" fill="#ccd6ef" />
          <circle cx="27" cy="13" r="1.5" fill="#ccd6ef" />
          <circle cx="13" cy="27" r="1.5" fill="#ccd6ef" />
          <circle cx="27" cy="27" r="1.5" fill="#ccd6ef" />
        </svg>
      )
    },
    {
      id: 'dogecoin',
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: '$0.0731',
      change: '0.55%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#c2a633" />
          <path d="M14 10h8c5.5 0 9 3.5 9 10s-3.5 10-9 10h-8V10zm4 4v12h3.5c3.3 0 5.5-2 5.5-6s-2.2-6-5.5-6H18z" fill="white" />
          <rect x="12" y="18" width="9" height="3" rx="1.5" fill="white" />
        </svg>
      )
    },
    {
      id: 'litecoin',
      name: 'Litecoin',
      symbol: 'LTC',
      price: '$44.02',
      change: '1.06%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#9b9b9b" />
          <text x="20" y="27" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">Ł</text>
        </svg>
      )
    },
    {
      id: 'avalanche',
      name: 'Avalanche',
      symbol: 'AVAX',
      price: '$6.75',
      change: '4.59%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#e84142" />
          <polygon points="20,9 32,31 8,31" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
          <line x1="20" y1="16" x2="20" y2="25" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="28" r="1.5" fill="white" />
        </svg>
      )
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      price: '$7.76',
      change: '1.70%',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="20" fill="#375bd2" />
          <path d="M20 9l-3 1.8-6 3.4-3 1.8v8l3 1.8 6 3.4 3 1.8 3-1.8 6-3.4 3-1.8v-8l-3-1.8-6-3.4zM28 22.5l-8 4.6-8-4.6v-5l8-4.6 8 4.6z" fill="white" />
        </svg>
      )
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-white font-bold text-sm">Market Overview</span>
        </div>
        <Link
          href="/dashboard/market"
          className="flex items-center gap-0.5 text-teal-400 hover:text-teal-300 text-xs font-semibold transition"
        >
          View More
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      <div>
        {cryptos.map((crypto, index) => (
          <div
            key={crypto.id}
            className={`flex items-center justify-between px-4 py-3.5 ${
              index > 0 ? 'border-t border-slate-800' : ''
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 flex-shrink-0">{crypto.icon}</div>
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{crypto.name}</div>
                <div className="text-slate-500 text-xs">{crypto.symbol}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-white text-sm font-semibold">{crypto.price}</div>
              <span
                className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                  crypto.isPositive ? 'bg-teal-900 text-teal-400' : 'bg-red-950 text-red-400'
                }`}
              >
                {crypto.isPositive ? '▲' : '▼'} {crypto.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;