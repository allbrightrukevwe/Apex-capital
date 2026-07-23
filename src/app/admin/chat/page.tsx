"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Search, RefreshCw, Send, User, Clock, Check, CheckCheck,
  MessageSquare, Trash2, Mail
} from "lucide-react";

interface ChatMessage {
  id: string;
  userId: number;
  message: string;
  isRead: boolean;
  senderType: string;
  senderName: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [sending, setSending] = useState<Record<number, boolean>>({});
  const [filterType, setFilterType] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/chat");
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const handleSendReply = async (userId: number) => {
    const text = replyText[userId]?.trim();
    if (!text) return;

    setSending(prev => ({ ...prev, [userId]: true }));
    try {
      await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: text, senderType: "admin" }),
      });
      setReplyText(prev => ({ ...prev, [userId]: "" }));
      fetchMessages();
    } catch (error) {
    } finally {
      setSending(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await fetch("/api/admin/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, isRead: true }),
      });
      fetchMessages();
    } catch (error) {
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/admin/chat?id=${messageId}`, { method: "DELETE" });
      fetchMessages();
    } catch (error) {
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // Group messages by user
  const groupedMessages = messages.reduce((acc: Record<number, ChatMessage[]>, msg) => {
    if (!acc[msg.userId]) acc[msg.userId] = [];
    acc[msg.userId].push(msg);
    return acc;
  }, {});

  const filteredUsers = Object.entries(groupedMessages).filter(([userId, msgs]) => {
    const user = msgs[0]?.user;
    if (!user) return false;
    const matchesSearch = !search || 
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      msgs.some(m => m.message?.toLowerCase().includes(search.toLowerCase()));
    
    if (filterType === "unread") return msgs.some(m => !m.isRead && m.senderType === "user");
    if (filterType === "read") return msgs.every(m => m.isRead);
    return matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.isRead && m.senderType === "user").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-1">Manage user messages and support chat</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Total Messages</span>
          </div>
          <p className="text-2xl font-bold text-white">{messages.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-amber-400" />
            <span className="text-slate-400 text-sm">Unread</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{unreadCount}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-teal-400" />
            <span className="text-slate-400 text-sm">Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{Object.keys(groupedMessages).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterType === f
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No messages found</p>
          </div>
        ) : (
          filteredUsers.map(([userId, msgs]) => {
            const user = msgs[0]?.user;
            const hasUnread = msgs.some(m => !m.isRead && m.senderType === "user");
            
            return (
              <div key={userId} className={`bg-slate-900 rounded-xl border overflow-hidden ${
                hasUnread ? 'border-teal-500/30' : 'border-slate-800'
              }`}>
                {/* User Header */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    {hasUnread && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                        UNREAD
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {msgs.length} message{msgs.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {msgs.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-xl p-3 ${
                        msg.senderType === 'admin'
                          ? 'bg-teal-500/20 text-teal-100'
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-400">
                            {msg.senderType === 'admin' ? 'Admin' : user?.firstName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {formatDate(msg.createdAt)}
                          </span>
                          {msg.senderType === 'user' && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="text-slate-500 hover:text-teal-400"
                            >
                              {msg.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Box */}
                <div className="flex items-center gap-2 p-4 bg-slate-800/30 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyText[parseInt(userId)] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [userId]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(parseInt(userId))}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => handleSendReply(parseInt(userId))}
                    disabled={sending[parseInt(userId)] || !replyText[parseInt(userId)]?.trim()}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-slate-950 font-medium text-sm flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending[parseInt(userId)] ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}