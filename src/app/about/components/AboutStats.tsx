'use client';

import { useState, useEffect, useRef } from 'react';

interface Stat {
  value: string;
  label: string;
  numericValue?: number;
}

const AboutStats = () => {
  const [counts, setCounts] = useState<{ [key: number]: string }>({});
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats: Stat[] = [
    { value: '2021', label: 'Founded', numericValue: 2021 },
    { value: '150+', label: 'Countries Served', numericValue: 150 },
    { value: '12,000+', label: 'Active Accounts', numericValue: 12000 },
    { value: '2.1M+', label: 'Trades Executed', numericValue: 2100000 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    stats.forEach((stat, index) => {
      if (!stat.numericValue) return;
      
      let current = 0;
      const target = stat.numericValue;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      const interval = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        let displayValue = '';
        if (index === 0) {
          // Founded year - just show the year
          displayValue = '2021';
        } else if (index === 1) {
          // Countries - show with +
          displayValue = Math.floor(current) + '+';
        } else if (index === 2) {
          // Active Accounts - show with + and comma formatting
          displayValue = Math.floor(current).toLocaleString() + '+';
        } else if (index === 3) {
          // Trades - show with M+ formatting
          if (current >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M+';
          } else {
            displayValue = Math.floor(current).toLocaleString() + '+';
          }
        }
        
        setCounts(prev => ({
          ...prev,
          [index]: displayValue
        }));
      }, interval);

      return () => clearInterval(timer);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="border-t border-b border-teal-500/15 py-10 px-4">
      <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="text-center border-l border-teal-500/30 pl-4 py-2 first:border-l-0"
          >
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {isVisible ? counts[index] || stat.value : stat.value}
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutStats;