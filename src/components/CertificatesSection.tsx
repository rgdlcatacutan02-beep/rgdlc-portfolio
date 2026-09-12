import React, { useState, useMemo } from 'react';
import {
  Award,
  ShieldCheck,
  GraduationCap,
  Cpu,
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  Eye,
  ExternalLink,
  Terminal,
  Filter,
  CheckCircle2,
  Building,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { CertificateItem } from '../types';
import { defaultCertificateCategories } from '../defaultData';
import { openPdfPreview } from '../utils/fileUtils';

interface CertificatesSectionProps {
  certificates: CertificateItem[];
  isEditMode: boolean;
  onAddCertificate: (initialCategory?: string) => void;
  onEditCertificate: (cert: CertificateItem) => void;
  onDeleteCertificate: (certId: string) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  isEditMode,
  onAddCertificate,
  onEditCertificate,
  onDeleteCertificate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Compute all unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    // include defaults
    defaultCertificateCategories.forEach((c) => set.add(c));
    // include any categories from existing certificates
    certificates.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [certificates]);

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return certificates;
    }
    return certificates.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [certificates, selectedCategory]);

  // Count per category
  const getCategoryCount = (catName: string) => {
    if (catName === 'ALL') return certificates.length;
    return certificates.filter((c) => c.category.toLowerCase() === catName.toLowerCase()).length;
  };

  // Helper for category styling
  const getCategoryTheme = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('civil service') || lower.includes('hge') || lower.includes('government')) {
      return {
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
        iconBg: 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300',
        borderColor: 'hover:border-emerald-500/50',
        icon: ShieldCheck,
      };
    }
    if (lower.includes('academic') || lower.includes('honor') || lower.includes('award') || lower.includes('degree')) {
      return {
        badgeBg: 'bg-amber-500/10 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-500/30',
        iconBg: 'bg-amber-500 text-slate-950 dark:bg-amber-500/20 dark:text-amber-300',
        borderColor: 'hover:border-amber-500/50',
        icon: GraduationCap,
      };
    }
    if (lower.includes('technical') || lower.includes('it') || lower.includes('developer') || lower.includes('engineer')) {
      return {
        badgeBg: 'bg-cyan-500/10 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border-cyan-500/30',
        iconBg: 'bg-[#028090] text-white dark:bg-[#028090]/30 dark:text-[#2dd4bf]',
        borderColor: 'hover:border-[#028090]/50',
        icon: Cpu,
      };
    }
    // Default / Custom category
    return {
      badgeBg: 'bg-purple-500/10 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-500/30',
      iconBg: 'bg-purple-600 text-white dark:bg-purple-500/20 dark:text-purple-300',
      borderColor: 'hover:border-purple-500/50',
      icon: Award,
    };
  };

  return (
    <section id="certificates" className="py-20 bg-slate-50/70 dark:bg-[#070b14]/70 border-b border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 05 . VERIFIED CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Certificates &amp; Category Credentials
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Civil Service Eligibility (Honor Graduate Eligibility - PD 907), academic honors, IT engineering certifications, and verified credentials.
            </p>
          </div>

          {isEditMode && (
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => onAddCertificate(selectedCategory !== 'ALL' ? selectedCategory : undefined)}
                className="inline-flex items-center gap-2 rounded-full bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 dark:text-[#070b14] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Certificate</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filters Bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2 pb-2">
          <span className="text-xs font-mono-code text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </span>

          {/* "ALL" pill */}
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#004643] text-white dark:bg-[#2dd4bf] dark:text-[#070b14] shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#2dd4bf]/40'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-code ${
                selectedCategory === 'ALL'
                  ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#070b14]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {certificates.length}
            </span>
          </button>

          {/* Dynamic Category Pills */}
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#004643] text-white dark:bg-[#2dd4bf] dark:text-[#070b14] shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#2dd4bf]/40'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-code ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#070b14]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Quick Add Custom Category button in Edit Mode */}
          {isEditMode && (
            <button
              onClick={() => onAddCertificate('__custom__')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-[#028090]/50 dark:border-[#2dd4bf]/50 text-[#028090] dark:text-[#2dd4bf] hover:bg-[#028090]/10 transition-colors"
              title="Add a new category"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ New Category</span>
            </button>
          )}
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => {
              const theme = getCategoryTheme(cert.category);
              const CategoryIcon = theme.icon;

              return (
                <div
                  key={cert.id}
                  className={`rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-6 sm:p-7 space-y-4 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between relative group ${theme.borderColor}`}
                >
                  {/* Card Top: Category badge & Edit/Delete actions */}
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono-code font-bold ${theme.badgeBg}`}
                        >
                          <CategoryIcon className="h-3 w-3" />
                          <span>{cert.category}</span>
                        </span>

                        {cert.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono-code font-bold text-amber-700 dark:text-amber-300">
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      {/* Admin Controls */}
                      {isEditMode && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onEditCertificate(cert)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCertificate(cert.id)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-lg font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] leading-snug tracking-tight">
                      {cert.title}
                    </h3>

                    {/* Issuing Organization */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Building className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf] shrink-0" />
                      <span className="truncate">{cert.issuingOrganization}</span>
                    </div>

                    {/* Date and Validity */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Issued: <strong>{cert.issueDate}</strong></span>
                      </span>
                      {cert.expirationDate && (
                        <span className="text-slate-400">
                          • {cert.expirationDate}
                        </span>
                      )}
                    </div>

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <div className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/80 truncate">
                        ID: <strong className="text-slate-700 dark:text-slate-200">{cert.credentialId}</strong>
                      </div>
                    )}

                    {/* Description / Competencies */}
                    {cert.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: View Document proof button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    {cert.credentialUrl ? (
                      <button
                        type="button"
                        onClick={() => openPdfPreview(cert.credentialUrl || '')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#028090]/30 hover:border-[#028090] bg-[#028090]/10 hover:bg-[#028090] text-[#028090] hover:text-white dark:text-[#2dd4bf] dark:hover:text-[#070b14] dark:hover:bg-[#2dd4bf] font-semibold px-3.5 py-1.5 text-xs shadow-sm transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Document / Proof</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Officially Conferred &amp; Verified</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono-code text-slate-400 uppercase">
                      Order #{cert.order || '1'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3 bg-white/50 dark:bg-slate-900/30">
            <Award className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No certificates in category "{selectedCategory}"
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can switch category filters or click below to add a certificate in this category.
            </p>
            {isEditMode && (
              <button
                onClick={() => onAddCertificate(selectedCategory !== 'ALL' ? selectedCategory : undefined)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] text-white dark:text-[#070b14] font-bold px-4 py-2 text-xs transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Certificate to {selectedCategory}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
