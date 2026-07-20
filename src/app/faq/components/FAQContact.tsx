'use client';

import Link from 'next/link';

const FAQContact = () => {
  return (
    <section className="py-12 px-4 border-t border-teal-500/20">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/50 border border-teal-500/15 rounded-2xl p-7">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">
            Still have questions?
          </h3>
          <p className="text-gray-400 text-sm">
            Our team responds within 24 hours, seven days a week.
          </p>
        </div>
        
        <Link 
          href="/contact" 
          className="flex-shrink-0 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all duration-200 text-sm uppercase tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default FAQContact;