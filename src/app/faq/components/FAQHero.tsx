'use client';

const FAQHero = () => {
  return (
    <section className="py-20 px-4 text-center border-b border-teal-500/15">
      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Support Center
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
          FREQUENTLY ASKED <span className="text-teal-400">QUESTIONS</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
          Everything you need to know about Apex AI, your funded account rules, and how payouts work.
        </p>
      </div>
    </section>
  );
};

export default FAQHero;