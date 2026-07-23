'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Image, Smile, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  senderType: string;
  senderName: string | null;
  isRead: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMessagesLength = useRef(0);

  const emojis = ['😀', '😂', '😍', '🎉', '👍', '🔥', '💯', '❤️', '😢', '😡', '🤔', '😴'];

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      setIsLoggedIn(!!storedToken);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    if (isOpen && isLoggedIn && token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isLoggedIn, token]);

  // ✅ Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      // New message arrived - scroll to bottom
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  // ✅ Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/chat/get-messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setToken(null);
      }
    } catch (error) {
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !selectedImage) return;
    if (!token) {
      alert('Please login to send messages');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setMessage('');
        setSelectedImage(null);
        setImagePreview(null);
        setShowEmojiPicker(false);
        await fetchMessages();
        // ✅ Scroll to bottom after sending
        setTimeout(() => scrollToBottom(), 200);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setToken(null);
        alert('Session expired. Please login again.');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(message + emoji);
  };

  const getReadStatus = (isRead: boolean) => {
    return isRead ? '✓✓' : '✓';
  };

  const formatMessageTime = (date: string) => {
    const msgDate = new Date(date);
    const today = new Date();
    const isToday = msgDate.toDateString() === today.toDateString();
    
    if (isToday) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ✅ Group messages by date
  const groupedMessages = messages.reduce((groups: { date: string; messages: Message[] }[], msg) => {
    const msgDate = new Date(msg.createdAt).toLocaleDateString();
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.date === msgDate) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date: msgDate, messages: [msg] });
    }
    return groups;
  }, []);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full p-4 shadow-lg flex items-center gap-2 transition-all z-40 hover:scale-110"
        title={isLoggedIn ? 'Open Chat Support' : 'Please login first'}
      >
        <MessageCircle size={24} />
        <span className="hidden sm:inline text-sm font-semibold">Support</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-slate-900 rounded-xl shadow-2xl z-50 flex flex-col border border-slate-700">
          {/* Header */}
          <div className="bg-teal-500 text-slate-950 p-4 rounded-t-xl flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-semibold">Support Chat</h3>
              <p className="text-xs text-slate-800 opacity-80">We typically reply within minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-teal-600 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Login Required Message */}
          {!isLoggedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <MessageCircle size={48} className="text-slate-600 mb-4" />
              <p className="text-white font-semibold mb-2">Please Login</p>
              <p className="text-sm text-slate-400 mb-4">
                You need to login to send messages to support.
              </p>
              <a
                href="/login"
                className="px-4 py-2 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 transition text-sm font-semibold"
              >
                Go to Login
              </a>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-slate-900 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <MessageCircle size={32} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-sm">Start a conversation!</p>
                    <p className="text-xs text-slate-600 mt-1">Our support team is here to help.</p>
                  </div>
                ) : (
                  groupedMessages.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {/* Date Divider */}
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-slate-800 text-slate-400 text-[10px] font-medium px-3 py-1 rounded-full">
                          {new Date(group.date).toLocaleDateString([], { 
                            weekday: 'short', month: 'short', day: 'numeric' 
                          })}
                        </div>
                      </div>

                      {/* Messages for this date */}
                      {group.messages.map((msg) => (
                        <div key={msg.id} className={`mb-3 ${msg.senderType === 'user' ? '' : ''}`}>
                          {msg.senderType === 'user' ? (
                            <>
                              <div className="flex justify-end">
                                <div className="bg-teal-500 text-slate-950 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] shadow-sm">
                                  {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="Message" className="max-w-full rounded-lg mb-2" />
                                  )}
                                  {msg.message && <p className="text-sm break-words">{msg.message}</p>}
                                  <div className="flex justify-end items-center gap-1.5 mt-1">
                                    <p className="text-[10px] text-slate-800 opacity-70">
                                      {formatMessageTime(msg.createdAt)}
                                    </p>
                                    <span className="text-[10px] text-slate-800 opacity-70">{getReadStatus(msg.isRead)}</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-end gap-2">
                                <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mb-1">
                                  <span className="text-[10px] font-bold text-teal-400">S</span>
                                </div>
                                <div className="bg-slate-800 text-white rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%] shadow-sm">
                                  {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="Message" className="max-w-full rounded-lg mb-2" />
                                  )}
                                  {msg.message && <p className="text-sm break-words">{msg.message}</p>}
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <p className="text-[10px] text-slate-400">
                                      {formatMessageTime(msg.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 rounded-full p-1.5 shadow-lg hover:bg-teal-400 transition"
                >
                  <ChevronDown size={16} />
                </button>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="p-3 border-t border-slate-700 bg-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                    <p className="text-xs text-slate-400">Image selected</p>
                  </div>
                  <button
                    onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="p-3 border-t border-slate-700 bg-slate-800 grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { addEmoji(emoji); setShowEmojiPicker(false); }}
                      className="text-xl hover:bg-slate-700 rounded p-2 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700 flex items-end gap-2 shrink-0 bg-slate-800 rounded-b-xl">
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition flex-shrink-0" title="Send image">
                  <Image size={18} />
                </button>
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition flex-shrink-0" title="Send emoji">
                  <Smile size={18} />
                </button>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 disabled:opacity-50 resize-none max-h-24"
                />
                <button
                  type="submit"
                  disabled={isLoading || (!message.trim() && !selectedImage)}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-full transition flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}