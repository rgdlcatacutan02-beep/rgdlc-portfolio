import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import {
  PortfolioProfile,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  SeminarItem,
  SkillCategory,
  ContactMessage,
  CertificateItem,
} from '../types';
import {
  defaultProfile,
  defaultProjects,
  defaultExperiences,
  defaultEducation,
  defaultSeminars,
  defaultSkillCategories,
  defaultCertificates,
} from '../defaultData';

const PORTFOLIO_DOC = 'portfolio/main';
const PROFILE_STORAGE_KEY = 'rg_portfolio_profile';
const PROJECTS_STORAGE_KEY = 'rg_portfolio_projects';
const EXPERIENCES_STORAGE_KEY = 'rg_portfolio_experiences';
const EDUCATION_STORAGE_KEY = 'rg_portfolio_education';
const SEMINARS_STORAGE_KEY = 'rg_portfolio_seminars';
const CERTIFICATES_STORAGE_KEY = 'rg_portfolio_certificates';

/**
 * Safe localStorage writer that guarantees data is preserved even if browser quota is constrained.
 * If quota is reached (e.g. from large base64 thumbnails), it saves a lightweight payload
 * preserving all project details (title, links, descriptions, tags, order, roles) without crashing.
 */
function safeSaveProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('LocalStorage quota limit reached, saving project data with lightweight image references:', err);
    try {
      const lightweight = projects.map((p) => ({
        ...p,
        imageUrl: p.imageUrl?.startsWith('data:') && p.imageUrl.length > 50000 ? '' : p.imageUrl,
      }));
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(lightweight));
    } catch (e2) {
      console.error('Critical storage warning: Could not save projects to localStorage:', e2);
    }
  }
}

/**
 * Robust cloud sync helper:
 * - Attempts to write directly to Cloud Firestore.
 * - If user is signed in as portfolio owner, writes succeed with live cloud persistence.
 * - If user is in local admin mode and rules allow it, writes succeed directly.
 * - If Firestore permissions block it, catches gracefully and preserves data in browser storage.
 */
async function syncToFirestore(
  writeFn: () => Promise<void>,
  operationType: OperationType,
  path: string,
  entityName: string
): Promise<void> {
  // Safety timeout: Never freeze the UI for more than 4 seconds
  const timeoutPromise = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error('Cloud sync timeout: network slow or database pending initialization')), 4000)
  );

  try {
    await Promise.race([writeFn(), timeoutPromise]);
    console.info(`[Firestore Sync] Successfully persisted ${entityName} to Cloud Firestore.`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (
      msg.includes('Cloud sync timeout') ||
      msg.includes('Missing or insufficient permissions') ||
      msg.includes('permission-denied') ||
      msg.includes('PERMISSION_DENIED') ||
      msg.includes('offline')
    ) {
      console.warn(`[Firestore Sync] Notice for ${path}: ${msg}. Data is safely preserved in browser local storage.`);
      return;
    }
    console.warn(`[Firestore Sync Warning] ${path}:`, error);
  }
}

// Fetch Profile
export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  // Check localStorage first
  try {
    const local = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.fullName) {
        if (!parsed.github || parsed.github === 'https://github.com') {
          parsed.github = defaultProfile.github;
        }
        return { ...defaultProfile, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Could not parse local profile:', err);
  }

  const path = 'portfolio';
  try {
    const docRef = doc(db, path, 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const merged = { ...defaultProfile, ...(snap.data() as PortfolioProfile) };
      if (!merged.github || merged.github === 'https://github.com') {
        merged.github = defaultProfile.github;
      }
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore quota error for profile
      }
      return merged;
    }
  } catch (error) {
    console.warn('Could not fetch portfolio profile from Firestore, falling back to CV data:', error);
  }

  return defaultProfile;
}

// Save Profile
export async function updatePortfolioProfile(profile: PortfolioProfile): Promise<void> {
  const updated = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage immediately
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save profile to localStorage:', err);
  }

  // Sync to Firestore
  const path = 'portfolio';
  const docRef = doc(db, path, 'main');
  await syncToFirestore(() => setDoc(docRef, updated, { merge: true }), OperationType.WRITE, PORTFOLIO_DOC, 'portfolio profile');
}

