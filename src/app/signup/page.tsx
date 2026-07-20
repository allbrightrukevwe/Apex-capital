'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SignupFormData {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
  currency: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  country?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '', email: '', country: '', phone: '', password: '', confirmPassword: '', currency: 'USD'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verification step
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const currencies = [
    { code: 'USD', label: '$ USD', flag: '🇺🇸' },
    { code: 'GBP', label: '£ GBP', flag: '🇬🇧' },
    { code: 'EUR', label: '€ EUR', flag: '🇪🇺' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName, email: formData.email, country: formData.country,
          phone: formData.phone, password: formData.password, currency: formData.currency,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      setVerifyEmail(formData.email);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setVerifyError('Please enter the verification code'); return; }
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setVerified(true);
      setTimeout(() => router.push('/login?verified=true'), 1500);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleCurrencySelect = (currency: string) => {
    setFormData(prev => ({ ...prev, currency }));
  };

  // ====== VERIFY STEP ======
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md relative">
          <div className="flex items-center mb-8">
            <button onClick={() => setStep('register')} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Back
            </button>
            <div className="flex-1 text-center">
              <Link href="/" className="inline-block text-xl font-black tracking-widest">
                <span className="text-white">APEX</span><span className="text-teal-400"> CAPITA</span>
              </Link>
            </div>
            <div className="w-12"></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
            {verified ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-teal-400 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-white font-bold text-lg mb-1">Email Verified!</p>
                <p className="text-slate-400 text-sm">Redirecting to login...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mb-3">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <h1 className="text-white font-bold text-xl mb-1">Check your email</h1>
                  <p className="text-slate-500 text-sm text-center">We sent a 6-digit code to</p>
                  <p className="text-teal-400 font-semibold text-sm">{verifyEmail}</p>
                </div>
                {verifyError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">❌ {verifyError}</div>
                )}
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setVerifyError(''); }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-bold text-white text-center tracking-[0.5em] placeholder-slate-700 focus:outline-none focus:border-teal-500 transition"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={verifyLoading || code.length !== 6}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition"
                  >
                    {verifyLoading ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="30 20" /></svg>Verifying...</>
                    ) : 'Confirm Email'}
                  </button>
                </form>
                <p className="text-center text-slate-600 text-xs mt-4">Didn't receive it? Check your spam folder.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex items-center mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </Link>
          <div className="flex-1 text-center">
            <Link href="/" className="inline-block text-xl font-black tracking-widest">
              <span className="text-white">APEX</span>
              <span className="text-teal-400"> CAPITA</span>
            </Link>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
          <h1 className="text-white font-bold text-xl mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">Start trading with AI in minutes</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Country
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., United States"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.country ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.country && (
                <p className="text-red-400 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Currency Selection */}
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                Choose Currency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleCurrencySelect(currency.code)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-bold transition ${
                      formData.currency === currency.code
                        ? 'border-teal-500 bg-teal-500/10 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span>{currency.flag}</span>
                    <span>{currency.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-slate-600 text-xs">
              By signing up you agree to our{' '}
              <span className="text-teal-400">Terms of Service</span>
            </p>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-400 font-semibold hover:text-teal-300 transition">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2025 Apex Capita · Trading involves risk
        </p>
      </div>
    </div>
  );
};

export default SignupPage;