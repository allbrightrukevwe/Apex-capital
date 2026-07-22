'use client';

import { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: ''
      });
      setIsSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 lg:px-12 flex-1">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Contact Form */}
        <div className="bg-slate-900/70 border border-teal-500/20 rounded-2xl p-7 lg:p-9">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-white mb-1">Send Us a Message</h2>
            <p className="text-gray-500 text-sm">Fill in the form and we will get back to you shortly.</p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400 text-sm">
              ✅ Thank you for your message! We'll get back to you within 24 hours.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-slate-950/60 border border-teal-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/60 focus:bg-slate-950/80 transition duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-slate-950/60 border border-teal-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/60 focus:bg-slate-950/80 transition duration-200"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Phone Number <span className="text-gray-600 normal-case font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="w-full bg-slate-950/60 border border-teal-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/60 focus:bg-slate-950/80 transition duration-200"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Message <span className="text-amber-400">*</span>
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us how we can help you..."
                className="w-full bg-slate-950/60 border border-teal-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/60 focus:bg-slate-950/80 transition duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold px-7 py-3.5 rounded-xl transition duration-200 text-sm uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-900/70 border border-teal-500/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
            Other Ways to Reach Us
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                <a href="mailto:supportapexcapitals@gmail.com" className="text-teal-400 hover:text-teal-300 text-sm font-semibold transition">
                  supportapexcapitals@gmail.com
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Response Time</p>
                <p className="text-white text-sm font-semibold">Within 24 hours</p>
                <p className="text-gray-500 text-xs">7 days a week</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Headquarters</p>
                <p className="text-white text-sm font-semibold">Global Operations</p>
                <p className="text-gray-500 text-xs">150+ countries served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;