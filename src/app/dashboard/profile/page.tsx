  'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/lib/contexts/UserContext';

// Sidebar Component
const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      href: '/dashboard/deposit',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v13M5 14l7 7 7-7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Deposit'
    },
    {
      href: '/dashboard/withdraw',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21V8M5 10l7-7 7 7" />
          <path d="M3 21h18" />
        </svg>
      ),
      label: 'Withdraw'
    },
    {
      href: '/dashboard/bot-console',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      ),
      label: 'Bot Console'
    },
    {
      href: '/dashboard/live-trading',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Live Trading'
    },
    {
      href: '/dashboard/market',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      label: 'Market Data'
    },
    {
      href: '/dashboard/platform',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      label: 'Live Platform'
    },
    {
      href: '/dashboard/history',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: 'History'
    },
    {
      href: '/dashboard/profile',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: 'Profile'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 z-40 bg-slate-900 border-r border-teal-500/10">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-5 py-4 border-b border-teal-500/10 flex-shrink-0">
          <Link href="/" className="text-base font-bold tracking-wider">
            <span className="text-white">APE</span>
            <span className="text-teal-400 text-2xl">X</span>
            <span className="text-white"> CAPITA</span>
          </Link>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2.5 py-3 border-t border-teal-500/10 flex-shrink-0 space-y-0.5">
          <a
            href="mailto:support@apexcapita.io"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-teal-500/8 transition w-full"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Support
          </a>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition w-full">
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

// Profile Header Component
const ProfileHeader = () => {
  const { user } = useUserContext();
  return (
    <header className="sticky top-0 z-30 bg-slate-950 border-b border-teal-500/10 px-4 lg:px-6 h-13 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors">Dashboard</Link>
          <span className="text-slate-600">→</span>
          <span className="text-white font-semibold">Profile</span>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden lg:block text-slate-500 text-xs truncate max-w-[180px]">{user?.email || ''}</span>
      </div>
    </header>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const { user, loading, refresh } = useUserContext();
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setCountry((user as any).country || '');
      setPhone((user as any).phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName, country, phone }),
      });
      if (!res.ok) throw new Error('Failed to save');
      await refresh();
      setSaveMsg('Profile updated successfully!');
    } catch {
      setSaveMsg('Failed to save changes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert('Passwords do not match!'); return; }
    if (newPassword.length < 8) { alert('Password must be at least 8 characters!'); return; }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setNewPassword(''); setConfirmPassword('');
    alert('Password updated!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      alert('Account deletion request submitted.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="lg:ml-60">
        <ProfileHeader />

        <main className="px-3 py-4 lg:px-6 lg:py-6 max-w-xl">
          {/* Profile Settings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-base">Profile Settings</h1>
                <p className="text-slate-500 text-xs">Manage your personal information</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Email - Read Only */}
              <div>
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                  Email Address <span className="text-slate-600 normal-case font-normal">(Read-Only)</span>
                </label>
                <div className="relative">
                  <input
                    readOnly
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                    type="email"
                    value={loading ? '' : (user?.email || '')}
                  />
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                  Full Name
                </label>
                <input
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Country & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 appearance-none pr-8 transition"
                    >
                      <option value="" disabled>Select country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="India">India</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Somalia">Somalia</option>
                      <option value="Sudan">Sudan</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Libya">Libya</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Angola">Angola</option>
                    </select>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    placeholder="+1 000 000 0000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Save Message */}
              {saveMsg && (
                <p className={`text-xs font-semibold ${saveMsg.includes('success') ? 'text-teal-400' : 'text-red-400'}`}>{saveMsg}</p>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:p-6 mt-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Security</h2>
                <p className="text-slate-500 text-xs">Change your account password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                    New Password
                  </label>
                  <input
                    placeholder="Min. 8 characters"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    placeholder="Repeat password"
                    required
                    className="w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition border-slate-700 focus:border-teal-500"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-bold text-sm transition"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeDasharray="30 20" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-red-400 font-bold text-sm">Danger Zone</h3>
            </div>
            <p className="text-slate-500 text-xs mb-3">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-1.5 text-red-400 border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg text-xs font-bold transition"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Delete Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;