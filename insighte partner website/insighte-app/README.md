# Insighte Platform

> Structured care marketplace for children's mental health, therapy, education, and support services.

## Core Features
- Marketplace discovery & search
- Provider profiles & verification
- Booking & session management
- Payments via Razorpay
- Session notes (public & private separation)
- Parent dashboard
- Provider dashboard
- Packages & credits system
- Provider gamification layer
- Admin operations

## Stack
- **Frontend**: Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payments**: Razorpay
- **Search**: PostgreSQL FTS (MVP) → Algolia (scale)
- **Notifications**: WhatsApp / Email / Push
- **Video**: Google Meet / WebRTC

## Architecture Philosophy
```
Problem → Service → Provider → Session → Notes → Progress → Package → Retention
```

## Project Docs
- `/vision/` — Product overview, personas, USP
- `/architecture/` — System, frontend, backend, data models, API contracts
- `/design/` — Design system, UX principles, components
- `/features/` — Detailed feature specs per domain
- `/flows/` — End-to-end user journey maps
- `/data/` — Schema docs + sample data
- `/integrations/` — Third-party integration specs
- `/ai_prompts/` — Ordered AI prompts for build phases
- `/roadmap/` — MVP, Phase 2, Phase 3
- `/qa/` — Edge cases, error states, performance, accessibility
- `/.agents/rules/` — Local agent & coding rules for this project

## Roles
| Role | Description |
|---|---|
| Parent | Primary user — discovers, books, pays, tracks |
| Provider | Therapist/Educator — manages bookings, sessions, notes |
| Admin/Ops | Approves providers, manages disputes & payouts |

## Provider Tiers
- **Insighte Partners** — Payroll-based
- **Insighte Independents** — Vetted freelancers
- **Royale Educators** — Premium, curated, invite-only

## Getting Started
```bash
npm install
npm run dev
```

> See `/.agents/rules/project_rules.md` for all coding conventions and library rules.
