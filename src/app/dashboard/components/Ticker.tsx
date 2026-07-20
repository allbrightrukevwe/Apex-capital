'use client';

interface TickerItem {
  pair: string;
  price: string;
  change: string;
  isPositive: boolean;
}

interface TickerProps {
  variant: 'desktop' | 'mobile';
}

const Ticker = ({ variant }: TickerProps) => {
  const tickerData: TickerItem[] = [
    { pair: 'EUR/USD', price: '1.0821', change: '0.25%', isPositive: true },
    { pair: 'GBP/USD', price: '1.3412', change: '0.02%', isPositive: true },
    { pair: 'USD/JPY', price: '149.85', change: '4.63%', isPositive: true },
    { pair: 'AUD/USD', price: '0.6512', change: '2.53%', isPositive: true },
    { pair: 'USD/CAD', price: '1.3621', change: '2.86%', isPositive: false },
    { pair: 'EUR/GBP', price: '0.8563', change: '4.62%', isPositive: true },
    { pair: 'NZD/USD', price: '0.5934', change: '1.12%', isPositive: false },
    { pair: 'USD/CHF', price: '0.9012', change: '0.87%', isPositive: true },
  ];

  // Duplicate for seamless scrolling
  const items = [...tickerData, ...tickerData];

  const getAnimationDuration = () => {
    return variant === 'desktop' ? '22s' : '18s';
  };

  return (
    <div className="border-b border-teal-500/[0.07] overflow-hidden">
      <div
        className={`ticker-track ${variant === 'desktop' ? 'hidden lg:flex' : 'flex'}`}
        style={{ animationDuration: getAnimationDuration() }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 ${
              variant === 'desktop' ? 'px-5 py-1.5' : 'px-4 py-1.5'
            } text-[11px] font-semibold border-r border-teal-500/[0.07] flex-shrink-0 whitespace-nowrap`}
          >
            <span className="text-slate-400">{item.pair}</span>
            <span className="text-white">{item.price}</span>
            <span className={item.isPositive ? 'text-teal-400' : 'text-red-400'}>
              {item.isPositive ? '▲' : '▼'} {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;