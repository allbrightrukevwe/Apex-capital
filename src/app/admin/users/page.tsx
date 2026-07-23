"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Eye, RefreshCw, TrendingUp, TrendingDown, 
  Pencil, Trash2, User, Crown, Lock, EyeOff, 
  Mail, Phone, DollarSign, Bot, Activity, 
  Calendar, Wallet, ArrowUpDown, ArrowUp, ArrowDown,
  Coins, Download, Plus, Minus 
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  balance: number;
  isAdmin: boolean;
  bots: number;
  trades: number;
  deposits: number;
  withdrawals: number;
  totalPnL: number;
  createdAt: string;
  updatedAt: string;
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: string;
  isAdmin: boolean;
  role: "user" | "admin";
  password: string;
  confirmPassword: string;
}

interface DepositForm {
  amount: number;
  description: string;
  currency: string;
  network: string;
}

const CURRENCIES = [
  { symbol: 'USDT', name: 'Tether USD', networks: ['TRC20', 'ERC20', 'BEP20'] },
  { symbol: 'BTC',  name: 'Bitcoin',    networks: ['BTC'] },
  { symbol: 'ETH',  name: 'Ethereum',   networks: ['ERC20'] },
  { symbol: 'SOL',  name: 'Solana',     networks: ['SOL'] },
  { symbol: 'BNB',  name: 'BNB',        networks: ['BEP20'] },
  { symbol: 'MATIC',name: 'Polygon',    networks: ['POLYGON'] },
  { symbol: 'XRP',  name: 'Ripple',     networks: ['XRP'] },
  { symbol: 'DOGE', name: 'Dogecoin',   networks: ['DOGE'] },
];

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);

  // modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Deposit modal
  const [depositUser, setDepositUser] = useState<User | null>(null);
  const [depositForm, setDepositForm] = useState<DepositForm>({ amount: 0, description: "", currency: "USDT", network: "TRC20" });
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState("");
  const [depositSuccess, setDepositSuccess] = useState("");

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      balance: user.balance.toString(),
      isAdmin: user.isAdmin,
      role: user.isAdmin ? "admin" : "user",
      password: "",
      confirmPassword: "",
    });
    setEditError("");
    setShowPassword(false);
  };

  const handleEditSave = async () => {
    if (!editUser || !editForm) return;
    
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setEditError("Passwords do not match");
      return;
    }
    
    if (editForm.password && editForm.password.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    
    setEditLoading(true);
    setEditError("");
    try {
      const body: any = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        balance: parseFloat(editForm.balance),
        isAdmin: editForm.role === "admin",
      };
      
      if (editForm.password) {
        body.password = editForm.password;
      }
      
      const response = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        setEditUser(null);
        setEditForm(null);
        fetchUsers();
      } else {
        const data = await response.json();
        setEditError(data.error || "Failed to update user");
      }
    } catch {
      setEditError("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositUser) return;
    if (depositForm.amount <= 0) {
      setDepositError("Amount must be greater than 0");
      return;
    }

    setDepositLoading(true);
    setDepositError("");
    setDepositSuccess("");
    
    try {
      const response = await fetch("/api/admin/users/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: depositUser.id,
          amount: depositForm.amount,
          description: depositForm.description || "Admin deposit",
          currency: depositForm.currency,
          network: depositForm.network,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepositSuccess(`Successfully deposited $${depositForm.amount.toFixed(2)} (${depositForm.currency}) to ${depositUser.firstName} ${depositUser.lastName}`);
        setDepositForm({ amount: 0, description: "", currency: "USDT", network: "TRC20" });
        fetchUsers();
        setTimeout(() => {
          setDepositUser(null);
          setDepositSuccess("");
        }, 2000);
      } else {
        const data = await response.json();
        setDepositError(data.error || "Failed to process deposit");
      }
    } catch (error) {
      setDepositError("Network error. Please try again.");
    } finally {
      setDepositLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteUser(null);
        fetchUsers();
      }
    } catch (error) {
    } finally {
      setDeleteLoading(false);
    }
  };

  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-teal-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-teal-400" />;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: any = a[sortField as keyof User];
    let bVal: any = b[sortField as keyof User];
    
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchUsers} className="mt-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage platform users and track all their activities</p>
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

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("firstName")}>
                  <div className="flex items-center">User {getSortIcon("firstName")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("email")}>
                  <div className="flex items-center">Email {getSortIcon("email")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Password</th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("withdrawals")}>
                  <div className="flex items-center">Withdrawals {getSortIcon("withdrawals")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("deposits")}>
                  <div className="flex items-center">Deposits {getSortIcon("deposits")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("balance")}>
                  <div className="flex items-center">Balance {getSortIcon("balance")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("totalPnL")}>
                  <div className="flex items-center">P&L {getSortIcon("totalPnL")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("bots")}>
                  <div className="flex items-center">Bots {getSortIcon("bots")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("trades")}>
                  <div className="flex items-center">Trades {getSortIcon("trades")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("isAdmin")}>
                  <div className="flex items-center">Role {getSortIcon("isAdmin")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400 cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">Joined {getSortIcon("createdAt")}</div>
                </th>
                <th className="text-left p-3 text-sm text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <div className="font-medium text-white whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-amber-400" />
                      <span className="text-sm font-mono text-slate-500">••••••••</span>
                      <button
                        onClick={() => openEdit(user)}
                        className="text-xs text-teal-400 hover:text-teal-300 ml-1"
                      >
                        (Change)
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Download className="h-3 w-3" />
                      ${(user.withdrawals || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-teal-400">
                      <Coins className="h-3 w-3" />
                      ${(user.deposits || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-teal-400 font-mono">
                      <DollarSign className="h-3 w-3" />
                      {(user.balance || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1 text-sm font-mono ${(user.totalPnL || 0) >= 0 ? "text-teal-400" : "text-red-400"}`}>
                      {(user.totalPnL || 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {(user.totalPnL || 0) >= 0 ? "+" : ""}{(user.totalPnL || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-purple-400">
                      <Bot className="h-3 w-3" />
                      {user.bots || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Activity className="h-3 w-3" />
                      {user.trades || 0}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                      user.isAdmin 
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" 
                        : "bg-slate-500/10 text-slate-400"
                    }`}>
                      {user.isAdmin ? <Crown className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}/trades`)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-cyan-400"
                        title="View Trades"
                      >
                        <Activity className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-teal-400"
                        title="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDepositUser(user)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-teal-400 hover:text-teal-300"
                        title="Add Deposit"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteUser(user)}
                        className="p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-red-400"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedUsers.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">User Details</h2>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {selectedUser.firstName?.[0] || "U"}{selectedUser.lastName?.[0] || "S"}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-sm text-slate-400">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Balance</p>
                <p className="text-xl font-bold text-teal-400">${(selectedUser.balance || 0).toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Total P&L</p>
                <p className="text-xl font-bold text-white">${(selectedUser.totalPnL || 0).toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Bots</p>
                <p className="text-xl font-bold text-purple-400">{selectedUser.bots || 0}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Trades</p>
                <p className="text-xl font-bold text-cyan-400">{selectedUser.trades || 0}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && editForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Edit User</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Balance ($)</label>
                <input
                  type="number"
                  value={editForm.balance}
                  onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  step="0.01"
                />
              </div>
              
              {/* Password Section */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <label className="text-sm font-medium text-slate-300">Change Password</label>
                  <span className="text-xs text-slate-500">(Leave blank to keep current)</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500 pr-10"
                      placeholder="New password (optional)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div>
                    <input
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              {/* Role Selection */}
              <div className="border-t border-slate-700 pt-4">
                <label className="block text-sm text-slate-400 mb-2">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "user" })}
                    className={`p-2 rounded-lg border transition ${
                      editForm.role === "user"
                        ? "border-teal-500 bg-teal-500/10 text-teal-400"
                        : "border-slate-700 bg-slate-800 text-slate-400"
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "admin" })}
                    className={`p-2 rounded-lg border transition ${
                      editForm.role === "admin"
                        ? "border-teal-500 bg-teal-500/10 text-teal-400"
                        : "border-slate-700 bg-slate-800 text-slate-400"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {editError && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{editError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditUser(null); setEditForm(null); }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-slate-950"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-teal-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Deposit</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Add funds to <span className="text-white font-medium">{depositUser.firstName} {depositUser.lastName}</span>'s account
            </p>
            
            {depositSuccess && (
              <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-teal-400 text-sm">{depositSuccess}</p>
              </div>
            )}
            
            {depositError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{depositError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm({ ...depositForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Currency</label>
                <select
                  value={depositForm.currency}
                  onChange={(e) => {
                    const selected = CURRENCIES.find(c => c.symbol === e.target.value)!;
                    setDepositForm({ ...depositForm, currency: selected.symbol, network: selected.networks[0] });
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Network</label>
                <select
                  value={depositForm.network}
                  onChange={(e) => setDepositForm({ ...depositForm, network: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  {(CURRENCIES.find(c => c.symbol === depositForm.currency)?.networks || []).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={depositForm.description}
                  onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  placeholder="Admin deposit"
                />
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="text-teal-400 font-mono">${depositUser.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">After Deposit:</span>
                  <span className="text-teal-400 font-mono">${(depositUser.balance + depositForm.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Currency:</span>
                  <span className="text-cyan-400 font-mono">{depositForm.currency} ({depositForm.network})</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setDepositUser(null); setDepositError(""); setDepositSuccess(""); setDepositForm({ amount: 0, description: "", currency: "USDT", network: "TRC20" }); }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={depositLoading || depositForm.amount <= 0}
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-slate-950"
              >
                {depositLoading ? "Processing..." : "Add Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm border border-slate-800">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Delete User</h2>
            <p className="text-slate-400 text-sm text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {deleteUser.firstName} {deleteUser.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 rounded-lg transition text-sm font-medium text-white"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}