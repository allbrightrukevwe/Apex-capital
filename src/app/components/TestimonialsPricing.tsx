'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: number;
  name: string;
  country: string;
  flag: string;
  text: string;
  initial: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

const TestimonialsPricing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sipho Mthembu',
      country: 'South Africa',
      flag: '🇿🇦',
      initial: 'S',
      text: 'I had tried several trading systems before, but none delivered consistent results. After joining Apex Trading Bot, I finally started seeing real profits in my account. The trades were accurate, easy to follow, and the support team was always available when needed. Thank you Apex Trading Bot for helping me achieve financial growth. Looking forward to many more successful trades ahead!'
    },
    {
      id: 2,
      name: 'Michael Johnson',
      country: 'United States',
      flag: '🇺🇸',
      initial: 'M',
      text: 'Apex Trading Bot exceeded my expectations. I was skeptical at first, but after my first few trades, I started seeing positive returns. The platform is user-friendly and the signals are highly effective. Thanks to Apex Trading Bot, I\'ve finally been able to earn consistent profits. Thank you, and I look forward to continuing this successful journey.'
    },
    {
      id: 3,
      name: 'James Thompson',
      country: 'United Kingdom',
      flag: '🇬🇧',
      initial: 'J',
      text: 'After months of searching for a reliable trading solution, I discovered Apex Trading Bot. The results have been outstanding. My investment has grown steadily, and I have regained confidence in online trading. Thank you Apex Trading Bot for delivering what was promised. Looking forward to future profits and continued success.'
    },
    {
      id: 4,
      name: 'Ahmed Al Mansoori',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      initial: 'A',
      text: 'Apex Trading Bot has completely transformed my trading experience. The automated system is efficient, reliable, and profitable. I recovered my initial investment quickly and have continued to generate profits from successful trades. Thank you for this amazing service. Looking forward to achieving even greater results.'
    },
    {
      id: 5,
      name: 'Daniel Tan',
      country: 'Malaysia',
      flag: '🇲🇾',
      initial: 'D',
      text: 'I joined Apex Trading Bot after a recommendation from a friend, and it was one of the best decisions I\'ve made. The bot consistently identifies profitable opportunities and has helped me grow my portfolio. Thank you Apex Trading Bot for your professionalism and excellent performance. Looking forward to many more profitable months ahead.'
    },
    {
      id: 6,
      name: 'Petrus Shilongo',
      country: 'Namibia',
      flag: '🇳🇦',
      initial: 'P',
      text: 'As someone new to trading, I needed a trustworthy solution. Apex Trading Bot made the process simple and profitable. My account has shown impressive growth, and I am extremely satisfied with the results. Thank you for helping me earn profits and build confidence in trading. Looking forward to a long and successful partnership.'
    }
  ];

  const plans: Plan[] = [
    {
      id: 1,
      name: 'Bronze',
      price: '$400',
      features: [
        '1 active bot instance',
        'All 4 strategies included',
        'M1 to H1 timeframes',
        'Up to $5,000 trade size',
        '24/7 automated execution',
        'Email profit reports'
      ]
    },
    {
      id: 2,
      name: 'Silver',
      price: '$700',
      isPopular: true,
      features: [
        '3 active bot instances',
        'All 4 strategies + priority signals',
        'M1 to H4 timeframes',
        'Up to $15,000 trade size',
        'Sub-50ms execution priority',
        'Real-time dashboard access'
      ]
    },
    {
      id: 3,
      name: 'Gold',
      price: '$1,000',
      features: [
        'Unlimited bot instances',
        'All 4 strategies + custom config',
        'All timeframes M1 to W1',
        'Up to $50,000 trade size',
        'Dedicated execution server',
        'Weekly strategy review call'
      ]
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="trading-plans" className="bg-slate-950 border-t border-teal-500/20">
      {/* Testimonials Section */}
      <section className="bg-slate-900/50 py-20 border-t border-teal-500/10">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              What Our <span className="text-white">Users Say</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Join thousands of successful traders who are earning consistent profits with Apex Trading Bot
            </p>
          </div>

          <div className="relative" style={{ minHeight: '420px' }}>
            <div className="w-full max-w-3xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-700 ${
                    index === currentTestimonial
                      ? 'opacity-100 relative pointer-events-auto'
                      : 'opacity-0 absolute inset-0 pointer-events-none'
                  }`}
                  style={{
                    position: index === currentTestimonial ? 'relative' : 'absolute',
                    pointerEvents: index === currentTestimonial ? 'auto' : 'none',
                    inset: 0
                  }}
                >
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 border border-teal-500/20 flex flex-col gap-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 text-amber-400 fill-current">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-1 border-t border-slate-700/60">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                        {testimonial.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                          <span>{testimonial.flag}</span>
                          <span>{testimonial.country}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'w-8 h-2 bg-teal-400 rounded-full'
                    : 'w-2 h-2 bg-teal-500/30 rounded-full hover:bg-teal-500/60'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 bg-amber-500/8 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Bot Packages
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-2">
            Choose Your Plan
          </h2>
          
          <p className="text-gray-400 text-center text-sm mb-14 max-w-lg mx-auto">
            Every plan unlocks all four strategies. Higher tiers get more concurrent bots, faster execution intervals, and larger trade sizes.
          </p>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-slate-900/70 border rounded-2xl p-7 transition duration-300 ${
                  plan.isPopular
                    ? 'border-teal-500/30 hover:border-teal-400/60 ring-1 ring-teal-400/50'
                    : 'border-teal-500/30 hover:border-teal-400/60'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-teal-500/15 text-teal-300`}>
                  {plan.name}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-white font-bold text-4xl">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/ month</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/signup"
                  className={`block w-full py-2.5 rounded-lg text-sm text-center transition duration-200 ${
                    plan.isPopular
                      ? 'bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold'
                      : 'border border-teal-500/60 text-teal-400 bg-transparent hover:bg-teal-500/10'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default TestimonialsPricing;