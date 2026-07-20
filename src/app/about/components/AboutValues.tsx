'use client';

import { useState } from 'react';

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutValues = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values: Value[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
      title: 'Transparency',
      description: 'No hidden fees, no fine print. Every strategy, every trade, every result is visible. We operate with full accountability to everyone on the platform.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Community',
      description: 'We believe serious traders thrive together. Our ecosystem fosters shared intelligence, collective growth, and a network of professionals who hold each other to the highest standard.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Trust',
      description: 'Institutional-grade security and reliable infrastructure ensure your capital is protected around the clock. Your focus stays on results. We handle the infrastructure.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Markets evolve. Our algorithms evolve with them. Continuous research, adaptive regime detection, and ongoing model retraining keep Apex AI ahead of market structure shifts.'
    }
  ];

  return (
    <section className="py-20 px-4 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Core Values
          </span>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-3">
          What We Stand For
        </h2>
        
        <p className="text-gray-500 text-center text-sm mb-14">
          The principles that drive every decision and every trade
        </p>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-slate-900/70 border border-teal-500/20 rounded-2xl p-8 text-center hover:border-teal-400/40 transition-all duration-300 hover:bg-slate-900/90 group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon with animation */}
              <div className={`w-14 h-14 bg-teal-500/12 rounded-full flex items-center justify-center text-teal-400 mx-auto mb-5 transition-all duration-500 ${
                hoveredIndex === index ? 'scale-110 bg-teal-500/20 rotate-12' : ''
              }`}>
                {value.icon}
              </div>
              
              {/* Title */}
              <h3 className={`text-white font-bold text-lg mb-3 transition-all duration-300 ${
                hoveredIndex === index ? 'text-teal-400' : ''
              }`}>
                {value.title}
              </h3>
              
              {/* Description */}
              <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${
                hoveredIndex === index ? 'text-gray-300' : ''
              }`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;