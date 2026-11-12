import React, { useState, useEffect, useRef } from 'react';
import { X, Save, FolderGit2, Upload, Trash2, Camera, Image as ImageIcon } from 'lucide-react';
import { ProjectItem } from '../types';
import { compressAndEncodeImage } from '../utils/imageUtils';

interface EditProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectItem) => Promise<void>;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProjectItem>({
    id: `proj-${Date.now()}`,
    title: '',
    subtitle: '',
    category: 'Full-Stack Web App',
    year: '2025',
    role: '',
    description: '',
    highlights: '',
    tags: '',
    link: '',
    imageUrl: '',
    featured: 'false',
    order: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        id: `proj-${Date.now()}`,
        title: '',
        subtitle: '',
        category: 'Full-Stack Web App',
        year: `${new Date().getFullYear()}`,
        role: '',
        description: '',
        highlights: '',
        tags: '',
        link: '',
        imageUrl: '',
        featured: 'false',
        order: '',
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const compressed = await compressAndEncodeImage(file, 1200, 800, 0.82);
      setFormData((prev) => ({ ...prev, imageUrl: compressed }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process project image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      let msg = 'Failed to save project';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          msg = parsed.error || err.message;
        } catch {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              {project ? 'Edit Project' : 'Add New Project'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project Screenshot / Photo Upload Section */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
                <span>Project Photo / Screenshot</span>
              </label>
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Preview Banner */}
            {formData.imageUrl && (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
                <img
                  src={formData.imageUrl}
                  alt="Project Screenshot Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Upload & URL Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="project-image-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 text-xs transition-colors shrink-0"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{uploading ? 'Processing...' : 'Upload Image File'}</span>
              </button>
              
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Or paste image URL (e.g. Unsplash, Imgur, Cloudinary)"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Project Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Smart IoT Fire Detection System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Project Subtitle / Tagline</label>
              <input
                type="text"
                placeholder="e.g. Full-Stack Automotive Dealership Platform"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Your Role</label>
              <input
                type="text"
                placeholder="e.g. Full-Stack Developer & UI/UX Designer"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category</label>
              <input
                type="text"
                required
                placeholder="IoT & Embedded, AI & Robotics, etc."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Year / Timeframe</label>
              <input
                type="text"
                required
                placeholder="e.g. 2024 or 2025-2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Overview / Short Description</label>
            <textarea
              rows={3}
              required
              placeholder="High level description of the system or prototype..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Key Implementations & Highlights (one per line)
            </label>
            <textarea
              rows={4}
              placeholder="Integrated live camera video stream&#10;Engineered GSM SMS emergency alerts&#10;Configured sensor thresholds for smoke and heat"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Technologies / Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Tailwind CSS, Firebase, Cloud Firestore"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://your-app.vercel.app"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Demo Login Hint</label>
              <input
                type="text"
                placeholder="e.g. 1-click demo login on the sign-in page"
                value={formData.demoNote || ''}
                onChange={(e) => setFormData({ ...formData, demoNote: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="font-semibold text-slate-300">GitHub / Project Link</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Featured Tag</label>
              <select
                value={formData.featured || 'false'}
                onChange={(e) => setFormData({ ...formData, featured: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="false">Standard Tag</option>
                <option value="true">Featured Flagship</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Showcase Layout</label>
              <select
                value={formData.order === '1' ? 'spotlight' : 'standard'}
                onChange={(e) => {
                  if (e.target.value === 'spotlight') {
                    setFormData({ ...formData, order: '1', featured: 'true' });
                  } else {
                    setFormData({ ...formData, order: formData.order === '1' ? '99' : formData.order });
                  }
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="standard">Standard Grid Card</option>
                <option value="spotlight">👑 Spotlight Hero (Large)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 px-5 py-2 font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
