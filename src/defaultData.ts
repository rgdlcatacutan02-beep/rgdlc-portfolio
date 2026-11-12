import { PortfolioProfile, ProjectItem, ExperienceItem, EducationItem, SeminarItem, SkillCategory, CivilServiceEligibility, CertificateItem } from './types';

export const defaultCivilServiceEligibility: CivilServiceEligibility = {
  title: 'Honor Graduate Eligibility (HGE - PD 907)',
  lawOrBasis: 'Presidential Decree No. 907 (Granting Civil Service Eligibility to College Honor Graduates)',
  level: 'First & Second Level Career Service Eligibility (Professional & Sub-Professional)',
  honorTitle: 'Cum Laude (Bachelor of Science in Computer Engineering)',
  institution: 'Pampanga State Agricultural University (PSAU)',
  dateConferred: '2025',
  certificateNo: '',
  issuingAgency: 'Civil Service Commission (CSC), Republic of the Philippines',
  certificateUrl: '',
  description:
    'Conferred First and Second Level Eligibility pursuant to Presidential Decree No. 907 by virtue of graduating Cum Laude with a Bachelor of Science in Computer Engineering. Fully qualifies for scientific, technical, and executive appointments in the Philippine Civil Service without examination requirement.',
  enabled: true,
};

export const defaultProfile: PortfolioProfile = {
  fullName: 'Regie De Leon Catacutan',
  title: 'Network & IT Support Engineer | Full-Stack Web Developer',
  email: 'rgdlcatacutan02@gmail.com',
  phone: '0981-5731-759',
  location: 'Magalang, Pampanga, Philippines',
  summary:
    'I keep systems running — and I build the ones businesses run on. I\'m a Computer Engineering graduate (Cum Laude) working as a Network Engineer, where I monitor network infrastructure and server health, support workstations and users, and resolve connectivity issues before they become downtime. Before that, I supported servers, POS systems, and the store network as an IT Specialist at Robinsons Supermarket, and I spent 2+ years working remotely for a US-based client.\nOn the development side, I build full-stack business systems with React, TypeScript, Firebase, Node.js, PHP, and MySQL. I\'m open to remote roles in IT Support, Systems/NOC Support, and Web Development.',
  cvUrl: '/Regie_De_Leon_Catacutan_CV.pdf',
  cvFileName: 'Regie_De_Leon_Catacutan_CV.pdf',
  cvFileSize: '304 KB',
  cvUpdatedAt: new Date().toISOString(),
  civilServiceEligibility: defaultCivilServiceEligibility,
  github: 'https://github.com/rgdlcatacutan02-beep',
  linkedin: 'https://www.linkedin.com/in/regie-catacutan-aa8553373',
  updatedAt: new Date().toISOString(),
};

