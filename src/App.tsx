/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  isAuthorizedOwner,
  AUTHORIZED_OWNER_EMAIL,
  User,
} from './firebase';
import {
  PortfolioProfile,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  SeminarItem,
  SkillCategory,
  ContactMessage,
  CertificateItem,
} from './types';
import {
  defaultProfile,
  defaultProjects,
  defaultExperiences,
  defaultEducation,
  defaultSeminars,
  defaultSkillCategories,
  defaultCertificates,
} from './defaultData';
import {
  getPortfolioProfile,
  updatePortfolioProfile,
  getProjects,
  upsertProject,
  removeProject,
  getExperiences,
  upsertExperience,
  removeExperience,
  getEducation,
  upsertEducation,
  removeEducation,
  getSeminars,
  upsertSeminar,
  removeSeminar,
  getSkillCategories,
  upsertSkillCategory,
  removeSkillCategory,
  getCertificates,
  upsertCertificate,
  removeCertificate,
  getContactMessages,
  removeContactMessage,
  saveProjectsOrder,
  seedDefaultsToFirestore,
  syncAllLocalToFirestore,
} from './services/portfolioService';

import { Navbar } from './components/Navbar';
import { SkillsBanner } from './components/SkillsBanner';
import { AdminBar } from './components/AdminBar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { SeminarsSection } from './components/SeminarsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { LoginModal } from './components/LoginModal';
import { EditProfileModal } from './components/EditProfileModal';
import { EditProjectModal } from './components/EditProjectModal';
import { EditExperienceModal } from './components/EditExperienceModal';
import { EditEducationModal } from './components/EditEducationModal';
import { EditSeminarModal } from './components/EditSeminarModal';
import { EditSkillCategoryModal } from './components/EditSkillCategoryModal';
import { EditCertificateModal } from './components/EditCertificateModal';
import { ManageCvModal } from './components/ManageCvModal';
import { EditEligibilityModal } from './components/EditEligibilityModal';
import { MessagesDrawer } from './components/MessagesDrawer';

