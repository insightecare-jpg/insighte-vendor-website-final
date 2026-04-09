# Insighte Marketplace Architecture: Technical Specification v1.0

## 1. Executive Summary
The Insighte Marketplace is a high-performance discovery engine designed for 5,000+ clinical partners. It utilizes a "Weightless Monolith" philosophy—prioritizing server-side logic and minimal client-side overhead while maintaining a premium, "Sanctuary" (Antigravity) user experience.

---

## 2. Technical Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Core Framework** | Next.js 15 (App Router) | Server-side rendering, React Server Components (RSC). |
| **State Management** | Zustand | Unified global search state (`useSearchStore`). |
| **Database/Backend** | Supabase (PostgreSQL) | Data persistence, Row Level Security (RLS). |
| **Search Engine** | Supabase RPC (`search_partners`) | Server-side text search (GIN indexing) & multi-dimensional filtering. |
| **Fetching** | TanStack Query (React Query) | Infinite scroll, debounced re-fetching, and cache management. |
| **Styling** | Tailwind CSS + Framer Motion | High-density Sanctuary design system (Glassmorphism). |

---

## 3. Data Flow Architecture

### A. The Search Cycle (Client-to-Database)
1. **Input**: User interacts with the `SearchHeader` or `FilterDrawer`.
2. **State Transition**: `useSearchStore` updates global parameters (`query`, `specializations`, `careModes`, etc.).
3. **Debounce Component**: The `SearchHeader` uses `use-debounce` (300ms) to ensure state updates don't overwhelm the API.
4. **Fetching Protocol**: `PartnerGrid` detects state changes and triggers a `useInfiniteQuery` fetch.
5. **Database Invocation**: A call is made to the Supabase RPC `search_partners`.
6. **SQL Execution**: The database performs a server-side search using:
   - `tsvector` for full-text relevance.
   - JSONB containment operators for specializations.
   - Relational filtering for care modes and locations.
7. **Hydration**: The result set is streamed back to the client and rendered in the `PartnerGrid`.

### B. Discovery Modes (`Specialists` vs `Pathways`)
- **Specialists**: Direct retrieval of partner profiles.
- **Pathways**: Client-side (or server-side) filtering of curated clinical programs based on the same global search state, allowing a unified "One Search, Two Discoveries" experience.

---

## 4. Design Doctrine: The Sanctuary System
The UI adheres to the **Insighte "Sanctuary" Doctrine**:
- **Connection Before Correction**: Errors are handled with supportive microcopy; Optimistic UI ensures zero perceived lag.
- **Neuro-Affirmative**: Reduced motion support, calming color palettes, and clear visual hierarchy (Progressive Disclosure).
- **High-Density Glassmorphism**: Translucent headers and cards with sophisticated blur effects (backdrop-filter) and 1px "spectral" borders.

---

## 5. Security & Scaling
- **RLS (Row Level Security)**: Every database query is verified against the user's role and permissions.
- **RPC Encapsulation**: Complex logic is handled within Postgres functions (RPCs) to minimize network round-trips and keep business logic secure on the server.
- **Indexing**: GIN indexes on `specialization` and `bio` fields ensure sub-100ms response times for 5,000+ records.

---

## 6. Implementation Status
- [x] Unified Zustand Store (Discovery Mode Integrated)
- [x] Debounced Server-Side Search
- [x] Protocol Refining (Aesthetic Filter Drawer)
- [x] Pathways/Specialists View Switching
- [x] Infinite Scroll Hydration
