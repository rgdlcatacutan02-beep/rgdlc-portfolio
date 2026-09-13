import React from 'react';
import {
  GraduationCap,
  PlusCircle,
  Edit2,
  Trash2,
  Award,
  Calendar,
  MapPin,
  Terminal,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { EducationItem, CivilServiceEligibility } from '../types';
import { openPdfPreview } from '../utils/fileUtils';

interface EducationSectionProps {
  education: EducationItem[];
  isEditMode: boolean;
  onAddEducation: () => void;
  onEditEducation: (edu: EducationItem) => void;
  onDeleteEducation: (eduId: string) => void;
  eligibility?: CivilServiceEligibility;
  onEditEligibility?: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  isEditMode,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  eligibility,
  onEditEligibility,
}) => {
  return (
    <section id="education" className="py-20 bg-white dark:bg-[#070b14] border-b border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 07 . ACADEMIC FORMATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Education &amp; Academic Honors
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Foundational computer engineering degree, Latin honors, and professional civil service eligibility.
            </p>
          </div>

          {isEditMode && (
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              {onEditEligibility && (
                <button
                  onClick={onEditEligibility}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold px-4 py-2.5 text-xs shadow-sm transition-all"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Configure CSC / HGE</span>
                </button>
              )}
              <button
                onClick={onAddEducation}
                className="inline-flex items-center gap-2 rounded-full bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 dark:text-[#070b14] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Education</span>
              </button>
            </div>
          )}
        </div>

        {/* Civil Service Eligibility / HGE Verified Showcase Card */}
        {eligibility && (eligibility.enabled ?? true) && (
          <div className="mb-10 rounded-2xl border border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/60 dark:hover:border-emerald-400/50 transition-all duration-300 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-[#004643] dark:bg-[#028090] text-emerald-300 dark:text-[#2dd4bf] shrink-0 shadow-md border border-emerald-500/30">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      Civil Service Commission Conferred
                    </span>
                    {eligibility.certificateNo && (
                      <span className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                        Resolution: <strong className="text-slate-700 dark:text-slate-200">{eligibility.certificateNo}</strong>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#004643] dark:text-white font-['Space_Grotesk'] tracking-tight">
                    {eligibility.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {eligibility.level} • {eligibility.lawOrBasis}
                  </p>
                </div>
              </div>

              {/* Action Buttons: View Certificate / Edit */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pt-1">
                {eligibility.certificateUrl && (
                  <button
                    type="button"
                    onClick={() => openPdfPreview(eligibility.certificateUrl || '')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 text-emerald-800 dark:text-emerald-300 font-semibold px-3.5 py-2 text-xs shadow-sm transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>View Certificate</span>
                  </button>
                )}
                {isEditMode && onEditEligibility && (
                  <button
                    type="button"
                    onClick={onEditEligibility}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold px-3.5 py-2 text-xs shadow-sm transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Eligibility</span>
                  </button>
                )}
              </div>
            </div>

            {eligibility.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                {eligibility.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 border-t border-emerald-200/60 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-slate-400 dark:text-slate-500 block">Conferred Basis</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{eligibility.honorTitle || 'Cum Laude'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-slate-400 dark:text-slate-500 block">Granting Commission</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{eligibility.issuingAgency}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-slate-400 dark:text-slate-500 block">Conferment Year</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{eligibility.dateConferred || '2025'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-[#fffffe] dark:bg-slate-900/80 hover:border-[#004643]/40 dark:hover:border-[#2dd4bf]/40 hover:-translate-y-1 hover:shadow-xl p-6 sm:p-8 space-y-4 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#028090] dark:text-[#2dd4bf] font-bold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.period}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                    {item.degree}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {item.school}
                  </p>
                </div>

                {/* Edit Controls */}
                {isEditMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditEducation(item)}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                      title="Edit Education"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEducation(item.id)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                      title="Delete Education"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Honors Badge */}
              {item.honors && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                  <Award className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{item.honors}</span>
                </div>
              )}

              {/* Location */}
              {item.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
