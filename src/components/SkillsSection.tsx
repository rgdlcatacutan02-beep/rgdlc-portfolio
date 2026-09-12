import React, { useState } from 'react';
import {
  Code,
  Cpu,
  Server,
  Wrench,
  Palette,
  Lightbulb,
  Globe,
  PlusCircle,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Terminal,
  Layers,
} from 'lucide-react';
import { SkillCategory } from '../types';
import { defaultSkillCategories } from '../defaultData';

export interface SkillsSectionProps {
  categories?: SkillCategory[];
  isEditMode?: boolean;
  onAddCategory?: () => void;
  onEditCategory?: (category: SkillCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onDeleteSkillTag?: (categoryId: string, skillIndex: number) => void;
  onAddSkillTag?: (categoryId: string, newSkill: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories = defaultSkillCategories,
  isEditMode = false,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onDeleteSkillTag,
  onAddSkillTag,
}) => {
  const [quickAddCatId, setQuickAddCatId] = useState<string | null>(null);
  const [quickAddValue, setQuickAddValue] = useState<string>('');

  const iconMap: Record<string, React.ReactNode> = {
    'Web & Full-Stack Development': <Globe className="h-4 w-4 text-[#004643]" />,
    'Programming Languages': <Code className="h-4 w-4 text-[#028090]" />,
    'Hardware & IoT': <Cpu className="h-4 w-4 text-emerald-700" />,
    'Network & Systems': <Server className="h-4 w-4 text-[#004643]" />,
    'Software & Engineering Tools': <Wrench className="h-4 w-4 text-amber-600" />,
    'Creative & Core Strengths': <Palette className="h-4 w-4 text-rose-600" />,
    'Core Strengths': <Lightbulb className="h-4 w-4 text-purple-700" />,
  };

  const handleQuickAddSubmit = (catId: string) => {
    const trimmed = quickAddValue.trim();
    if (trimmed && onAddSkillTag) {
      onAddSkillTag(catId, trimmed);
    }
    setQuickAddValue('');
    setQuickAddCatId(null);
  };

  return (
    <section id="skills" className="py-20 bg-white dark:bg-[#070b14] border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 04 . TECHNICAL EXPERTISE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Skills &amp; Competencies
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Specialized domain skills spanning network administration, embedded IoT devices, modern web frameworks, and system support.
            </p>
          </div>

          {isEditMode && onAddCategory && (
            <button
              onClick={onAddCategory}
              className="inline-flex items-center gap-2 rounded-full bg-[#004643] dark:bg-[#028090] hover:bg-[#028090] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all self-start md:self-auto shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Skill Category</span>
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.title}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#fffffe] dark:bg-slate-900/60 p-6 space-y-4 hover:border-[#004643]/40 dark:hover:border-[#028090]/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-[#004643]/5 dark:bg-[#004643]/30 shrink-0 border border-[#004643]/10 dark:border-[#004643]/30">
                      {iconMap[cat.title] || <Layers className="h-4 w-4 text-[#004643] dark:text-[#2dd4bf]" />}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] truncate">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Admin Edit & Delete */}
                  {isEditMode && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onEditCategory && (
                        <button
                          onClick={() => onEditCategory(cat)}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs hover:bg-amber-100 transition-colors"
                          title={`Edit ${cat.title}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDeleteCategory && (
                        <button
                          onClick={() => onDeleteCategory(cat.id || cat.title)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300 text-xs hover:bg-rose-100 transition-colors"
                          title={`Delete ${cat.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Skills Tag Pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:border-[#004643]/40 dark:hover:border-[#028090]/50 hover:bg-[#004643]/5 dark:hover:bg-[#028090]/15 hover:text-[#004643] dark:hover:text-[#2dd4bf] text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 font-mono-code font-medium transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#028090] dark:bg-[#2dd4bf]" />
                      <span>{skill}</span>
                      {isEditMode && onDeleteSkillTag && (
                        <button
                          type="button"
                          onClick={() => onDeleteSkillTag(cat.id || cat.title, idx)}
                          className="text-slate-400 hover:text-rose-600 ml-0.5"
                          title={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {/* Quick Add Tag in Edit Mode */}
                  {isEditMode && onAddSkillTag && (
                    <>
                      {quickAddCatId === (cat.id || cat.title) ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            autoFocus
                            placeholder="Skill name..."
                            value={quickAddValue}
                            onChange={(e) => setQuickAddValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleQuickAddSubmit(cat.id || cat.title);
                              } else if (e.key === 'Escape') {
                                setQuickAddCatId(null);
                                setQuickAddValue('');
                              }
                            }}
                            className="w-28 rounded-md border border-[#004643] dark:border-[#028090] bg-white dark:bg-slate-950 px-2 py-1 text-xs text-slate-800 dark:text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAddSubmit(cat.id || cat.title)}
                            className="p-1 rounded bg-[#004643] dark:bg-[#028090] text-white hover:bg-[#028090]"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAddCatId(null);
                              setQuickAddValue('');
                            }}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddCatId(cat.id || cat.title);
                            setQuickAddValue('');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:border-[#004643] dark:hover:border-[#028090] hover:text-[#004643] dark:hover:text-[#2dd4bf] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono-code text-slate-400 dark:text-slate-500">
                {cat.skills.length} competencies listed
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
