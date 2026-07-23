'use client';

import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
  { code: 'tr', label: 'Turkish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'th', label: 'Thai' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ms', label: 'Malay' },
  { code: 'tl', label: 'Filipino' },
];

export default function Translator() {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const translatePage = async (langCode: string) => {
    if (langCode === 'en') {
      window.location.reload();
      return;
    }
    setLoading(true);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'iframe'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    const chunkSize = 10;
    for (let i = 0; i < nodes.length; i += chunkSize) {
      const chunk = nodes.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (node) => {
          const original = node.textContent?.trim();
          if (!original) return;
          try {
            const res = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(original)}&langpair=en|${langCode}`
            );
            const data = await res.json();
            if (data.responseStatus === 200 && data.responseData?.translatedText) {
              node.textContent = data.responseData.translatedText;
            }
          } catch {
            // silently skip
          }
        })
      );
    }
    setLoading(false);
  };

  const handleSelect = (lang: (typeof LANGUAGES)[0]) => {
    setSelectedLang(lang);
    setOpen(false);
    translatePage(lang.code);
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium px-2 py-1.5 rounded-lg border border-slate-700 hover:border-teal-500/40 text-slate-400 hover:text-teal-400 transition-colors"
        title="Translate page"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
          </svg>
        )}
        <span className="hidden sm:inline text-xs">{selectedLang.label}</span>
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-[9999] max-h-64 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                selectedLang.code === lang.code
                  ? 'bg-teal-500/15 text-teal-400 font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
