# Insighte Care Platform — v1 (Next.js 15 + Supabase)

Premium, neuro-inclusive care marketplace for families. Built with the **Antigravity** design system.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS Variables (Design Tokens)
- **Backend**: Supabase (Auth, DB, RLS, Storage)
- **State**: TanStack Query + Zustand
- **Animations**: Framer Motion + Native CSS

## Key Features
- **Discovery Engine**: Premium Marketplace for verified providers.
- **Booking Engine**: Flow-based multi-step journey (Service -> Slot -> Child -> Pay).
- **Glassmorphism UI**: High-fidelity, weightless interface with depth.
- **RBAC**: Role-based access control for Parents, Providers, and Admins.
- **Mobile First**: Minimum 44px touch targets; safe-area handling.

## Repository
- **URL**: [insighte-vendor-website-final](https://github.com/insightecare-jpg/insighte-vendor-website-final)

## Setup
1. **Environment Variables**: Use the `.env.local` file. The following keys are required:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
2. **Installation**: `npm install`
3. **Development**: `npm run dev`

---
"Connection Before Correction" — Insighte DNA.
