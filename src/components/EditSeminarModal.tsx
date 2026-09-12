import React, { useState, useEffect } from 'react';
import { X, Save, Award } from 'lucide-react';
import { SeminarItem } from '../types';

interface EditSeminarModalProps {
  seminar: SeminarItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sem: SeminarItem) => Promise<void>;
}

export const EditSeminarModal: React.FC<EditSeminarModalProps> = ({
  seminar,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SeminarItem>({
    id: `sem-${Date.now()}`,
    title: '',
    date: 'May 08, 2025',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (seminar) {
      setFormData(seminar);
    } else {
      setFormData({
        id: `sem-${Date.now()}`,
        title: '',
        date: '',
        description: '',
      });
    }
  }, [seminar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save seminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              {seminar ? 'Edit Seminar' : 'Add Seminar & Certification'}
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
            <label className="font-semibold text-slate-300">Seminar / Workshop Title</label>
            <input
              type="text"
              required
              placeholder="e.g. HTML, CSS, JavaScript Web Development"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Date Attended</label>
            <input
              type="text"
              required
              placeholder="e.g. May 08, 2025"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Details & Focus Areas (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Key skills learned, modules covered..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <span>{saving ? 'Saving...' : 'Save Seminar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
