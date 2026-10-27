# Developer Portfolio & GitHub Analytics

A sleek, responsive personal developer portfolio and public GitHub analytics explorer built for [JOD-X8](https://github.com/JOD-X8).

> [!NOTE]
> **Project Phase:** Documentation & Project Foundation.  
> This project is currently in its initial setup phase. Application code, database migrations, and deployments are planned in upcoming milestones. See [PROJECT_STATUS.md](file:///c:/D%20drive/THE%20PROJECT/developer-portfolio-github-analytics/PROJECT_STATUS.md) for live progress tracking.

---

## Overview

**Developer Portfolio & GitHub Analytics** brings together two core experiences into a unified web application:
1. **Personal Developer Portfolio:** A high-impact portfolio showcasing technical background, core skills, featured engineering projects, and contact channels.
2. **GitHub Explorer & Historical Analytics:** A live inspection and historical tracking tool powered by the GitHub REST API and PostgreSQL, providing deep insights into repository statistics, language breakdowns, and longitudinal metric growth (stars, forks, repositories) over time.

---

## Planned Key Features

*Note: Features listed below reflect the project specification and will be implemented across planned milestones.*

- **Portfolio Showcase (`/`):**
  - Personal introduction and biography.
  - Categorized technical skills matrix.
  - Featured engineering projects with direct links and technology stacks.
  - Live summary of GitHub statistics.
  - Resume viewing and direct contact links.

- **Interactive GitHub Explorer (`/explorer`):**
  - Instant public profile search (defaults to `JOD-X8`).
  - Searchable and filterable repository listings.
  - Sorting by star count, last updated date, and alphabetical name.
  - Detailed repository cards (stars, forks, open issues, license, language).
  - Aggregate language distribution chart.

- **Historical Snapshot Analytics (`/analytics`):**
  - Periodic snapshots of profile metrics stored in PostgreSQL.
  - Star growth, fork activity, and repository count trend charts.
  - Verifiable historical tracking with custom date range filters.
  - Graceful historical state handling (tracking begins at collection; never fabricated).

- **Resilient UX & Accessibility:**
  - Dedicated states for loading skeletons, empty results, API errors, and GitHub rate limits.
  - Accessible controls adhering to WCAG 2.1 AA standards.
  - Fully responsive across mobile, tablet, and desktop viewports.

---

## Design System

The application design is derived directly from the approved Figma mockup:

- **Theme:** Minimalist, high-contrast dark theme with neon-lime highlights.
- **Palette:**
  - **Background:** `#0B0D0C`
  - **Cards & Surfaces:** `#171A18`
  - **Neon-Lime Accent:** `#B7FF3C`
  - **Primary Text:** `#E8ECE8`
  - **Secondary Text:** `#9BA39B`
  - **Borders & Dividers:** `#262B27`
- **Visuals:** Subtle glow accents, sharp modern typography, and clean card containers.

---

## Planned Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **External Data:** [GitHub REST API](https://docs.github.com/en/rest)
- **Database & ORM:** [PostgreSQL 18](https://www.postgresql.org/) (v18.6 verified) & [Prisma ORM](https://www.prisma.io/)
- **Deployment Platform:** [Vercel](https://vercel.com/)
- **Development Tooling:** Antigravity (primary agentic assistant) with VS Code & PowerShell (manual fallback)

---

## Local Prerequisites

Ensure your system has the following installed before beginning application development:

- **Node.js:** v18.18+ or v20+ LTS recommended
- **npm:** Included with Node.js
- **Git:** Version 2.30+ installed and configured
- **PostgreSQL:** Version 18.x (installed locally and running on port `5432`)
- **Editor / Terminal:** Antigravity or Visual Studio Code with PowerShell

---

## Future Setup & Installation Guide

*(For use once scaffolding begins in Milestone 2 / 3)*

### 1. Clone the Repository
```bash
git clone https://github.com/JOD-X8/developer-portfolio-github-analytics.git
cd developer-portfolio-github-analytics
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory based on `.env.example`:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_analytics?schema=public"

# Optional GitHub Personal Access Token (for higher rate limits: 5000 req/hr)
GITHUB_ACCESS_TOKEN=""
```

### 4. Initialize Database Schema
```bash
npx prisma migrate dev --name init
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Documentation Navigation

- **Detailed Technical Specification:** [docs/PROJECT_SPEC.md](file:///c:/D%20drive/THE%20PROJECT/developer-portfolio-github-analytics/docs/PROJECT_SPEC.md)
- **Milestone & Status Tracker:** [PROJECT_STATUS.md](file:///c:/D%20drive/THE%20PROJECT/developer-portfolio-github-analytics/PROJECT_STATUS.md)

---

## License

This project is licensed under the MIT License.
