import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  FileText,
  Upload,
  Download,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { readPdfAsBase64, triggerPdfDownload, openPdfPreview, formatBytes } from '../utils/fileUtils';

interface ManageCvModalProps {
  profile: PortfolioProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: PortfolioProfile) => Promise<void>;
}

export const ManageCvModal: React.FC<ManageCvModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [cvUrl, setCvUrl] = useState(profile.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf');
  const [cvFileName, setCvFileName] = useState(profile.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf');
  const [cvFileSize, setCvFileSize] = useState(profile.cvFileSize || '304 KB');
  const [cvUpdatedAt, setCvUpdatedAt] = useState(profile.cvUpdatedAt || new Date().toISOString());
  
  const [readingFile, setReadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCvUrl(profile.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf');
      setCvFileName(profile.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf');
      setCvFileSize(profile.cvFileSize || '304 KB');
      setCvUpdatedAt(profile.cvUpdatedAt || new Date().toISOString());
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setReadingFile(true);
    setError('');
    setSuccessMsg('');
    try {
      const parsed = await readPdfAsBase64(file);
      setCvUrl(parsed.dataUrl);
      setCvFileName(parsed.fileName);
      setCvFileSize(parsed.fileSize);
      setCvUpdatedAt(new Date().toISOString());
      setSuccessMsg(`"${file.name}" loaded successfully (${parsed.fileSize}). Click "Save Changes" to apply.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to read the PDF file.');
    } finally {
      setReadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleResetToDefault = () => {
    setCvUrl('/Regie_De_Leon_Catacutan_CV.pdf');
    setCvFileName('Regie_De_Leon_Catacutan_CV.pdf');
    setCvFileSize('304 KB');
    setCvUpdatedAt(new Date().toISOString());
    setSuccessMsg('Reset to the original default CV (304 KB).');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated: PortfolioProfile = {
        ...profile,
        cvUrl,
        cvFileName,
        cvFileSize,
        cvUpdatedAt,
      };
      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save updated CV.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#070b14] p-6 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004643] text-[#2dd4bf] border border-[#028090]/40">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                Manage Downloadable CV
              </h3>
              <p className="text-xs text-slate-400">
                Update or upload the official Curriculum Vitae PDF for portfolio visitors.
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

        {/* Feedback Alerts */}
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

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Active CV Card Display */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
                Active Document Status
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live on Portfolio
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-5 w-5 text-[#2dd4bf] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-xs">
                    {cvFileName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Size: <span className="text-slate-300 font-mono-code">{cvFileSize}</span> • Last Updated: <span className="text-slate-300 font-mono-code">{new Date(cvUpdatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              {/* Quick Test Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openPdfPreview(cvUrl)}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition-colors"
                  title="Preview active PDF"
                >
                  <Eye className="h-3.5 w-3.5 text-[#2dd4bf]" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerPdfDownload(cvUrl, cvFileName)}
                  className="p-1.5 rounded-lg bg-[#004643] hover:bg-[#028090] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Test download file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Test</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 block">
              Upload New PDF from Device
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragOver
                  ? 'border-[#2dd4bf] bg-[#2dd4bf]/5 text-[#2dd4bf]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70 text-slate-400'
              }`}
            >
              <div className="p-3 rounded-full bg-[#004643]/30 text-[#2dd4bf] border border-[#028090]/40">
                <Upload className={`h-6 w-6 ${readingFile ? 'animate-bounce' : ''}`} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-200 text-xs sm:text-sm">
                  {readingFile ? 'Reading and encoding PDF file...' : 'Click to select or drag and drop a PDF file'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Standard format (.pdf up to 4MB). Fits directly in your portfolio cloud database.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative URL & File Name Options */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-[#2dd4bf]" />
                <span>Or Specify CV Path / External Download URL:</span>
              </label>
              <input
                type="text"
                value={cvUrl.startsWith('data:') ? '(Uploaded Base64 Document Encoded)' : cvUrl}
                onChange={(e) => {
                  setCvUrl(e.target.value);
                  setCvUpdatedAt(new Date().toISOString());
                }}
                disabled={cvUrl.startsWith('data:')}
                placeholder="/Regie_De_Leon_Catacutan_CV.pdf or https://..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 placeholder-slate-600 focus:border-[#2dd4bf] focus:outline-none font-mono-code text-[11px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Download File Name</label>
                <input
                  type="text"
                  required
                  value={cvFileName}
                  onChange={(e) => setCvFileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-[#2dd4bf] focus:outline-none text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">File Size Display Tag</label>
                <input
                  type="text"
                  value={cvFileSize}
                  onChange={(e) => setCvFileSize(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-[#2dd4bf] focus:outline-none text-xs font-mono-code"
                />
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-300 text-xs transition-colors py-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore Default CV</span>
            </button>
          </div>

          {/* Modal Actions */}
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
              disabled={saving || readingFile}
              className="inline-flex items-center gap-2 rounded-xl bg-[#004643] hover:bg-[#028090] text-white font-bold px-5 py-2 text-xs transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
