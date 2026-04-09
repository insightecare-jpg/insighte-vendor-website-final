# Insighte Platform — Imported Skills Registry
# Sourced from: /Users/midhunnoble/.gemini/antigravity/skills/
# Last imported: 2026-03-27

## How to Use Skills
When a task matches a skill's trigger description, read the corresponding SKILL.md
before proceeding. Skills provide deep, curated guidance beyond general knowledge.

---

## Full Skill Index

### 🌐 Browser & Automation
| Skill | Path | Trigger |
|-------|------|---------|
| `agent-browser` | `.gemini/antigravity/skills/agent-browser/SKILL.md` | Navigating pages, filling forms, clicking buttons, taking screenshots, scraping data, testing web apps, automating browser actions |

---

### 🎨 Design & UI/UX

| Skill | Path | Trigger |
|-------|------|---------|
| `antigravity-design-expert` | `.gemini/antigravity/skills/antigravity-design-expert/SKILL.md` | Building spatial, glassmorphism, GSAP-animated, isometric, or "weightless" web interfaces |
| `ui-ux-pro-max` | `.gemini/antigravity/skills/ui-ux-pro-max/SKILL.md` | Designing new pages, refactoring components, choosing color/typography/layout systems, reviewing UI for a11y or UX quality |
| `web-design-guidelines` | `.gemini/antigravity/skills/web-design-guidelines/SKILL.md` | Auditing UI code against Vercel Web Interface Guidelines; "review my UI", "check accessibility", "audit design" |
| `ux-copy` | `.gemini/antigravity/skills/ux-copy/SKILL.md` | Writing or reviewing microcopy, error messages, empty states, CTAs, confirmation dialogs, onboarding text |
| `marketing-psychology` | `.gemini/antigravity/skills/marketing-psychology/SKILL.md` | Applying psychology/behavioral science to copy or UI; anchoring, social proof, loss aversion, scarcity, framing |

---

### 📱 Mobile

| Skill | Path | Trigger |
|-------|------|---------|
| `mobile-design` | `.gemini/antigravity/skills/mobile-design/SKILL.md` | iOS/Android app design and engineering; touch interaction, performance, offline, platform conventions |
| `mobile-first-design` | `.gemini/antigravity/skills/mobile-first-design/SKILL.md` | Responsive design; designing small-screen first and scaling up |
| `mobile-responsiveness` | `.gemini/antigravity/skills/mobile-responsiveness/SKILL.md` | Building responsive layouts, mobile navigation, touch events, breakpoints, viewport, `dvh` |
| `mobile-touch` | `.gemini/antigravity/skills/mobile-touch/SKILL.md` | iOS/Android gestures, haptic feedback, Disney animation principles applied to mobile touch |
| `mobile-ux-optimizer` | `.gemini/antigravity/skills/mobile-ux-optimizer/SKILL.md` | Viewport issues (`100vh`), safe areas, notches, touch targets, swipe gestures, mobile performance |

---

### ♿ Accessibility

| Skill | Path | Trigger |
|-------|------|---------|
| `web-accessibility` | `.gemini/antigravity/skills/web-accessibility/SKILL.md` | WCAG compliance, semantic HTML, keyboard navigation, screen readers, ARIA, form labels, touch targets, i18n |

---

### ⚡ Performance & Architecture

| Skill | Path | Trigger |
|-------|------|---------|
| `next-cache-components` | `.gemini/antigravity/skills/next-cache-components/SKILL.md` | Next.js 16+ PPR, `use cache` directive, `cacheLife`, `cacheTag`, `updateTag`, migrating from `unstable_cache` |
| `vercel-react-best-practices` | `.gemini/antigravity/skills/vercel-react-best-practices/SKILL.md` | React/Next.js perf optimization; waterfalls, bundle size, server rendering, re-renders, data fetching |
| `turborepo` | `.gemini/antigravity/skills/turborepo/SKILL.md` | Monorepo build system; `turbo.json`, task pipelines, caching, remote cache, `--affected`, CI optimization |

---

### 🧪 Testing & Code Quality

| Skill | Path | Trigger |
|-------|------|---------|
| `vitest-testing` | `.gemini/antigravity/skills/vitest-testing/SKILL.md` | Writing unit/integration tests with Vitest; `vi.mock`, `vi.fn`, snapshots, coverage, async testing |
| `clean-code` | `.gemini/antigravity/skills/clean-code/SKILL.md` | Reviewing or refactoring code for readability; naming, functions, formatting, error handling (Uncle Bob principles) |
| `create-architectural-decision-record` | `.gemini/antigravity/skills/create-architectural-decision-record/SKILL.md` | Creating ADR documents for architectural decisions; saves to `/docs/adr/` |

---

### 🔍 Meta / Discovery

| Skill | Path | Trigger |
|-------|------|---------|
| `find-skills` | `.gemini/antigravity/skills/find-skills/SKILL.md` | Finding and installing new skills from skills.sh; "is there a skill for X", "find a skill for X" |

---

## Insighte Platform — Priority Skill Mapping

Given the platform's nature (marketplace for care providers, mobile-primary, neuro-inclusive),
these skills are most frequently relevant:

### Always Apply
- `web-accessibility` — every UI component
- `mobile-ux-optimizer` — every screen (mobile-primary product)
- `vercel-react-best-practices` — every React/Next.js component

### Apply When Building UI
- `ui-ux-pro-max` — design system decisions, new pages, component reviews
- `antigravity-design-expert` — premium aesthetic, glassmorphism, animations
- `ux-copy` — all user-facing text: errors, CTAs, empty states

### Apply When Building Features
- `next-cache-components` — provider listings, search, CMS content (heavy caching opportunity)
- `mobile-first-design` + `mobile-responsiveness` — booking flows, session notes

### Apply When Reviewing/Auditing
- `web-design-guidelines` — pre-launch UI audits
- `clean-code` — PR reviews, refactoring sessions
- `vitest-testing` — writing tests for business logic (booking state machine, payment flows)