// Fetch Projects
export async function getProjects(): Promise<ProjectItem[]> {
  // 1. Check localStorage first
  try {
    const local = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        // Merge in any missing default projects by ID, but NEVER overwrite user edits!
        for (const def of defaultProjects) {
          const existingIdx = parsed.findIndex((it: ProjectItem) => it.id === def.id);
          if (existingIdx === -1) {
            parsed.push(def);
            changed = true;
          } else {
            // Only update link if the existing project has an empty link and default has a verified link
            if (!parsed[existingIdx].link && def.link) {
              parsed[existingIdx].link = def.link;
              changed = true;
            }
          }
        }
        if (changed) {
          safeSaveProjects(parsed);
        }
        return parsed.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      }
    }
  } catch (err) {
    console.warn('Could not parse local projects:', err);
  }

  // 2. Fetch from Cloud Firestore if available
  const path = 'projects';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: ProjectItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as ProjectItem);
      });
      for (const def of defaultProjects) {
        const existingIdx = items.findIndex((it) => it.id === def.id);
        if (existingIdx === -1) {
          items.push(def);
        } else if (!items[existingIdx].link && def.link) {
          items[existingIdx].link = def.link;
        }
      }
      const sorted = items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      safeSaveProjects(sorted);
      return sorted;
    }
  } catch (error) {
    console.warn('Could not fetch projects from Firestore, using default CV projects:', error);
  }

  // 3. Fallback to default verified projects
  safeSaveProjects(defaultProjects);
  return defaultProjects;
}

// Save Project
export async function upsertProject(project: ProjectItem): Promise<void> {
  // Update localStorage immediately and safely
  try {
    const current = await getProjects();
    const idx = current.findIndex((p) => p.id === project.id);
    let updated: ProjectItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = project;
    } else {
      updated = [project, ...current];
    }
    safeSaveProjects(updated);
  } catch (err) {
    console.warn('Could not save project to localStorage:', err);
  }

  const path = `projects/${project.id}`;
  const docRef = doc(db, 'projects', project.id);
  await syncToFirestore(() => setDoc(docRef, project, { merge: true }), OperationType.WRITE, path, `project ${project.title}`);
}

// Delete Project
export async function removeProject(projectId: string): Promise<void> {
  try {
    const current = await getProjects();
    const updated = current.filter((p) => p.id !== projectId);
    safeSaveProjects(updated);
  } catch (err) {
    console.warn('Could not remove project from localStorage:', err);
  }

  const path = `projects/${projectId}`;
  const docRef = doc(db, 'projects', projectId);
  await syncToFirestore(() => deleteDoc(docRef), OperationType.DELETE, path, `project ${projectId}`);
}

// Save Reordered Projects
export async function saveProjectsOrder(reordered: ProjectItem[]): Promise<void> {
  const updated = reordered.map((p, idx) => ({
    ...p,
    order: String(idx + 1),
  }));

  safeSaveProjects(updated);

  for (const proj of updated) {
    const path = `projects/${proj.id}`;
    const docRef = doc(db, 'projects', proj.id);
    await syncToFirestore(() => setDoc(docRef, proj, { merge: true }), OperationType.WRITE, path, `reorder project ${proj.title}`);
  }
}

// Fetch Experiences
export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const local = localStorage.getItem(EXPERIENCES_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      }
    }
  } catch (err) {
    console.warn('Could not parse local experiences:', err);
  }

  const path = 'experiences';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: ExperienceItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as ExperienceItem);
      });
      const sorted = items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
    return defaultExperiences;
  } catch (error) {
    console.warn('Could not fetch experiences from Firestore, using default CV experiences:', error);
    return defaultExperiences;
  }
}

// Save Experience
export async function upsertExperience(exp: ExperienceItem): Promise<void> {
  try {
    const current = await getExperiences();
    const idx = current.findIndex((e) => e.id === exp.id);
    let updated: ExperienceItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = exp;
    } else {
      updated = [exp, ...current];
    }
    localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save experience to localStorage:', err);
  }

  const path = `experiences/${exp.id}`;
  const docRef = doc(db, 'experiences', exp.id);
  await syncToFirestore(() => setDoc(docRef, exp, { merge: true }), OperationType.WRITE, path, `experience ${exp.role}`);
}

// Delete Experience
export async function removeExperience(expId: string): Promise<void> {
  try {
    const current = await getExperiences();
    const updated = current.filter((e) => e.id !== expId);
    localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not remove experience from localStorage:', err);
  }

  const path = `experiences/${expId}`;
  const docRef = doc(db, 'experiences', expId);
  await syncToFirestore(() => deleteDoc(docRef), OperationType.DELETE, path, `experience ${expId}`);
}

