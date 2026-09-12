import React, { useRef } from 'react';
import { ShieldCheck, ArrowUp, Sparkles, LogOut } from 'lucide-react';
import { PortfolioProfile } from '../types';
import { User } from '../firebase';

interface FooterProps {
  profile: PortfolioProfile;
  user?: User | null;
  adminUser?: string | null;
  isEditMode?: boolean;
  onOpenLogin?: () => void;
  onToggleEditMode?: () => void;
  onLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  user,
  adminUser,
  isEditMode,
  onOpenLogin,
  onToggleEditMode,
  onLogout,
}) => {
  const isLoggedIn = Boolean(user || adminUser);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hidden triple-click trigger on copyright text
  const handleSecretCopyrightClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenLogin?.();
    }
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 800);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] py-12 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Attestation */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
                CATACUTAN<span className="text-[#028090] dark:text-[#2dd4bf]">.</span>
              </span>
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                Computer Engineer
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {profile.fullName} • {profile.location}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-[#028090] dark:text-[#2dd4bf] font-medium pt-0.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Engineering Portfolio • Honor Graduate Eligibility (PD 907)</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#about" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">About</a>
            <a href="#projects" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Projects</a>
            <a href="#experience" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Roadmap</a>
            <a href="#skills" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Skills</a>
            <a href="#seminars" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Credentials</a>
            <a href="#education" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Education</a>
            <a href="#contact" className="hover:text-[#004643] dark:hover:text-[#2dd4bf] font-medium transition-colors">Contact</a>
            
            {/* Logged-In Only Admin Controls */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={onToggleEditMode}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                    isEditMode
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-[#004643] dark:hover:text-[#2dd4bf]'
                  }`}
                  title="Toggle Admin Editor"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isEditMode ? 'Editing Active' : 'Admin Panel'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#004643] dark:hover:border-[#2dd4bf] hover:text-[#004643] dark:hover:text-[#2dd4bf] text-slate-600 dark:text-slate-300 transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Secret Easter-Egg Copyright Line: Triple-click triggers admin login */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] font-mono-code text-slate-400 dark:text-slate-500">
          <p
            onClick={handleSecretCopyrightClick}
            className="cursor-default select-none hover:text-slate-500 dark:hover:text-slate-400 transition-colors"
            title="© Regie De Leon Catacutan"
          >
            © {new Date().getFullYear()} Regie De Leon Catacutan. Engineered with React, TypeScript, Tailwind CSS &amp; Cloud Firestore.
          </p>
        </div>
      </div>
    </footer>
  );
};
