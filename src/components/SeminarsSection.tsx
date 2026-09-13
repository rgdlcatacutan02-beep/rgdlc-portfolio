import React from 'react';
import {
  Award,
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  Terminal,
} from 'lucide-react';
import { SeminarItem } from '../types';

interface SeminarsSectionProps {
  seminars: SeminarItem[];
  isEditMode: boolean;
  onAddSeminar: () => void;
  onEditSeminar: (sem: SeminarItem) => void;
  onDeleteSeminar: (semId: string) => void;
}

export const SeminarsSection: React.FC<SeminarsSectionProps> = ({
  seminars,
  isEditMode,
  onAddSeminar,
  onEditSeminar,
  onDeleteSeminar,
}) => {
  return (
    <section id="seminars" className="py-20 bg-slate-50/50 dark:bg-[#070b14]/50 border-b border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 06 . SEMINARS &amp; LEARNING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Seminars &amp; Continuous Learning
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Professional engineering workshops, technology site immersions, and advanced workflow certifications.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={onAddSeminar}
              className="inline-flex items-center gap-2 rounded-full bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 dark:text-[#070b14] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Seminar</span>
            </button>
          )}
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seminars.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-[#004643]/40 dark:hover:border-[#2dd4bf]/40 p-6 sm:p-7 space-y-4 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#004643]/5 dark:bg-[#2dd4bf]/10 border border-[#004643]/15 dark:border-[#2dd4bf]/20 px-3 py-1 text-xs font-mono-code text-[#004643] dark:text-[#2dd4bf] font-bold">
                    <Calendar className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                    <span>{item.date}</span>
                  </div>

                  {isEditMode && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditSeminar(item)}
                        className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                        title="Edit Seminar"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSeminar(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                        title="Delete Seminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] leading-snug">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <CheckCircle className="h-4 w-4 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Verified Attendance &amp; Certification</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
