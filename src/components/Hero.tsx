import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Edit2,
  Camera,
  FolderGit2,
  Award,
  ShieldCheck,
  Github,
  Linkedin,
  Terminal,
  Download,
  Maximize2,
  X,
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { triggerPdfDownload, sanitizeUrl } from '../utils/fileUtils';

interface HeroProps {
  profile: PortfolioProfile;
  isEditMode: boolean;
  onEditProfile: () => void;
  projectCount?: number;
  onEditEligibility?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  isEditMode,
  onEditProfile,
  projectCount = 5,
  onEditEligibility,
}) => {
  const [activeTab, setActiveTab] = useState<'engineer' | 'skills' | 'philosophy'>('engineer');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-[#ffffff] dark:bg-[#070b14] transition-colors duration-250">
      {/* Ambient Radial Background Glows matching target design */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/3 w-[550px] h-[550px] bg-[#004643]/[0.07] dark:bg-[#004643]/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#028090]/[0.08] dark:bg-[#028090]/25 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-slate-100/70 dark:bg-slate-900/30 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bio, Badges, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill with Pulsing Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-1.5 shadow-sm text-xs font-mono-code font-semibold text-emerald-800 dark:text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/70 hover:shadow-md transition-all duration-200 cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">OPEN TO REMOTE ROLES</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-600 dark:text-slate-300 font-sans flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#028090] dark:text-[#2dd4bf]" />
                Pampanga, PH
              </span>
            </div>

            {/* Greeting & Name */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#028090] dark:text-[#2dd4bf] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#f02a2d]" />
                <span>// HELLO WORLD — MEET THE ENGINEER</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pt-1">
                {/* Profile Photo Avatar Frame - Enlarged & Focused */}
                <div className="relative group shrink-0">
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-3xl p-1.5 bg-gradient-to-tr from-[#004643] via-[#028090] to-emerald-400 shadow-xl ring-4 ring-emerald-500/15 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-emerald-500/25 group-hover:ring-8 group-hover:ring-emerald-500/30 group-hover:-translate-y-1">
                    <div
                      onClick={() => profile.photoUrl && setIsPhotoModalOpen(true)}
                      className={`h-full w-full rounded-[20px] overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center relative ${
                        profile.photoUrl ? 'cursor-pointer' : ''
                      }`}
                      title={profile.photoUrl ? 'Click to view full photo' : undefined}
                    >
                      {profile.photoUrl ? (
                        <>
                          <img
                            src={profile.photoUrl}
                            alt={profile.fullName}
                            className="h-full w-full object-cover object-[center_16%] scale-110 group-hover:scale-115 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-[#004643] dark:text-[#2dd4bf] shadow-lg">
                              <Maximize2 className="w-4 h-4" />
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-3xl font-bold font-['Space_Grotesk'] text-[#004643] dark:text-white">RC</span>
                      )}
                    </div>
                  </div>

                  {isEditMode && (
                    <button
                      onClick={onEditProfile}
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all hover:scale-110 cursor-pointer"
                      title="Edit Profile Photo"
                      aria-label="Edit Profile Photo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk'] leading-[1.1]">
                      {profile.fullName}
                    </h1>
                    {isEditMode && (
                      <button
                        onClick={onEditProfile}
                        className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 transition-colors"
                        title="Edit Profile"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Role Title & Sub-badge */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-block px-3 py-1 rounded-md bg-[#004643] dark:bg-[#028090] text-white text-xs font-bold uppercase tracking-wider font-mono-code shadow-sm">
                      {profile.title}
                    </span>
                    <button
                      type="button"
                      onClick={isEditMode && onEditEligibility ? onEditEligibility : undefined}
                      className={`text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all ${
                        isEditMode ? 'cursor-pointer hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300' : ''
                      }`}
                      title={isEditMode ? 'Click to edit Civil Service Eligibility / HGE' : 'Civil Service Commission Honor Graduate Eligibility (PD 907)'}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{profile.civilServiceEligibility?.title || 'Cum Laude & Civil Service Honor Eligible (PD 907)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Concise Bio / Engineering Mission */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal pt-1">
              Network &amp; IT Support Engineer who also builds full-stack business systems. I monitor networks and servers, support users and POS environments, and ship React + TypeScript apps — now open to remote IT Support, NOC, and Web Development roles.
            </p>

            {/* CTA Buttons and Social Links */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              {/* Primary Action Button with Project Counter Badge */}
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#004643] dark:bg-[#028090] hover:bg-[#028090] dark:hover:bg-[#028090]/80 text-white font-bold px-6 py-3 text-sm shadow-md shadow-[#004643]/20 dark:shadow-cyan-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Explore Projects</span>
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono-code font-semibold">
                  {projectCount}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Secondary Navigation to Contact */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#004643] dark:hover:border-[#028090] hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold px-5 py-3 text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Get In Touch</span>
              </a>

              {/* Download CV CTA */}
              <button
                type="button"
                onClick={() => triggerPdfDownload(profile.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf', profile.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#004643] dark:hover:border-[#028090] hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold px-5 py-3 text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                title="Download Official CV (PDF)"
              >
                <Download className="w-4 h-4 text-[#028090] dark:text-[#2dd4bf] transition-transform duration-200 group-hover:translate-y-0.5" />
                <span>Download CV</span>
              </button>

              {/* Social Channels (GitHub & LinkedIn) */}
              <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:ml-2">
                {profile.github && (
                  <a
                    href={sanitizeUrl(profile.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#004643] dark:hover:text-white hover:border-[#004643]/50 dark:hover:border-[#028090]/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-110 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                    title="GitHub"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={sanitizeUrl(profile.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#004643] dark:hover:text-white hover:border-[#004643]/50 dark:hover:border-[#028090]/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-110 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                    title="LinkedIn"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Signature Interactive CodeDeck Card + Floating HUD Metrics */}
          <div className="lg:col-span-5 relative">
            
            {/* The CodeDeckCard (macOS Style Code Editor Window) */}
            <div className="relative rounded-2xl border border-slate-200/90 bg-[#1e293b] text-slate-100 shadow-2xl shadow-slate-900/15 overflow-hidden transition-all duration-300">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700/80">
                {/* Window Control Dots */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f02a2d] inline-block shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#eab308] inline-block shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block shadow-sm" />
                </div>

                {/* Switchable Tabs */}
                <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono-code">
                  <button
                    onClick={() => setActiveTab('engineer')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'engineer'
                        ? 'bg-[#004643] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Engineer.ts
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'skills'
                        ? 'bg-[#004643] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Skills.config
                  </button>
                  <button
                    onClick={() => setActiveTab('philosophy')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'philosophy'
                        ? 'bg-[#004643] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Philosophy.json
                  </button>
                </div>
              </div>

              {/* Code Snippet Body */}
              <div className="p-4 sm:p-5 font-mono-code text-xs sm:text-[13px] leading-relaxed overflow-x-auto min-h-[220px]">
                {activeTab === 'engineer' && (
                  <div className="space-y-1">
                    <p className="text-slate-400">// System Engineer Specification</p>
                    <p>
                      <span className="text-purple-400 font-bold">export const</span>{' '}
                      <span className="text-cyan-300 font-bold">engineer</span> = &#123;
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">name</span>:{' '}
                      <span className="text-emerald-300">"{profile.fullName}"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">degree</span>:{' '}
                      <span className="text-emerald-300">"BS Computer Engineering (Cum Laude)"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">eligibility</span>:{' '}
                      <span className="text-emerald-300">"Civil Service Honor Graduate (PD 907)"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">roles</span>:{' '}
                      <span className="text-amber-300">[</span>
                      <span className="text-emerald-300">"Network &amp; IT Support Engineer"</span>,{' '}
                      <span className="text-emerald-300">"Full-Stack Web Developer"</span>
                      <span className="text-amber-300">]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">location</span>:{' '}
                      <span className="text-emerald-300">"Pampanga, Philippines (GMT+8)"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">workSetup</span>:{' '}
                      <span className="text-emerald-300">"Remote / WFH"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">availableForHire</span>:{' '}
                      <span className="text-[#f02a2d] font-bold">true</span>
                    </p>
                    <p>&#125;;</p>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-1">
                    <p className="text-slate-400">// Engineering Stack Configuration</p>
                    <p>
                      <span className="text-purple-400 font-bold">export const</span>{' '}
                      <span className="text-cyan-300 font-bold">stackConfig</span> = &#123;
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">languages</span>:{' '}
                      <span className="text-amber-300">[</span>
                      <span className="text-emerald-300">"TypeScript"</span>,{' '}
                      <span className="text-emerald-300">"Python"</span>,{' '}
                      <span className="text-emerald-300">"C++"</span>
                      <span className="text-amber-300">]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">systems</span>:{' '}
                      <span className="text-amber-300">[</span>
                      <span className="text-emerald-300">"Cisco Routing"</span>,{' '}
                      <span className="text-emerald-300">"Linux"</span>,{' '}
                      <span className="text-emerald-300">"Raspberry Pi"</span>,{' '}
                      <span className="text-emerald-300">"POS / CCTV"</span>
                      <span className="text-amber-300">]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">cloudAndData</span>:{' '}
                      <span className="text-amber-300">[</span>
                      <span className="text-emerald-300">"Firebase Firestore"</span>,{' '}
                      <span className="text-emerald-300">"Auth"</span>,{' '}
                      <span className="text-emerald-300">"REST APIs"</span>
                      <span className="text-amber-300">]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">databases</span>:{' '}
                      <span className="text-amber-300">[</span>
                      <span className="text-emerald-300">"MySQL"</span>,{' '}
                      <span className="text-emerald-300">"Firestore"</span>
                      <span className="text-amber-300">]</span>
                    </p>
                    <p>&#125;;</p>
                  </div>
                )}

                {activeTab === 'philosophy' && (
                  <div className="space-y-1">
                    <p className="text-slate-400">// Engineering Values &amp; Principles</p>
                    <p>&#123;</p>
                    <p className="pl-4">
                      <span className="text-sky-300">"reliability"</span>:{' '}
                      <span className="text-emerald-300">"High availability &amp; proactive diagnostics"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">"codeQuality"</span>:{' '}
                      <span className="text-emerald-300">"Type-safe, modular, and maintainable"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">"integration"</span>:{' '}
                      <span className="text-emerald-300">"Bridging software applications with hardware systems"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-300">"mindset"</span>:{' '}
                      <span className="text-emerald-300">"Disciplined troubleshooting &amp; continuous learning"</span>
                    </p>
                    <p>&#125;</p>
                  </div>
                )}
              </div>

              {/* Deck Window Footer */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-t border-slate-700/80 text-[11px] font-mono-code text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span className="text-emerald-400 font-semibold">Ready to collaborate</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>TypeScript 5.8</span>
                  <span>UTF-8</span>
                </div>
              </div>
            </div>

            {/* Floating HUD Stat Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-[#004643]/30 dark:hover:border-[#028090]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#004643] dark:text-white">
                  <FolderGit2 className="w-4 h-4 text-[#028090] dark:text-[#2dd4bf]" />
                  <span className="text-base sm:text-lg font-bold font-['Space_Grotesk']">{projectCount}+</span>
                </div>
                <span className="block text-[11px] font-mono-code text-slate-500 dark:text-slate-400 uppercase mt-0.5">Projects</span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-[#004643]/30 dark:hover:border-[#028090]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#004643] dark:text-white">
                  <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-base sm:text-lg font-bold font-['Space_Grotesk']">Cum Laude</span>
                </div>
                <span className="block text-[11px] font-mono-code text-slate-500 dark:text-slate-400 uppercase mt-0.5">BS CpE Honors</span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-[#004643]/30 dark:hover:border-[#028090]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#004643] dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-base sm:text-lg font-bold font-['Space_Grotesk']">2+ yrs</span>
                </div>
                <span className="block text-[11px] font-mono-code text-slate-500 dark:text-slate-400 uppercase mt-0.5">Remote Work</span>
              </div>
            </div>

          </div>

        </div>

        {/* Scroll Indicator Mouse Pill */}
        <div className="mt-12 md:mt-16 flex flex-col items-center justify-center gap-2">
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-[#004643] dark:hover:text-[#2dd4bf] transition-colors group"
          >
            <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-[#004643] dark:group-hover:border-[#2dd4bf] flex items-start justify-center p-1 transition-colors">
              <span className="w-1 h-2 rounded-full bg-[#028090] dark:bg-[#2dd4bf] animate-bounce" />
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-[#004643] dark:group-hover:text-[#2dd4bf] transition-colors">
              SCROLL TO EXPLORE
            </span>
          </a>
        </div>

      </div>

      {/* High-Resolution Profile Photo Lightbox Modal */}
      {isPhotoModalOpen && profile.photoUrl && (
        <div
          onClick={() => setIsPhotoModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="relative max-h-[75vh] overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{profile.fullName}</p>
                <p className="text-xs text-slate-400">{profile.title}</p>
              </div>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    onEditProfile();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer"
                >
                  Change Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