export const defaultProjects: ProjectItem[] = [
  {
    id: 'dunks-auto-sales',
    title: 'DUNKS AUTO SALES',
    subtitle: 'Full-Stack Automotive Dealership & Inventory Management Platform',
    category: 'Full-Stack Web App',
    year: '2025',
    role: 'Full-Stack Developer & UI/UX Designer',
    description:
      'A production-ready dealership platform built to streamline vehicle browsing, financing, trade-in appraisals, lead management, and inventory operations.',
    highlights:
      'Vehicle Inventory: Advanced multi-criteria filtering by make, model, price, mileage, body style, fuel type, and transmission\nFinancing Calculator: Real-time calculation engine for loan principal, down-payment, interest rates, and monthly amortization\nTrade-In & Appraisal: Multi-step vehicle appraisal workflows with Cloud Firestore persistence and automated WhatsApp lead routing\nTest Drive Booking: Online scheduling system for vehicle test drives and showroom consultations\nAdmin Dashboard: Secure RBAC authentication with complete vehicle inventory CRUD operations\nLead Management Pipeline: Centralized tracking dashboard for financing, trade-in, and customer contact inquiries\nDealership Business Portal: Dynamic management for dealership info, operating hours, WhatsApp routing, and loan parameters\nReal-time Cloud Sync: Low-latency Firestore synchronization for instant vehicle catalog and lead updates',
    tags: 'React, TypeScript, Tailwind CSS, Node.js, Express, Firebase, Cloud Firestore, Firebase Auth, Cloud Storage, Vite, Lucide React, Motion',
    featured: 'true',
    link: '',
    order: '5',
  },
  {
    id: 'wellpet-vetcore-pro',
    title: 'WellPet VetCore Pro',
    subtitle: 'Veterinary Practice Management System & Electronic Medical Records Platform',
    category: 'Full-Stack Web App',
    year: '2025',
    role: 'Full-Stack Developer & UI/UX Designer',
    description:
      'An enterprise-style veterinary management platform designed to digitize clinic operations, from patient registration and appointments to electronic medical records, pharmacy, billing, inventory, and pet-owner self-service.',
    highlights:
      'RBAC & Authentication: Role-based access for administrators, veterinarians, veterinary assistants, receptionists, and pet owners\nPatient Management: Comprehensive client and pet profiles with medical history, weight tracking, allergies, microchip information, and clinical alerts\nAppointment Management: Calendar-based scheduling with veterinarian assignment and complete appointment status tracking\nElectronic Medical Records (EMR): Structured veterinary SOAP notes, diagnoses, prescriptions, procedures, and printable medical summaries\nVaccination & Preventive Care: Vaccine records, booster due dates, lot/batch tracking, and printable vaccination certificates\nPharmacy & Prescriptions: Medication dispensing, dosage instructions, treatment tracking, and printable prescriptions\nLaboratory Management: Diagnostic orders, result recording, reference flags, attachments, and status tracking\nSurgical Management: Surgery scheduling, surgeon assignment, anesthesia/recovery notes, and post-operative care documentation\nPOS & Billing: Itemized invoices, taxes, balances, multiple payment methods, and printable receipts\nInventory Management: Medication, vaccine, supply, and consumable stock tracking with low-stock and expiration alerts\nStaff Management: Staff profiles, credentials, employment information, and account access controls\nAudit Logging: Traceable system activity logs for security, compliance, and record accountability\nPet Owner Portal: Online appointment requests, digital health records, vaccination history, medication information, and bill review\nEngineering Highlights: Modular architecture covering 14 core veterinary workflows, strict TypeScript models, and normalized relational data models (Clients → Pets → Appointments → Medical Records → Invoices)',
    tags: 'React, TypeScript, Tailwind CSS, Context API, Custom Hooks, Lucide React, Responsive UI, EMR, Healthtech, POS, Role-Based Access Control',
    featured: 'true',
    link: 'https://github.com/rgdlcatacutan02-beep/veterinary-clinic-management-system',
    order: '1',
  },
  {
    id: 'arcforge',
    title: 'ARCforge',
    subtitle: 'Autonomous IoT Aquaculture Telemetry & Automation Platform',
    category: 'IoT & Embedded Systems',
    year: '2026',
    role: 'Embedded Systems & Full-Stack IoT Engineer',
    description:
      'An open-source, production-ready full-stack IoT platform tailored for high-density aquaculture operations (Australian Redclaw crayfish and recirculating systems), bridging physical edge hardware with real-time cloud telemetry and automation.',
    highlights:
      'Real-Time Telemetry Matrix: Live sub-second monitoring for Dissolved Oxygen (mg/L), Water pH, Temperature (°C), Turbidity (NTU), and battery parameters\nClosed-Loop Edge Automation Engine: Fail-safe threshold evaluations running on edge hardware with manual emergency kill-switch overrides\nSolar & LiFePO4 Microgrid Hub: Live power-flow telemetry (Solar PV yield vs. active farm pump loads), MPPT efficiency metrics, and autonomy forecasting\nLive Node Camera Matrix: Multi-camera grid with MJPEG/RTSP stream integration, low-latency node inspection, and snapshot triggers\nAutomated Feeder Schedules: Micro-controlled servo feeder augers with schedule presets, manual pulse controls, and historical feeding logs\nIncident Alert Center: Multi-level alerts (Critical, Warning, Info) with automated SMS dispatch routing and status tracking\nPredictive Analytics Suite: Multi-parametric historical time-series graphs with CSV/JSON export and AI-driven biological buffer diagnostics',
    tags: 'Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Firebase Firestore, Raspberry Pi 4B, ESP32-CAM, IoT Sensors, REST API, Solar MPPT',
    featured: 'true',
    link: 'https://github.com/rgdlcatacutan02-beep/ARCforge',
    order: '2',
  },
  {
    id: 'coffeegarage-pos',
    title: 'CoffeeGarage POS',
    subtitle: 'Smart Café Management, POS & Kitchen Display System',
    category: 'Full-Stack Web App',
    year: '2026',
    role: 'Full-Stack Developer & Systems Architect',
    description:
      'An intelligent cloud-native café management and Point of Sale platform featuring recipe-level inventory deduction, real-time Kitchen Display System (KDS), customer loyalty rewards, and AI-powered business analytics.',
    highlights:
      'Fast-Paced Touch POS Interface: Quick item selection, drink customizations, addons, split bills, discount vouchers, and cash drawer management\nReal-Time Kitchen Display System (KDS): Live kitchen/barista order dispatch tickets with timer indicators, status progressions, and audio/visual alerts\nIngredient-Level Recipe Inventory: Automated real-time deduction of beans (g), milk (ml), syrups, and consumables per beverage sold with low-stock warnings\nShift Tracking & Z-Reading: Opening float, cash drops, discrepancy calculations, cashier drawer balancing, and automated shift close reports\nCustomer Loyalty & Rewards: Points accumulation engine, customer profile management, birthday perks, and QR code redemption\nMulti-Branch Architecture & Analytics: Real-time revenue dashboards, best-seller rankings, and sales velocity charts powered by Recharts\nGemini AI Business Assistant: Integrated @google/genai conversational assistant for revenue insights, stock optimization, and operational queries\nThermal Receipt & Invoice Generation: Built-in react-to-print formatting for ESC/POS receipt printers and digital invoices',
    tags: 'React 19, TypeScript, Tailwind CSS, Firebase Firestore, Google Gemini API, Recharts, POS, KDS, Vite, Framer Motion, QR Code',
    featured: 'true',
    link: 'https://github.com/rgdlcatacutan02-beep/CoffeeGarage-POS-system',
    order: '3',
  },
  {
    id: 'itrs-hub',
    title: 'ITRS Hub',
    subtitle: 'IT Operations, PC Setup & Cloud Resource Portal',
    category: 'Full-Stack Web App',
    year: '2026',
    role: 'Full-Stack Developer & Systems Architect',
    description:
      'A centralized modern IT Operations and PC Setup portal built with React 19, Vite, and TypeScript. Designed for managing standard department PC software configurations, technician work orders, credential vaults, and cloud-synchronized operations.',
    highlights:
      'Role-Based Access Control (RBAC): Super Admin, Admin, Staff/Technician, and Viewer tiers with granular administrative permissions\nStandard PC Setup Blueprints: Curated department application checklists, driver installers, and workstation onboarding guides\nEncrypted Credential Vault: Secure password manager and service credential storage with clipboard quick-copy capabilities\nWork Order & Task Management: Technician operational checklists, leave/day-off request workflows, and task approvals\nIT Operations Scratchpad: Quick memo and technician notes synchronized across sessions\nCloud Architecture & REST Layer: Asynchronous service layer with live telemetry, latency metrics, and Express REST backend\nCloud Backup & Restore: Instant JSON system state snapshots and recovery\nSleek Minimalist SaaS UI: Deep carbon & dark slate aesthetics with translucent glassmorphism (backdrop-blur-xl)',
    tags: 'React 19, TypeScript, Vite, Tailwind CSS, Node.js, Express, REST API, RBAC, IT Operations, Systems Administration, Glassmorphism',
    featured: 'true',
    link: 'https://github.com/rgdlcatacutan02-beep/ITRS-hub',
    order: '4',
  },
  {
    id: 'iot-fire-detection',
    title: 'IoT-Based Fire Detection System',
    subtitle: 'Edge Hardware & Automated GSM Early Hazard Alert Platform',
    category: 'IoT & Embedded Systems',
    year: '2024',
    role: 'Embedded Systems & Hardware Engineer',
    description:
      'An intelligent safety monitoring system engineered using Raspberry Pi, specialized sensors, and live camera streaming to detect fire hazards early and alert users in real time.',
    highlights:
      'Developed a fire detection system using Raspberry Pi and high-sensitivity sensors\nIntegrated live video streaming and automated GSM SMS alert features\nDesigned a responsive web interface for real-time monitoring and emergency notifications\nOptimized sensor thresholds to minimize false alarms in challenging environments',
    tags: 'Raspberry Pi, Python, IoT Sensors, GSM Module, Video Streaming, Hardware Integration',
    featured: 'true',
    link: '',
    order: '6',
  },
  {
    id: 'rai-assistant',
    title: 'RAI: Raspberry AI Assistant with OLED Eyes',
    subtitle: 'ChatGPT-Powered Smart Companion with Animated OLED Interface',
    category: 'AI & Robotics',
    year: '2024',
    role: 'Embedded AI & Firmware Developer',
    description:
      'A ChatGPT-powered smart companion device built on Raspberry Pi Zero featuring interactive OLED eyes with animated expressions and voice synthesis.',
    highlights:
      'Engineered an expressive ChatGPT-Powered OLED Eyed AI Assistant for Raspberry Pi Zero\nCreated dynamic micro-animations for emotional states and interaction feedback\nIntegrated OpenAI API for voice and prompt reasoning\nEngineered lightweight embedded python services for smooth low-power performance',
    tags: 'Raspberry Pi Zero, OpenAI / ChatGPT, OLED Display, Python, Speech Synthesis, Embedded Linux',
    featured: 'true',
    link: '',
    order: '7',
  },
  {
    id: 'network-monitor-dashboard',
    title: 'Retail Store & Network Support Operations',
    subtitle: 'Case Study: Keeping a Supermarket\'s Servers, POS, and Network Running',
    category: 'Infrastructure & Support',
    year: '2025-2026',
    role: 'IT Specialist – Store Support / Network Engineer',
    description:
      'A case study from my on-site IT work: monitoring servers and network health, supporting POS terminals and workstations, and resolving hardware, software, and connectivity issues so store operations keep running.',
    highlights:
      'Supported store servers, POS systems, workstations, and network infrastructure\nTroubleshot hardware, software, and connectivity issues to keep downtime minimal\nPerformed preventive maintenance on IT equipment and assisted with CCTV systems\nWorked with ticketing systems and remote support tools for issue tracking and resolution',
    tags: 'Network Diagnostics, POS Systems, Remote Support Tools, Server Maintenance, CCTV, Ticketing',
    featured: 'false',
    link: '',
    order: '8',
  },
];

