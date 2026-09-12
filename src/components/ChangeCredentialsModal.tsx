import React, { useState } from 'react';
import { X, KeyRound, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { updateAdminCredentials, verifyAdminCredentials } from '../services/adminAuthService';

interface ChangeCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUsername: string) => void;
  currentUsername: string;
}

export const ChangeCredentialsModal: React.FC<ChangeCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUsername,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newUsername.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      // Verify current password first
      const verification = await verifyAdminCredentials(currentUsername, currentPassword);
      if (!verification.success) {
        setError('Current password is incorrect.');
        setLoading(false);
        return;
      }

      // Update credentials
      await updateAdminCredentials(newUsername.trim(), newPassword);
      onSuccess(newUsername.trim());
      onClose();
    } catch (err: unknown) {
      console.error('Failed to update credentials:', err);
      setError('An error occurred while saving new credentials.');
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

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004643]/10 dark:bg-[#2dd4bf]/10 border border-[#004643]/20 dark:border-[#2dd4bf]/20 text-[#004643] dark:text-[#2dd4bf]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] tracking-tight">
              Change Admin Credentials
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your dashboard username and password.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              New Admin Username <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. regie"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-2.5 pr-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
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

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono-code uppercase text-[11px] tracking-wider">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 disabled:opacity-50 px-5 py-2 font-bold text-white dark:text-[#070b14] shadow-md transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Updating...' : 'Save New Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
