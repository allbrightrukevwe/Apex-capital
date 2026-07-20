"use client";

import { useEffect, useState } from "react";
import { 
  Search, Send, Mail, Users, CheckCircle, 
  RefreshCw, User, X
} from "lucide-react";

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminEmailPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "users">("compose");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSendEmail = async () => {
    if (!subject || !message || selectedUsers.length === 0) {
      setSendResult({ success: false, message: "Please fill all fields and select at least one user" });
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUsers,
          subject,
          message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSendResult({ success: true, message: `Email sent to ${selectedUsers.length} user(s)` });
        setSubject("");
        setMessage("");
        setSelectedUsers([]);
        setSelectAll(false);
      } else {
        setSendResult({ success: false, message: data.error || "Failed to send email" });
      }
    } catch (error) {
      setSendResult({ success: false, message: "Network error" });
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Email Users</h1>
        <p className="text-slate-400 mt-1">Send emails to platform users</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("compose")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "compose"
              ? 'bg-teal-500 text-slate-950'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Mail className="h-4 w-4 inline mr-2" />
          Compose Email
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "users"
              ? 'bg-teal-500 text-slate-950'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Select Users ({selectedUsers.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        {activeTab === "compose" && (
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Compose Email</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">To</label>
                  <div className="bg-slate-800 rounded-lg p-3 text-white text-sm">
                    {selectedUsers.length === 0 ? (
                      <span className="text-slate-500">No users selected</span>
                    ) : (
                      <span>{selectedUsers.length} user(s) selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={8}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                {sendResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    sendResult.success
                      ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {sendResult.success ? <CheckCircle className="h-4 w-4 inline mr-1" /> : <X className="h-4 w-4 inline mr-1" />}
                    {sendResult.message}
                  </div>
                )}

                <button
                  onClick={handleSendEmail}
                  disabled={sending || selectedUsers.length === 0 || !subject || !message}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email to {selectedUsers.length} User(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Selection */}
        {(activeTab === "users" || activeTab === "compose") && (
          <div className={`${activeTab === "compose" ? "lg:col-span-1" : "lg:col-span-3"}`}>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Users</h2>
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-teal-400 hover:text-teal-300"
                >
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500 placeholder-slate-500"
                />
              </div>

              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${
                      selectedUsers.includes(user.id)
                        ? 'bg-teal-500/10 border border-teal-500/30'
                        : 'hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </label>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-slate-500 py-4">No users found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}