export default function App() {
  // Data state
  const [profile, setProfile] = useState<PortfolioProfile>(defaultProfile);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences);
  const [education, setEducation] = useState<EducationItem[]>(defaultEducation);
  const [seminars, setSeminars] = useState<SeminarItem[]>(defaultSeminars);
  const [skills, setSkills] = useState<SkillCategory[]>(defaultSkillCategories);
  const [certificates, setCertificates] = useState<CertificateItem[]>(defaultCertificates);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Auth & UI state (Strictly Google Cloud Authentication)
  const [user, setUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isManageCvOpen, setIsManageCvOpen] = useState(false);
  const [isEditEligibilityOpen, setIsEditEligibilityOpen] = useState(false);
  
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);

  const [isEditEducationOpen, setIsEditEducationOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<EducationItem | null>(null);

  const [isEditSeminarOpen, setIsEditSeminarOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<SeminarItem | null>(null);

  const [isEditSkillCategoryOpen, setIsEditSkillCategoryOpen] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<SkillCategory | null>(null);

  const [isEditCertificateOpen, setIsEditCertificateOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);

  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);

  // Notification helper
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Auth listener for Firebase Google Cloud Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (isAuthorizedOwner(currentUser)) {
          setIsEditMode(true);
          loadMessages();
        } else {
          // Unrecognized account: immediately de-escalate and sign out
          setIsEditMode(false);
          logoutUser().catch(console.error);
        }
      } else {
        setIsEditMode(false);
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Secret Admin Access: Keyboard shortcut (Ctrl/Cmd + Shift + A) and URL Hash (#admin / #login)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    const handleHashCheck = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#login') {
        setIsLoginModalOpen(true);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    handleHashCheck();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashCheck);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    async function loadPortfolioData() {
       try {
         setLoading(true);
         const [profData, projData, expData, eduData, semData, skillData, certData] = await Promise.all([
           getPortfolioProfile(),
           getProjects(),
           getExperiences(),
           getEducation(),
           getSeminars(),
           getSkillCategories(),
           getCertificates(),
         ]);
         setProfile(profData);
         setProjects(projData);
         setExperiences(expData);
         setEducation(eduData);
         setSeminars(semData);
         setSkills(skillData);
         setCertificates(certData);
       } catch (err) {
         console.error('Failed to load portfolio initial data:', err);
       } finally {
         setLoading(false);
       }
    }
    loadPortfolioData();
  }, []);

  // Fetch messages if owner is logged in
  const loadMessages = async () => {
    try {
      const msgs = await getContactMessages();
      setMessages(msgs);
    } catch (err) {
      console.warn('Could not load messages:', err);
    }
  };

  // Auth actions
  const handleAdminLoginSuccess = (loggedInName: string) => {
    setIsEditMode(true);
    showNotification(`Welcome back, ${loggedInName}! Google Cloud Admin dashboard unlocked.`);
    loadMessages();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsEditMode(false);
      setMessages([]);
      showNotification('Signed out from Admin Dashboard.');
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  // Profile Save
  const handleSaveProfile = async (updated: PortfolioProfile) => {
    await updatePortfolioProfile(updated);
    setProfile(updated);
    showNotification('Profile updated and saved to Cloud Firestore!');
  };

  // Project Actions
  const handleSaveProject = async (project: ProjectItem) => {
    let reindexed: ProjectItem[] = [];
    setProjects((prev) => {
      let list: ProjectItem[];
      const exists = prev.some((p) => p.id === project.id);
      if (exists) {
        list = prev.map((p) => (p.id === project.id ? project : p));
      } else {
        list = [project, ...prev];
      }

      // If set to spotlight position #1
      if (project.order === '1') {
        const target = list.find((p) => p.id === project.id);
        const others = list.filter((p) => p.id !== project.id);
        if (target) {
          list = [target, ...others];
        }
      }

      reindexed = list.map((p, idx) => ({
        ...p,
        order: String(idx + 1),
        featured: idx === 0 ? 'true' : p.featured,
      }));
      return reindexed;
    });

    await saveProjectsOrder(reindexed);
    showNotification(`Project "${project.title}" saved successfully!`);
  };

  const handleReorderProjects = async (reordered: ProjectItem[]) => {
    const indexed = reordered.map((p, idx) => ({
      ...p,
      order: String(idx + 1),
      featured: idx === 0 ? 'true' : p.featured,
    }));
    setProjects(indexed);
    showNotification('Project showcase order updated!');
    await saveProjectsOrder(indexed);
  };

  const handleSetSpotlightProject = async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    const others = projects.filter((p) => p.id !== projectId);
    const reordered = [target, ...others].map((p, idx) => ({
      ...p,
      order: String(idx + 1),
      featured: idx === 0 ? 'true' : p.featured,
    }));
    setProjects(reordered);
    showNotification(`"${target.title}" is now the spotlight showcase project!`);
    await saveProjectsOrder(reordered);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await removeProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      showNotification('Project removed.');
    }
  };

  // Experience Actions
  const handleSaveExperience = async (exp: ExperienceItem) => {
    await upsertExperience(exp);
    setExperiences((prev) => {
      const exists = prev.some((e) => e.id === exp.id);
      if (exists) {
        return prev.map((e) => (e.id === exp.id ? exp : e));
      }
      return [exp, ...prev];
    });
    showNotification(`Experience at ${exp.company} saved!`);
  };

  const handleDeleteExperience = async (expId: string) => {
    if (confirm('Are you sure you want to delete this experience record?')) {
      await removeExperience(expId);
      setExperiences((prev) => prev.filter((e) => e.id !== expId));
      showNotification('Experience removed.');
    }
  };

  // Education Actions
  const handleSaveEducation = async (edu: EducationItem) => {
    await upsertEducation(edu);
    setEducation((prev) => {
      const exists = prev.some((e) => e.id === edu.id);
      if (exists) {
        return prev.map((e) => (e.id === edu.id ? edu : e));
      }
      return [...prev, edu];
    });
    showNotification('Education record updated!');
  };

  const handleDeleteEducation = async (eduId: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      await removeEducation(eduId);
      setEducation((prev) => prev.filter((e) => e.id !== eduId));
      showNotification('Education entry removed.');
    }
  };

  // Seminar Actions
  const handleSaveSeminar = async (sem: SeminarItem) => {
    await upsertSeminar(sem);
    setSeminars((prev) => {
      const exists = prev.some((s) => s.id === sem.id);
      if (exists) {
        return prev.map((s) => (s.id === sem.id ? sem : s));
      }
      return [...prev, sem];
    });
    showNotification('Seminar record updated!');
  };

  const handleDeleteSeminar = async (semId: string) => {
    if (confirm('Are you sure you want to delete this seminar entry?')) {
      await removeSeminar(semId);
      setSeminars((prev) => prev.filter((s) => s.id !== semId));
      showNotification('Seminar removed.');
    }
  };

  // Certificate Actions
  const handleSaveCertificate = async (cert: CertificateItem) => {
    await upsertCertificate(cert);
    setCertificates((prev) => {
      const exists = prev.some((c) => c.id === cert.id);
      if (exists) {
        return prev.map((c) => (c.id === cert.id ? cert : c));
      }
      return [cert, ...prev];
    });
    showNotification(`Certificate "${cert.title}" saved!`);
  };

  const handleDeleteCertificate = async (certId: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await removeCertificate(certId);
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      showNotification('Certificate removed.');
    }
  };

  const handleOpenAddCertificate = (initialCategory?: string) => {
    if (initialCategory && initialCategory !== '__custom__') {
      setSelectedCertificate({
        id: `cert-${Date.now()}`,
        title: '',
        category: initialCategory,
        issuingOrganization: '',
        issueDate: '',
        expirationDate: 'Lifetime / Does not expire',
        credentialId: '',
        credentialUrl: '',
        description: '',
        featured: false,
        order: '1',
      });
    } else if (initialCategory === '__custom__') {
      setSelectedCertificate({
        id: `cert-${Date.now()}`,
        title: '',
        category: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: 'Lifetime / Does not expire',
        credentialId: '',
        credentialUrl: '',
        description: '',
        featured: false,
        order: '1',
      });
    } else {
      setSelectedCertificate(null);
    }
    setIsEditCertificateOpen(true);
  };

  // Skill Category Actions
  const handleSaveSkillCategory = async (cat: SkillCategory) => {
    await upsertSkillCategory(cat);
    setSkills((prev) => {
      const exists = prev.some((c) => (c.id || c.title) === (cat.id || cat.title));
      if (exists) {
        return prev.map((c) => ((c.id || c.title) === (cat.id || cat.title) ? cat : c));
      }
      return [...prev, cat];
    });
    showNotification(`Skill category "${cat.title}" saved!`);
  };

  const handleDeleteSkillCategory = async (catId: string) => {
    if (confirm('Are you sure you want to delete this skill category?')) {
      await removeSkillCategory(catId);
      setSkills((prev) => prev.filter((c) => (c.id || c.title) !== catId));
      showNotification('Skill category removed.');
    }
  };

  const handleDeleteSkillTag = async (catId: string, skillIndex: number) => {
    const targetCat = skills.find((c) => (c.id || c.title) === catId);
    if (!targetCat) return;

    const updatedSkills = targetCat.skills.filter((_, idx) => idx !== skillIndex);
    const updatedCat: SkillCategory = {
      ...targetCat,
      skills: updatedSkills,
    };
    await upsertSkillCategory(updatedCat);
    setSkills((prev) =>
      prev.map((c) => ((c.id || c.title) === catId ? updatedCat : c))
    );
    showNotification('Skill removed.');
  };

  const handleAddSkillTag = async (catId: string, newSkill: string) => {
    const targetCat = skills.find((c) => (c.id || c.title) === catId);
    if (!targetCat) return;
    if (targetCat.skills.includes(newSkill)) return;

    const updatedCat: SkillCategory = {
      ...targetCat,
      skills: [...targetCat.skills, newSkill],
    };
    await upsertSkillCategory(updatedCat);
    setSkills((prev) =>
      prev.map((c) => ((c.id || c.title) === catId ? updatedCat : c))
    );
    showNotification(`Added "${newSkill}" to ${targetCat.title}!`);
  };

  // Message Delete
  const handleDeleteMessage = async (msgId: string) => {
    await removeContactMessage(msgId);
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    showNotification('Message deleted.');
  };

  // Manual Save All Action
  const handleSaveAll = async () => {
    if (!user) {
      showNotification('Note: You are in LOCAL MODE. Click "Connect Cloud" (top bar) to sync your changes to Cloud Firestore so all visitors and browsers see them!');
    }
    setSyncing(true);
    try {
      showNotification('Saving and synchronizing all portfolio sections...');
      await syncAllLocalToFirestore(
        profile,
        projects,
        experiences,
        education,
        seminars,
        skills,
        certificates
      );
      showNotification('All portfolio changes saved and synced successfully!');
    } catch (err) {
      console.error('Failed to save all changes:', err);
      showNotification('Failed to save changes.');
    } finally {
      setSyncing(false);
    }
  };

  // Sync / Seed Defaults
  const handleSeedDefaults = async () => {
    if (confirm('This will synchronize your baseline portfolio information into Cloud Firestore. Continue?')) {
      setSyncing(true);
      try {
        await seedDefaultsToFirestore();
        showNotification('Baseline data successfully synced to Firestore!');
      } catch (err) {
        console.error('Failed to sync defaults:', err);
        showNotification('Failed to sync defaults to Firestore.');
      } finally {
        setSyncing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#070b14] text-[#1e293b] dark:text-[#f1f5f9] flex flex-col font-sans selection:bg-[#004643]/15 selection:text-[#004643] dark:selection:bg-[#028090]/30 dark:selection:text-[#2dd4bf] transition-colors duration-250">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[#004643]/30 dark:border-[#028090]/40 bg-white/95 dark:bg-slate-900/95 px-5 py-2.5 text-xs font-semibold text-[#004643] dark:text-[#2dd4bf] shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar - Always clean for visitors without sign-in clutter */}
      <Navbar
        profile={profile}
        onSecretAdminTrigger={() => setIsLoginModalOpen(true)}
      />

      {/* Admin Action Bar if user is authenticated as owner and edit mode is active */}
      {user && isAuthorizedOwner(user) && isEditMode && (
        <AdminBar
          onEditProfile={() => setIsEditProfileOpen(true)}
          onEditEligibility={() => setIsEditEligibilityOpen(true)}
          onManageCv={() => setIsManageCvOpen(true)}
          onAddProject={() => {
            setSelectedProject(null);
            setIsEditProjectOpen(true);
          }}
          onAddExperience={() => {
            setSelectedExperience(null);
            setIsEditExperienceOpen(true);
          }}
          onAddEducation={() => {
            setSelectedEducation(null);
            setIsEditEducationOpen(true);
          }}
          onAddSeminar={() => {
            setSelectedSeminar(null);
            setIsEditSeminarOpen(true);
          }}
          onAddCertificate={() => handleOpenAddCertificate()}
          onAddSkillCategory={() => {
            setSelectedSkillCategory(null);
            setIsEditSkillCategoryOpen(true);
          }}
          onSeedDefaults={handleSeedDefaults}
          onSaveAll={handleSaveAll}
          userEmail={user.email || AUTHORIZED_OWNER_EMAIL}
          syncing={syncing}
          onOpenMessages={() => setIsMessagesDrawerOpen(true)}
          unreadCount={messages.length}
          onLogout={handleLogout}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
        />
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          profile={profile}
          isEditMode={isEditMode}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onEditEligibility={() => setIsEditEligibilityOpen(true)}
          projectCount={projects.length}
        />

        <SkillsBanner />

        <AboutSection
          profile={profile}
          isEditMode={isEditMode}
          onEditProfile={() => setIsEditProfileOpen(true)}
        />

        <ProjectsSection
          projects={projects}
          isEditMode={isEditMode}
          onAddProject={() => {
            setSelectedProject(null);
            setIsEditProjectOpen(true);
          }}
          onEditProject={(proj) => {
            setSelectedProject(proj);
            setIsEditProjectOpen(true);
          }}
          onDeleteProject={handleDeleteProject}
          onReorderProjects={handleReorderProjects}
          onSetSpotlightProject={handleSetSpotlightProject}
          onSaveOrder={handleSaveAll}
        />

        <ExperienceSection
          experiences={experiences}
          isEditMode={isEditMode}
          onAddExperience={() => {
            setSelectedExperience(null);
            setIsEditExperienceOpen(true);
          }}
          onEditExperience={(exp) => {
            setSelectedExperience(exp);
            setIsEditExperienceOpen(true);
          }}
          onDeleteExperience={handleDeleteExperience}
        />

        <SkillsSection
          categories={skills}
          isEditMode={isEditMode}
          onAddCategory={() => {
            setSelectedSkillCategory(null);
            setIsEditSkillCategoryOpen(true);
          }}
          onEditCategory={(cat) => {
            setSelectedSkillCategory(cat);
            setIsEditSkillCategoryOpen(true);
          }}
          onDeleteCategory={handleDeleteSkillCategory}
          onDeleteSkillTag={handleDeleteSkillTag}
          onAddSkillTag={handleAddSkillTag}
        />

        <CertificatesSection
          certificates={certificates}
          isEditMode={isEditMode}
          onAddCertificate={handleOpenAddCertificate}
          onEditCertificate={(cert) => {
            setSelectedCertificate(cert);
            setIsEditCertificateOpen(true);
          }}
          onDeleteCertificate={handleDeleteCertificate}
        />

        <SeminarsSection
          seminars={seminars}
          isEditMode={isEditMode}
          onAddSeminar={() => {
            setSelectedSeminar(null);
            setIsEditSeminarOpen(true);
          }}
          onEditSeminar={(sem) => {
            setSelectedSeminar(sem);
            setIsEditSeminarOpen(true);
          }}
          onDeleteSeminar={handleDeleteSeminar}
        />

        <EducationSection
          education={education}
          isEditMode={isEditMode}
          onAddEducation={() => {
            setSelectedEducation(null);
            setIsEditEducationOpen(true);
          }}
          onEditEducation={(edu) => {
            setSelectedEducation(edu);
            setIsEditEducationOpen(true);
          }}
          onDeleteEducation={handleDeleteEducation}
          eligibility={profile.civilServiceEligibility}
          onEditEligibility={() => setIsEditEligibilityOpen(true)}
        />

        <ContactSection
          profile={profile}
          isEditMode={isEditMode}
          onManageCv={() => setIsManageCvOpen(true)}
        />
      </main>

      {/* Footer with subtle Owner Admin Access */}
      <Footer
        profile={profile}
        user={user}
        isEditMode={isEditMode}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onLogout={handleLogout}
      />

      {/* Owner Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Editor Modals */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
        onOpenManageCv={() => setIsManageCvOpen(true)}
        onOpenEditEligibility={() => setIsEditEligibilityOpen(true)}
      />

      <EditProjectModal
        project={selectedProject}
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onSave={handleSaveProject}
      />

      <EditExperienceModal
        experience={selectedExperience}
        isOpen={isEditExperienceOpen}
        onClose={() => setIsEditExperienceOpen(false)}
        onSave={handleSaveExperience}
      />

      <EditEducationModal
        education={selectedEducation}
        isOpen={isEditEducationOpen}
        onClose={() => setIsEditEducationOpen(false)}
        onSave={handleSaveEducation}
      />

      <EditSeminarModal
        seminar={selectedSeminar}
        isOpen={isEditSeminarOpen}
        onClose={() => setIsEditSeminarOpen(false)}
        onSave={handleSaveSeminar}
      />

      <EditSkillCategoryModal
        category={selectedSkillCategory}
        isOpen={isEditSkillCategoryOpen}
        onClose={() => setIsEditSkillCategoryOpen(false)}
        onSave={handleSaveSkillCategory}
      />

      <EditCertificateModal
        certificate={selectedCertificate}
        isOpen={isEditCertificateOpen}
        onClose={() => {
          setIsEditCertificateOpen(false);
          setSelectedCertificate(null);
        }}
        onSave={handleSaveCertificate}
        existingCategories={certificates.map((c) => c.category)}
      />

      <ManageCvModal
        profile={profile}
        isOpen={isManageCvOpen}
        onClose={() => setIsManageCvOpen(false)}
        onSave={handleSaveProfile}
      />

      <EditEligibilityModal
        profile={profile}
        isOpen={isEditEligibilityOpen}
        onClose={() => setIsEditEligibilityOpen(false)}
        onSave={handleSaveProfile}
      />

      <MessagesDrawer
        isOpen={isMessagesDrawerOpen}
        onClose={() => setIsMessagesDrawerOpen(false)}
        messages={messages}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}
