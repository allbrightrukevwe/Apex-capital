"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, Bot, Wallet, Settings, LogOut,
  Menu, X, ShieldCheck, Activity, TrendingDown, TrendingUp,
  MessageSquare, Mail, ArrowDownUp, History,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // ✅ Send token from localStorage in Authorization header
        const token = localStorage.getItem('token');
        
        const res = await fetch("/api/admin/verify", {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Cache-Control': 'no-cache',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Admin verify status:', res.status);
        
        if (res.status === 401) { 
          router.push("/login"); 
          return; 
        }
        if (res.status === 403) { 
          router.push("/dashboard"); 
          return; 
        }
        if (res.ok) {
          const data = await res.json();
          console.log('🔍 Admin verify data:', data);
          if (data.isAdmin) { 
            setIsAdmin(true); 
            setLoading(false); 
            return; 
          }
        }
        router.push("/dashboard");
      } catch (error) {
        console.error('Admin verify error:', error);
        router.push("/login");
      }
    };
    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    localStorage.clear(); // ✅ Clear all localStorage
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    }); // ✅ Clear all cookies
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/bots", label: "Bots", icon: Bot },
    { href: "/admin/trades", label: "Trades", icon: ArrowDownUp },
    { href: "/admin/deposits", label: "Deposits", icon: TrendingDown },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: TrendingUp },
    { href: "/admin/transactions", label: "Transactions", icon: History },
    { href: "/admin/wallets", label: "Wallets", icon: Wallet },
    { href: "/admin/chat", label: "Messages", icon: MessageSquare },
    { href: "/admin/email", label: "Email Users", icon: Mail },
    { href: "/admin/activities", label: "Activities", icon: Activity },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-teal-400" />
          <span className="font-bold text-lg text-white">Admin Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-800 text-white">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-900 border-r border-slate-800 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className={`flex items-center gap-2 ${!sidebarOpen && "justify-center w-full"}`}>
            <ShieldCheck className="h-8 w-8 text-teal-400 flex-shrink-0" />
            {sidebarOpen && <span className="font-bold text-lg text-white">Admin Panel</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-slate-800 text-white">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const isActive = typeof window !== 'undefined' && (
              window.location.pathname === item.href || 
              (item.href !== "/admin" && window.location.pathname.startsWith(item.href))
            );
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <aside className="lg:hidden fixed top-16 left-0 z-40 w-full bg-slate-900 border-b border-slate-800 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} pt-16 lg:pt-0`}>
        <div className="min-h-screen bg-slate-900 p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}