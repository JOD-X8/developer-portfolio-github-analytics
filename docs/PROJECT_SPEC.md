# Developer Portfolio & GitHub Analytics — Project Specification

**Document Version:** 1.0.0  
**Status:** Approved for Documentation Phase  
**Target Profile:** [https://github.com/JOD-X8](https://github.com/JOD-X8)  
**Primary Coding Assistant:** Antigravity  
**Manual Fallback:** VS Code & PowerShell  

---

## 1. Executive Summary

**Developer Portfolio & GitHub Analytics** is a modern web application designed to serve as both a personal developer portfolio for **JOD-X8** and an interactive public GitHub analytics explorer. The platform merges professional personal branding (showcasing skills, featured projects, and career background) with data-driven GitHub insights (real-time repository browsing, language breakdowns, and persistent historical metrics captured over time).

---

## 2. Project Goals & Target Audience

### 2.1 Goals
- Provide a responsive, high-performance personal portfolio tailored to the approved Figma design.
- Offer live GitHub data inspection using the official GitHub REST API.
- Capture and persist historical statistics (stars, forks, public repository counts) using PostgreSQL and Prisma ORM to display verifiable trend analysis over time.
- Deliver an accessible, user-friendly experience with a dark aesthetic accented by neon lime.

### 2.2 Target Audience
- Technical recruiters, engineering hiring managers, and prospective collaborators.
- Open-source peers and developers interested in repository metrics and activity trends.
- The developer (**JOD-X8**) for tracking and presenting personal development growth.

---

## 3. Design System & Theme Specifications

The user interface follows the approved Figma design specifications.

### 3.1 Color Palette
| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| **Background** | `#0B0D0C` | Primary background color for all pages |
| **Card / Surface** | `#171A18` | Elevated surfaces, cards, modals, and container panels |
| **Accent (Neon Lime)**| `#B7FF3C` | Call-to-action buttons, active tabs, highlights, key metrics |
| **Text Primary** | `#E8ECE8` | High-contrast body text, headings, and primary labels |
| **Text Secondary** | `#9BA39B` | Subheadings, metadata, timestamps, secondary labels |
| **Border / Divider** | `#262B27` | Subtle borders for cards and table rows |

### 3.2 Visual Language & Accessibility
- **Aesthetic:** Minimalist, high-tech dark theme with subtle neon-lime glow accents.
- **Glow Effects:** Restrained box-shadow and text-shadow accents; never overwhelming or distracting from readability.
- **Contrast & Accessibility:** All text and interactive controls must adhere to WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio for normal text).
- **Responsiveness:** Fluid grid and flexbox layouts optimized for mobile (375px+), tablet (768px+), and desktop (1024px, 1440px+).

---

## 4. Page Architecture & Detailed Specifications

The application consists of three primary views accessible via a shared navigation header.

```
+-----------------------------------------------------------------------+
|  [Logo / Name]     [Portfolio Home]   [GitHub Explorer]   [Analytics]  |
+-----------------------------------------------------------------------+
|                                                                       |
|  Page View Container (Responsive Layout)                              |
|                                                                       |
+-----------------------------------------------------------------------+
|  Footer: Navigation Links | GitHub Profile Link | Copyright           |
+-----------------------------------------------------------------------+
```

### 4.1 Page 1: Portfolio Home (`/`)
Serves as the primary landing page and developer showcase.

- **Hero / Introduction:**
  - Headline, brief professional bio, and high-impact greeting.
  - Primary call-to-action buttons: "Explore GitHub Analytics", "View Featured Projects", and "Contact Me / Resume".
- **About Section:**
  - Background narrative, software engineering philosophy, and current focus areas.
- **Technical Skills:**
  - Categorized skill chips or badges (e.g., Languages, Frameworks, Databases, Tools).
  - Clean visual categorization without arbitrary percentage progress bars.
- **Featured Projects:**
  - Curated cards highlighting flagship repositories and personal applications.
  - Card elements: Project title, concise description, tech stack tags, live demo link, and GitHub repository link.
- **Live GitHub Snapshot Summary:**
  - Real-time summary widget pulling live public stats for `JOD-X8` (public repos, stars, followers).
- **Resume & Contact Links:**
  - Direct download or viewing link for resume/CV.
  - Links to LinkedIn, GitHub (`https://github.com/JOD-X8`), and contact email.

### 4.2 Page 2: GitHub Explorer (`/explorer`)
An interactive search and inspection tool for public GitHub profiles, defaulting to `JOD-X8`.

- **Profile Lookup Bar:**
  - Search input allowing users to inspect any valid public GitHub username (pre-filled with `JOD-X8`).
  - Validation: Handles invalid usernames, non-existent users, and empty inputs gracefully.
- **Profile Overview Card:**
  - Avatar, display name, handle, bio, location, company, website, and creation date.
  - Metric counters: Public Repositories, Followers, Following, Total Public Gists.
