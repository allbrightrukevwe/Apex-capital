"use client";

import { useEffect, useState } from "react";
import { 
  Search, RefreshCw, Activity, User, Calendar, 
  Filter, LogIn, LogOut, CreditCard, Bot, 
  DollarSign, Settings, Shield, AlertCircle,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";

interface ActivityLog {
  id: string;
  userId: number;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filterAction, setFilterAction] = useState("all");
  const [sortField, setSortField] = useState<keyof ActivityLog>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/admin/activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const handleSort = (field: keyof ActivityLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof ActivityLog) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-teal-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-teal-400" />;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="h-4 w-4" />;
      case 'logout': return <LogOut className="h-4 w-4" />;
      case 'deposit': return <CreditCard className="h-4 w-4" />;
      case 'withdrawal': return <DollarSign className="h-4 w-4" />;
      case 'bot_activated': return <Bot className="h-4 w-4" />;
      case 'bot_profit': return <Activity className="h-4 w-4" />;
      case 'settings_changed': return <Settings className="h-4 w-4" />;
      case 'admin_action': return <Shield className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'logout': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'deposit': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'withdrawal': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'bot_activated': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'bot_profit': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'admin_action': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getActionLabel = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // Get unique action types for filter
  const actionTypes = [...new Set(activities.map(a => a.action))];

  const filteredActivities = activities.filter(a => {
    const matchesSearch = !search || 
      a.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.action?.toLowerCase().includes(search.toLowerCase()) ||
      a.ipAddress?.includes(search);
    const matchesFilter = filterAction === "all" || a.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? comparison : -comparison;
  });

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
          <h1 className="text-3xl font-bold text-white">Activities</h1>
          <p className="text-slate-400 mt-1">Monitor all user and system activities</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Total Activities</p>
          <p className="text-2xl font-bold text-white">{activities.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Logins Today</p>
          <p className="text-2xl font-bold text-teal-400">
            {activities.filter(a => a.action === 'login' && new Date(a.createdAt).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Bot Actions</p>
          <p className="text-2xl font-bold text-purple-400">
            {activities.filter(a => a.action.includes('bot')).length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-sm">Admin Actions</p>
          <p className="text-2xl font-bold text-rose-400">
            {activities.filter(a => a.action.includes('admin')).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Actions</option>
          {actionTypes.map((action) => (
            <option key={action} value={action}>{getActionLabel(action)}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user, action, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600 text-sm"
          />
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400">User</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("action")}>
                  <div className="flex items-center">Action {getSortIcon("action")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Details</th>
                <th className="text-left p-3 text-sm text-slate-400">IP Address</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">Date {getSortIcon("createdAt")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white">{activity.user?.firstName} {activity.user?.lastName}</p>
                        <p className="text-xs text-slate-500">{activity.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                      {getActionLabel(activity.action)}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-400 max-w-[200px] truncate">
                    {activity.details ? JSON.stringify(activity.details).substring(0, 80) : '-'}
                  </td>
                  <td className="p-3">
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                      {activity.ipAddress || 'N/A'}
                    </code>
                  </td>
                  <td className="p-3 text-sm text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(activity.createdAt)}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="text-xs text-teal-400 hover:text-teal-300 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {sortedActivities.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No activities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Activity Details</h2>
              <button onClick={() => setSelectedActivity(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">User</p>
                <p className="text-white">{selectedActivity.user?.firstName} {selectedActivity.user?.lastName}</p>
                <p className="text-xs text-slate-400">{selectedActivity.user?.email}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Action</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${getActionColor(selectedActivity.action)}`}>
                  {getActionIcon(selectedActivity.action)}
                  {getActionLabel(selectedActivity.action)}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">IP Address</p>
                <code className="text-sm text-slate-300">{selectedActivity.ipAddress || 'N/A'}</code>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">User Agent</p>
                <p className="text-xs text-slate-400 break-all">{selectedActivity.userAgent || 'N/A'}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Date</p>
                <p className="text-sm text-white">{formatDate(selectedActivity.createdAt)}</p>
              </div>
              {selectedActivity.details && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Details</p>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {JSON.stringify(selectedActivity.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}