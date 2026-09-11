# Campusly 🎓

> **Find your people. Find your opportunities.**  
> A centralized campus network connecting students with hackathon teammates, student clubs, and campus initiatives tailored to their skills and interests.

---

## 🌟 The Problem & The Solution

| The Fragmented Reality ❌ | The Campusly Standard ✨ |
|---|---|
| **WhatsApp Noise**: Lost across 15+ muted groups, dead Discord servers, and expired Instagram stories. | **One Centralized Feed**: Every hackathon, club recruitment, and project opportunity in one ranked place. |
| **Teammate Friction**: Cold-posting *"any python devs?"* into silent groups with zero response. | **Skill-Based Discovery**: Discover student builders by stack, year, and focus, and team up with 1 click. |
| **Missed Deadlines**: Finding out about flagship hackathons or club applications the day after they close. | **Instant Passes**: Reserve hackathon passes and register for club memberships with confirmed digital passes. |

---

## 🧭 Complete Feature Tour

### 1. 🎯 Curated "For You" Feed (`/feed`)
- Real-time ranked opportunities tailored to student interests (*AI/ML, Web Dev, Design, Startups*).
- Category tabs: **⚡ Hackathons**, **🏛️ Clubs**, **👤 Teammates**, **🛠️ Projects**.
- Natural human-readable context tags (*Tomorrow · 6:00 PM*, *Recruiting Members*, *Seeking Frontend Peer*) with zero arbitrary match scores.
- Live search filtering titles, tags, and authors with instant clear.

### 2. ⚡ Universal Creation Loop (`+ Post`)
- Universal modal accessible anywhere in the top navigation.
- 3 Dedicated broadcast modes:
  - **Looking for Teammate**: Project name, skills needed, pitch, and skill tags.
  - **Host Event / Meetup**: Event title, date, venue, and description.
  - **Register Club**: Official society registration and recruitment announcement.
- Instant feedback: newly published posts appear at the top of the feed with `⚡ Posted Just Now`.

### 3. 🏛️ Campus Club Showcase & Registration (`/clubs/[slug]` & `/clubs/register`)
- **Club Details**: Meeting times (*Every Thursday · 6:00 PM · CS Hall 3*), active member counters, perks (*GPU Compute Access, Travel Grants*), and active projects.
- **Executive Leadership**: Interlinks with student profiles (*President: Priya Verma*, *Tech Lead: Rahul Sharma*).
- **Instant Membership Application**: Choose focus tracks (*ML, Robotics, Web*) and generate verified **Digital Member Passes** (`#AIRS-2026-042`).
- **Self-Serve Club Registration**: Dedicated portal for club leaders with real-time feed preview cards.

### 4. 🏆 Hackathon Details & Digital Passes (`/events/[slug]`)
- Comprehensive overview: schedule, prizes (₹50,000 pool), host information, and campus venue.
- **1-Click Registration Pass**: Instantly reserves entry pass `#CAMPUS-8841` with check-in details.

### 5. 👥 Student Directory & Builder Profiles (`/people` & `/people/[slug]`)
- Skill-based peer discovery with domain chips (*AI, Web Dev, Design, Startups, Mobile*).
- Rich student portfolios highlighting degree, bio, interests, looking-for criteria, and active projects.

### 6. 💬 Live Peer Messaging (`/messages/[slug]`)
- Interactive direct messaging with peer status indicator (*Active now*).
- Automated rapid response simulation for realistic hackathon live demos.

### 7. 🔐 Zero-Friction Campus Login (`/login`)
- 1-Click **Hackathon Demo Personas** for rapid presentation:
  - **Rahul Sharma** (CSE · AI & Backend)
  - **Ananya Singh** (Design & CS · UI/UX)
- University email sign-in (`@university.edu`).

### 8. 🎨 Adaptive Theming & Native Mobile UX
- Full **Dark & Light Mode** support powered by `next-themes` and Lucide icons.
- **Native Mobile Navigation Bar** for smartphones and mobile presentation viewports.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Typography**: [Geist Sans](https://vercel.com/font)
- **Monorepo / Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/Utpal4505/Campusly.git
cd Campusly

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Verify build
pnpm --filter web build

# Start production server
pnpm --filter web start
```

---

## 📁 Project Architecture

```text
apps/web/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider & GlobalModals
│   ├── page.tsx                # Landing page
│   ├── feed/                   # Personalized "For You" Feed
│   ├── login/                  # Campus login with 1-click demo personas
│   ├── onboarding/             # 2-step interest & goal onboarding
│   ├── events/[slug]/          # Event overview & digital ticket reservation
│   ├── clubs/[slug]/           # Club details & membership application pass
│   ├── clubs/register/         # Self-serve club registration portal
│   ├── people/                 # Student directory
│   ├── people/[slug]/          # Student builder profiles
│   └── messages/[slug]/        # Real-time peer chat interface
├── components/
│   ├── AppHeader.tsx           # Universal navigation bar & mobile bottom dock
│   ├── CreatePostModal.tsx     # 3-tab creation modal (Teammates, Events, Clubs)
│   ├── EditInterestsModal.tsx  # Non-destructive inline preferences manager
│   ├── GlobalModals.tsx        # Globally mounted application dialogs
│   ├── ThemeToggle.tsx         # Dark / Light mode switcher
│   └── ...                     # Hero, ValueProps, ProblemSection, Navbar
└── lib/
    └── store.ts                # Zustand global state (user, posts, preferences)
```

---

## 📄 License

Built for the campus builder community. Distributed under the MIT License.
