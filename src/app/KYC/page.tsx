'use client';

import Link from 'next/link';
import KycForm from './components/KycForm';
import MobileHeader from '../dashboard/components/MobileHeader';
import Sidebar from '../dashboard/components/Sidebar';

export default function KYCPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="lg:ml-60">
        <MobileHeader />
        <header className="hidden lg:flex sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-6 h-13 items-center">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">Dashboard</Link>
            <span className="text-slate-600">→</span>
            <span className="text-white font-semibold">KYC Verification</span>
          </nav>
        </header>

        <main className="px-4 py-5 lg:px-6 lg:py-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Identity Verification</h1>
              <p className="text-slate-500 text-xs mt-0.5">Complete your KYC to unlock full account features</p>
            </div>
          </div>

          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-amber-300 text-sm">
              Please fill out the form carefully. To comply with regulations, each participant must complete identity verification (KYC/AML) to prevent fraud. <span className="font-semibold">Information cannot be edited after submission.</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{ step: '01', label: 'Personal Info' }, { step: '02', label: 'Address' }, { step: '03', label: 'Documents' }].map((s) => (
              <div key={s.step} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <p className="text-teal-400 font-bold text-xs">{s.step}</p>
                <p className="text-slate-300 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold text-sm">KYC Application Form</h2>
              <p className="text-slate-500 text-xs mt-0.5">All fields marked with * are required</p>
            </div>
            <div className="p-5">
              <KycForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
