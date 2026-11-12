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
