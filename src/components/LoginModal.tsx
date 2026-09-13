import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { loginWithGoogle, logoutUser, isAuthorizedOwner, AUTHORIZED_OWNER_EMAIL } from '../firebase';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        if (!isAuthorizedOwner(user)) {
          await logoutUser();
          setError(`Access denied. Only the verified portfolio owner (${AUTHORIZED_OWNER_EMAIL}) has administrative access.`);
          return;
        }
        onSuccess(user.displayName || user.email || 'Admin');
        onClose();
      }
    } catch (err: unknown) {
      console.error('Google Sign-in error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('closed-by-user') || msg.includes('popup-closed')) {
        return;
      }
      if (msg.includes('unauthorized-domain')) {
        setError('Domain not authorized: Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (msg.includes('popup-blocked')) {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else {
        setError(`Google Sign-in failed: ${msg}`);
      }
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
            Authorized portal for managing projects, experience roadmap, and portfolio content via Google Cloud Authentication.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#028090] dark:text-[#2dd4bf]" />
            <span>Owner Account Requirement</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Administrative access is strictly restricted to the verified owner account:
            <span className="block font-mono-code font-bold text-[#004643] dark:text-[#2dd4bf] mt-1 break-all">
              {AUTHORIZED_OWNER_EMAIL}
            </span>
          </p>
        </div>

        {/* Google Sign-in for direct Cloud Sync */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold px-4 py-3 text-sm shadow-sm transition-all hover:border-[#004643]/40 dark:hover:border-[#2dd4bf]/50 disabled:opacity-50 cursor-pointer active:scale-98"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating...' : 'Sign In with Google Cloud'}</span>
        </button>

        {/* Security footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono-code">
          <ShieldCheck className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
          <span>Secured with Google OAuth &amp; Cloud Firestore Rules</span>
        </div>
      </div>
    </div>
  );
};
