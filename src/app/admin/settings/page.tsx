"use client";

import { useEffect, useState } from "react";
import { 
  Save, RefreshCw, Settings, Globe, Shield, 
  Mail, Bell, Database, Lock, Key, Server,
  CheckCircle, AlertCircle
} from "lucide-react";

interface AppSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  minDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  tradingFee: number;
  referralBonus: number;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  jwtSecret: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: "Apex Capita",
    siteUrl: "https://apexcapita.io",
    supportEmail: "support@apexcapita.io",
    minDeposit: 10,
    minWithdrawal: 50,
    maxWithdrawal: 10000,
    tradingFee: 1,
    referralBonus: 5,
    maintenanceMode: false,
    registrationOpen: true,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    jwtSecret: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaveMessage({ type: "success", text: "Settings saved successfully" });
      } else {
        setSaveMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "trading", label: "Trading", icon: Settings },
    { id: "email", label: "Email", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
  ];

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
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-slate-950 font-bold text-sm"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          saveMessage.type === "success"
            ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {saveMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {saveMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Forms */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-400" />
              General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Site URL</label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-white">Maintenance Mode</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationOpen}
                  onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-white">Registration Open</span>
              </label>
            </div>
          </div>
        )}

        {/* Trading Settings */}
        {activeTab === "trading" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-teal-400" />
              Trading Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Minimum Deposit ($)</label>
                <input
                  type="number"
                  value={settings.minDeposit}
                  onChange={(e) => setSettings({ ...settings, minDeposit: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Minimum Withdrawal ($)</label>
                <input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Maximum Withdrawal ($)</label>
                <input
                  type="number"
                  value={settings.maxWithdrawal}
                  onChange={(e) => setSettings({ ...settings, maxWithdrawal: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Trading Fee (%)</label>
                <input
                  type="number"
                  value={settings.tradingFee}
                  onChange={(e) => setSettings({ ...settings, tradingFee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Referral Bonus (%)</label>
                <input
                  type="number"
                  value={settings.referralBonus}
                  onChange={(e) => setSettings({ ...settings, referralBonus: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-400" />
              Email Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP Port</label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  placeholder="587"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400" />
              Security Settings
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">JWT Secret Key</label>
                <input
                  type="password"
                  value={settings.jwtSecret}
                  onChange={(e) => setSettings({ ...settings, jwtSecret: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Changing this will invalidate all existing user sessions</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-sm text-amber-400">
                ⚠️ <strong>Warning:</strong> Changing security settings may affect all users. Proceed with caution.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}