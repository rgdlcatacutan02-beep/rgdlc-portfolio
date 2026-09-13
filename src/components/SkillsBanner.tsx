import React from 'react';
import {
  Code2,
  Cpu,
  Server,
  Database,
  Terminal,
  Globe,
  Layers,
  Flame,
  Radio,
  Wifi,
  Shield,
  Monitor,
  Workflow,
} from 'lucide-react';

export const SkillsBanner: React.FC = () => {
  const rowOne = [
    { name: 'React', icon: Code2, category: 'Frontend' },
    { name: 'TypeScript', icon: Terminal, category: 'Languages' },
    { name: 'Tailwind CSS', icon: Layers, category: 'Styling' },
    { name: 'Node.js', icon: Server, category: 'Backend' },
    { name: 'Python', icon: Code2, category: 'Languages' },
    { name: 'Raspberry Pi', icon: Cpu, category: 'Embedded' },
    { name: 'Firebase Firestore', icon: Flame, category: 'Cloud' },
    { name: 'Linux OS', icon: Terminal, category: 'Systems' },
    { name: 'Cisco Routing', icon: Wifi, category: 'Networks' },
    { name: 'Express.js', icon: Globe, category: 'Backend' },
  ];

  const rowTwo = [
    { name: 'Network Diagnostics', icon: Wifi, category: 'Networks' },
    { name: 'IoT Sensors & Telemetry', icon: Radio, category: 'Embedded' },
    { name: 'POS & Workstation Support', icon: Monitor, category: 'Infrastructure' },
    { name: 'CCTV Surveillance Systems', icon: Shield, category: 'Security' },
    { name: 'MySQL & Relational Data', icon: Database, category: 'Database' },
    { name: 'RESTful API Architecture', icon: Workflow, category: 'Architecture' },
    { name: 'Vite & Build Tooling', icon: Layers, category: 'Tooling' },
    { name: 'Hardware Prototyping', icon: Cpu, category: 'Hardware' },
  ];

  return (
    <section className="relative py-8 bg-slate-50/70 dark:bg-[#0b101d] border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-colors duration-250">
      {/* Left & Right Gradient Fade Overlays */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0b101d] dark:via-[#0b101d]/80 dark:to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#0b101d] dark:via-[#0b101d]/80 dark:to-transparent z-10 pointer-events-none" />

      <div className="space-y-3">
        {/* Row 1 - Scrolling Left */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-3">
            {[...rowOne, ...rowOne].map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={`${skill.name}-${index}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-[#028090] dark:hover:border-[#2dd4bf] hover:shadow-lg hover:shadow-[#028090]/10 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-200 group shrink-0 cursor-default"
                >
                  <div className="p-1 rounded-md bg-[#004643]/5 dark:bg-[#004643]/30 text-[#004643] dark:text-[#2dd4bf] group-hover:bg-[#004643] dark:group-hover:bg-[#028090] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono-code font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    {skill.name}
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-400 dark:text-slate-500 uppercase">
                    • {skill.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2 - Scrolling Right / Reverse */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-reverse flex items-center gap-3">
            {[...rowTwo, ...rowTwo].map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={`${skill.name}-${index}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-[#028090] dark:hover:border-[#2dd4bf] hover:shadow-lg hover:shadow-[#028090]/10 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-200 group shrink-0 cursor-default"
                >
                  <div className="p-1 rounded-md bg-[#028090]/5 dark:bg-[#028090]/30 text-[#028090] dark:text-[#2dd4bf] group-hover:bg-[#028090] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono-code font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    {skill.name}
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-400 dark:text-slate-500 uppercase">
                    • {skill.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
