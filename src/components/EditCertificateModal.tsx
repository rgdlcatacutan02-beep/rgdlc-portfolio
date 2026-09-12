import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Award,
  UploadCloud,
  FileText,
  Eye,
  Trash2,
  Tag,
  Plus,
  ShieldCheck,
  Calendar,
  Building,
  Hash,
} from 'lucide-react';
import { CertificateItem } from '../types';
import { defaultCertificateCategories } from '../defaultData';
import { readPdfAsBase64, openPdfPreview } from '../utils/fileUtils';

interface EditCertificateModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: CertificateItem) => Promise<void>;
  existingCategories?: string[];
}

export const EditCertificateModal: React.FC<EditCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onSave,
  existingCategories = [],
}) => {
  // Merge categories
  const allCategories = Array.from(
    new Set([...defaultCertificateCategories, ...existingCategories])
  );

  const [formData, setFormData] = useState<CertificateItem>({
    id: `cert-${Date.now()}`,
    title: '',
    category: allCategories[0] || 'Civil Service & Government (HGE)',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: 'Lifetime / Does not expire',
    credentialId: '',
    credentialUrl: '',
    description: '',
    featured: false,
    order: '1',
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (certificate) {
      setFormData(certificate);
      const isKnown = allCategories.includes(certificate.category);
      if (!isKnown && certificate.category) {
        setIsCustomCategory(true);
        setCustomCategoryInput(certificate.category);
      } else {
        setIsCustomCategory(false);
        setCustomCategoryInput('');
      }
      if (certificate.credentialUrl) {
        setFileMeta({
          name: certificate.credentialUrl.startsWith('data:') ? 'Attached Document' : certificate.credentialUrl,
          size: '',
        });
      } else {
        setFileMeta(null);
      }
    } else {
      setFormData({
        id: `cert-${Date.now()}`,
        title: '',
        category: allCategories[0] || 'Civil Service & Government (HGE)',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: 'Lifetime / Does not expire',
        credentialId: '',
        credentialUrl: '',
        description: '',
        featured: false,
        order: '1',
      });
      setIsCustomCategory(false);
      setCustomCategoryInput('');
      setFileMeta(null);
    }
  }, [certificate, isOpen]);

  if (!isOpen) return null;

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: customCategoryInput || '' });
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: val });
    }
  };

  const handleCustomCategoryBlur = () => {
    if (customCategoryInput.trim()) {
      setFormData({ ...formData, category: customCategoryInput.trim() });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setError('');
      const base64Data = await readPdfAsBase64(file);
      setFormData((prev) => ({ ...prev, credentialUrl: base64Data }));
      setFileMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, credentialUrl: '' }));
    setFileMeta(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const finalCategory = isCustomCategory
      ? customCategoryInput.trim()
      : formData.category.trim();

    if (!finalCategory) {
      setError('Please provide a valid category for this certificate.');
      setSaving(false);
      return;
    }

    try {
      await onSave({
        ...formData,
        category: finalCategory,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#004643]/30 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                {certificate ? 'Edit Certificate / Credential' : 'Add Certificate / Credential'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organize by category (Civil Service / HGE, Academic, IT / Technical, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Certificate Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
              <span>Certificate / Credential Title *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Honor Graduate Eligibility (HGE - PD 907) or AWS Certified Cloud Practitioner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
            />
          </div>

          {/* Category Selector & Custom Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                  <span>Category *</span>
                </span>
                {!isCustomCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(true);
                      setFormData({ ...formData, category: customCategoryInput });
                    }}
                    className="text-[11px] font-semibold text-[#028090] dark:text-[#2dd4bf] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Category</span>
                  </button>
                )}
              </label>

              {!isCustomCategory ? (
                <select
                  value={formData.category}
                  onChange={handleCategorySelectChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none cursor-pointer"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Add Custom Category...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professional Licenses, Cloud & DevOps..."
                    value={customCategoryInput}
                    onChange={(e) => {
                      setCustomCategoryInput(e.target.value);
                      setFormData({ ...formData, category: e.target.value });
                    }}
                    onBlur={handleCustomCategoryBlur}
                    className="flex-1 rounded-xl border border-[#028090] dark:border-[#2dd4bf] bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setFormData({ ...formData, category: allCategories[0] });
                    }}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Select from existing categories"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Issuing Organization */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Issuing Organization *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Civil Service Commission (CSC), PSAU, Cisco, DICT"
                value={formData.issuingOrganization}
                onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
              />
            </div>
          </div>

          {/* Issue Date & Expiration Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Issue Date *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2025 or May 08, 2025"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">
                Expiration / Validity (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Lifetime / Permanent / No Expiration"
                value={formData.expirationDate || ''}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
              />
            </div>
          </div>

          {/* Credential ID / Registration No. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Credential ID / Resolution No. (optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CSC-PD907-VERIFIED or License #12345"
                value={formData.credentialId || ''}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.order || '1'}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
              />
            </div>
          </div>

          {/* File Upload / Document Attachment */}
          <div className="space-y-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <UploadCloud className="h-4 w-4 text-[#028090] dark:text-[#2dd4bf]" />
                <span>Certificate Document / Proof (PDF or Image)</span>
              </label>
              <span className="text-[11px] text-slate-500">Max 5MB (PDF/JPG/PNG)</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/png,image/jpeg,image/webp"
              className="hidden"
            />

            {formData.credentialUrl ? (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="truncate text-xs">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block truncate">
                      {fileMeta?.name || 'Certificate File Attached'}
                    </span>
                    {fileMeta?.size && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        {fileMeta.size}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openPdfPreview(formData.credentialUrl || '')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove attached file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#028090] dark:hover:border-[#2dd4bf] rounded-xl cursor-pointer bg-white dark:bg-slate-900/50 transition-colors text-center"
              >
                <UploadCloud className="h-7 w-7 text-slate-400 dark:text-slate-500 mb-1.5" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {uploading ? 'Reading file...' : 'Click to browse and upload certificate file'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Attach official PDF certificate or certificate image scan
                </span>
              </div>
            )}
          </div>

          {/* Description & Competencies Verified */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Description / Competencies Verified (optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Conferred First and Second Level Eligibility pursuant to PD 907 by virtue of graduating Cum Laude with a BS in Computer Engineering..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-slate-900 dark:text-slate-100 focus:border-[#028090] dark:focus:border-[#2dd4bf] focus:outline-none"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="cert-featured"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-[#004643] focus:ring-[#004643] cursor-pointer"
            />
            <label htmlFor="cert-featured" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              Mark as <strong>Featured Credential</strong> (shows prominent badge &amp; highlight on portfolio)
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 dark:text-[#070b14] text-white font-bold px-5 py-2 shadow-md transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Certificate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
