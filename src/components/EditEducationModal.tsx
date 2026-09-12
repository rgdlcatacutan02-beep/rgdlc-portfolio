import React, { useState, useEffect } from 'react';
import { X, Save, GraduationCap } from 'lucide-react';
import { EducationItem } from '../types';

interface EditEducationModalProps {
  education: EducationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (edu: EducationItem) => Promise<void>;
}

export const EditEducationModal: React.FC<EditEducationModalProps> = ({
  education,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<EducationItem>({
    id: `edu-${Date.now()}`,
    school: '',
    degree: '',
    period: '2021 - 2025',
    honors: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        id: `edu-${Date.now()}`,
        school: '',
        degree: '',
        period: '',
        honors: '',
        location: '',
      });
    }
  }, [education, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              {education ? 'Edit Education' : 'Add Academic Background'}
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
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Degree / Program</label>
            <input
              type="text"
              required
              placeholder="e.g. Bachelor of Science in Computer Engineering"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">School / University</label>
            <input
              type="text"
              required
              placeholder="e.g. Pampanga State Agricultural University"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Years Attended</label>
              <input
                type="text"
                required
                placeholder="e.g. 2021 - 2025"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Location</label>
              <input
                type="text"
                placeholder="e.g. Magalang, Pampanga"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Honors & Awards</label>
            <input
              type="text"
              placeholder="e.g. Cum Laude, Presidential Award for Pioneer Graduates"
              value={formData.honors || ''}
              onChange={(e) => setFormData({ ...formData, honors: e.target.value })}
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
              <span>{saving ? 'Saving...' : 'Save Education'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