export const defaultExperiences: ExperienceItem[] = [
  {
    id: 'exp-3core',
    role: 'Network Engineer',
    company: '3core Leaderstech Corp. · Clark, Pampanga',
    period: 'Mar 2026 - Present',
    responsibilities:
      'Maintain and monitor network infrastructure to support uninterrupted business operations.\nMonitor server availability, performance, and system health to ensure operational stability.\nProvide workstation support, including troubleshooting, configuration, and user assistance.\nDiagnose and resolve network connectivity and technical issues to minimize service disruptions.\nSupport server build and maintenance activities and assist in maintaining CCTV camera systems.',
    tools: 'Network Infrastructure, Server Diagnostics, Workstation Support, CCTV Systems, Switch Configuration',
    order: '1',
  },
  {
    id: 'exp-robinsons',
    role: 'IT Specialist – Store Support',
    company: 'Robinsons Supermarket · City of San Fernando',
    period: 'Sep 2025 - Mar 2026',
    responsibilities:
      'Supported store servers, POS systems, workstations, and network infrastructure.\nTroubleshot hardware, software, and connectivity issues to keep checkout and store operations running.\nMaintained IT equipment to keep store downtime minimal.\nUsed ticketing systems and performed preventive maintenance.',
    tools: 'POS Systems, Server Maintenance, Hardware Troubleshooting, Remote Diagnostic Tools, Ticketing Systems',
    order: '2',
  },
  {
    id: 'exp-iphoenix',
    role: 'Survey Design Engineer Intern',
    company: 'I-Phoenix Corporation',
    period: 'Jan 2025 - May 2025',
    responsibilities:
      'Assisted the engineering team with pole plotting for telecommunications infrastructure.\nUsed QGIS, CAD, and Google Earth for spatial data management and design.\nManaged and formatted large CSV datasets for geospatial projects.\nEdited and developed As-Built plans in CAD for project documentation.',
    tools: 'QGIS, AutoCAD, Google Earth, CSV Data Management',
    order: '3',
  },
  {
    id: 'exp-freelance',
    role: 'Virtual Assistant, Social Media Manager & Web Developer',
    company: 'Remote · US-based client (Lance Dynamic Credit Repair) & Freelance',
    period: '2022 - 2024',
    responsibilities:
      'Worked remotely for a US-based client for 2+ years across time zones.\nCreated and managed social media content for multiple clients, specializing in short-form video (Reels, TikTok).\nDeveloped strategies to increase audience engagement and follower growth.\nDesigned, built, and maintained client websites using AI-assisted development tools.',
    tools: 'Remote Collaboration, Web Development, Canva, Photoshop, Video Editing, AI Development Tools',
    order: '4',
  },
];

