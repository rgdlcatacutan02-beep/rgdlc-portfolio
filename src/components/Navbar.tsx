import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Award,
  Send,
  ArrowUpRight,
  Printer,
  Download,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { triggerPdfDownload } from '../utils/fileUtils';

interface NavbarProps {
  profile?: PortfolioProfile;
  onSecretAdminTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onSecretAdminTrigger }) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('#home');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home', icon: Home },
    { id: 'about', label: 'About', href: '#about', icon: User },
    { id: 'projects', label: 'Projects', href: '#projects', icon: FolderGit2 },
    { id: 'experience', label: 'Roadmap', href: '#experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', href: '#skills', icon: Cpu },
    { id: 'certificates', label: 'Certificates', href: '#certificates', icon: Award },
    { id: 'contact', label: 'Contact', href: '#contact', icon: Send },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage (0 - 100)
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);
      setScrolled(totalScroll > 20);

      // Bottom of page detection -> highlight Contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection('#contact');
        return;
      }

      const sectionIds = ['contact', 'education', 'seminars', 'certificates', 'skills', 'experience', 'projects', 'about', 'home'];
      const scrollPosition = window.scrollY + 180;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('#home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(href);

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', ' ');
      return;
    }

    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const yOffset = -75;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  // Secret triple-click trigger on the logo dot to open admin login
  const dotClickCountRef = useRef(0);
  const dotTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleLogoDotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dotClickCountRef.current += 1;
    if (dotClickCountRef.current >= 3) {
      dotClickCountRef.current = 0;
      onSecretAdminTrigger?.();
    }
    if (dotTimerRef.current) clearTimeout(dotTimerRef.current);
    dotTimerRef.current = setTimeout(() => {
      dotClickCountRef.current = 0;
    }, 800);
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-slate-100/60 dark:bg-slate-900/60 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#004643] via-[#028090] to-[#f02a2d] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Glassmorphic Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,70,67,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border-b border-slate-200/80 dark:border-slate-800/80 py-2.5'
            : 'bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-850/60 py-3.5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="group flex items-center gap-2.5 focus:outline-none"
            aria-label="Regie De Leon Catacutan Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#004643] dark:bg-[#0d5c58] text-white font-bold font-mono-code text-sm shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#028090]">
              RC
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk'] leading-none">
                CATACUTAN
                <span
                  onClick={handleLogoDotClick}
                  className="text-[#028090] dark:text-[#2dd4bf] cursor-pointer select-none transition-transform hover:scale-125 inline-block"
                  title="."
                >
                  .
                </span>
              </span>
              <span className="text-[10px] font-mono-code tracking-wider uppercase text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Computer Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/70 dark:border-slate-800 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#004643] dark:bg-[#028090] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#004643] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fffffe]' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#028090] dark:bg-[#2dd4bf] animate-pulse" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:border-[#004643] dark:hover:border-amber-400/50 hover:text-[#004643] transition-all duration-200 shadow-sm"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>

            <button
              onClick={() => triggerPdfDownload(profile?.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf', profile?.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf')}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#004643]/40 dark:hover:border-[#028090]/50 hover:text-[#004643] dark:hover:text-[#2dd4bf] transition-all duration-200 shadow-sm cursor-pointer"
              title="Download Curriculum Vitae (PDF)"
            >
              <Download className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>Download CV</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="flex items-center gap-1.5 rounded-full bg-[#004643] dark:bg-[#028090] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#028090] dark:hover:bg-[#028090]/80 transition-all duration-200 shadow-sm group"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Button & Mobile Theme Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#070b14]/95 px-4 pt-3 pb-5 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#004643] dark:bg-[#028090] text-white'
                        : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerPdfDownload(profile?.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf', profile?.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Download CV</span>
              </button>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#004643] dark:bg-[#028090] text-white text-xs font-bold"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Mobile Dock for Convenient Thumb Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden w-[92%] max-w-sm">
        <div className="bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-lg border border-slate-200/90 dark:border-slate-800/90 rounded-full px-3 py-2 shadow-xl shadow-slate-900/10 dark:shadow-black/60 flex items-center justify-around">
          {navLinks.slice(0, 4).map((link) => {
            const isActive = activeSection === link.href;
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative p-2 rounded-full transition-all ${
                  isActive
                    ? 'text-[#004643] dark:text-[#2dd4bf] bg-[#004643]/10 dark:bg-[#028090]/20 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={link.label}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#004643] dark:bg-[#2dd4bf]" />
                )}
              </a>
            );
          })}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="p-2 rounded-full bg-[#004643] dark:bg-[#028090] text-white shadow-sm"
            title="Contact"
          >
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
};
