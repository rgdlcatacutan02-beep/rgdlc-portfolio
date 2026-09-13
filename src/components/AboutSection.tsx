import React from 'react';
import {
  Terminal,
  Edit3,
  Server,
  Cpu,
  Shield,
  Workflow,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PortfolioProfile } from '../types';

interface AboutSectionProps {
  profile: PortfolioProfile;
  isEditMode: boolean;
  onEditProfile: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  isEditMode,
  onEditProfile,
}) => {
  const philosophies = [
    {
      title: 'Infrastructure & System Reliability',
      description:
        'Ensuring 99.9% operational availability across network switches, enterprise junket servers, and store workstations through systematic monitoring and failover protocols.',
      icon: Server,
    },
    {
      title: 'Hardware & IoT Engineering',
      description:
        'Bridging the physical and digital domains with Raspberry Pi, embedded Linux environments, real-time sensor telemetry, and intelligent edge processing.',
      icon: Cpu,
    },
    {
      title: 'Full-Stack Modern Applications',
      description:
        'Architecting reactive, type-safe web systems using React, TypeScript, Tailwind CSS, and cloud persistence with low-latency API integration.',
      icon: Workflow,
    },
    {
      title: 'Surveillance & Systems Security',
      description:
        'Maintaining enterprise CCTV networks, standardized remote diagnostics, network switch management, and proactive hardware maintenance.',
      icon: Shield,
    },
  ];

  const standards = [
    'Strict type safety and component modularity across software codebases',
    'Proactive network diagnostic workflows reducing downtime by up to 35%',
    'Hardware telemetry integration with real-time alerting systems',
    'Continuous operational uptime focus for critical business services',
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-[#070b14] border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 01 . ABOUT ME</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Engineering Mindset &amp; Systems Approach
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              A comprehensive technical overview of how I design, maintain, and scale computer systems from physical hardware to modern software.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-all shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Narrative & Core Philosophies Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Engineering Ethos and Standards */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#fffffe] dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-bold text-[#028090] dark:text-[#2dd4bf]">
                <Sparkles className="w-4 h-4 text-[#f02a2d]" />
                <span>Core Discipline &amp; Philosophy</span>
              </div>
              <h3 className="text-2xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] leading-snug">
                {profile.title ? `Bridging Physical Hardware & ${profile.title}` : 'Bridging Physical Hardware & Scalable Software'}
              </h3>
              {profile.summary ? (
                <div className="space-y-3">
                  {profile.summary.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  As a Computer Engineer, my work centers on holistic system reliability. Rather than treating software and infrastructure as separate silos, I build unified solutions—whether configuring resilient router topologies for 24/7 business operations or programming responsive React applications backed by real-time cloud data.
                </p>
              )}
            </div>

            {/* Standards Checklist */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="block text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Operating Benchmarks
              </span>
              <div className="space-y-2">
                {standards.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#028090] dark:text-[#2dd4bf] mt-0.5 shrink-0" />
                    <span className="leading-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Core Engineering Capabilities Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {philosophies.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 hover:border-[#004643]/40 dark:hover:border-[#028090]/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#004643]/5 dark:bg-[#004643]/30 text-[#004643] dark:text-[#2dd4bf] group-hover:bg-[#004643] dark:group-hover:bg-[#028090] group-hover:text-white transition-colors w-fit border border-[#004643]/10 dark:border-[#004643]/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] font-mono-code text-[#028090] dark:text-[#2dd4bf] font-semibold">
                    <Zap className="w-3 h-3" />
                    <span>Production Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