export const defaultEducation: EducationItem[] = [
  {
    id: 'edu-psau',
    school: 'Pampanga State Agricultural University',
    degree: 'Bachelor of Science in Computer Engineering',
    period: '2021 - 2025',
    honors: 'Cum Laude • Presidential Award for Pioneer Graduates • Honor Graduate Eligibility (PD 907)',
    location: 'Magalang, Pampanga',
    order: '1',
  },
  {
    id: 'edu-tnhs',
    school: 'Tarlac National High School - Main',
    degree: 'Senior High School (STEM Track)',
    period: '2019 - 2021',
    honors: 'With High Honors',
    location: 'Macabulos Drive, San Roque, Tarlac City',
    order: '2',
  },
];

export const defaultSeminars: SeminarItem[] = [
  {
    id: 'sem-web-dev',
    title: 'HTML, CSS, JavaScript Web Development',
    date: 'May 08, 2025',
    description: 'Modern front-end architecture, responsive design fundamentals, and asynchronous JavaScript.',
    order: '1',
  },
  {
    id: 'sem-emerging-tech',
    title: 'Emerging Technologies: Exploring Innovations for the Future Training & Site Visit',
    date: 'March 28, 2025',
    description: 'Exploration of emerging enterprise technologies, cloud computing trends, and on-site infrastructure inspection.',
    order: '2',
  },
  {
    id: 'sem-innovation',
    title: 'Seminar for Innovation and Entrepreneurship',
    date: 'February 21, 2025',
    description: 'Product lifecycle strategy, technical venture building, and intellectual property formulation.',
    order: '3',
  },
  {
    id: 'sem-ai-workflow',
    title: 'Leveraging AI to Transform Education and Modern Workflows: "Enhancing Presentations and Visuals with AI"',
    date: 'October 30, 2024',
    description: 'Practical adoption of generative AI tools for modern presentation design, asset creation, and workflow automation.',
    order: '4',
  },
];

