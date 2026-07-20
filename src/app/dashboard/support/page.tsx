'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

interface Message {
  id: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  senderType: string;
  senderName: string | null;
  isRead: boolean;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/chat/get-messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;
    if (!token) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('message', text);
      if (selectedImage) formData.append('image', selectedImage);

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setText('');
        setSelectedImage(null);
        setImagePreview(null);
        await fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const fmt = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-white font-bold text-xl tracking-wide uppercase">Support Chat</h1>
            <p className="text-slate-400 text-sm mt-0.5">Our team typically replies within minutes</p>
          </div>
          <a
            href="mailto:support@apexcapita.io"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-teal-400 hover:border-teal-500/40 transition text-xs font-medium flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Support
          </a>
        </div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-sm">Start a conversation</p>
                <p className="text-slate-500 text-xs mt-1">Send a message and our support team will respond shortly.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.senderType !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <span className="text-[10px] font-bold text-teal-400">S</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.senderType === 'user'
                      ? 'bg-teal-500 text-slate-950 rounded-br-md'
                      : 'bg-slate-800 text-white rounded-bl-md'
                  }`}>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="attachment" className="max-w-full rounded-lg mb-2" />
                    )}
                    {msg.message && <p className="text-sm break-words">{msg.message}</p>}
                    <div className={`flex items-center gap-1 mt-1 ${msg.senderType === 'user' ? 'justify-end' : ''}`}>
                      <span className={`text-[10px] ${msg.senderType === 'user' ? 'text-slate-800 opacity-70' : 'text-slate-500'}`}>
                        {fmt(msg.createdAt)}
                      </span>
                      {msg.senderType === 'user' && (
                        <span className="text-[10px] text-slate-800 opacity-70">{msg.isRead ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-4 py-2 border-t border-slate-800 bg-slate-800/50 flex items-center gap-3">
              <img src={imagePreview} alt="preview" className="h-10 w-10 object-cover rounded-lg" />
              <span className="text-xs text-slate-400 flex-1">Image selected</span>
              <button
                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                className="text-red-400 text-xs hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-end gap-2 p-3 border-t border-slate-800 bg-slate-800/30">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
              }}
              placeholder="Type a message..."
              rows={1}
              disabled={sending}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none max-h-24 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || (!text.trim() && !selectedImage)}
              className="p-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 rounded-full transition flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
