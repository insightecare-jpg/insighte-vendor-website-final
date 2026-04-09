# Insighte Platform: Architectural Evolution Report

This document outlines the structural and design-centric shifts in the Insighte platform architecture as of April 2026. The evolution focuses on transitioning from a service-directory model to a **Clinical-Education Ecosystem**.

## 1. Architectural Overview

The core of the platform has shifted from static summary pages to a **Modular Engine Pattern**, allowing for rapid deployment of high-fidelity landing pages and cinematic content experiences.

## 2. Key Component Overhauls

### A. The Program Engine (`ProgramTemplate.tsx`)
Instead of 4 disparate files, the program pages now use a unified **High-Density Template**.
- **Dynamic Content Slots**: Dedicated blocks for 'Clinical Features', 'Methodology Flow', and 'Benefit Mapping'.
- **Built-in Conversion**: Integrated WhatsApp and Clinical Consultation triggers into every program page.
- **Expert Mapping**: A shared Carousel logic that dynamically filters specialists based on the program's context.

### B. Cinematic Blog Infrastructure
The blog has been rebuilt to resemble a **Modern Streaming Service (Netflix-Style)**.
- **Visual Intelligence**: Automated fallback logic for missing media using premium Unsplash identifiers.
- **Reading Modes**: `BlogPostClient` now supports tri-modal rendering (Light, Sepia, and "Sanctuary" Dark) to enhance neuro-affirmative accessibility.
- **Multimedia Core**: Native support for YouTube embeds and Podcast iFrames, allowing the blog to function as a learning hub rather than just a text repository.

### C. LMS & Enrollment Layer
- **Idempotent Seeding**: Introduction of `setup_and_seed.sql` which enforces table creation, RLS safety, and dummy data in a single transaction.
- **Interactive Enrollment**: A shifted logic in the `Courses` component that notifies parents via toast messages when enrollment is "In-Finalization," preventing abandoned clicks on dead links.

## 3. Design Doctrine: The "Sanctuary" Shift

The visual language has evolved from **"Vibrant & Bold"** to **"Weightless & Sanctuary."**

| Feature | Old Architecture | Sanctuary (New Architecture) |
| :--- | :--- | :--- |
| **Typography** | `font-black` (Heavy) | `font-bold` / `font-semibold` (Elegant) |
| **Surfaces** | Solid Backgrounds | High-Intensity Glassmorphism (120px Blur) |
| **Interactions** | Standard Links | Motion-interpolated transitions (Framer Motion) |
| **Color Palette** | Contrast-heavy | Softened clinical accents (Sage, Lavender, Sand) |

## 4. Database Schema Updates

The following tables were introduced/enhanced to support the new architecture:
- **`public.courses`**: Manages masterclass tracks, pricing, and enrollment links.
- **`public.blog_posts`**: Enhanced with `content_markdown`, `video_url`, and `podcast_url`.
- **`public.course_modules`**: Supports future expansion into structured unit-based learning.

> [!NOTE]
> All architectural shifts are documented in the `supabase/setup_and_seed.sql` and synchronized with the GitHub repository under the `main` branch.