export const defaultSkillCategories: SkillCategory[] = [
  {
    id: 'skill-web',
    title: 'Web & Full-Stack Development',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js & Express', 'Firebase & Firestore', 'PHP & MySQL', 'REST APIs', 'Vite'],
    order: '1',
  },
  {
    id: 'skill-prog',
    title: 'Programming Languages',
    skills: ['Python', 'C/C++', 'JavaScript', 'HTML5 & CSS3', 'Java (basic)'],
    order: '2',
  },
  {
    id: 'skill-iot',
    title: 'Hardware & IoT',
    skills: ['Raspberry Pi', 'Arduino IDE', 'Sensors & Telemetry', 'OLED Interfaces', 'GSM Alert Modules'],
    order: '3',
  },
  {
    id: 'skill-network',
    title: 'Network & Systems',
    skills: ['Network Infrastructure', 'TCP/IP', 'Windows Server', 'Server Maintenance', 'Help Desk & IT Support', 'POS Systems Support', 'CCTV & Surveillance', 'Diagnostics & Troubleshooting'],
    order: '4',
  },
  {
    id: 'skill-tools',
    title: 'Software & Engineering Tools',
    skills: ['VS Code', 'Git & GitHub', 'Autodesk AutoCAD', 'QGIS', 'MS Office Suite', 'Remote Support Tools'],
    order: '5',
  },
  {
    id: 'skill-creative',
    title: 'Creative & Core Strengths',
    skills: ['Canva', 'Adobe Photoshop', 'UI/UX Design', 'Short-form Video Production', 'Problem-Solving', 'Analytical Thinking'],
    order: '6',
  },
];

