# EduWeConnect Frontend

**Unified Operating System for Schools & Colleges — India**  
Built with React 18 + Vite + TypeScript (strict) + TanStack Query v5 + Tailwind CSS v3 + Sonner

---

## 🚀 Getting Started

```bash
npm install
npm run dev          # http://localhost:7000
npx tsc --noEmit     # Must show 0 errors before every commit/PR
```

---

## 🤖 For Developers & AI Agents — READ FIRST

> This project contains two rule files. **Read one of them before touching any code.**

| File | Who reads it | Purpose |
|---|---|---|
| [`AGENTS.md`](./AGENTS.md) | **AI agents** (Antigravity, Copilot, Cursor) | Auto-loaded system rules |
| [`.agents/rules/frontend-architecture.md`](./.agents/rules/frontend-architecture.md) | **Human developers** | Same rules, also in `.agents/` folder |

Both files are **identical**. They cover:
- File naming conventions (kebab-case — why, how, what's banned)
- Feature module 11-layer structure
- Coding patterns (named exports, `function` declarations, zero `any`)
- TanStack Query Key Factory + `staleTime: 0`
- API layer (`unknown` + Zod parse)
- Manager-approved design system tokens
- Full UI component library usage
- Complete anti-pattern reference (BAD → GOOD table)

---

## 🎨 Design System — Manager-Approved Tokens

> **DO NOT use hardcoded hex values anywhere.** Always use `var(--token-name)`.

| Token | Value | Used For |
|---|---|---|
| `--navy` | `#102A43` | Headings, buttons, active states |
| `--deep-navy` | `#0B1F33` | Footer, dark hover states |
| `--gold` | `#B8862C` | Accents, icons, highlights |
| `--light-gold` | `#D6A84F` | Gradient endpoint |
| `--cream` | `#F7F1E3` | Page background base |
| `--warm-white` | `#FFFDF8` | Card backgrounds |
| `--beige` | `#EDE2CC` | Hover states, skeleton |
| `--sand` | `#D8C29D` | Secondary backgrounds |
| `--text-primary` | `#102A43` | All headings |
| `--text-secondary` | `#536579` | Sub-text |
| `--text-muted` | `#7C8794` | Labels, captions |
| `--border` | `#DED5C5` | All borders |
| `--input-bg` | `#FFFCF6` | Input backgrounds |
| `--success` | `#56745A` | Success states |
| `--page-background` | gradient | Body background |
| `--card-background` | rgba warm-white | All cards |
| `--card-shadow` | `0 20px 60px ...` | Card elevation |
| `--button-background` | `#102A43` | Primary buttons |
| `--button-hover` | `#0B1F33` | Button hover |
| `--gold-gradient` | linear gradient | Decorative panels |
| `--footer-background` | `#0B1F33` | Footer |
| `--footer-text` | `#F7F1E3` | Footer text |
| `--footer-accent` | `#D6A84F` | Footer links |

---

## 🏗️ Project Structure

```
src/
├── assets/images/          # Image asset registry
├── components/
│   ├── ui/                 # 29 UI primitives (import from '@/components/ui')
│   │   ├── spinner.tsx     # ONLY loading indicator — NEVER plain text
│   │   ├── button.tsx      # 6 variants: primary/secondary/outline/ghost/danger/gold
│   │   ├── dialog.tsx      # REPLACES window.confirm() — MANDATORY
│   │   ├── action-icon-button.tsx  # View/Edit/Delete table actions
│   │   └── index.ts        # ← always import from here
│   ├── app-header.tsx
│   ├── app-sidebar.tsx
│   └── protected-route.tsx
├── contexts/
│   └── auth-context.tsx    # useAuth() — single source of truth
├── features/               # 13 Domain Modules (see below)
├── layouts/
│   ├── auth-layout.tsx
│   └── dashboard-layout.tsx
├── lib/
│   ├── api-client.ts       # Axios + Bearer token + 401 redirect + formatApiClientError
│   ├── lazy-with-retry.ts  # Prevents stale chunk errors after deployments
│   └── utils.ts            # cn(), formatInr(), formatDate()
├── routes.tsx              # lazyWithRetry() direct file imports
├── main.tsx
└── index.css               # All :root CSS tokens
```

---

## 📦 Feature Module Structure (Mandatory 11-Layer Anatomy)

Every domain in `src/features/<domain>/` MUST follow this **exact** structure:

```
features/<domain>/
├── api/          <domain>.api.ts     ← Axios calls, unknown + Zod parse
├── components/   <domain>-*.tsx      ← Pure UI, typed props only
├── constants/    constants.ts        ← Routes, columns, badge classes
├── enums/        <domain>.enum.ts    ← Lowercase DB-matched enums
├── hooks/        use-<domain>-list.ts ← Master facade hook
├── mutations/    create/update/delete-<domain>.ts  ← 1 file per action
├── pages/        <domain>-page.tsx   ← export default function
├── queries/      keys.ts + get-<domain>.ts ← staleTime: 0 mandatory
├── schemas/      schemas.ts          ← Zod schemas
├── types/        types.ts            ← ALL types centralized here
├── utils/        utils.ts            ← Domain helpers
└── index.ts                         ← THE ONLY index.ts (public barrel)
```

---

## 📚 13 Feature Modules

| # | Module | Path |
|---|---|---|
| 0 | Auth — Login, OTP, Forgot Password | `features/auth/` |
| 1 | Dashboard — Multi-role KPI Hub | `features/dashboard/` |
| 2 | Chat & Video Calls | `features/chat-calls/` |
| 3 | Academic Calendar & Timetable | `features/calendar/` |
| 4 | Announcements & Broadcasts | `features/announcements/` |
| 5 | Academic Resources — Notes, PDFs, Videos | `features/academic-resources/` |
| 6 | Attendance — Student & Staff ✅ **Reference Module** | `features/attendance/` |
| 7 | Admissions — Application Portal | `features/admissions/` |
| 8 | Recruitment — Job Board & ATS | `features/recruitment/` |
| 9 | Test Marks — Gradebook & Report Cards | `features/test-marks/` |
| 10 | Test Scheduling — Exams & Hall Tickets | `features/test-scheduling/` |
| 11 | Finance & Fees | `features/finance-fees/` |
| 12 | Celebrations — School Gallery | `features/celebrations/` |
| 13 | Birthdays — Wishing Wall | `features/birthdays/` |

> 📌 **`features/attendance/`** is the **reference implementation**. When building any new module, copy its structure exactly.

---

## ✅ Pre-Commit Checklist

```bash
npx tsc --noEmit    # → 0 errors required
```

- [ ] All new files use **kebab-case** naming
- [ ] Zero `any` types
- [ ] Zero inline `interface` in `.tsx` files
- [ ] Zero `window.confirm()` — use `<Dialog>` instead
- [ ] Every mutation has `toast.success()` + `toast.error(formatApiClientError(...))`
- [ ] Every query has `staleTime: 0`
- [ ] Loading states use `<Spinner />` — never plain text
- [ ] All colors via `var(--token)` — no hardcoded hex values
- [ ] Cross-feature imports only via `@/features/<domain>` barrel

---

## 🧰 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI |
| Vite | 5 | Build |
| TypeScript | 5 (strict) | Type safety |
| TanStack Query | v5 | Server state |
| React Router | v6 | Routing |
| React Hook Form + Zod | latest | Forms + validation |
| Axios | 1.7 | HTTP |
| Sonner | 1.5 | Toasts |
| Tailwind CSS | v3 | Utility classes |
| Lucide React | latest | Icons |

---

*Architecture validated against MNC enterprise standards — Google, Airbnb, Microsoft, Atlassian (2024–2026)*
