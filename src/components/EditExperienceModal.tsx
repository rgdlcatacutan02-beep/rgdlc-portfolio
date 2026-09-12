import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { ExperienceItem } from '../types';

interface EditExperienceModalProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (exp: ExperienceItem) => Promise<void>;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExperienceItem>({
    id: `exp-${Date.now()}`,
    role: '',
    company: '',
    period: '2026 - Present',
    responsibilities: '',
    tools: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        id: `exp-${Date.now()}`,
        role: '',
        company: '',
        period: `${new Date().getFullYear()} - Present`,
        responsibilities: '',
        tools: '',
      });
    }
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              {experience ? 'Edit Work Experience' : 'Add Work Experience'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Job Title / Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Network Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Company / Organization</label>
              <input
                type="text"
                required
                placeholder="e.g. 3Core LeadersTech"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Employment Period</label>
            <input
              type="text"
              required
              placeholder="e.g. 2026 - Present or 2025 - 2026"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Responsibilities & Key Duties (one per line)
            </label>
            <textarea
              rows={5}
              required
              placeholder="Maintained and monitored network infrastructure&#10;Monitored server availability and performance&#10;Provided workstation and troubleshooting support"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Tools & Technologies (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Remote support tools, Ticketing systems, Network diagnostics"
              value={formData.tools}
              onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-slate-300 hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2 font-bold text-slate-950"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Experience'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