export const defaultCertificateCategories: string[] = [
  'Civil Service & Government (HGE)',
  'Academic Honors & Awards',
  'Technical & IT Certifications',
  'Professional Development',
];

export const defaultCertificates: CertificateItem[] = [
  {
    id: 'cert-hge',
    title: 'Honor Graduate Eligibility (HGE - PD 907)',
    category: 'Civil Service & Government (HGE)',
    issuingOrganization: 'Civil Service Commission (CSC), Republic of the Philippines',
    issueDate: '2025',
    expirationDate: 'Permanent (Does not expire)',
    credentialId: '',
    credentialUrl: '',
    description:
      'Conferred First and Second Level Career Service Eligibility pursuant to Presidential Decree No. 907 by virtue of graduating Cum Laude with a Bachelor of Science in Computer Engineering. Fully qualifies for scientific, technical, and executive appointments in the Philippine Civil Service without examination requirement.',
    featured: true,
    order: '1',
  },
  {
    id: 'cert-pioneer',
    title: 'Presidential Award for Pioneer Graduates',
    category: 'Academic Honors & Awards',
    issuingOrganization: 'Pampanga State Agricultural University (PSAU)',
    issueDate: '2025',
    expirationDate: 'Lifetime Recognition',
    credentialId: '',
    credentialUrl: '',
    description:
      'Special highest institutional distinction awarded to pioneer graduates of the Bachelor of Science in Computer Engineering program for academic and leadership excellence.',
    featured: true,
    order: '2',
  },
  {
    id: 'cert-cumlaude',
    title: 'Cum Laude Latin Honor Distinction',
    category: 'Academic Honors & Awards',
    issuingOrganization: 'Pampanga State Agricultural University (PSAU)',
    issueDate: '2025',
    expirationDate: 'Lifetime Recognition',
    credentialId: '',
    credentialUrl: '',
    description:
      'Conferred for continuous scholastic excellence across the four-year Bachelor of Science in Computer Engineering curriculum.',
    featured: true,
    order: '3',
  },
  {
    id: 'cert-webdev',
    title: 'HTML, CSS, JavaScript Modern Web Development',
    category: 'Technical & IT Certifications',
    issuingOrganization: 'Professional Tech Immersion Program',
    issueDate: 'May 08, 2025',
    expirationDate: 'Lifetime',
    credentialId: '',
    credentialUrl: '',
    description:
      'Certificate of completion for training in HTML, CSS, and JavaScript: responsive design fundamentals, component patterns, and asynchronous JavaScript.',
    featured: false,
    order: '4',
  },
  {
    id: 'cert-emerging-tech',
    title: 'Emerging Technologies: Exploring Innovations for the Future (Training & Site Visit)',
    category: 'Technical & IT Certifications',
    issuingOrganization: 'Industry Technical Workshop & Site Inspection',
    issueDate: 'March 28, 2025',
    expirationDate: 'Lifetime',
    credentialId: '',
    credentialUrl: '',
    description:
      'Training and on-site visit covering emerging enterprise technologies, cloud computing trends, and infrastructure operations.',
    featured: false,
    order: '5',
  },
  {
    id: 'cert-stem-honors',
    title: 'Senior High School - With High Honors (STEM Track)',
    category: 'Academic Honors & Awards',
    issuingOrganization: 'Tarlac National High School - Main',
    issueDate: '2021',
    expirationDate: 'Lifetime Recognition',
    credentialId: '',
    credentialUrl: '',
    description:
      'Graduated with High Honors in the Science, Technology, Engineering, and Mathematics (STEM) academic strand.',
    featured: false,
    order: '6',
  },
];