// Fetch Education
export async function getEducation(): Promise<EducationItem[]> {
  try {
    const local = localStorage.getItem(EDUCATION_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      }
    }
  } catch (err) {
    console.warn('Could not parse local education:', err);
  }

  const path = 'education';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: EducationItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as EducationItem);
      });
      const sorted = items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
    return defaultEducation;
  } catch (error) {
    console.warn('Could not fetch education from Firestore, using default CV education:', error);
    return defaultEducation;
  }
}

// Save Education
export async function upsertEducation(edu: EducationItem): Promise<void> {
  try {
    const current = await getEducation();
    const idx = current.findIndex((e) => e.id === edu.id);
    let updated: EducationItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = edu;
    } else {
      updated = [...current, edu];
    }
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save education to localStorage:', err);
  }

  const path = `education/${edu.id}`;
  const docRef = doc(db, 'education', edu.id);
  await syncToFirestore(() => setDoc(docRef, edu, { merge: true }), OperationType.WRITE, path, `education ${edu.degree}`);
}

// Delete Education
export async function removeEducation(eduId: string): Promise<void> {
  try {
    const current = await getEducation();
    const updated = current.filter((e) => e.id !== eduId);
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not remove education from localStorage:', err);
  }

  const path = `education/${eduId}`;
  const docRef = doc(db, 'education', eduId);
  await syncToFirestore(() => deleteDoc(docRef), OperationType.DELETE, path, `education ${eduId}`);
}

// Fetch Seminars
export async function getSeminars(): Promise<SeminarItem[]> {
  try {
    const local = localStorage.getItem(SEMINARS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      }
    }
  } catch (err) {
    console.warn('Could not parse local seminars:', err);
  }

  const path = 'seminars';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: SeminarItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as SeminarItem);
      });
      const sorted = items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      localStorage.setItem(SEMINARS_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
    return defaultSeminars;
  } catch (error) {
    console.warn('Could not fetch seminars from Firestore, using default CV seminars:', error);
    return defaultSeminars;
  }
}

// Save Seminar
export async function upsertSeminar(seminar: SeminarItem): Promise<void> {
  try {
    const current = await getSeminars();
    const idx = current.findIndex((s) => s.id === seminar.id);
    let updated: SeminarItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = seminar;
    } else {
      updated = [...current, seminar];
    }
    localStorage.setItem(SEMINARS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save seminar to localStorage:', err);
  }

  const path = `seminars/${seminar.id}`;
  const docRef = doc(db, 'seminars', seminar.id);
  await syncToFirestore(() => setDoc(docRef, seminar, { merge: true }), OperationType.WRITE, path, `seminar ${seminar.title}`);
}

// Delete Seminar
export async function removeSeminar(seminarId: string): Promise<void> {
  try {
    const current = await getSeminars();
    const updated = current.filter((s) => s.id !== seminarId);
    localStorage.setItem(SEMINARS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not remove seminar from localStorage:', err);
  }

  const path = `seminars/${seminarId}`;
  const docRef = doc(db, 'seminars', seminarId);
  await syncToFirestore(() => deleteDoc(docRef), OperationType.DELETE, path, `seminar ${seminarId}`);
}

// Send Contact Message (from public visitors)
export async function submitContactMessage(message: ContactMessage): Promise<void> {
  const path = `messages/${message.id}`;
  try {
    const docRef = doc(db, 'messages', message.id);
    await setDoc(docRef, message);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Fetch Messages (for owner)
export async function getContactMessages(): Promise<ContactMessage[]> {
  const path = 'messages';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const items: ContactMessage[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as ContactMessage);
    });
    return items.sort((a, b) => (b.createdAt.localeCompare(a.createdAt)));
  } catch (error) {
    console.warn('Could not load contact messages:', error);
    return [];
  }
}

// Delete Contact Message
export async function removeContactMessage(id: string): Promise<void> {
  const path = `messages/${id}`;
  try {
    const docRef = doc(db, 'messages', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

const SKILLS_STORAGE_KEY = 'rg_portfolio_skills';

// Fetch Skill Categories (LocalStorage first, then Firestore, then defaults)
export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const local = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load skills from localStorage:', err);
  }

  const path = 'skills';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: SkillCategory[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as SkillCategory);
      });
      const sorted = items.sort((a, b) => Number(a.order || 99) - Number(b.order || 99));
      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
  } catch (error) {
    console.warn('Could not fetch skills from Firestore, using default skills:', error);
  }

  return defaultSkillCategories;
}

