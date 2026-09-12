import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound, LogIn } from 'lucide-react';
import { verifyAdminCredentials } from '../services/adminAuthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await verifyAdminCredentials(username, password);
      if (result.success) {
        onSuccess(username.trim());
        onClose();
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#004643]/10 dark:bg-[#2dd4bf]/10 border border-[#004643]/20 dark:border-[#2dd4bf]/20 text-[#004643] dark:text-[#2dd4bf] shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] tracking-tight">
            Admin Authentication
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Authorized session portal for managing projects, experience roadmap, and portfolio content.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-3 pr-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 disabled:opacity-50 text-white dark:text-[#070b14] font-bold px-5 py-3 text-sm shadow-md transition-all active:scale-98"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Security footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono-code">
          <ShieldCheck className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
          <span>Secured with Cloud Firestore &amp; hashed admin state</span>
        </div>
      </div>
    </div>
  );
};
