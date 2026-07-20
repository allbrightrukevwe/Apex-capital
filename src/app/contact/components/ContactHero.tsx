'use client';

const ContactHero = () => {
  return (
    <section className="py-20 px-4 text-center border-b border-teal-500/15">
      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 text-amber-400/70 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Get In Touch
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
          CONTACT <span className="text-teal-400">US</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-xl mx-auto mb-8">
          Have a question or need support? Our team is available seven days a week. We respond within 24 hours.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-teal-400">24/7</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider">Support</div>
          </div>
          <div className="w-px bg-teal-500/20"></div>
          <div>
            <div className="text-2xl font-bold text-teal-400">&lt;24hr</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider">Response Time</div>
          </div>
          <div className="w-px bg-teal-500/20"></div>
          <div>
            <div className="text-2xl font-bold text-teal-400">150+</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;