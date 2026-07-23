'use client';

import { useState, useEffect } from 'react';
import WithdrawHeader from './components/WithdrawHeader';
import { useUserContext } from '@/lib/contexts/UserContext';
import Sidebar from '../components/Sidebar';

// Main Withdraw Page
interface CryptoCurrency {
  value: string;
  label: string;
}

const WithdrawPage = () => {
  const { user, loading } = useUserContext();
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // ====== VERIFICATION MODAL STATES ======
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // ====== WITHDRAWAL SUCCESS STATE ======
  const [showWithdrawalSuccess, setShowWithdrawalSuccess] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');

  // ✅ REAL WITHDRAWAL HISTORY
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const currencies: CryptoCurrency[] = [
    { value: 'BTC', label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'USDT', label: 'Tether' },
    { value: 'USDC', label: 'USD Coin' },
    { value: 'SOL', label: 'Solana' },
    { value: 'BNB', label: 'BNB' },
    { value: 'DOGE', label: 'Dogecoin' },
    { value: 'LTC', label: 'Litecoin' },
    { value: 'TRX', label: 'Tron' },
    { value: 'XRP', label: 'Ripple' },
  ];

  // ✅ Fetch withdrawal history
  const fetchWithdrawalHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/withdraw');
      const data = await res.json();
      if (data.success) {
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (err) {
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const handleWithdraw = async () => {
    if (!amount || !selectedCurrency || !walletAddress) {
      return;
    }
    setWithdrawalError('');
    setIsVerifying(true);
    try {
      const res = await fetch('/api/withdraw/send-code', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
    } catch (err: any) {
      setWithdrawalError(err.message);
      setIsVerifying(false);
      return;
    }
    setIsVerifying(false);
    setShowVerificationModal(true);
    setVerificationCode('');
    setIsVerified(false);
  };

  const handleVerify = async () => {
    if (verificationCode.length === 8) {
      setIsVerifying(true);
      setWithdrawalError('');
      
      try {
        const res = await fetch('/api/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: selectedCurrency,
            walletAddress,
            code: verificationCode,
          }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Withdrawal failed');
        }
        
        setIsVerifying(false);
        setIsVerified(true);
        
        // ✅ Refresh history after successful withdrawal
        fetchWithdrawalHistory();
        
        // Close modal after success
        setTimeout(() => {
          setShowVerificationModal(false);
          // Show withdrawal success message on the page
          setWithdrawalAmount(amount);
          setShowWithdrawalSuccess(true);
          // Reset form
          setAmount('');
          setSelectedCurrency('');
          setWalletAddress('');
          // Auto-hide success message after 10 seconds
          setTimeout(() => {
            setShowWithdrawalSuccess(false);
          }, 10000);
        }, 1000);
        
      } catch (error: any) {
        setIsVerifying(false);
        setWithdrawalError(error.message);
      }
    }
  };

  const handleCancel = () => {
    setShowVerificationModal(false);
    setVerificationCode('');
    setIsVerifying(false);
    setIsVerified(false);
    setWithdrawalError('');
  };

  const handleMaxClick = () => {
    setAmount(user?.balance?.toString() || '0.00');
  };

  // Auto-fill code for testing (remove in production)
  const handleAutoFillCode = () => {
    setVerificationCode('12345678');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="lg:ml-64">
        <WithdrawHeader />

        <main className="px-3 py-4 lg:px-6 lg:py-6 flex justify-center">
          <div className="w-full max-w-md space-y-4">
            {/* Page Title */}
            <div>
              <h1 className="text-white font-bold text-xl tracking-wide uppercase">
                Withdraw Crypto
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Withdraw your funds to any cryptocurrency wallet
              </p>
            </div>

            {/* AML Compliance Notice */}
            <div className="rounded-xl border border-teal-500/30 bg-teal-500/8 p-4">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="text-teal-400 text-xs font-bold mb-1">AML Compliance</p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    To comply with global Anti-Money Laundering (AML) and security regulations, 
                    we require a <span className="text-white font-bold">100% trading turnover</span> 
                    on all deposited funds before they can be withdrawn.
                  </p>
                </div>
              </div>
            </div>

            {/* Available Balance */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                  Available Balance
                </span>
              </div>
              <div className="text-3xl font-bold text-teal-400">
                {loading ? '$...' : `$${user?.balance?.toFixed(2) || '0.00'}`}
              </div>
            </div>

            {/* ====== WITHDRAWAL VERIFIED SUCCESS MESSAGE ====== */}
            {showWithdrawalSuccess && (
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-teal-400 font-bold text-sm">Withdrawal Verified</p>
                    <p className="text-slate-300 text-xs">
                      Your withdrawal of <span className="text-white font-bold">${parseFloat(withdrawalAmount).toFixed(2)}</span> will be processed within <span className="text-white font-bold">60 seconds</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawal Form */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
              <h2 className="text-white font-bold text-sm">Withdrawal Details</h2>

              {/* Amount */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5 block">
                  Amount (USD)
                </label>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 focus-within:border-teal-500/50 rounded-lg px-3 py-2.5 transition">
                  <span className="text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    onClick={handleMaxClick}
                    className="text-teal-400 text-xs font-bold hover:text-teal-300 transition"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Currency Selection */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5 block">
                  Select Currency
                </label>
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 focus:border-teal-500/50 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-500">
                      Choose cryptocurrency
                    </option>
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value} className="bg-slate-800">
                        {currency.value} — {currency.label}
                      </option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5 block">
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder={`Enter your ${selectedCurrency || 'BTC'} wallet address`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none transition"
                />
                <p className="text-amber-500/80 text-[10px] mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Double-check the address. Transactions cannot be reversed.
                </p>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                disabled={!amount || !selectedCurrency || !walletAddress}
                className={`w-full font-bold py-3 rounded-xl transition text-sm tracking-widest uppercase flex items-center justify-center gap-2 ${
                  amount && selectedCurrency && walletAddress
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                    : 'bg-slate-700 disabled:cursor-not-allowed text-slate-500'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21V8M5 10l7-7 7 7" />
                  <path d="M3 21h18" />
                </svg>
                Withdraw
              </button>
            </div>

            {/* Withdrawal History */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h2 className="text-white font-bold text-sm mb-3">Withdrawal History</h2>

              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 mb-4">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by coin, network, status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* ✅ REAL DATA */}
              {loadingHistory ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">Loading...</p>
                </div>
              ) : withdrawalHistory.length === 0 ? (
                <div className="text-center py-8">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-700 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21V8M5 10l7-7 7 7" />
                    <path d="M3 21h18" />
                  </svg>
                  <p className="text-slate-500 text-sm">No withdrawals yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {withdrawalHistory
                    .filter((w: any) => 
                      !searchTerm || 
                      w.coin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      w.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      w.address?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((w: any) => (
                      <div key={w.id} className="flex items-center justify-between py-2 border-b border-slate-800">
                        <div>
                          <p className="text-white text-sm font-semibold">
                            ${w.amount?.toFixed(2)} {w.coin}
                          </p>
                          <p className="text-slate-500 text-xs truncate max-w-[200px]">
                            To: {w.address}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-semibold ${
                            w.status === 'completed' ? 'text-teal-400' :
                            w.status === 'pending' ? 'text-amber-400' :
                            w.status === 'failed' ? 'text-red-400' :
                            'text-slate-400'
                          }`}>
                            {w.status?.charAt(0).toUpperCase() + w.status?.slice(1)}
                          </span>
                          <p className="text-slate-500 text-[10px]">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ====== VERIFICATION MODAL ====== */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl animate-pop-in relative">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition"
              aria-label="Close"
              disabled={isVerifying}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col text-center pt-2">
              {/* Shield icon */}
              <div className="w-16 h-16 rounded-full border-2 border-teal-400 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>

              <h2 className="text-white font-bold text-lg mb-1">Verify Withdrawal</h2>
              <p className="text-slate-400 text-xs mb-6">
                Enter the 8-digit code sent to your email
              </p>

              {/* Error message */}
              {withdrawalError && (
                <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3">
                  ❌ {withdrawalError}
                </p>
              )}

              {/* Code input */}
              <div className="mb-4">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="00000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                      setVerificationCode(value);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500/50 rounded-lg px-4 py-3 text-center text-2xl font-mono text-white placeholder-slate-600 focus:outline-none transition tracking-widest"
                  autoFocus
                  disabled={isVerifying || isVerified}
                />
                <p className="text-slate-500 text-[10px] mt-2 flex items-center justify-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {isVerified 
                    ? '✓ Verified successfully!' 
                    : 'Check your email for the verification code'}
                </p>
                {verificationCode.length > 0 && verificationCode.length < 8 && (
                  <p className="text-slate-500 text-[10px] mt-1">
                    {8 - verificationCode.length} more digit{8 - verificationCode.length > 1 ? 's' : ''} needed
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                  disabled={isVerifying || isVerified}
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 8 || isVerifying || isVerified}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                    verificationCode.length === 8 && !isVerifying && !isVerified
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                      : 'bg-slate-700 disabled:cursor-not-allowed text-slate-500'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" className="opacity-25" />
                        <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75" />
                      </svg>
                      Verifying...
                    </>
                  ) : isVerified ? (
                    '✅ Verified'
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>

              {/* Developer testing helper - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleAutoFillCode}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-400 transition"
                >
                  [DEV] Auto-fill code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
          from { transform: scale(0.95) translateY(8px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-pop-in { animation: pop-in 0.25s ease-out; }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default WithdrawPage;