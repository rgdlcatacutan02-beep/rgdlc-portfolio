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
import { db, OperationType, handleFirestoreError } from '../firebase';
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
const CERTIFICATES_STORAGE_KEY = 'rg_portfolio_certificates';

// Fetch Profile
export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  // Check localStorage first
  try {
    const local = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.fullName) {
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
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
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
  try {
    const docRef = doc(db, path, 'main');
    await setDoc(docRef, updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PORTFOLIO_DOC);
  }
}

// Fetch Projects
export async function getProjects(): Promise<ProjectItem[]> {
  // Check localStorage first
  try {
    const local = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      }
    }
  } catch (err) {
    console.warn('Could not parse local projects:', err);
  }

  const path = 'projects';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: ProjectItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as ProjectItem);
      });
      // Ensure any newly added default projects are merged in
      for (const def of defaultProjects) {
        if (!items.some((it) => it.id === def.id)) {
          items.push(def);
        }
      }
      const sorted = items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
  } catch (error) {
    console.warn('Could not fetch projects from Firestore, using default CV projects:', error);
  }

  return defaultProjects;
}

// Save Project
export async function upsertProject(project: ProjectItem): Promise<void> {
  // Update localStorage immediately
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
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save project to localStorage:', err);
  }

  const path = `projects/${project.id}`;
  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Project
export async function removeProject(projectId: string): Promise<void> {
  try {
    const current = await getProjects();
    const updated = current.filter((p) => p.id !== projectId);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not remove project from localStorage:', err);
  }

  const path = `projects/${projectId}`;
  try {
    const docRef = doc(db, 'projects', projectId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch Experiences
export async function getExperiences(): Promise<ExperienceItem[]> {
  const path = 'experiences';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: ExperienceItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as ExperienceItem);
      });
      return items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
    }
    return defaultExperiences;
  } catch (error) {
    console.warn('Could not fetch experiences from Firestore, using default CV experiences:', error);
    return defaultExperiences;
  }
}

// Save Experience
export async function upsertExperience(exp: ExperienceItem): Promise<void> {
  const path = `experiences/${exp.id}`;
  try {
    const docRef = doc(db, 'experiences', exp.id);
    await setDoc(docRef, exp, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Experience
export async function removeExperience(expId: string): Promise<void> {
  const path = `experiences/${expId}`;
  try {
    const docRef = doc(db, 'experiences', expId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch Education
export async function getEducation(): Promise<EducationItem[]> {
  const path = 'education';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: EducationItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as EducationItem);
      });
      return items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
    }
    return defaultEducation;
  } catch (error) {
    console.warn('Could not fetch education from Firestore, using default CV education:', error);
    return defaultEducation;
  }
}

// Save Education
export async function upsertEducation(edu: EducationItem): Promise<void> {
  const path = `education/${edu.id}`;
  try {
    const docRef = doc(db, 'education', edu.id);
    await setDoc(docRef, edu, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Education
export async function removeEducation(eduId: string): Promise<void> {
  const path = `education/${eduId}`;
  try {
    const docRef = doc(db, 'education', eduId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch Seminars
export async function getSeminars(): Promise<SeminarItem[]> {
  const path = 'seminars';
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: SeminarItem[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as SeminarItem);
      });
      return items.sort((a, b) => (Number(a.order || 99) - Number(b.order || 99)));
    }
    return defaultSeminars;
  } catch (error) {
    console.warn('Could not fetch seminars from Firestore, using default CV seminars:', error);
    return defaultSeminars;
  }
}

// Save Seminar
export async function upsertSeminar(seminar: SeminarItem): Promise<void> {
  const path = `seminars/${seminar.id}`;
  try {
    const docRef = doc(db, 'seminars', seminar.id);
    await setDoc(docRef, seminar, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Seminar
export async function removeSeminar(seminarId: string): Promise<void> {
  const path = `seminars/${seminarId}`;
  try {
    const docRef = doc(db, 'seminars', seminarId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
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
  try {
    const docRef = doc(db, 'certificates', cert.id);
    await setDoc(docRef, cert, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
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
  try {
    const docRef = doc(db, 'certificates', certId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Seed all default CV items to Firestore
export async function seedDefaultsToFirestore(): Promise<void> {
  await updatePortfolioProfile(defaultProfile);
  for (const proj of defaultProjects) {
    await upsertProject(proj);
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
