import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, Upload, Trash2, Camera, Image as ImageIcon, ShieldCheck, FileText } from 'lucide-react';
import { PortfolioProfile } from '../types';
import { compressAndEncodeImage } from '../utils/imageUtils';

interface EditProfileModalProps {
  profile: PortfolioProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: PortfolioProfile) => Promise<void>;
  onOpenManageCv?: () => void;
  onOpenEditEligibility?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
  onOpenManageCv,
  onOpenEditEligibility,
}) => {
  const [formData, setFormData] = useState<PortfolioProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setError('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const compressed = await compressAndEncodeImage(file, 800, 800, 0.82);
      setFormData((prev) => ({ ...prev, photoUrl: compressed }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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
            <User className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              Edit Portfolio Profile
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

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Profile Photo Upload Section */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span>Profile Photo</span>
              </label>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900 shrink-0 shadow-lg shadow-cyan-500/10 flex items-center justify-center">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Profile Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <User className="h-8 w-8 text-slate-600" />
                    <span className="text-[9px] uppercase tracking-wider font-bold mt-1 text-slate-500">No Photo</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                    Optimizing...
                  </div>
                )}
              </div>

              {/* Upload & URL Controls */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="profile-photo-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <span className="text-[11px] text-slate-500">JPG, PNG, WebP (auto-optimized)</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Or paste an online Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Professional Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Address / Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* CV & Online Presence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">CV Download URL</label>
              <input
                type="text"
                placeholder="/Regie_De_Leon_Catacutan_CV.pdf"
                value={formData.cvUrl || ''}
                onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Shortcuts to CV and CSC Eligibility Manager */}
          {(onOpenManageCv || onOpenEditEligibility) && (
            <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-[11px] font-mono-code text-slate-400">Quick Credentials Config:</span>
              {onOpenManageCv && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManageCv();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload / Manage CV File</span>
                </button>
              )}
              {onOpenEditEligibility && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEditEligibility();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Civil Service / HGE Details</span>
                </button>
              )}
            </div>
          )}

          {/* Summary / Bio */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Profile Bio / Summary</label>
            <textarea
              rows={4}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
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
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
