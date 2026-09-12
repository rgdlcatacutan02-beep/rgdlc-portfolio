import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Save,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Eye,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PortfolioProfile, CivilServiceEligibility } from '../types';
import { defaultCivilServiceEligibility } from '../defaultData';
import { readPdfAsBase64, openPdfPreview } from '../utils/fileUtils';
import { compressAndEncodeImage } from '../utils/imageUtils';

interface EditEligibilityModalProps {
  profile: PortfolioProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: PortfolioProfile) => Promise<void>;
}

export const EditEligibilityModal: React.FC<EditEligibilityModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const initialEligibility = profile.civilServiceEligibility || defaultCivilServiceEligibility;
  const [eligibility, setEligibility] = useState<CivilServiceEligibility>(initialEligibility);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEligibility(profile.civilServiceEligibility || defaultCivilServiceEligibility);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setError('');
    setSuccessMsg('');

    try {
      if (file.type.startsWith('image/')) {
        const compressed = await compressAndEncodeImage(file, 1400, 1400, 0.85);
        setEligibility((prev) => ({ ...prev, certificateUrl: compressed }));
        setSuccessMsg(`Certificate image "${file.name}" uploaded and optimized.`);
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const parsed = await readPdfAsBase64(file, 3 * 1024 * 1024);
        setEligibility((prev) => ({ ...prev, certificateUrl: parsed.dataUrl }));
        setSuccessMsg(`Certificate PDF "${file.name}" (${parsed.fileSize}) attached.`);
      } else {
        throw new Error('Please choose a certificate image (JPG/PNG) or PDF document.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process certificate document.');
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveDoc = () => {
    setEligibility((prev) => ({ ...prev, certificateUrl: '' }));
    setSuccessMsg('Certificate document removed.');
  };

  const handleApplyPreset = () => {
    setEligibility({
      ...defaultCivilServiceEligibility,
      honorTitle: 'Cum Laude (Bachelor of Science in Computer Engineering)',
      institution: 'Pampanga State Agricultural University (PSAU)',
      dateConferred: '2025',
      certificateNo: eligibility.certificateNo || 'CSC-PD907-VERIFIED',
      enabled: true,
    });
    setSuccessMsg('Applied official Honor Graduate Eligibility (PD 907) presets.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated: PortfolioProfile = {
        ...profile,
        civilServiceEligibility: eligibility,
      };
      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save eligibility details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#070b14] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#004643] text-[#2dd4bf] border border-[#028090]/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                Civil Service Eligibility / HGE
              </h3>
              <p className="text-xs text-slate-400">
                Configure Philippine Civil Service Commission &amp; Honor Graduate Eligibility (PD 907).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Alerts */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Presets Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-[#028090]/30 bg-[#004643]/10">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="h-4 w-4 text-[#2dd4bf]" />
            <span className="text-slate-300">Fast Setup: Honor Graduate Eligibility (PD 907)</span>
          </div>
          <button
            type="button"
            onClick={handleApplyPreset}
            className="px-3 py-1 rounded-lg bg-[#004643] hover:bg-[#028090] text-white text-xs font-semibold transition-colors"
          >
            Apply PD 907 Presets
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Display Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <span className="font-semibold text-white block">Feature on Portfolio</span>
              <span className="text-slate-400 text-[11px]">
                Showcase verified Civil Service badge &amp; credential card in Academic and Credentials sections.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={eligibility.enabled ?? true}
                onChange={(e) => setEligibility({ ...eligibility, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#028090]"></div>
            </label>
          </div>

          {/* Title & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Eligibility Title</label>
              <input
                type="text"
                required
                value={eligibility.title}
                onChange={(e) => setEligibility({ ...eligibility, title: e.target.value })}
                placeholder="Honor Graduate Eligibility (HGE - PD 907)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Career Service Level</label>
              <input
                type="text"
                required
                value={eligibility.level}
                onChange={(e) => setEligibility({ ...eligibility, level: e.target.value })}
                placeholder="First & Second Level Career Service Eligibility"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Law / Legal Basis & Issuing Agency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Legal Authority / Law</label>
              <input
                type="text"
                required
                value={eligibility.lawOrBasis}
                onChange={(e) => setEligibility({ ...eligibility, lawOrBasis: e.target.value })}
                placeholder="Presidential Decree No. 907"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Issuing Commission / Body</label>
              <input
                type="text"
                required
                value={eligibility.issuingAgency}
                onChange={(e) => setEligibility({ ...eligibility, issuingAgency: e.target.value })}
                placeholder="Civil Service Commission (CSC), Philippines"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Academic Basis & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Latin Honor / Degree Basis</label>
              <input
                type="text"
                value={eligibility.honorTitle || ''}
                onChange={(e) => setEligibility({ ...eligibility, honorTitle: e.target.value })}
                placeholder="Cum Laude (BS Computer Engineering)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Institution / University</label>
              <input
                type="text"
                value={eligibility.institution || ''}
                onChange={(e) => setEligibility({ ...eligibility, institution: e.target.value })}
                placeholder="Pampanga State Agricultural University (PSAU)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Date Conferred & Registration / Board No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Year / Date Conferred</label>
              <input
                type="text"
                value={eligibility.dateConferred || ''}
                onChange={(e) => setEligibility({ ...eligibility, dateConferred: e.target.value })}
                placeholder="2025"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Certificate / Serial / Board No.</label>
              <input
                type="text"
                value={eligibility.certificateNo || ''}
                onChange={(e) => setEligibility({ ...eligibility, certificateNo: e.target.value })}
                placeholder="CSC-PD907-VERIFIED or Certificate Number"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs font-mono-code"
              />
            </div>
          </div>

          {/* Description / Scope & Privileges */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Privileges &amp; Technical Scope</label>
            <textarea
              rows={3}
              value={eligibility.description || ''}
              onChange={(e) => setEligibility({ ...eligibility, description: e.target.value })}
              placeholder="Conferred First and Second Level Eligibility pursuant to Presidential Decree No. 907..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-100 focus:border-[#2dd4bf] focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Certificate Proof Document / Verification Link */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="font-semibold text-slate-300 block">
              Official Certificate / Verification Proof (Optional)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf,application/pdf"
              className="hidden"
              onChange={handleDocumentUpload}
            />

            {eligibility.certificateUrl ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate text-xs">
                      Certificate Attached / Proof Available
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Visitors can preview or verify this credential directly.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openPdfPreview(eligibility.certificateUrl || '')}
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#2dd4bf]" />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveDoc}
                    className="p-1.5 rounded-lg border border-rose-800 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs"
                    title="Remove document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDoc}
                  className="p-3 rounded-xl border border-dashed border-slate-700 hover:border-[#2dd4bf] bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 text-[#2dd4bf]" />
                  <span>{uploadingDoc ? 'Processing...' : 'Upload Certificate (Image or PDF)'}</span>
                </button>
                <input
                  type="url"
                  placeholder="Or paste external certificate URL (https://...)"
                  value={eligibility.certificateUrl || ''}
                  onChange={(e) => setEligibility({ ...eligibility, certificateUrl: e.target.value })}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 placeholder-slate-600 focus:border-[#2dd4bf] focus:outline-none text-xs"
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#004643] hover:bg-[#028090] text-white font-bold px-5 py-2 text-xs transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5 text-emerald-300" />
              <span>{saving ? 'Saving...' : 'Save Eligibility'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