- **Repository Search & Filter Controls:**
  - **Live Search:** Instant filter by repository name or description.
  - **Language Filter:** Dropdown populated dynamically from repository primary languages.
  - **Sorting Options:** Sort by Star Count (highest to lowest), Last Updated (newest first), and Repository Name (A–Z).
- **Repository Grid / List:**
  - Repository cards containing: Name (with external link), description, primary language badge, star count, fork count, open issues count, license badge, and last updated relative timestamp.
- **Language Distribution Visualization:**
  - Visual breakdown chart (e.g., horizontal stacked bar or donut chart) showing aggregate primary language usage across the displayed repositories.

### 4.3 Page 3: Historical Analytics (`/analytics`)
Data-driven trend visualization powered by persistent PostgreSQL snapshot records.

- **Tracked Profile Overview:**
  - Displays currently tracked profile (`JOD-X8`) and tracking initiation date.
- **Key Metric Trends:**
  - Comparative cards showing net changes (e.g., star growth, fork growth, repository additions) over selected timeframes.
- **Historical Charts:**
  - **Star Growth Timeline:** Visual line chart of aggregate stars across snapshots.
  - **Repository & Fork Trajectory:** Multi-metric chart displaying repository count and fork activity over time.
- **Date Range Filters:**
  - Quick filters: Last 7 Days, Last 30 Days, Last 90 Days, All Recorded History.
- **Snapshot History Table:**
  - Tabular list of recorded collection timestamps, captured repository counts, total stars, and total forks.

---

## 5. UI States & Edge-Case Handling

Every interactive view must handle standard asynchronous states cleanly:

1. **Loading States:**
   - Display skeleton loaders matching the exact card and layout dimensions to eliminate layout shifts.
   - Restrained neon-lime shimmer animation.
2. **Empty States:**
   - Clearly explain when no repositories match the applied search query or language filter.
   - Provide a quick "Reset Filters" action.
3. **API Error Handling:**
   - Non-intrusive error banners when the GitHub REST API fails or returns non-200 responses.
   - Meaningful guidance for 404 (User Not Found) and network failures.
4. **Rate Limit Handling (HTTP 403 / 429):**
   - Detect GitHub rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`).
   - Display a user-friendly notice indicating rate limit status and the exact reset time, rather than a broken page.
5. **Unavailable Historical Data State:**
   - If historical snapshots have not yet accrued for a profile or timeframe, display an informative state: *"Historical tracking begins when recording starts. No past data exists prior to initial collection."*
   - Never fabricate or extrapolate missing data points.
6. **Prototype vs. Real Data:**
   - During development and initial scaffolding, any mock data must be explicitly labeled `[DEMO DATA]`.
   - All mock data must be replaced by live GitHub API calls and PostgreSQL records during respective milestones.

---

## 6. Technical Stack & Architecture

```
+------------------------------------------------------------------+
|                          Next.js (App Router)                    |
|       React Server Components (RSC) + Client Components          |
|                 Tailwind CSS (Neon Lime / Dark Theme)            |
+------------------------------------------------------------------+
               |                                    |
               v                                    v
+-----------------------------+      +-----------------------------+
|    GitHub REST API (v3)     |      |       Prisma ORM            |
|  - Profile & Repo Metadata  |      +-----------------------------+
|  - Real-time queries        |                     |
+-----------------------------+                     v
                                     +-----------------------------+
                                     |     PostgreSQL 18.6 DB      |
                                     |  - Tracked Profiles         |
                                     |  - Periodic Snapshots       |
                                     +-----------------------------+
```

### 6.1 Frontend & Application Framework
- **Framework:** Next.js (App Router)
- **Library:** React with TypeScript for end-to-end type safety
- **Styling:** Tailwind CSS with custom theme extensions for `#0B0D0C`, `#171A18`, `#B7FF3C`, and `#E8ECE8`
- **Icons:** Lucide React (clean, accessible vector icons)
- **Charts:** Lightweight, accessible charting library (e.g., Recharts or Chart.js)

### 6.2 Data Sources & Persistence
- **Public Data:** GitHub REST API (`https://api.github.com`).
- **Database:** PostgreSQL 18 (Local verified version: 18.6).
- **ORM:** Prisma ORM for database migrations, schema definition, and type-safe queries.

### 6.3 Deployment & Tooling
- **Hosting / Deployment:** Vercel (seamless Next.js integration).
- **Version Control:** Git & GitHub.
- **Primary AI Assistant:** Antigravity.
- **Manual Fallback Environment:** VS Code & Windows PowerShell.

---

## 7. Database Concept & Schema Design

