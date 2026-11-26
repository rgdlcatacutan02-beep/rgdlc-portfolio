export interface CivilServiceEligibility {
  title: string;
  lawOrBasis: string;
  level: string;
  honorTitle?: string;
  institution?: string;
  dateConferred?: string;
  certificateNo?: string;
  issuingAgency: string;
  certificateUrl?: string;
  description?: string;
  enabled?: boolean;
}

export interface PortfolioProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  photoUrl?: string;
  cvUrl?: string;
  cvFileName?: string;
  cvFileSize?: string;
  cvUpdatedAt?: string;
  civilServiceEligibility?: CivilServiceEligibility;
  github?: string;
  linkedin?: string;
  upwork?: string;
  jobstreet?: string;
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  year: string;
  role?: string;
  description: string;
  highlights: string; // newline separated points
  tags: string; // comma-separated
  featured?: string; // 'true' | 'false'
  link?: string;
  demoUrl?: string; // live deployment URL
  demoNote?: string; // e.g. demo login hint shown in the project modal
  imageUrl?: string;
  order?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  responsibilities: string; // newline separated points or text
  tools: string; // comma-separated or summary
  order?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
  honors?: string;
  location?: string;
  order?: string;
}

export interface SeminarItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  order?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
  order?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  category: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  featured?: boolean;
  order?: string;
}

/**
 * A video in the Video Editing portfolio.
 * `types` drives the filter tabs, so a short UGC ad can be tagged
 * ['Short-form', 'UGC', 'Ad'] and show up under each of those tabs.
 */
export interface VideoItem {
  id: string;
  title: string;
  types: string[]; // values from VIDEO_TYPES (custom values are allowed and get their own tab)
  description: string; // what I did: cuts, captions, motion graphics, color, sound
  tools?: string[];
  videoUrl: string; // /videos/x.mp4 (served from public/), a YouTube link, or a Google Drive link
  posterUrl?: string; // thumbnail shown before playing
  aspect: '9:16' | '16:9' | '1:1' | '4:5';
  duration?: string; // e.g. "0:45"
  client?: string; // shown only if set
  featured?: boolean;
  order?: string;
}