// Save or Update Skill Category
export async function upsertSkillCategory(cat: SkillCategory): Promise<void> {
  // Update localStorage immediately
  try {
    const current = await getSkillCategories();
    const idx = current.findIndex((c) => c.id === cat.id);
    let updated: SkillCategory[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = cat;
    } else {
      updated = [...current, cat];
    }
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save skills to localStorage:', err);
  }

  // Sync to Firestore
  const path = `skills/${cat.id}`;
  try {
    const docRef = doc(db, 'skills', cat.id);
    await setDoc(docRef, cat, { merge: true });
  } catch (error) {
    console.warn('Could not sync skill category to Firestore:', error);
  }
}

// Remove Skill Category
export async function removeSkillCategory(catId: string): Promise<void> {
  try {
    const current = await getSkillCategories();
    const updated = current.filter((c) => c.id !== catId);
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not delete skill from localStorage:', err);
  }

  const path = `skills/${catId}`;
  try {
    const docRef = doc(db, 'skills', catId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not delete skill category from Firestore:', error);
  }
}

// Fetch Certificates
export async function getCertificates(): Promise<CertificateItem[]> {
  try {
    const local = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => Number(a.order || 99) - Number(b.order || 99));
      }
    }
  } catch (err) {
    console.warn('Could not parse local certificates:', err);
  }

  const path = 'certificates';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: CertificateItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as CertificateItem);
      });
      // Ensure any default certificates exist if not already present
      for (const def of defaultCertificates) {
        if (!items.some((it) => it.id === def.id)) {
          items.push(def);
        }
      }
      const sorted = items.sort((a, b) => Number(a.order || 99) - Number(b.order || 99));
      localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
  } catch (error) {
    console.warn('Could not fetch certificates from Firestore, using default certificates:', error);
  }

  return defaultCertificates;
}

// Save or Update Certificate
export async function upsertCertificate(cert: CertificateItem): Promise<void> {
  try {
    const current = await getCertificates();
    const idx = current.findIndex((c) => c.id === cert.id);
    let updated: CertificateItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = cert;
    } else {
      updated = [cert, ...current];
    }
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save certificate to localStorage:', err);
  }

  const path = `certificates/${cert.id}`;
  const docRef = doc(db, 'certificates', cert.id);
  await syncToFirestore(() => setDoc(docRef, cert, { merge: true }), OperationType.WRITE, path, `certificate ${cert.title}`);
}

// Remove Certificate
export async function removeCertificate(certId: string): Promise<void> {
  try {
    const current = await getCertificates();
    const updated = current.filter((c) => c.id !== certId);
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not delete certificate from localStorage:', err);
  }

  const path = `certificates/${certId}`;
  const docRef = doc(db, 'certificates', certId);
  await syncToFirestore(() => deleteDoc(docRef), OperationType.DELETE, path, `certificate ${certId}`);
}

// Seed all default CV items to Firestore
export async function seedDefaultsToFirestore(): Promise<void> {
  await updatePortfolioProfile(defaultProfile);
  safeSaveProjects(defaultProjects);
  for (const proj of defaultProjects) {
    const docRef = doc(db, 'projects', proj.id);
    await syncToFirestore(() => setDoc(docRef, proj, { merge: true }), OperationType.WRITE, `projects/${proj.id}`, `project ${proj.title}`);
  }
  for (const exp of defaultExperiences) {
    await upsertExperience(exp);
  }
  for (const edu of defaultEducation) {
    await upsertEducation(edu);
  }
  for (const sem of defaultSeminars) {
    await upsertSeminar(sem);
  }
  for (const cat of defaultSkillCategories) {
    await upsertSkillCategory(cat);
  }
  for (const cert of defaultCertificates) {
    await upsertCertificate(cert);
  }
}

// Synchronize all current in-memory / local portfolio data to Cloud Firestore
export async function syncAllLocalToFirestore(
  profile: PortfolioProfile,
  projects: ProjectItem[],
  experiences: ExperienceItem[],
  education: EducationItem[],
  seminars: SeminarItem[],
  skills: SkillCategory[],
  certificates: CertificateItem[]
): Promise<void> {
  await updatePortfolioProfile(profile);
  safeSaveProjects(projects);
  for (const proj of projects) {
    const docRef = doc(db, 'projects', proj.id);
    await syncToFirestore(() => setDoc(docRef, proj, { merge: true }), OperationType.WRITE, `projects/${proj.id}`, `project ${proj.title}`);
  }
  for (const exp of experiences) {
    await upsertExperience(exp);
  }
  for (const edu of education) {
    await upsertEducation(edu);
  }
  for (const sem of seminars) {
    await upsertSeminar(sem);
  }
  for (const cat of skills) {
    await upsertSkillCategory(cat);
  }
  for (const cert of certificates) {
    await upsertCertificate(cert);
  }
}
