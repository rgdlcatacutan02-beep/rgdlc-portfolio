import React from 'react';
import {
  Sparkles,
  PlusCircle,
  Briefcase,
  GraduationCap,
  Award,
  CloudUpload,
  UserCheck,
  Mail,
  LogOut,
  X,
  KeyRound,
  Cpu,
  ShieldCheck,
  FileText,
  Save,
} from 'lucide-react';

interface AdminBarProps {
  onEditProfile: () => void;
  onAddProject: () => void;
  onAddExperience: () => void;
  onAddEducation: () => void;
  onAddSeminar: () => void;
  onAddCertificate?: () => void;
  onAddSkillCategory?: () => void;
  onEditEligibility?: () => void;
  onManageCv?: () => void;
  onSeedDefaults: () => void;
  onSaveAll?: () => void;
  userEmail: string | null;
  syncing: boolean;
  onOpenMessages?: () => void;
  unreadCount?: number;
  onLogout?: () => void;
  onToggleEditMode?: () => void;
  onChangeCredentials?: () => void;
  isCloudConnected?: boolean;
  onConnectCloud?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onEditProfile,
  onAddProject,
  onAddExperience,
  onAddEducation,
  onAddSeminar,
  onAddCertificate,
  onAddSkillCategory,
  onEditEligibility,
  onManageCv,
  onSeedDefaults,
  onSaveAll,
  userEmail,
  syncing,
  onOpenMessages,
  unreadCount = 0,
  onLogout,
  onToggleEditMode,
  onChangeCredentials,
  isCloudConnected = false,
  onConnectCloud,
}) => {
  return (
    <aside
      aria-label="Editor Toolbar"
      className="sticky top-16 z-30 bg-[#004643] dark:bg-[#070b14]/95 text-white backdrop-blur-md border-b border-[#028090]/50 dark:border-slate-800 shadow-xl px-4 py-2 text-xs animate-in slide-in-from-top-2"
    >
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <span className={`flex h-2 w-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <UserCheck className="h-4 w-4 text-emerald-300" />
          <span className="text-white font-mono-code">Admin Bar</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-emerald-200 hidden sm:inline truncate max-w-[180px] font-mono-code text-[11px]">
            {userEmail}
          </span>
          {isCloudConnected ? (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono-code font-bold">
              CLOUD SYNCED
            </span>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[10px] font-mono-code font-bold">
                LOCAL MODE
              </span>
              {onConnectCloud && (
                <button
                  type="button"
                  onClick={onConnectCloud}
                  className="px-2.5 py-0.5 rounded-full bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/40 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Sign in with Google to enable live Cloud Firestore sync"
                >
                  Connect Cloud
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
            title="Edit Name, Bio, and Coordinates"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Profile</span>
          </button>

          {onChangeCredentials && (
            <button
              onClick={onChangeCredentials}
              className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 px-3 py-1 font-medium border border-amber-300/30 transition-colors"
              title="Change admin username and password"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}

          <button
            onClick={onAddProject}
            className="flex items-center gap-1 rounded-full bg-[#028090] hover:bg-[#028090]/80 text-white px-3 py-1 font-bold border border-white/20 transition-colors shadow-sm"
            title="Add a new project showcase"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Project</span>
          </button>

          <button
            onClick={onAddExperience}
            className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
            title="Add work experience"
          >
            <Briefcase className="h-3.5 w-3.5 text-sky-300" />
            <span>+ Experience</span>
          </button>

          <button
            onClick={onAddEducation}
            className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
            title="Add education entry"
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-300" />
            <span>+ Education</span>
          </button>

          <button
            onClick={onAddSeminar}
            className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
            title="Add seminar or training"
          >
            <Award className="h-3.5 w-3.5 text-purple-300" />
            <span>+ Seminar</span>
          </button>

          {onAddCertificate && (
            <button
              onClick={onAddCertificate}
              className="flex items-center gap-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 font-bold border border-amber-400/30 transition-colors shadow-sm"
              title="Add Certificate with category (HGE, Academic, IT, etc.)"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>+ Certificate</span>
            </button>
          )}

          {onAddSkillCategory && (
            <button
              onClick={onAddSkillCategory}
              className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
              title="Add skill category"
            >
              <Cpu className="h-3.5 w-3.5 text-teal-300" />
              <span>+ Skills</span>
            </button>
          )}

          {onEditEligibility && (
            <button
              onClick={onEditEligibility}
              className="flex items-center gap-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 font-semibold border border-emerald-500/30 transition-colors"
              title="Add or Edit Civil Service Eligibility / HGE (PD 907)"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>CSC / HGE</span>
            </button>
          )}

          {onManageCv && (
            <button
              onClick={onManageCv}
              className="flex items-center gap-1 rounded-full bg-[#028090]/40 hover:bg-[#028090] text-cyan-200 px-3 py-1 font-semibold border border-cyan-400/30 transition-colors"
              title="Upload, update, or change downloadable CV"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-300" />
              <span>Manage CV</span>
            </button>
          )}

          {onOpenMessages && (
            <button
              onClick={onOpenMessages}
              className="relative flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 font-medium border border-white/15 transition-colors"
              title="View received contact messages"
            >
              <Mail className="h-3.5 w-3.5 text-white" />
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f02a2d] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {onSaveAll && (
            <button
              onClick={onSaveAll}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1 font-bold border border-emerald-400/40 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Save all changes to local storage and Cloud Firestore"
            >
              <Save className="h-3.5 w-3.5 text-slate-950" />
              <span>Save Changes</span>
            </button>
          )}

          <button
            onClick={onSeedDefaults}
            disabled={syncing}
            className="flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 text-white px-3 py-1 font-medium border border-white/20 transition-colors"
            title="Populate baseline data into Firestore"
          >
            <CloudUpload className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync DB'}</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-3 py-1 font-medium border border-rose-400/30 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}

          {onToggleEditMode && (
            <button
              onClick={onToggleEditMode}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Hide Dashboard"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
