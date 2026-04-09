# Frontend Architecture

## Framework
**Next.js 15** with App Router. Default to Server Components. Use Client Components only where interactivity requires it.

---

## Route Structure

```
app/
├── (public)/                        # Unauthenticated routes
│   ├── page.tsx                     # Homepage
│   ├── marketplace/
│   │   └── page.tsx                 # Provider search & listing
│   ├── providers/
│   │   └── [slug]/
│   │       └── page.tsx             # Provider profile
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx             # Service page (CMS-driven)
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── contact/page.tsx
│
├── (auth)/                          # Auth pages (no layout chrome)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── onboarding/page.tsx
│
├── (parent)/                        # Authenticated parent routes
│   ├── layout.tsx                   # Parent layout with nav
│   ├── dashboard/page.tsx
│   ├── sessions/
│   │   ├── page.tsx                 # My Sessions
│   │   └── [id]/page.tsx            # Session detail + public notes
│   ├── bookings/
│   │   ├── new/page.tsx             # Booking flow stepper
│   │   └── [id]/page.tsx
│   ├── checkout/
│   │   └── [bookingId]/page.tsx     # Payment page
│   ├── children/page.tsx            # Child profile management
│   └── reviews/page.tsx
│
├── (provider)/                      # Authenticated provider routes
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── bookings/
│   │   ├── page.tsx                 # Booking inbox
│   │   └── [id]/page.tsx
│   ├── sessions/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── notes/page.tsx       # Notes entry
│   ├── calendar/page.tsx
│   ├── profile/page.tsx
│   ├── earnings/page.tsx
│   └── clients/page.tsx
│
└── (admin)/                         # Admin-only routes
    ├── layout.tsx
    ├── dashboard/page.tsx
    ├── providers/
    │   ├── page.tsx                 # Approvals queue
    │   └── [id]/page.tsx
    ├── bookings/page.tsx
    ├── payments/page.tsx
    ├── reviews/page.tsx
    └── tickets/page.tsx
```

---

## App Areas by Role

| Area | Route Prefix | Auth Required | Role |
|---|---|---|---|
| Public site | `/` | No | All |
| Parent app | `/(parent)/` | Yes | `PARENT` |
| Provider app | `/(provider)/` | Yes | `PROVIDER` |
| Admin dashboard | `/(admin)/` | Yes | `ADMIN` |

Middleware enforces role-based redirects at the edge before any page renders.

---

## Parent App Modules

1. Authentication (OTP, Google)
2. Child profile management
3. Home / recommendations
4. Marketplace search
5. Provider listing page
6. Provider profile page
7. Booking flow (stepper)
8. Checkout and payments
9. My Sessions
10. Session detail + public notes
11. Reviews and support

---

## Provider App Modules

1. Authentication
2. KYC / onboarding flow
3. Profile editor
4. Availability calendar
5. Booking inbox
6. Session room launcher
7. Notes editor (public + private separated)
8. Earnings / payout screen
9. Notifications

---

## Admin Web Modules

1. Provider approvals queue
2. CMS & category management
3. Booking operations table
4. Payments reconciliation
5. Reviews moderation
6. Support tickets
7. Reporting dashboard

---

## State Management

| Concern | Solution |
|---|---|
| Server data / async | TanStack Query v5 |
| Client UI state | Zustand |
| Forms | React Hook Form + Zod |
| URL state (filters, sort) | `nuqs` (type-safe search params) |
| Auth state | Supabase Auth + Zustand hydration |

---

## Key Tech Decisions

- **Server Components by default** — only add `"use client"` when needed for interactivity.
- **No `any` in TypeScript.** Database types generated via `supabase gen types typescript`.
- **Tailwind + shadcn/ui** — shadcn components live in `components/ui/`. Do not modify them directly — extend via composition.
- **`next/image`** for all images with `sizes` attribute and `priority` for above-fold images.
- **`next/font`** for typography — no external CDN imports.

---

## Wireframes

### Homepage
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Logo  Home  Marketplace  Services  About  Blog  Contact  [Book]         │
├──────────────────────────────────────────────────────────────────────────┤
│ HERO: Gentle care for every child and family                            │
│ [ Explore Marketplace ]   [ Book First Session ]                        │
│ Quick search: [Service ▼] [Location ▼] [Mode ▼] [Search]               │
├──────────────────────────────────────────────────────────────────────────┤
│ TRUST BAND: 250+ professionals | Verified | Online+Offline | Notes      │
├──────────────────────────────────────────────────────────────────────────┤
│ BROWSE BY SERVICE: [Shadow] [Homecare] [Counselling] [Special Ed]       │
├──────────────────────────────────────────────────────────────────────────┤
│ BROWSE BY CATEGORY: [Partners] [Independents] [Royale]                  │
├──────────────────────────────────────────────────────────────────────────┤
│ FEATURED PROVIDERS: [Card] [Card] [Card] [Card]                         │
├──────────────────────────────────────────────────────────────────────────┤
│ HOW IT WORKS: Search → Compare → Book → Attend → View notes             │
├──────────────────────────────────────────────────────────────────────────┤
│ TESTIMONIALS / BLOG / FOOTER                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Marketplace
```
┌──────────────────────────────────────────────────────────────────────────┐
│ FILTER BAR: Service ▼  Location ▼  Experience ▼  Price ▼  Category ▼   │
├───────────────────────┬──────────────────────────────────────────────────┤
│ LEFT FILTER PANEL     │ RESULTS GRID                                     │
│ □ Shadow  □ Homecare  │ [Card] Photo | Name | Badge | ⭐ | Price          │
│ □ Online  □ Offline   │ Tags | [View Profile] [Book]                     │
│ Price slider          │ [Card] ...                                       │
│ Experience range      │                                                  │
│ [Apply] [Reset]       │ Pagination / infinite scroll                     │
└───────────────────────┴──────────────────────────────────────────────────┘
```

### Provider Profile
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Photo] Name | Badge | ⭐4.8 | 8 yrs | Bangalore | Online+Offline       │
├───────────────────────────────────────┬──────────────────────────────────┤
│ About | Credentials | Services        │ STICKY BOOKING CARD              │
│ Age groups | Approach | Reviews       │ ₹800 first session               │
│                                       │ [Service ▼] [Mode ▼] [Child ▼]  │
│                                       │ [Date picker] [Slots]            │
│                                       │ [Continue to Payment]            │
└───────────────────────────────────────┴──────────────────────────────────┘
```

---

## Responsive Rules

| Breakpoint | Behavior |
|---|---|
| Desktop (≥1024px) | Sidebar filters, sticky booking card |
| Tablet (768-1023px) | Collapsed filter bar, inline booking |
| Mobile (<768px) | Filter bottom sheet, sticky bottom CTA |

---

## Performance Budget

- Lighthouse ≥ 90 across all pages
- LCP < 2.5s
- CLS < 0.1
- FID / INP < 100ms
- Bundle analyzed before adding any new dependency
