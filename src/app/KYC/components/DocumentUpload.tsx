'use client';

import type { DocumentType } from '../../../types/kyc';

interface DocumentUploadProps {
  documentType: DocumentType;
  onChange: (type: DocumentType) => void;
}

const DOCS: { value: DocumentType; label: string; icon: React.ReactNode }[] = [
  {
    value: "Int'l Passport",
    label: "Int'l Passport",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="4" width="12" height="16" rx="2" />
        <circle cx="14" cy="10" r="2" />
        <path d="M19 15H15" /><path d="M19 18H15" />
      </svg>
    ),
  },
  {
    value: 'National ID',
    label: 'National ID',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="4" />
        <circle cx="9" cy="10" r="2" />
        <path d="M13 8H17" /><path d="M13 12H17" />
        <path d="M5 16c0 0 1.5-2 4-2s4 2 4 2" />
      </svg>
    ),
  },
  {
    value: 'Drivers License',
    label: "Driver's License",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="18" rx="3" />
        <path d="M16 14.5C16 12.015 13.985 10 11.5 10S7 12.015 7 14.5" />
        <path d="M7 7.5H17" />
      </svg>
    ),
  },
];

export default function DocumentUpload({ documentType, onChange }: DocumentUploadProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {DOCS.map(opt => {
          const active = documentType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                active
                  ? 'bg-teal-500/10 border-teal-500/40 text-teal-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {opt.icon}
              <span className="text-xs font-medium text-center leading-tight">{opt.label}</span>
              {active && (
                <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-slate-300 text-xs font-semibold mb-3">Document requirements:</p>
        <ul className="space-y-2">
          {[
            'Document must not be expired',
            'Must be clearly visible with no blur or glare',
            'All four corners must be visible',
          ].map(item => (
            <li key={item} className="flex items-center gap-2 text-slate-400 text-xs">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
