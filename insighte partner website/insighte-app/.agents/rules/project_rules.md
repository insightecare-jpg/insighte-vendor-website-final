# 🔒 INSIGHTE PLATFORM — LOCAL AGENT RULES

> These rules govern all AI-assisted development within the `insighte-app` project.  
> They extend the global Antigravity rules and are specific to the Insighte platform's stack, design philosophy, and operational requirements.

---

## 1. STACK & LIBRARIES

### Mandatory Stack
| Layer | Technology | Notes |
|---|---|---|
| Frontend Framework | **Next.js 15** (App Router) | Server Components by default |
| Language | **TypeScript** (strict mode) | No `any` types. Ever. |
| Styling | **Tailwind CSS** + **shadcn/ui** | No inline styles or plain CSS modules |
| Database | **Supabase + PostgreSQL** | RLS on every table, migrations only |
| Payments | **Razorpay** | Frontend + backend webhook verification |
| State | **Zustand** or **React Context** | Prefer server state via React Query / SWR |
| Forms | **React Hook Form** + **Zod** | Schema validation at the form and API layer |
| Icons | **Lucide React** | No FontAwesome or custom SVG dumps |
| Animation | **Framer Motion** | Respect `prefers-reduced-motion` always |
| Notifications | **Sonner** | Consistent toast pattern |

### Prohibited Libraries
- ❌ `moment.js` → use `date-fns` or `dayjs`
- ❌ `axios` → use native `fetch` with typed wrappers
- ❌ `react-query v3` → use **TanStack Query v5**
- ❌ Any UI library that conflicts with shadcn/ui (e.g., Chakra, MUI, Ant Design)

---

## 2. FILE & FOLDER CONVENTIONS

```
src/
├── app/                   # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui primitives (auto-generated, do not edit)
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── supabase/          # Supabase client, server, middleware
│   ├── razorpay/          # Payment utility functions
│   └── utils/             # General helpers, formatters
├── hooks/                 # Custom React hooks
├── types/                 # Global TypeScript interfaces and enums
├── services/              # Server-side data access layer (no direct DB calls in components)
└── constants/             # App-wide constants (roles, statuses, tiers, etc.)
```

### Naming Rules
- **Components**: `PascalCase.tsx` (e.g., `ProviderCard.tsx`)
- **Hooks**: `camelCase.ts` prefixed with `use` (e.g., `useBookingState.ts`)
- **Services**: `camelCase.ts` (e.g., `bookingService.ts`)
- **Types**: `PascalCase` interfaces, `SCREAMING_SNAKE_CASE` enums

---

## 3. DATABASE & SUPABASE RULES

- **Every table MUST have RLS enabled.** No exceptions. Provider data, notes, bookings — all protected at the DB level.
- **Migrations only.** Never edit the schema via the Supabase dashboard directly.
- **Private notes** (`is_private: true`) must NEVER be accessible to Parent role. Enforce via RLS policy.
- **Booking state machine:** `DRAFT → PENDING_PAYMENT → CONFIRMED → COMPLETED | CANCELLED`
- Use Supabase **Edge Functions** for webhook handlers (Razorpay callbacks, notification triggers).
- Strictly typed DB schema via `supabase gen types typescript`.

---

## 4. ROLES & RBAC

Three first-class roles defined in `types/roles.ts`:

```typescript
export enum UserRole {
  PARENT = 'parent',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}
```

| Capability | Parent | Provider | Admin |
|---|---|---|---|
| View public notes | ✅ | ✅ | ✅ |
| View private notes | ❌ | ✅ (own) | ✅ |
| Create/cancel booking | ✅ | ❌ | ✅ |
| Accept/decline booking | ❌ | ✅ | ✅ |
| Initiate payment | ✅ | ❌ | ✅ |
| Approve provider | ❌ | ❌ | ✅ |
| View earnings | ❌ | ✅ (own) | ✅ |

---

## 5. COMPONENT RULES

