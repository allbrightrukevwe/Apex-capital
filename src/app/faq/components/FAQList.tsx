'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer?: string;
}

interface FAQCategory {
  icon: React.ReactNode;
  title: string;
  items: FAQItem[];
}

const FAQList = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const faqCategories: FAQCategory[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      title: 'General & Account',
      items: [
        { 
          question: 'What is Apex Capita?',
          answer: 'Apex Capita is an AI-powered trading platform that provides institutional-grade algorithmic trading strategies to retail investors. Our system executes trades with sub-50ms latency across 200+ markets.'
        },
        { 
          question: 'Is there a time limit to complete the evaluation?',
          answer: 'Yes, you have 30 days to complete the evaluation phase. However, you can request an extension if needed.'
        },
        { 
          question: 'What trading platforms does Apex AI support?',
          answer: 'Apex AI supports all major trading platforms including MetaTrader 4, MetaTrader 5, cTrader, and proprietary platforms through API integration.'
        },
        { 
          question: 'Are third-party bots or EAs allowed on my account?',
          answer: 'No, third-party bots and EAs are not allowed. Only Apex AI\'s proprietary algorithms are permitted to ensure fairness and security.'
        },
        { 
          question: 'Can I hold multiple trading accounts at the same time?',
          answer: 'Yes, depending on your subscription tier. Bronze allows 1 instance, Silver allows 3, and Gold offers unlimited instances.'
        }
      ]
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Rules & Drawdowns',
      items: [
        { 
          question: 'How is the Daily Drawdown calculated?',
          answer: 'Daily Drawdown is calculated based on the highest equity peak of the day, measured at 5 PM EST. A loss of more than 5% from the daily peak will trigger a breach.'
        },
        { 
          question: 'What is the Maximum Drawdown limit?',
          answer: 'The Maximum Drawdown limit is set at 10% from the starting balance. Once you reach this threshold, the account is paused for review.'
        },
        { 
          question: 'Can the bot hold trades overnight or over the weekend?',
          answer: 'Yes, Apex AI can hold positions overnight and over weekends, depending on the strategy being used. However, risk management protocols are applied.'
        },
        { 
          question: 'Are there restrictions on trading during high-impact news events?',
          answer: 'Yes, certain strategies are paused during high-impact news events to protect against extreme volatility. This is automatically managed by the AI.'
        },
        { 
          question: 'What happens if I breach a drawdown rule?',
          answer: 'If a drawdown rule is breached, the account is temporarily paused. You can reset the account or appeal the breach with our support team.'
        }
      ]
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Payouts',
      items: [
        { 
          question: 'When can I request my first payout?',
          answer: 'You can request your first payout after 14 days of active trading with a minimum profit of $500. Subsequent payouts can be requested every 7 days.'
        },
        { 
          question: 'What is the profit split?',
          answer: 'The profit split is 80/20 in your favor. You keep 80% of the profits, and Apex Capita takes 20%. Higher tiers may offer better splits.'
        },
        { 
          question: 'How are payouts processed and how long do they take?',
          answer: 'Payouts are processed within 24-48 hours via bank transfer, cryptocurrency, or PayPal. The processing time depends on the withdrawal method.'
        },
        { 
          question: 'Is the evaluation or activation fee refunded upon passing?',
          answer: 'Yes, the activation fee is refunded upon successfully passing the evaluation phase and completing the first payout cycle.'
        },
        { 
          question: 'Is there a maximum payout limit per cycle?',
          answer: 'Yes, the maximum payout per cycle is 10% of your account balance. For Gold tier members, this limit is increased to 15%.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isOpen = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    return openItems[key] || false;
  };

  return (
    <section className="py-16 px-4 lg:px-12 flex-1">
      <div className="max-w-3xl mx-auto space-y-14">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-teal-500/15 rounded-lg flex items-center justify-center text-teal-400 flex-shrink-0">
                {category.icon}
              </div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {category.title}
              </h2>
              <div className="flex-1 h-px bg-teal-500/15 ml-2"></div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => {
                const isItemOpen = isOpen(categoryIndex, itemIndex);
                return (
                  <div 
                    key={itemIndex}
                    className={`rounded-xl border transition-all duration-300 ${
                      isItemOpen 
                        ? 'border-teal-500/30 bg-slate-900/60' 
                        : 'border-teal-500/15 bg-slate-900/40 hover:border-teal-500/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(categoryIndex, itemIndex)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                    >
                      <span className={`text-sm font-semibold leading-snug transition-colors ${
                        isItemOpen ? 'text-teal-400' : 'text-gray-200'
                      }`}>
                        {item.question}
                      </span>
                      <span className={`flex-shrink-0 transition-transform duration-300 text-amber-500/60 ${
                        isItemOpen ? 'rotate-180' : ''
                      }`}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    
                    {/* Answer */}
                    {isItemOpen && item.answer && (
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-gray-400 text-sm leading-relaxed border-t border-teal-500/10 pt-3">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQList;