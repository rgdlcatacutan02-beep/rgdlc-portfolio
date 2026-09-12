import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Plus, Tag } from 'lucide-react';
import { SkillCategory } from '../types';

interface EditSkillCategoryModalProps {
  category: SkillCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: SkillCategory) => Promise<void>;
}

export const EditSkillCategoryModal: React.FC<EditSkillCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [order, setOrder] = useState('1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setTitle(category.title || '');
      setSkills(Array.isArray(category.skills) ? [...category.skills] : []);
      setOrder(category.order || '1');
    } else {
      setTitle('');
      setSkills([]);
      setOrder('1');
    }
    setNewSkillInput('');
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    // Support comma-separated batch adding if user pastes multiple
    if (trimmed.includes(',')) {
      const splitItems = trimmed
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !skills.includes(s));
      setSkills((prev) => [...prev, ...splitItems]);
    } else if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a category title.');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one skill to this category.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload: SkillCategory = {
        id: category?.id || `skill-${Date.now()}`,
        title: title.trim(),
        skills: skills,
        order: order || '99',
      };
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save skill category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              {category ? 'Edit Skill Category' : 'Add Skill Category'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Category Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Category Title <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud & DevOps, Web Development, Programming Languages"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Display Sequence Order (1, 2, 3...)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-28 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Add Skills Input */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>Skills / Technologies in this Category <span className="text-cyan-400">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">Press Enter or comma to add</span>
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Docker, Kubernetes, AWS (or comma separated)"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition-colors shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Tags List */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">
              Current Skills ({skills.length}):
            </div>
            {skills.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-slate-500 text-xs">
                No skills added yet. Type a skill name above and click "Add" or press Enter.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-xl border border-slate-800/80 bg-slate-950/60">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200"
                  >
                    <Tag className="h-3 w-3 text-cyan-400" />
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
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
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 px-5 py-2 font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
