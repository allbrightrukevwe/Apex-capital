'use client';

import { useEffect, useRef, useState } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  position: 'left' | 'right';
}

const AboutTimeline = () => {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const timelineEvents: TimelineEvent[] = [
    {
      year: '2021',
      title: 'The Problem We Saw',
      description: 'Retail traders with real skill were being wiped out by undercapitalisation and emotional decision-making. The financial markets are ruthless, and trading without a disciplined, automated system often leads to blown accounts regardless of talent.',
      position: 'left'
    },
    {
      year: '2022',
      title: 'Building the Engine',
      description: 'We assembled a team of quantitative analysts, ex-institutional traders, and AI engineers with one mandate: build a bot that executes with institutional precision at retail speed. Twelve months of backtesting across 200 markets followed.',
      position: 'right'
    },
    {
      year: '2023',
      title: 'First Live Deployments',
      description: 'Apex AI went live with four concurrent strategies running on real capital. Sub-50ms execution, dynamic risk allocation, and zero emotional bias delivered consistent results across crypto, forex, indices, and commodities.',
      position: 'left'
    },
    {
      year: '2024',
      title: 'Scaling the Platform',
      description: 'We opened access to retail investors globally. Over 12,000 active accounts activated within the first year. Profit generation crossed the $8 million mark. The platform expanded to support unlimited concurrent bot instances for Gold tier members.',
      position: 'right'
    },
    {
      year: 'Today',
      title: 'The Standard We Hold',
      description: 'Apex AI now operates across 150 plus countries, processing over 2 million trades and scanning 50,000 signals every month. Our mission remains unchanged: make institutional-grade algorithmic trading accessible to every serious investor on the planet.',
      position: 'left'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleEvents(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-14">Our Story</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-amber-500/30"></div>
          
          <div className="space-y-10">
            {timelineEvents.map((event, index) => (
              <div 
                key={index}
                data-index={index}
                className={`timeline-item relative md:flex md:gap-0 ${
                  event.position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
                } transition-all duration-700 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Mobile View */}
                <div className="flex gap-5 items-start md:hidden">
                  <div className="flex-shrink-0 mt-1 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(20,184,166,0.7)] z-10"></div>
                  <div className="flex-1 pb-2">
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
                      {event.year}
                    </div>
                    <h3 className="text-white font-bold text-base mb-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Desktop Left Content */}
                <div className={`hidden md:block w-5/12 ${
                  event.position === 'left' ? 'pr-10' : 'pl-10 ml-auto'
                }`}>
                  <div className={`bg-slate-900/70 border border-teal-500/20 rounded-xl p-5 hover:border-teal-400/40 transition-all duration-300 ${
                    visibleEvents.includes(index) ? 'scale-100' : 'scale-95'
                  }`}>
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                      {event.year}
                    </div>
                    <h3 className="text-white font-bold text-base mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-slate-950 z-10 shadow-[0_0_8px_rgba(20,184,166,0.7)]"></div>

                {/* Desktop Right Empty Space */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;