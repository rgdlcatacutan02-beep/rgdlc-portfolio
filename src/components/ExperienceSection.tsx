import React from 'react';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  Building2,
  Wrench,
  Terminal,
} from 'lucide-react';
import { ExperienceItem } from '../types';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  isEditMode: boolean;
  onAddExperience: () => void;
  onEditExperience: (exp: ExperienceItem) => void;
  onDeleteExperience: (expId: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isEditMode,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
}) => {
  return (
    <section id="experience" className="py-20 bg-white dark:bg-[#070b14] border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 03 . EXPERIENCE &amp; ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Career Journey &amp; Work History
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Hands-on engineering in network infrastructure, server stability, POS workstations, and enterprise systems.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={onAddExperience}
              className="inline-flex items-center gap-2 rounded-full bg-[#004643] dark:bg-[#028090] hover:bg-[#028090] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Work Experience</span>
            </button>
          )}
        </div>

        {/* Timeline Roadmap Structure */}
        <div className="relative border-l-2 border-[#004643]/20 dark:border-[#028090]/30 ml-3 sm:ml-6 space-y-10 pl-6 sm:pl-10">
          {experiences.map((exp) => {
            const bulletPoints = exp.responsibilities
              ? exp.responsibilities.split('\n').filter((p) => p.trim().length > 0)
              : [];
            const toolsList = exp.tools
              ? exp.tools.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div key={exp.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[33px] sm:-left-[49px] top-1.5 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#004643] dark:border-[#028090] bg-white dark:bg-slate-900 text-[#004643] dark:text-[#2dd4bf] shadow-md group-hover:bg-[#004643] dark:group-hover:bg-[#028090] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>

                {/* Experience Card */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#fffffe] dark:bg-slate-900/60 hover:border-[#004643]/40 dark:hover:border-[#028090]/50 group-hover:-translate-y-0.5 group-hover:shadow-lg p-6 sm:p-8 transition-all duration-300 shadow-sm">
                  {/* Top Bar: Role, Company, Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#028090] dark:text-[#2dd4bf] font-semibold mt-0.5">
                        <Building2 className="h-4 w-4" />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1 text-xs font-mono-code font-semibold text-slate-700 dark:text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                        <span>{exp.period}</span>
                      </div>

                      {/* Edit controls in Admin Mode */}
                      {isEditMode && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditExperience(exp)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs hover:bg-amber-100 transition-colors"
                            title="Edit Experience"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExperience(exp.id)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300 text-xs hover:bg-rose-100 transition-colors"
                            title="Delete Experience"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Responsibilities list */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-[#028090] dark:text-[#2dd4bf] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {point.replace(/^[-•*]\s*/, '')}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Tools used */}
                  {toolsList.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mr-2 font-mono-code font-bold uppercase">
                        <Wrench className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                        <span>Tooling:</span>
                      </div>
                      {toolsList.map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 font-mono-code border border-slate-200 dark:border-slate-700 hover:border-[#028090] dark:hover:border-[#2dd4bf] hover:text-[#004643] dark:hover:text-[#2dd4bf] hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 inline-block"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
