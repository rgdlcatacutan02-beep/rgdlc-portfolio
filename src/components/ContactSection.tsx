import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Printer,
  Terminal,
  ArrowUpRight,
  Download,
  Eye,
  FileText,
  Edit2,
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { submitContactMessage } from '../services/portfolioService';
import { isEmailForwardingConfigured, sendContactEmail } from '../services/emailService';
import { triggerPdfDownload, openPdfPreview } from '../utils/fileUtils';

interface ContactSectionProps {
  profile: PortfolioProfile;
  isEditMode?: boolean;
  onManageCv?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  isEditMode,
  onManageCv,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [botField, setBotField] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check: automated bot trap
    if (botField.trim().length > 0) {
      // Silently pretend success to deceive the bot without executing any database writes
      setSubmitted(true);
      return;
    }

    // Cooldown check (60-second client-side throttle)
    const lastSentStr = sessionStorage.getItem('rg_portfolio_msg_last');
    if (lastSentStr) {
      const elapsed = Date.now() - parseInt(lastSentStr, 10);
      if (elapsed < 60000) {
        const remainingSec = Math.ceil((60000 - elapsed) / 1000);
        setErrorMessage(`Please wait ${remainingSec}s before sending another message.`);
        return;
      }
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter a valid name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (trimmedMessage.length < 10) {
      setErrorMessage('Please enter a descriptive message (at least 10 characters).');
      return;
    }

    if (trimmedMessage.length > 2000) {
      setErrorMessage('Message is too long (maximum 2,000 characters).');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      // Email to Gmail and the Firestore backup run in parallel; the message
      // counts as delivered if either one succeeds.
      const deliveries: Promise<void>[] = [
        submitContactMessage({
          id: messageId,
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          createdAt: new Date().toISOString(),
        }),
      ];
      if (isEmailForwardingConfigured()) {
        deliveries.push(sendContactEmail({ name: trimmedName, email: trimmedEmail, message: trimmedMessage }));
      }
      const results = await Promise.allSettled(deliveries);
      results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .forEach((r) => console.error('Contact delivery failed:', r.reason));
      if (!results.some((r) => r.status === 'fulfilled')) {
        throw new Error('All contact delivery channels failed.');
      }
      sessionStorage.setItem('rg_portfolio_msg_last', Date.now().toString());
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      console.error('Failed to submit message:', err);
      setErrorMessage(`Could not send your message right now. Please email me directly at ${profile.email}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/50 dark:bg-[#070b14]/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow Badge */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
            <span>// 08 . GET IN TOUCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
            Connect &amp; Collaborate
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Interested in full-time engineering roles, network infrastructure projects, or technical consulting? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                  Send me a message
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  It goes straight to my Gmail. I usually reply within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-6 text-center space-y-3 animate-in fade-in duration-300">
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Message sent!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                    Thanks for reaching out. I'll reply to the email address you provided.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 underline hover:text-emerald-950 dark:hover:text-emerald-200"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Automated bot trap: invisible to genuine users */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input
                      type="text"
                      name="company_fax"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about the role or project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004643] dark:focus:border-[#2dd4bf] focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 dark:text-[#070b14] text-white font-bold px-8 py-3 text-sm shadow-md shadow-[#004643]/20 dark:shadow-[#2dd4bf]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Direct Info Cards + Download Resume Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Coordinates Card */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                Direct Contact Channels
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                {/* Email */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-[#028090]/50 dark:hover:border-[#2dd4bf]/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                        Email
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-[#004643] dark:text-[#2dd4bf] font-mono-code font-semibold truncate block hover:underline"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.email, 'email')}
                    className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-[#004643] dark:hover:text-[#2dd4bf] rounded-lg shrink-0 transition-colors"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-[#028090]/50 dark:hover:border-[#2dd4bf]/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                        Phone / Mobile
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-[#004643] dark:text-[#2dd4bf] font-mono-code font-semibold block hover:underline"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.phone, 'phone')}
                    className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-[#004643] dark:hover:text-[#2dd4bf] rounded-lg shrink-0 transition-colors"
                    title="Copy Phone"
                  >
                    {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-[#028090]/50 dark:hover:border-[#2dd4bf]/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
                  <div className="p-2 rounded-lg bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Current Location
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed block mt-0.5">
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download & Preview Curriculum Vitae Card */}
            <div className="rounded-2xl border border-[#004643]/30 dark:border-slate-800 bg-gradient-to-br from-[#004643]/5 via-white to-[#028090]/5 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-800/40 p-6 shadow-sm hover:shadow-md hover:border-[#004643]/50 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                    Official Curriculum Vitae
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Verified document detailing computer engineering qualifications, Latin honors, project highlights, and technical toolsets.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#004643] dark:bg-[#2dd4bf] text-white dark:text-[#070b14] shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerPdfDownload(profile.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf', profile.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004643] hover:bg-[#028090] dark:bg-[#2dd4bf] dark:hover:bg-[#2dd4bf]/90 text-white dark:text-[#070b14] font-bold py-2.5 px-3 text-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer"
                  title="Download active CV PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => openPdfPreview(profile.cvUrl || '/Regie_De_Leon_Catacutan_CV.pdf')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-3 text-xs hover:shadow-md hover:-translate-y-0.5 hover:border-[#028090] transition-all duration-200 text-center cursor-pointer"
                  title="Preview CV in browser"
                >
                  <Eye className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                  <span>Preview</span>
                </button>
              </div>

              {isEditMode && onManageCv && (
                <button
                  type="button"
                  onClick={onManageCv}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold py-2 text-xs transition-colors shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update / Change CV File</span>
                </button>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Civil Service Eligible (PD 907)</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500 font-mono-code truncate max-w-[140px]" title={profile.cvFileName || 'Regie_De_Leon_Catacutan_CV.pdf'}>
                  {profile.cvFileSize || '304 KB'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
