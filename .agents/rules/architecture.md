---
trigger: always_on
description: Core architectural laws and coding standards for the platform.
---

# Platform Architecture & Standards

These rules apply to all AI agents (Devin, Claude, Antigravity) working on this repository.

## 1. Zero-Friction UX
- **No Login Walls:** Do not require users to create an account to view the menu.
- **Speed:** All guest-facing pages must be optimized for instant loading (SSR/SSG). Avoid heavy client-side waterfalls.
- **Animations:** Use `framer-motion` for layout transitions and micro-interactions on the frontend to make the UI feel premium.

## 2. Backend & API Standards
- **Input Validation:** All API routes (Next.js App Router or Express) must strictly validate inputs using `zod`.
- **Typing:** Ensure complete end-to-end type safety between the API and the React frontend.
- **Sessions:** Guest sessions are tied to a `tableId` via HTTP-only cookies and validated via an OTP flow on their *first* order. Do not require OTPs for browsing.

## 3. Database (Prisma/Drizzle)
- Ensure all models map clearly to the physical domain: `Restaurant`, `Table`, `Session`, `Order`, `Payment`, `Invoice`.
- Never permanently delete historical order data (soft delete if necessary).