- All interactive elements: **minimum 44×44px touch targets**.
- Every user-facing error must use empathetic, supportive microcopy. No raw error codes.
- Use **Optimistic UI** for booking, note-saving, and review actions.
- Progressive Disclosure: don't dump all data on screen. Use accordions, sheets, and tabs.
- Skeleton loaders for all async data sections.
- **No flickering.** Hydration must be clean — prefer SSR for initial data.

---

## 6. PERFORMANCE BUDGET

- Target **Lighthouse score ≥ 90** (Performance, Accessibility, SEO).
- **100ms interaction rule**: UI must respond within 100ms. No blocking client-side operations.
- Images: Use `next/image` with proper `sizes` and `priority` attributes.
- Fonts: Load via `next/font`. No external CDN font imports.
- Bundle: Analyze with `@next/bundle-analyzer` before shipping new dependencies.

---

## 7. ACCESSIBILITY (A11Y)

- All components must pass **WCAG 2.1 AA** minimum.
- `aria-label` on all icon-only buttons.
- Focus management in modals and sheets.
- `prefers-reduced-motion`: disable Framer Motion animations when set.
- No autoplay on any media element.
- Color contrast ratio: ≥ 4.5:1 for normal text.

---

## 8. PAYMENTS (RAZORPAY)

- Booking status stays `PENDING_PAYMENT` until Razorpay webhook confirms `payment.captured`.
- Never trust client-side payment success callbacks alone — always verify via webhook.
- Store `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` in the `payments` table.
- Refunds must only be initiated by Admin role via a dedicated Edge Function.

---

## 9. SERVICES ENGINE RULES

The Services Engine is the **core differentiator**. These rules are non-negotiable:

1. Every service maps via the hierarchy: **Category → Sub-service → Use Case**.
2. Use-case language must be **parent-facing** (e.g., "my child can't focus"), not clinical.
3. A provider can offer services from **multiple categories**.
4. Package types must be linkable to specific service categories at the point of creation.
5. `service_pages` are auto-generated from the services engine data — no manually coded service pages.

---

## 10. SESSION NOTES

- `SessionNote` table has a boolean column `is_private`.
- **Public notes**: visible to parent, provider, admin.
- **Private notes**: visible to provider (own sessions only) and admin.
- RLS policy must enforce this — application-layer checks are supplementary.
- Notes must be submitted within **48 hours** of session completion (enforced via UI nudge + notification).

---

## 11. COPY & VOICE

- Tone: **Direct, warm, non-corporate**. Imagine a smart friend, not a bank.
- Error states: Empathetic ("Looks like that slot just got taken — let's find another one!" ✅ vs "Error 409: Conflict" ❌).
- Button labels: Action-first ("Book Session" ✅ vs "Submit" ❌).
- No Lorem Ipsum in any PR.

---

## 12. GIT CONVENTIONS

- Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes.
- Commit messages: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`).
- No direct pushes to `main`. All changes via PR with at least one review.
- Every migration file must be prefixed with a timestamp: `20260327_create_users_table.sql`.

---

## 13. PROVIDER TIERS (FIRST-CLASS ENTITIES)

```typescript
export enum ProviderTier {
  PARTNER = 'partner',       // Payroll-based, Insighte employees
  INDEPENDENT = 'independent', // Vetted freelancers
  ROYALE = 'royale',         // Premium curated, invite-only
}
```

Tier must affect: badge display, ranking algorithm, pricing flexibility, and visibility in search.

---

## 14. GAMIFICATION RULES

Provider levels (in order): `Starter → Growing → Pro → Elite → Royale`

Level calculation is server-side only. Never compute levels on the client.  
Metrics: sessions completed + avg rating + retention rate + notes completion rate - cancellation penalty.

---

## 15. SEARCH

- **MVP**: PostgreSQL full-text search with `tsvector` on provider name, bio, and service tags.
- **Scale**: Algolia or OpenSearch. Adapter pattern — abstract the search client behind a `searchService.ts` interface so the underlying engine can be swapped without component changes.
- Every search result must include provider tier, level badge, and primary service tags.

---

_Last updated: 2026-03-27 | Maintainer: Midhun Noble / Antigravity_
