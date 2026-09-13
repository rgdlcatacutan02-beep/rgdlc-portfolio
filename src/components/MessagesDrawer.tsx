import React, { useState } from 'react';
import { X, Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { ContactMessage } from '../types';

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onDeleteMessage: (id: string) => Promise<void>;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onDeleteMessage,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteMessage(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#004643]/10 dark:bg-[#2dd4bf]/10 text-[#004643] dark:text-[#2dd4bf]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#004643] dark:text-white font-['Space_Grotesk']">
                  Visitor Messages Inbox
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-code">
                  {messages.length} inquiries received
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages list */}
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2 bg-slate-50/50 dark:bg-slate-950/50">
              <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">No contact messages yet.</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Visitor inquiries submitted via the Contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2.5 relative group hover:border-[#004643]/30 dark:hover:border-[#2dd4bf]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white text-xs">
                        <User className="h-3.5 w-3.5 text-[#028090] dark:text-[#2dd4bf]" />
                        <span>{msg.name}</span>
                      </div>
                      <a
                        href={`mailto:${encodeURIComponent(msg.email)}`}
                        className="text-[11px] text-[#028090] dark:text-[#2dd4bf] hover:underline block font-mono-code"
                      >
                        {msg.email}
                      </a>
                    </div>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition-colors rounded hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60 whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono-code pt-1">
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <a
                      href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent('Re: Inquiry on Portfolio')}&body=${encodeURIComponent(`Hi ${msg.name},\n\n`)}`}
                      className="text-[#004643] dark:text-[#2dd4bf] font-bold hover:underline"
                    >
                      Reply via Email &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
