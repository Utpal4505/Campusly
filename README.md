# Campusly 🎓

> **Discover your people and campus opportunities.**
> A personalized campus network connecting students with hackathons, student clubs, open-source projects, and teammates tailored to their skills and interests.

---

## 🧭 Live Demo Flow

1. **Landing Page** (`/`): High-converting presentation hero with verified campus stats and product preview.
2. **Campus Login** (`/login`): Fast-track 1-click persona logins (*Rahul Sharma - AI/Backend*, *Ananya Singh - Design/CS*) or university email.
3. **Onboarding Flow** (`/onboarding`): 2-step interactive interest selector with animated personalization transition.
4. **For You Feed** (`/feed`): Curated feed with category tabs (Hackathons, Clubs, Teammates, Projects), live search, tag filters, and inline preference manager.
5. **Post Creation** (`+ Post` Modal): Live creation loop allowing students to broadcast teammate requests or campus events directly to the feed.
6. **Event Detail & Registration** (`/events/genai-hackathon`): 5-second clarity event overview with interactive digital pass reservation (`#CAMPUS-8841`).
7. **People & Profiles** (`/people`, `/people/rahul-sharma`): Skill-based peer matching and student builder portfolios.
8. **Live Messaging** (`/messages/rahul-sharma`): Real-time peer chat with automated instant reply simulation.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **State Management**: Zustand
- **Theme**: Light & Dark mode support (`next-themes`)
- **Package Manager**: pnpm monorepo

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev
```

Visit `http://localhost:3000` in your browser.
