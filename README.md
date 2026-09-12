# Regie De Leon Catacutan — Engineering Portfolio & Credentials Hub

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

A modern, high-performance portfolio and professional credential hub built for **Regie De Leon Catacutan** — Computer Engineer, IT Specialist, and Full-Stack Developer.

---

## 🌟 Key Features

- **Civil Service Eligibility (HGE - PD 907)**: Dedicated verification showcase for Philippine Civil Service Commission Honor Graduate Eligibility (First & Second Level Career Service).
- **Categorized Certificates & Credentials**: Category-filtered credentials system (Civil Service & Government, Academic Distinctions, IT & Technical Certifications, and custom categories) with built-in PDF/image preview.
- **Dynamic CV Management**: Integrated downloadable CV module with drag-and-drop replacement, live preview, and storage backup.
- **Admin Dashboard & CMS**: Secure administrator portal for managing project showcases, work history, education, skills matrix, seminars, and credentials.
- **Real-Time Cloud Synchronization**: Dual-layer persistence via Cloud Firestore and low-latency client storage fallback.
- **Responsive Dark/Light Theme**: Tailored design tokens with seamless theme switching and accessibility considerations.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Grid & Flexbox, Lucide React icons
- **Backend / Database**: Google Firebase, Cloud Firestore, Firebase Authentication
- **Document Handling**: Base64 & PDF Blob utilities for in-browser CV and certificate rendering

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone https://github.com/rgdlcatacutan02-beep/rgdlc-portfolio.git

# Navigate into project directory
cd rgdlc-portfolio

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in terminal) in your browser.

### Production Build

```bash
npm run build
```

The compiled and minified assets will be generated in the `dist/` directory.

---

## 🔒 Admin Access

The portfolio includes an administrative mode for updating credentials and portfolio entries:
- Shortcut: Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on macOS)
- URL hash: Append `#admin` or `#login` to your portfolio URL

---

## 📄 License

This project is licensed under the Apache 2.0 License.
