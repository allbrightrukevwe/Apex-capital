'use client';

import { useState } from 'react';
import type { DocumentType, KycFormData } from '../../../types/kyc';
import DocumentUpload from './DocumentUpload';
import FileUpload from './FileUpload';

export default function KycForm() {
  const [formData, setFormData] = useState<KycFormData>({
    first_name: '', last_name: '', email: '', phone_number: '',
    dob: '', social_media: '', address: '', city: '', state: '',
    country: '', document_type: "Int'l Passport", frontimg: null,
    backimg: null, agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof KycFormData>(key: K, value: KycFormData[K]) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) { setError('Please confirm all information is correct.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v instanceof File) body.append(k, v);
        else if (typeof v === 'boolean') body.append(k, v ? '1' : '0');
        else if (v !== null && v !== undefined) body.append(k, String(v));
      });
      await new Promise(r => setTimeout(r, 1200));
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Application Submitted</h3>
        <p className="text-slate-400 text-sm max-w-sm">Your KYC application has been submitted successfully. We'll review it and notify you within 24–48 hours.</p>
      </div>
    );
  }

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition";
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Personal Details */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-sm">Personal Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'First Name', key: 'first_name' },
            { label: 'Last Name', key: 'last_name' },
            { label: 'Email Address', key: 'email', type: 'email' },
            { label: 'Phone Number', key: 'phone_number' },
            { label: 'Date of Birth', key: 'dob', type: 'date' },
            { label: 'Twitter / Facebook Username', key: 'social_media' },
          ].map(({ label, key, type = 'text' }) => (
            <div key={key}>
              <label className={labelClass}>{label} <span className="text-red-400">*</span></label>
              <input
                type={type}
                value={formData[key as keyof KycFormData] as string}
                onChange={e => set(key as keyof KycFormData, e.target.value as any)}
                required
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Address */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-sm">Residential Address</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Street Address', key: 'address' },
            { label: 'City', key: 'city' },
            { label: 'State / Province', key: 'state' },
            { label: 'Country / Nationality', key: 'country' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className={labelClass}>{label} <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={formData[key as keyof KycFormData] as string}
                onChange={e => set(key as keyof KycFormData, e.target.value as any)}
                required
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Document Upload */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-sm">Identity Document</h3>
        </div>
        <DocumentUpload
          documentType={formData.document_type}
          onChange={(type: DocumentType) => set('document_type', type)}
        />
      </section>

      {/* File Uploads */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Front Side <span className="text-red-400">*</span></label>
          <FileUpload id="frontimg" name="frontimg" label="Upload Front Side" required onFileSelect={f => set('frontimg', f)} />
        </div>
        <div>
          <label className={labelClass}>Back Side <span className="text-red-400">*</span></label>
          <FileUpload id="backimg" name="backimg" label="Upload Back Side" required onFileSelect={f => set('backimg', f)} />
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Agreement + Submit */}
      <div className="pt-2 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={formData.agree}
              onChange={e => set('agree', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${formData.agree ? 'bg-teal-500 border-teal-500' : 'border-slate-600 bg-slate-800'}`}>
              {formData.agree && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-slate-400 text-sm">I confirm that all the information I have entered is accurate and correct.</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Submit KYC Application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
