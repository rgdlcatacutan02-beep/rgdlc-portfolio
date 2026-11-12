import React, { useState } from 'react';
import {
  FolderGit2,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  Search,
  CheckCircle,
  X,
  Terminal,
  Maximize2,
  Layers,
  ArrowUpRight,
  Github,
  Crown,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { sanitizeUrl } from '../utils/fileUtils';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  isEditMode: boolean;
  onAddProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
  onReorderProjects?: (newProjects: ProjectItem[]) => void;
  onSetSpotlightProject?: (projectId: string) => void;
  onSaveOrder?: () => Promise<void>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isEditMode,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onReorderProjects,
  onSetSpotlightProject,
  onSaveOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent, id: string) => {
    if (dragOverId === id) {
      setDragOverId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceId = draggedId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      return;
    }

    const sourceIndex = projects.findIndex((p) => p.id === sourceId);
    const targetIndex = projects.findIndex((p) => p.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    const updated = [...projects];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setDraggedId(null);
    if (onReorderProjects) {
      onReorderProjects(updated);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleMoveProject = (sourceIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? sourceIndex - 1 : sourceIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    if (onReorderProjects) {
      onReorderProjects(updated);
    }
  };

  // Manual save state
  const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);
  const [justSavedOrder, setJustSavedOrder] = useState<boolean>(false);

  const handleManualSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      if (onSaveOrder) {
        await onSaveOrder();
      } else if (onReorderProjects) {
        await onReorderProjects(projects);
      }
      setJustSavedOrder(true);
      setTimeout(() => setJustSavedOrder(false), 3500);
    } catch (err) {
      console.error('Failed to save project order manually:', err);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-slate-50/50 dark:bg-[#070b14] border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header with Eyebrow Badge & Admin Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>// 02 . FEATURED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
              Engineered Projects &amp; Software Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Production-ready platforms, automotive dealership systems, IoT telemetry, AI companions, and network setups.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={onAddProject}
              className="inline-flex items-center gap-2 rounded-full bg-[#004643] dark:bg-[#028090] hover:bg-[#028090] text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>

        {/* Reordering Admin Guidance & Save Order Button */}
        {isEditMode && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-[#028090]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 shadow-inner">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Showcase Spotlight &amp; Drag-and-Drop Positioning Active</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono-code font-bold">READY</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                  The <strong>1st project</strong> in the portfolio is automatically showcased as the <strong>Large Spotlight Card</strong> (2-column banner).
                  Drag any card using its <span className="font-mono-code text-[11px] font-bold">⠿ grip handle</span>, click <strong className="text-amber-600 dark:text-amber-400">&quot;👑 Set as Spotlight&quot;</strong>, or click <strong>&quot;Save Order&quot;</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              {selectedCategory !== 'All' ? (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all text-xs shadow"
                >
                  Switch to &quot;All&quot; to Drag &amp; Reorder
                </button>
              ) : (
                <button
                  onClick={handleManualSaveOrder}
                  disabled={isSavingOrder}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                  title="Save current project order to storage and cloud"
                >
                  {justSavedOrder ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                      <span>Order Saved to Cloud!</span>
                    </>
                  ) : isSavingOrder ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Order...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>Save Order</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#004643] dark:bg-[#028090] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#028090]/40 hover:text-[#004643] dark:hover:text-white hover:-translate-y-0.5 hover:shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#028090] focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-900">
            No projects found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const highlightsList = project.highlights
                ? project.highlights.split('\n').filter((h) => h.trim().length > 0)
                : [];
              const tagsList = project.tags
                ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : [];
              const globalIndex = projects.findIndex((p) => p.id === project.id);
              const isMaster = index === 0 && selectedCategory === 'All';
              const isDragging = draggedId === project.id;
              const isOver = dragOverId === project.id && !isDragging;

              return (
                <div
                  key={project.id}
                  draggable={isEditMode && selectedCategory === 'All'}
                  onDragStart={(e) => handleDragStart(e, project.id)}
                  onDragOver={(e) => handleDragOver(e, project.id)}
                  onDragLeave={(e) => handleDragLeave(e, project.id)}
                  onDrop={(e) => handleDrop(e, project.id)}
                  onDragEnd={handleDragEnd}
                  className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm hover:shadow-xl ${
                    isDragging
                      ? 'opacity-40 scale-[0.98] border-dashed border-cyan-500 ring-2 ring-cyan-500/50'
                      : ''
                  } ${
                    isOver
                      ? 'ring-2 ring-[#028090] dark:ring-[#2dd4bf] border-[#028090] scale-[1.01] bg-teal-500/5'
                      : ''
                  } ${
                    isMaster
                      ? 'border-[#004643]/40 dark:border-[#028090]/50 md:col-span-2 lg:col-span-2 shadow-md hover:-translate-y-1'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#028090]/40 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Admin Drag & Spotlight Toolbar */}
                    {isEditMode && (
                      <div
                        className={`px-4 py-2 border-b flex items-center justify-between text-xs transition-colors select-none ${
                          isMaster
                            ? 'bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-[#028090]/15 border-amber-500/30 dark:border-amber-500/20 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedCategory === 'All' && (
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                              title="Click and drag to reposition project"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                          )}
                          {isMaster ? (
                            <span className="inline-flex items-center gap-1.5 font-bold font-mono-code text-[11px] text-amber-700 dark:text-amber-300">
                              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>PRIMARY SPOTLIGHT (LARGE HERO CARD)</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSetSpotlightProject?.(project.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
                              title="Promote to position #1 (Featured as the Large Showcase Card)"
                            >
                              <Crown className="w-3.5 h-3.5 text-amber-500" />
                              <span>Set as Spotlight</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 font-mono-code text-[11px] text-slate-400 dark:text-slate-500">
                          <span>Pos #{globalIndex + 1}</span>
                        </div>
                      </div>
                    )}

                    {/* Project Banner / Thumbnail */}
                    {project.imageUrl ? (
                      <div
                        onClick={() => setActiveModalProject(project)}
                        className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer ${
                          isMaster ? 'h-56 sm:h-72' : 'h-48'
                        }`}
                      >
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[#004643] dark:text-[#2dd4bf] text-xs font-bold shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Preview Details</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-2 bg-gradient-to-r from-[#004643] via-[#028090] to-emerald-400" />
                    )}

                    <div className="p-6 space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-[11px] font-mono-code font-bold">
                            {project.category}
                          </span>
                          {isMaster && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-600/70 text-amber-800 dark:text-amber-300 text-[10px] font-mono-code font-bold shadow-sm">
                              <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              SPOTLIGHT HERO
                            </span>
                          )}
                          {project.featured === 'true' && !isMaster && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono-code font-bold">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono-code text-slate-400 dark:text-slate-500">
                          {project.year}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk'] group-hover:text-[#028090] dark:group-hover:text-[#2dd4bf] transition-colors">
                          {project.title}
                        </h3>
                        {project.subtitle && (
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            {project.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Tags */}
                      {tagsList.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {tagsList.slice(0, isMaster ? 8 : 5).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-mono-code"
                            >
                              {tag}
                            </span>
                          ))}
                          {tagsList.length > (isMaster ? 8 : 5) && (
                            <span className="text-[10px] font-mono-code text-slate-400 dark:text-slate-500">
                              +{tagsList.length - (isMaster ? 8 : 5)} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Links & Admin Actions */}
                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#004643] dark:text-[#2dd4bf] hover:text-[#028090] dark:hover:text-white hover:translate-x-0.5 transition-all duration-200"
                      >
                        <span>Inspect Specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {project.demoUrl && (
                        <a
                          href={sanitizeUrl(project.demoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#004643] dark:bg-[#028090] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#028090] dark:hover:bg-[#2dd4bf] dark:hover:text-[#070b14] hover:-translate-y-0.5 transition-all duration-200 ml-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {project.link && (
                        <a
                          href={sanitizeUrl(project.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5 transition-all duration-200 ml-2"
                        >
                          {project.link.includes('github.com') ? (
                            <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                          ) : (
                            <ExternalLink className="w-3.5 h-3.5" />
                          )}
                          <span>{project.link.includes('github.com') ? 'GitHub' : 'Demo'}</span>
                        </a>
                      )}
                    </div>

                    {isEditMode && (
                      <div className="flex items-center gap-1">
                        {selectedCategory === 'All' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIndex, 'left')}
                              disabled={globalIndex === 0}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                              title="Move Earlier (Up in Order)"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIndex, 'right')}
                              disabled={globalIndex === projects.length - 1}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                              title="Move Later (Down in Order)"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onEditProject(project)}
                          className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors text-xs"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors text-xs"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* macOS Style High-Res Project Inspection Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Window Header with Red/Yellow/Green Dots and ESC Badge */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] text-slate-200 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f02a2d]" />
                <span className="w-3 h-3 rounded-full bg-[#eab308]" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-xs font-mono-code text-slate-300 ml-2 font-bold">
                  {activeModalProject.title}.spec
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono-code text-slate-400 border border-slate-700">
                  ESC to close
                </span>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {activeModalProject.imageUrl && (
                <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 max-h-72">
                  <img
                    src={activeModalProject.imageUrl}
                    alt={activeModalProject.title}
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#028090] dark:text-[#2dd4bf] font-mono-code font-bold flex-wrap">
                  <span>{activeModalProject.category}</span>
                  <span>•</span>
                  <span>{activeModalProject.year}</span>
                  {activeModalProject.role && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500 dark:text-slate-400">{activeModalProject.role}</span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                  {activeModalProject.title}
                </h3>
                {activeModalProject.subtitle && (
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {activeModalProject.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Project Description
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeModalProject.description}
                </p>
              </div>

              {/* Highlights */}
              {activeModalProject.highlights && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Core Engineering Highlights
                  </h4>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-4 space-y-2">
                    {activeModalProject.highlights
                      .split('\n')
                      .filter((h) => h.trim().length > 0)
                      .map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf] mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tech Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Technologies Utilized
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md bg-[#004643]/5 dark:bg-[#028090]/20 border border-[#004643]/20 dark:border-[#028090]/30 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 gap-3 flex-wrap">
              <span className="text-xs font-mono-code text-slate-400 dark:text-slate-500">
                {activeModalProject.demoNote || 'Regie De Leon Catacutan Portfolio'}
              </span>
              <div className="flex items-center gap-2">
                {activeModalProject.demoUrl && (
                  <a
                    href={sanitizeUrl(activeModalProject.demoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#004643] dark:bg-[#028090] hover:bg-[#028090] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
                {activeModalProject.link && (
                  <a
                    href={sanitizeUrl(activeModalProject.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shadow-sm"
                  >
                    {activeModalProject.link.includes('github.com') ? (
                      <Github className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    <span>{activeModalProject.link.includes('github.com') ? 'View on GitHub' : 'Live Demo'}</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-1.5 rounded-full bg-[#004643] dark:bg-[#028090] text-white text-xs font-bold hover:bg-[#028090] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