### 7.1 Integrity Principles
1. **Verifiable Data Only:** Historical statistics strictly reflect records captured at collection time. Past data is never retroactively generated or guessed.
2. **Snapshot Deduplication:** Accidental duplicate snapshot collections within the same tracking window (e.g., multiple triggers on the same calendar day) must be rejected or updated via unique constraints.
3. **Foreign Key Integrity:** All snapshots belong to an explicitly registered `TrackedProfile`.

### 7.2 Conceptual Data Model

```
+------------------------------------+
|          TrackedProfile            |
+------------------------------------+
| id             String (CUID/UUID)  |<---+
| username       String (Unique)     |    |
| createdAt      DateTime            |    | 1
| updatedAt      DateTime            |    |
| lastSnapshotAt DateTime?           |    |
+------------------------------------+    |
                                          |
                                          | has many
                                          |
                                          | N
+------------------------------------+    |
|           StatsSnapshot            |    |
+------------------------------------+    |
| id             String (CUID/UUID)  |    |
| profileId      String (FK) --------+----+
| capturedAt     DateTime            |
| publicRepoCount Int                |
| totalStars     Int                 |
| totalForks     Int                 |
+------------------------------------+
```

### 7.3 Schema Definition Draft (Prisma)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model TrackedProfile {
  id             String          @id @default(cuid())
  username       String          @unique
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  lastSnapshotAt DateTime?
  snapshots      StatsSnapshot[]

  @@index([username])
}

model StatsSnapshot {
  id              String         @id @default(cuid())
  profileId       String
  profile         TrackedProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  capturedAt      DateTime       @default(now())
  publicRepoCount Int
  totalStars      Int
  totalForks      Int

  @@index([profileId, capturedAt])
  // Deduplication guard: one snapshot per profile per day
  @@unique([profileId, capturedAt])
}
```

---

## 8. Security & Configuration Rules

1. **Zero Secret Leakage:**
   - Never commit sensitive keys, passwords, or tokens to version control.
   - All credentials must reside in `.env.local` (ignored by `.gitignore`).
2. **Environment Variables Template (`.env.example`):**
   - Provide a sanitized `.env.example` defining required variable names without real values:
     - `DATABASE_URL` (PostgreSQL connection string)
     - `GITHUB_ACCESS_TOKEN` (optional PAT for elevated rate limits: 5,000 req/hr vs 60 req/hr)
3. **Server-Side API Handling:**
   - Any authenticated requests to GitHub utilizing a personal access token must execute strictly inside Next.js Server Components or API Route handlers to avoid exposing tokens in browser bundles.
4. **Input Validation:**
   - Sanitize all username inputs in GitHub Explorer to prevent URL injection and malicious request forging.

---

## 9. Project Milestones & Roadmap

| Milestone | Description | Status |
| :---: | :--- | :---: |
| **1** | **Design Approval:** Approved Figma design and visual color theme | **Completed** |
| **2** | **Documentation & Project Foundation:** Architecture specs, status tracking, README, environment verification | **In Progress (Current)** |
| **3** | **Portfolio UI Implementation:** Next.js scaffolding, Tailwind theme, Hero, About, Skills, Featured Projects | Planned |
| **4** | **GitHub API Integration:** Public profile fetching, repository search, filtering, sorting, language chart | Planned |
| **5** | **PostgreSQL & Prisma Analytics:** Database migrations, snapshot collection logic, historical timeline & charts | Planned |
| **6** | **Testing, Accessibility & Polish:** Responsive verification, WCAG AA compliance, loading/error states | Planned |
| **7** | **Deployment & Documentation:** Vercel production deployment, final documentation update | Planned |

---

## 10. Acceptance Criteria

- [ ] **Design Fidelity:** UI strictly adheres to `#0B0D0C` background, `#171A18` cards, `#B7FF3C` accent, and `#E8ECE8` text.
- [ ] **Portfolio Content:** Showcases accurate profile details and links for `https://github.com/JOD-X8` without fabricated accomplishments.
- [ ] **Explorer Capabilities:** Successfully loads public profiles, searches repositories, filters by language, and sorts by stars/updates/name.
- [ ] **Historical Analytics:** Accurately persists and visualizes snapshots over time without backfilling fake historical points.
- [ ] **Error Resilience:** Handles GitHub rate limits and missing profiles gracefully with clear feedback.
- [ ] **Accessibility & Performance:** Semantic HTML, keyboard navigable, responsive across mobile and desktop.
- [ ] **Clean Code & Security:** Zero secrets in Git; TypeScript strict mode enabled.

---

## 11. Known Limitations

- **GitHub REST API Rate Limits:** Unauthenticated client requests are limited to 60 requests per hour per IP. Providing an optional server-side token raises the limit to 5,000 requests per hour.
- **Historical Scope:** GitHub's public API does not provide day-by-day historical star logs retrospectively for arbitrary profiles. Historical analytics are available exclusively starting from the moment snapshot collection begins.
- **Public Visibility Only:** The application only accesses and calculates metrics for public repositories. Private repository metrics are excluded by design.
