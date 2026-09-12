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
  Sparkles,
  Terminal,
  Maximize2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  isEditMode: boolean;
  onAddProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isEditMode,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
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

        {/* Category Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#004643] dark:bg-[#028090] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#028090]/40 hover:text-[#004643] dark:hover:text-white'
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
              const isMaster = index === 0 && selectedCategory === 'All';

              return (
                <div
                  key={project.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                    isMaster
                      ? 'border-[#004643]/40 dark:border-[#028090]/50 md:col-span-2 lg:col-span-2 shadow-md'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-[#004643]/30 dark:hover:border-[#028090]/40'
                  }`}
                >
                  <div>
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
                          {project.featured === 'true' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono-code font-bold">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
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
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#004643] dark:text-[#2dd4bf] hover:text-[#028090] dark:hover:text-white transition-colors"
                      >
                        <span>Inspect Specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>

                    {isEditMode && (
                      <div className="flex items-center gap-1.5">
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
                <div className="flex items-center gap-2 text-xs text-[#028090] dark:text-[#2dd4bf] font-mono-code font-bold">
                  <span>{activeModalProject.category}</span>
                  <span>•</span>
                  <span>{activeModalProject.year}</span>
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
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono-code text-slate-400 dark:text-slate-500">
                Regie De Leon Catacutan Portfolio
              </span>
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-1.5 rounded-full bg-[#004643] dark:bg-[#028090] text-white text-xs font-bold hover:bg-[#028090] transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
