# 🏫 EduWeConnect Frontend
## Unified Operating System for Schools & Colleges — India

> **For AI Agents (Antigravity, Copilot, Cursor, etc.):** This file is your system prompt. Read it entirely before writing any code.
> **For Human Developers:** This is your project bible. Read it before your first commit.

**Stack:** React 18 · Vite · TypeScript strict · TanStack Query v5 · React Hook Form + Zod · Axios · Sonner · Tailwind CSS v3 · Lucide React

---

## 🚀 Getting Started

```bash
npm install
npm run dev          # http://localhost:7000
npx tsc --noEmit     # Must show 0 errors before every commit/PR
```

### Port Convention (Manager-approved, MNC Standard)

| Service | Port | Notes |
|---|---|---|
| **Frontend** (Vite dev) | `7000` | `strictPort: true` — fails if port taken |
| **Backend** (NestJS API) | `7001` | Proxied via `/api` in vite.config.ts |
| Dev proxy | `/api → 7001` | No CORS issues in development |

> **Rule:** Port is defined **only** in `vite.config.ts`. Never hardcode `localhost:7000` anywhere else in source code. Use relative `/api` paths for all API calls — the proxy handles the rest.

---

## 📦 Feature Modules

| # | Module | Path | Status |
|---|---|---|---|
| 0 | Auth — Login, OTP, Forgot Password | `features/auth/` | ✅ Implemented |
| 1 | Attendance — Student & Staff | `features/attendance/` | ✅ Reference Implementation |
| 2 | Admissions — Application Portal | `features/admissions/` | 🔲 Ready to build on request |
| 3 | Academic Resources — Notes, PDFs, Videos | `features/academic-resources/` | 🔲 Ready to build on request |
| 4 | Test Marks — Gradebook & Report Cards | `features/test-marks/` | 🔲 Ready to build on request |
| 5 | Test Scheduling — Exams & Hall Tickets | `features/test-scheduling/` | 🔲 Ready to build on request |
| 6 | Finance & Fees | `features/finance-fees/` | 🔲 Ready to build on request |
| 7 | Recruitment — Job Board & ATS | `features/recruitment/` | 🔲 Ready to build on request |
| 8 | Academic Calendar & Timetable | `features/calendar/` | 🔲 Ready to build on request |
| 9 | Announcements & Broadcasts | `features/announcements/` | 🔲 Ready to build on request |
| 10 | Chat & Video Calls | `features/chat-calls/` | 🔲 Ready to build on request |
| 11 | Celebrations — School Gallery | `features/celebrations/` | 🔲 Ready to build on request |
| 12 | Birthdays — Wishing Wall | `features/birthdays/` | 🔲 Ready to build on request |

> 📌 **`features/attendance/`** is the **reference implementation**. Copy its exact structure for every new module. Build one module at a time on user request.

---

## 🎨 Design System — Manager-Approved Tokens (DO NOT CHANGE)

> Every color in the app MUST come from this token set. Zero hardcoded hex values anywhere.

```css
:root {
  /* Primary Brand */
  --navy: #102A43;          /* Headings, buttons, active nav */
  --deep-navy: #0B1F33;     /* Footer, dark hover */
  --gold: #B8862C;          /* Accents, icons, highlights */
  --light-gold: #D6A84F;    /* Gradient endpoint */

  /* Backgrounds */
  --cream: #F7F1E3;         /* Page background base */
  --warm-white: #FFFDF8;    /* Card backgrounds */
  --beige: #EDE2CC;         /* Hover states, skeleton */
  --sand: #D8C29D;          /* Secondary backgrounds */

  /* Text */
  --text-primary: #102A43;  /* Headings */
  --text-secondary: #536579;/* Sub-text */
  --text-muted: #7C8794;    /* Labels, captions */

  /* UI Elements */
  --border: #DED5C5;        /* All borders */
  --input-bg: #FFFCF6;      /* All input backgrounds */
  --success: #56745A;       /* Success states */

  /* Composite */
  --page-background: linear-gradient(135deg, #F7F1E3 0%, #FFFDF8 45%, #EDE2CC 100%);
  --card-background: rgba(255, 253, 248, 0.96);
  --card-shadow: 0 20px 60px rgba(16, 42, 67, 0.15);
  --button-background: #102A43;
  --button-hover: #0B1F33;
  --button-text: #FFFFFF;
  --gold-gradient: linear-gradient(135deg, #B8862C, #D6A84F);
  --footer-background: #0B1F33;
  --footer-text: #F7F1E3;
  --footer-accent: #D6A84F;
}
```

---

## 🧩 UI Component Library (`src/components/ui/`)

> **STRICT COMPONENT REUSE RULE — ZERO INLINE UI CREATION:**
> All UI primitives in `@/components/ui` are finalized, token-aligned, and manager-approved.
> 1. **NEVER create inline/custom UI components** inside features or pages (e.g. inline pagination toolbars, inline dropdowns, raw `<select>`, ad-hoc modal boxes, custom alert popups, inline checkboxes, custom spinners).
> 2. **ALWAYS import directly from the central `@/components/ui` barrel.**
>    - ✅ `import { Button, Spinner, Dropdown, SearchDropdown, MultiSelectDropdown, MasterCodePagination, Dialog, Table, toast } from '@/components/ui'`
>    - ❌ `import { Button } from '@/components/ui/button'`
>    - ❌ Writing custom pagination, raw select tags, or custom popup structures inside feature pages is strictly forbidden.

| Category | Components |
|---|---|
| **Loading/Feedback** | `Spinner` · `Toaster` · `toast` · `Alert` · `Skeleton/SkeletonRow/SkeletonCard` · `Progress` |
| **Actions** | `Button` (primary/secondary/outline/ghost/danger/gold) · `ActionIconButton` (view/edit/delete) |
| **Form Controls** | `Input` · `SearchInput` · `Textarea` · `Label` · `FormError` · `Dropdown` · `SearchDropdown` · `MultiSelectDropdown` · `Checkbox` · `Switch` · `RadioGroup` |
| **Layout/Surface** | `Card/CardHeader/CardTitle/CardContent/CardFooter` · `Separator` · `Divider` · `StatCard` · `EmptyState` |
| **Data Display** | `Badge` (6 variants) · `Avatar/AvatarImage/InitialsAvatar` · `Table/TableHead/TableBody/TableRow/TableHeader/TableCell` |
| **Navigation** | `Tabs/TabPanel` · `Breadcrumb` · `Pagination/MasterCodePagination` |
| **Overlays** | `Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter/DialogClose` · `Sheet/SheetContent/SheetHeader/SheetTitle/SheetFooter` · `DropdownMenu/DropdownTrigger` · `Popover` · `Tooltip` |

---

## ✅ Pre-Commit Checklist

```bash
npx tsc --noEmit   # → 0 errors required
```

- [ ] All new files use **kebab-case** (`attendance-page.tsx` not `AttendancePage.tsx`)
- [ ] Zero `any` types anywhere
- [ ] Zero inline `interface` inside `.tsx` files (use `types/types.ts`)
- [ ] Zero `window.confirm()` — use `<Dialog>` instead
- [ ] Every mutation has `toast.success()` + `toast.error(formatApiClientError(...))`
- [ ] Every query has `staleTime: 0`
- [ ] **Mandatory Spinner on every API call:** Buttons must have `isLoading={mutation.isPending}`, tables/pages must render `<Spinner />` until the API succeeds.
- [ ] Loading states use `<Spinner />` or `<SkeletonRow />` — never `<p>Loading...</p>`
- [ ] All colors use `var(--token)` — no hardcoded hex values
- [ ] Form labels use `text-xs` (12px) — never `text-sm`
- [ ] Cross-feature imports only via `@/features/<domain>` barrel (`index.ts`)
- [ ] `useInvalidate<Domain>()` exported from every feature queries file

---

---

# 🤖 AI AGENT RULES — MANDATORY
## Read every section below before writing any code.

> Derived from: MNC enterprise standards (Google · Airbnb · Microsoft 2024–2026)

---

## SECTION 1: FILE & FOLDER NAMING — kebab-case EVERYWHERE

**Why?** Linux CI/CD is case-sensitive. `LoginPage.tsx` and `loginpage.tsx` are different files on Linux but the same on Windows → silent production crashes.

| Entity | Convention | Example |
|---|---|---|
| All folders | kebab-case | `chat-calls/`, `test-marks/` |
| React component files | kebab-case | `login-page.tsx`, `attendance-table.tsx` |
| Hook files | kebab-case | `use-attendance-list.ts` |
| API files | kebab-case | `attendance.api.ts` |
| Mutation files | kebab-case | `create-attendance.ts` |
| Query files | kebab-case | `get-attendances.ts`, `keys.ts` |
| Enum files | kebab-case | `attendance.enum.ts` |
| Schema/Type/Constant/Util files | exact name | `schemas.ts` · `types.ts` · `constants.ts` · `utils.ts` |

**Exported symbols INSIDE files still use PascalCase/camelCase:**
```ts
// File: attendance-table.tsx  (kebab filename)
export function AttendanceTable(props: AttendanceTableProps) { ... }  // PascalCase inside

// File: use-attendance-list.ts  (kebab filename)
export function useAttendanceList(params: AttendanceListParams) { ... }  // camelCase inside
```

**BANNED:**
```
AttendancePage.tsx    → use attendance-page.tsx
types/index.ts        → use types/types.ts
schemas/index.ts      → use schemas/schemas.ts
constants/index.ts    → use constants/constants.ts
```

---

## SECTION 2: MANDATORY FEATURE MODULE STRUCTURE (11 layers)

```
src/features/<domain>/
├── api/           <domain>.api.ts       ← ONLY file. NEVER index.ts inside.
├── components/    <domain>-*.tsx        ← Pure UI, typed props only
├── constants/     constants.ts          ← ALWAYS this exact name
├── enums/         <domain>.enum.ts      ← lowercase DB-matched values
├── hooks/         use-<domain>-list.ts  ← master facade hook
├── mutations/     create/update/delete-<domain>.ts  ← 1 file per action
├── pages/         <domain>-page.tsx     ← export default function
├── queries/       keys.ts + get-<domain-plural>.ts
├── schemas/       schemas.ts            ← ALWAYS this exact name
├── types/         types.ts              ← ALL types here. NOWHERE else.
├── utils/         utils.ts              ← ALWAYS this exact name
└── index.ts                            ← THE ONLY index.ts in the feature
```

**BANNED inside features:**
```
features/attendance/types/index.ts     ← inner index.ts BANNED
features/attendance/constants/index.ts ← inner index.ts BANNED
Inline interface in .tsx               ← move to types/types.ts
import from @/features/x/components/y ← use @/features/x via barrel
```

---

## SECTION 3: CODING PATTERNS

### Component Declaration
```tsx
// ✅ CORRECT — function declaration for pages (clearer stack traces)
export default function AttendancePage() { return <div>...</div> }

// ✅ CORRECT — named function for components
export function AttendanceTable(props: AttendanceTableProps) { ... }

// ❌ BANNED — anonymous arrow for page-level
export default () => <div>...</div>
```

### Named Exports Only (except pages)
```ts
// ✅ CORRECT
export function useCreateAttendanceMutation() { ... }
export const attendanceKeys = { ... }

// ❌ BANNED on mutations/queries/hooks
export default function createAttendance() { ... }
```

### Props — always in types/types.ts
```tsx
// ❌ BANNED — inline interface in component
function AttendanceTable({ rows }: { rows: AttendanceRecord[] }) { ... }

// ✅ CORRECT
import type { AttendanceTableProps } from '../types/types'
export function AttendanceTable({ rows }: AttendanceTableProps) { ... }
```

### TypeScript — Zero any
```ts
// ❌ BANNED
const data: any = response.data

// ✅ CORRECT
const response = await apiClient.get<unknown>(url)
const parsed = mySchema.parse(response.data)  // Zod parse after unknown
```

---

## SECTION 4: TANSTACK QUERY STANDARDS

### Query Key Factory (`queries/keys.ts`)
```ts
export const attendanceKeys = {
  all:     ['attendance'] as const,
  lists:   () => [...attendanceKeys.all, 'list'] as const,
  list:    (params: AttendanceListParams) => [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail:  (id: string) => [...attendanceKeys.details(), id] as const,
}
```

### Query Hook — staleTime: 0 is MANDATORY
```ts
export const attendanceListQueryOptions = (params: AttendanceListParams = {}) =>
  queryOptions({
    queryKey:        attendanceKeys.list(params),
    queryFn:         () => getAttendances(params),
    placeholderData: keepPreviousData,
    staleTime:       0,   // MANDATORY — never omit
  })
```

### Mutation — toast + invalidateQueries on EVERY mutation
```ts
export function useCreateAttendanceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAttendanceDto) => createAttendanceApi(payload),
    onSuccess: async () => {
      toast.success('Attendance marked successfully!')
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
    },
    onError: (error: Error) => {
      toast.error(formatApiClientError(error, 'Failed to mark attendance.'))
    },
  })
}
### Mandatory Loading Spinner on EVERY API Call
```tsx
// 1. In Query/Page views — Show centered Spinner or Skeleton until data is ready:
if (isLoading) {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}

// 2. In Mutation/Form submit buttons — Always bind isLoading={mutation.isPending}:
<Button
  type="submit"
  variant="primary"
  isLoading={createMutation.isPending}
>
  Save Record
</Button>

// 3. Inside Modals / Dialogs / Side Sheets:
// While fetching modal edit data, show centered Spinner; during submit, bind isLoading to modal action button:
{isLoadingRecord ? (
  <div className="flex h-48 items-center justify-center">
    <Spinner size={32} />
  </div>
) : (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Form Inputs */}
    <DialogFooter>
      <Button variant="outline" disabled={updateMutation.isPending} onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" isLoading={updateMutation.isPending}>
        Save Changes
      </Button>
    </DialogFooter>
  </form>
)}
```

---

## SECTION 5: API LAYER

```ts
// File: api/attendance.api.ts
import { apiClient } from '@/lib/api-client'
import { attendanceListResponseSchema } from '../schemas/schemas'

const BASE = '/attendance'

export async function getAttendances(params: AttendanceListParams): Promise<AttendanceListResponse> {
  const response = await apiClient.get<unknown>(BASE, { params })   // ← always unknown
  return attendanceListResponseSchema.parse(response.data)           // ← Zod parse
}
```

---

## SECTION 6: ENUM STANDARDS

```ts
// File: enums/attendance.enum.ts
// Values MUST match backend DB enum values exactly (lowercase)
export const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT:  'absent',
  LATE:    'late',
} as const
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]

// ❌ BANNED — hardcoded string literals
if (record.status === 'present') { ... }

// ✅ CORRECT — always use enum constants
if (record.status === AttendanceStatus.PRESENT) { ... }
```

---

## SECTION 7: DESIGN SYSTEM RULES

### Token usage (context → token)
```
Page background       → var(--page-background)
Primary buttons       → var(--button-background) / var(--button-hover) / var(--button-text)
Gold accents          → var(--gold-gradient) / var(--gold) / var(--light-gold)
Headings              → var(--text-primary)
Sub-text              → var(--text-secondary)
Captions/labels       → var(--text-muted)
Cards                 → var(--card-background) + var(--card-shadow)
Inputs                → var(--input-bg) + var(--border) + focus: var(--navy)
Footer                → var(--footer-background) / var(--footer-text) / var(--footer-accent)
Success               → var(--success)
```

### Absolute bans
```tsx
// ❌ BANNED — hardcoded hex
<div style={{ background: '#102A43' }}>     → use var(--navy)
<p className="text-blue-600">               → wrong brand color

// ❌ BANNED — plain text loading
<p>Loading...</p>                           → use <Spinner size={32} />

// ❌ BANNED — wrong label size
<label className="text-sm">Name</label>    → use text-xs (12px) mandatory

// ❌ BANNED — native browser dialog
window.confirm('Are you sure?')            → use <Dialog> ALWAYS
```

---

## SECTION 8: UI COMPONENT ARCHITECTURE (Radix Primitives + Custom Design Tokens)

> **MNC HYBRID ARCHITECTURE STANDARD**:
> We use **Radix UI Primitives** (accessible, keyboard-first, WAI-ARIA compliant headless engine) styled with **Custom Design Tokens** (`var(--navy)`, `var(--gold)`, `var(--cream)`, `var(--border)`).
> - **100% Code Ownership**: All primitives live directly in `src/components/ui/` — zero heavy external npm CSS locks.
> - **Accessibility Out-Of-The-Box**: Keyboard focus, Tab/Esc/Arrow navigation, focus traps, and ARIA attributes are handled automatically.
> - **Brand Fidelity**: Zero generic styling — strictly uses the manager-approved color palette and tokens.

### 📊 Architecture Comparison: Custom UI vs. shadcn/ui Hybrid

| Feature | 🛠️ Custom UI (From Scratch) | ⚡ shadcn/ui Hybrid Standard (Our Approach) |
| :--- | :--- | :--- |
| **Accessibility (WAI-ARIA)** | ❌ Build keyboard navigation (Arrow keys, Esc, Tab), focus traps, and screen reader labels manually. | ✅ **100% WAI-ARIA compliant** out of the box. |
| **Edge-case handling** | ⚠️ Popover collisions, scroll locking, and mobile touch events require writing lots of custom JavaScript. | ✅ Handled automatically by Radix primitives. |
| **Code Ownership** | ✅ You own the code in your repository. | ✅ **You own 100% of the code** in `src/components/ui/` (no npm lock-in). |
| **Customization** | ⭐⭐⭐⭐⭐ Unlimited | ⭐⭐⭐⭐⭐ **Unlimited** (Tailwind + CSS variables). |
| **Development Speed** | 🐢 Slower (spending days fixing popover/modal bugs). | 🚀 **Very fast** (drop in component, tune brand colors, done). |
| **MNC Standard** | Used in specialized legacy apps. | **Current industry standard** (Vercel, Supabase, Linear, modern enterprise apps). |

### 🗺️ Component Mapping in `src/components/ui/`

| Component | Underlying Engine | Design Token Styling |
|---|---|---|
| `<Dropdown />` | Headless popover logic | Solid white `#FFFFFF`, `--border`, clearable `X`, dark navy selected |
| `<SearchInput />` | HTML5 input + Lucide | Search icon + instant clear `X` button, `--navy` focus |
| `<Dialog />` | `@radix-ui/react-dialog` | Modal overlay `bg-black/40`, `--card-background`, `--card-shadow` |
| `<Popover />` | `@radix-ui/react-popover` | Solid `#FFFFFF`, `--border`, smooth slide/fade animations |
| `<Tooltip />` | `@radix-ui/react-tooltip` | `--deep-navy` background, `--cream` text, micro-animations |
| `<Tabs />` | `@radix-ui/react-tabs` | Active indicator `--navy`, hover `--cream` |
| `<Checkbox />` | `@radix-ui/react-checkbox` | Checked `--navy`, border `--border` |
| `<Button />` | Custom HTML button | `primary` (`--navy`), `danger` (`--danger`), `outline`, `ghost` |
| `<Spinner />` | SVG animation | Size prop, color matches brand |

### Usage Standards (`src/components/ui`)

```tsx
// ✅ Always import from barrel
import {
  Button,
  Spinner,
  Dropdown,
  SearchInput,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Card,
  Badge,
  Table,
} from '@/components/ui'

// 1. Button variants
<Button variant="primary">Save</Button>
<Button variant="danger" isLoading={isPending}>Delete</Button>
<Button variant="outline">Cancel</Button>

// 2. Loading — ONLY Spinner, never plain text
<Spinner size={32} />

// 3. Search Box — includes built-in X to clear
<SearchInput
  placeholder="Search..."
  value={query}
  onChange={setQuery}
  onClear={() => setQuery('')}
/>

// 4. Dropdown — strictly attached, clearable with X, keyboard-friendly
<Dropdown
  value={status}
  onChange={setStatus}
  options={STATUS_OPTIONS}
  placeholder="All Status"
  clearable={true}
/>

// 5. Dialog — ALWAYS Dialog, never window.confirm()
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Delete Record?</DialogTitle></DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Corner Radius & Border Radius Hierarchy (Manager-Approved)

| Level | Tailwind Class | Pixels | Usage |
|---|---|---|---|
| **Controls** | `rounded-[6px]` / `rounded-md` | `6px` | Buttons, Inputs, Checkboxes, Pagination Cards, Action Icons |
| **Containers** | `rounded-xl` | `12px` | Cards, StatCards, Table Containers, Popovers |
| **Overlays** | `rounded-2xl` | `16px` | Dialog Modals, Large Sheets |
| **Pills** | `rounded-full` | `9999px` | Avatars, Toggle Switches, Badge Pills |

---

## SECTION 9: ROUTING STANDARDS (MNC Enterprise Pattern)

### `createAppRouter(queryClient)` — Router Factory Pattern
```tsx
// routes.tsx — MNC enterprise pattern
import { createBrowserRouter } from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { lazyWithRetry } from '@/lib/lazy-with-retry'

// Step 1 — Lazy-load ALL pages via lazyWithRetry (direct file path, never barrel .then())
const AttendancePage = lazyWithRetry(() => import('@/features/attendance/pages/attendance-page'))
const AdmissionsPage = lazyWithRetry(() => import('@/features/admissions/pages/admissions-page'))
// ... all 13 modules

// Step 2 — Suspense wrapper for every lazy page
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// Step 3 — Factory receives queryClient to avoid circular imports
export function createAppRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    // Guest-only routes (redirect to home if already logged in)
    { path: '/login',           element: <GuestOnlyRoute><Lazy><LoginPage /></Lazy></GuestOnlyRoute> },
    { path: '/forgot-password', element: <GuestOnlyRoute><Lazy><ForgotPasswordPage /></Lazy></GuestOnlyRoute> },

    // Protected routes (redirect to /login if not authenticated)
    {
      path: '/',
      element: <ProtectedRoute><Lazy><DashboardLayout /></Lazy></ProtectedRoute>,
      children: [
        { index: true, element: <Lazy><DashboardPage /></Lazy> },

        // Each route has a loader() that pre-invalidates cache on navigation
        {
          path: 'attendance',
          element: <Lazy><AttendancePage /></Lazy>,
          loader: async () => {
            const { attendanceKeys } = await import('@/features/attendance/queries/keys')
            await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
            return null
          },
        },
        // ... repeat pattern for all 13 modules
      ],
    },

    // Catch-all
    { path: '*', element: <Navigate to="/" replace /> },
  ])
}
```

### Why `createAppRouter(queryClient)`?
- `queryClient` passed as arg (not imported) — avoids circular import between `main.tsx` ↔ `routes.tsx`
- `loader()` on each route pre-invalidates that feature's cache **before the page renders** — data is ALWAYS fresh on navigation
- Same queryClient instance shared between `QueryClientProvider` and route loaders

### Route Guards
```tsx
// GuestOnlyRoute — redirects authenticated users away from /login, /otp etc.
export function GuestOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

// ProtectedRoute — redirects unauthenticated users to /login
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()
  if (!isInitialized) return <div className="flex h-screen items-center justify-center"><Spinner size={40} /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
```

### Absolute bans
```tsx
// ❌ BANNED — barrel .then() remapping
const AttendancePage = lazyWithRetry(() =>
  import('@/features/attendance').then(m => ({ default: m.AttendancePage }))
)

// ❌ BANNED — no loader (data not pre-invalidated on navigation)
{ path: 'attendance', element: <AttendancePage /> }

// ❌ BANNED — no Suspense wrapper on lazy page
{ path: 'attendance', element: <AttendancePage /> }  // AttendancePage is lazy but no <Suspense>

// ✅ CORRECT
{ path: 'attendance', element: <Lazy><AttendancePage /></Lazy>, loader: async () => { ... return null } }
```

---

## SECTION 10: ANTI-PATTERN QUICK REFERENCE

| ❌ BANNED | ✅ CORRECT |
|---|---|
| `AttendancePage.tsx` | `attendance-page.tsx` |
| `types/index.ts` | `types/types.ts` |
| `schemas/index.ts` | `schemas/schemas.ts` |
| `constants/index.ts` | `constants/constants.ts` |
| `const data: any = res.data` | `const data: unknown = res.data` |
| Inline `interface` in `.tsx` | Move to `types/types.ts` |
| `window.confirm('delete?')` | `<Dialog>` modal — FOREVER BANNED |
| `import from '@/features/x/components/y'` | `import from '@/features/x'` |
| `staleTime: 60000` | `staleTime: 0` |
| `<p>Loading...</p>` | `<Spinner size={32} />` |
| Hardcoded `#102A43` | `var(--navy)` |
| `text-sm` on labels | `text-xs` (12px) |
| `export default` on mutations/hooks | Named export only |
| `.then(m => ({ default: m.Page }))` | Direct file path `lazyWithRetry()` import |
| `toast.error('Something went wrong')` | `toast.error(formatApiClientError(error, 'Fallback'))` |
| `import { X } from '@/components/ui/button'` | `import { X } from '@/components/ui'` |
| `import antd / import @mui` | Shadcn UI + Tailwind + Lucide ONLY |
| Inner `features/x/enums/index.ts` | `features/x/enums/attendance.enum.ts` |
| `src="/logo.png"` raw string in component | `import { eduLogo } from '@/assets/images'` |
| `useState` for form inputs | `react-hook-form` + `zodResolver` |
| `placeholderData: undefined` | `placeholderData: keepPreviousData` on paginated queries |
| `useEffect(...)` anywhere in the app | **COMPLETELY BANNED** — zero `useEffect` in entire codebase |
| `useQuery({ queryFn: () => Promise.all([...]) })` | Separate `useQuery` calls — auto-parallelized |
| `useState([])` for server data | `useQuery(queryOptions)` |

---

## SECTION 11: PAGES vs COMPONENTS BOUNDARY (MANDATORY)

### Pages (`pages/*.tsx`) — Route Container Layer
- **MUST**: Export `default function <Domain>Page()` — React.lazy() requires default export
- **MUST**: Read route params via `useParams()`
- **MUST**: Execute primary data queries (`useGetAttendances`, `useGetAttendanceDetail`)
- **MUST**: Handle page-level loading: `if (isLoading) return <div className="flex h-64 w-full items-center justify-center"><Spinner size={32} /></div>`
- **MUST**: Render fallback error state on fetch failure
- **MUST**: Pass data DOWN to components via typed props (never have components fetch their own data)
- **NEVER**: Contain business logic or direct API calls

### Components (`components/*.tsx`) — Pure Presentation Layer
- **NEVER**: Call `useParams()` inside components
- **NEVER**: Fetch their own page-level detail data independently
- **NEVER**: Call mutations directly — receive `onDelete`, `onEdit` callbacks via typed props
- **ALWAYS**: Receive data exclusively through typed interfaces in `types/types.ts`

```tsx
// ✅ CORRECT — page fetches, component presents
export default function AttendancePage() {
  const { rows, isLoading } = useAttendanceList(params)  // page fetches
  return <AttendanceTable rows={rows} isLoading={isLoading} onDelete={remove} />  // pass down
}

// ❌ BANNED — component fetching its own data
export function AttendanceTable() {
  const { rows } = useAttendanceList()  // ← BANNED inside component
}
```

---

## SECTION 12: IMAGE ASSET REGISTRY (MANDATORY)

> All static UI images MUST go through the asset registry. Zero raw string paths in components.

### Structure
```
src/assets/images/
├── index.ts          ← single export registry for ALL images
├── edu-logo.png
├── edu-logo-dark.png
└── errors/
    └── not-found.svg
```

### Registry Pattern (`src/assets/images/index.ts`)
```ts
// Declare and export every image here first
export { default as eduLogo }       from './edu-logo.png'
export { default as eduLogoDark }   from './edu-logo-dark.png'
export { default as notFoundImage } from './errors/not-found.svg'
// /public assets (favicon etc.) stay in /public — document them here as comments
// public: /favicon.svg (referenced in index.html)
```

### Usage in Components
```tsx
// ✅ CORRECT — always via named import from registry
import { eduLogo } from '@/assets/images'
<img src={eduLogo} alt="EduWeConnect" />

// ❌ BANNED — raw string paths
<img src="/edu-logo.png" alt="EduWeConnect" />         // BANNED
<img src="/assets/images/logo.png" alt="Logo" />      // BANNED
import logo from '../../assets/logo.png'              // BANNED (use @/ + registry)
```

### Adding a New Image
1. Drop file into `src/assets/images/` (or appropriate subfolder)
2. Add one `export { default as xxx } from './filename'` line in `src/assets/images/index.ts`
3. Import by name in component — NEVER skip the registry step

---

## SECTION 13: FORM MANAGEMENT STANDARDS

> All forms MUST use React Hook Form. Never use `useState` to hold form inputs.

```tsx
// ✅ CORRECT — React Hook Form + Zod
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { markAttendanceFormSchema } from '../schemas/schemas'
import type { MarkAttendanceFormValues } from '../types/types'

export function CreateAttendanceModal({ ... }) {
  const methods = useForm<MarkAttendanceFormValues>({
    resolver: zodResolver(markAttendanceFormSchema),
    defaultValues: { type: AttendanceType.STUDENT },
  })
  const { register, handleSubmit, formState: { errors } } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Labels: ALWAYS text-xs font-semibold */}
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Class</label>
        <Input {...register('classId')} error={Boolean(errors.classId)} />
        {/* Errors: ALWAYS text-xs */}
        {errors.classId && <p className="text-xs text-red-600">{errors.classId.message}</p>}
      </form>
    </FormProvider>
  )
}

// ❌ BANNED — useState for form
const [name, setName] = useState('')
const [email, setEmail] = useState('')
```

---

## SECTION 14: INVALIDATION FACADE & QUERY PATTERNS

### Export `useInvalidate<Domain>()` from every queries file
```ts
// In queries/get-attendances.ts — MANDATORY export
export function useInvalidateAttendance() {
  const queryClient = useQueryClient()
  return async () =>
    queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
}
```

### `placeholderData: keepPreviousData` is MANDATORY on paginated lists
```ts
// ✅ CORRECT — eliminates UI flicker on page change
export const attendanceListQueryOptions = (params: AttendanceListParams = {}) =>
  queryOptions({
    queryKey:        attendanceKeys.list(params),
    queryFn:         () => getAttendances(params),
    placeholderData: keepPreviousData,   // ← MANDATORY
    staleTime:       0,                  // ← MANDATORY
  })

// ❌ BANNED — causes table flash/empty on every page change
queryOptions({ queryKey: ..., queryFn: ..., staleTime: 0 })  // missing placeholderData
```

### Dropdown queries — lazy load + refetch on open
```ts
// Select/Combobox queries that populate dropdowns must support lazy loading
const classQuery = useQuery({
  ...classListQueryOptions(),
  enabled: dropdownOpen,    // only fetch when dropdown is opened
  staleTime: 0,
})
// Trigger on open:
onOpen={() => { setDropdownOpen(true); void classQuery.refetch() }}
```

---

## SECTION 15: NO 3RD-PARTY UI LIBRARIES

```
NEVER install or import:
  antd                 → use @/components/ui
  @mui/material        → use @/components/ui
  @chakra-ui/react     → use @/components/ui
  react-bootstrap      → use @/components/ui
  react-select         → use Select from @/components/ui
  react-datepicker     → use native <input type="date"> or custom Popover + Calendar
  react-modal          → use Dialog from @/components/ui
  react-toastify       → use Sonner (already installed)
```

**Allowed libraries:**
- Shadcn UI patterns (owned code in `@/components/ui/`)
- Tailwind CSS v3
- Lucide React (icons)
- Radix UI primitives (headless — already used by our ui/ components)
- Sonner (toasts)

---

## SECTION 16: COMPLETE PRE-COMMIT CHECKLIST

```bash
npx tsc --noEmit    # → 0 errors required before EVERY commit
```

- [ ] All new files use **kebab-case** filenames (`attendance-page.tsx`, not `AttendancePage.tsx`)
- [ ] Feature follows exact 11-layer structure (`api/`, `components/`, `constants/`, `enums/`, `hooks/`, `mutations/`, `pages/`, `queries/`, `schemas/`, `types/`, `utils/`, `index.ts`)
- [ ] No inner `index.ts` inside subdirectories (`types/types.ts` — not `types/index.ts`)
- [ ] Every `pages/*.tsx` has `export default function <Domain>Page()`
- [ ] `routes.tsx` uses `lazyWithRetry()` with direct file path — no `.then(m => ({ default: m.X }))` remapping
- [ ] Zero `any` types anywhere
- [ ] Zero `useEffect` anywhere in the codebase — **completely banned, zero exceptions**
- [ ] Zero inline `interface` in `.tsx` files (all types in `types/types.ts`)
- [ ] Zero `window.confirm()` / `alert()` — use `<Dialog>` instead
- [ ] Every mutation has `toast.success()` + `toast.error(formatApiClientError(...))`
- [ ] Every mutation invalidates `<domain>Keys.all` with `refetchType: 'all'`
- [ ] Every `queryOptions` has `staleTime: 0`
- [ ] Paginated queries have `placeholderData: keepPreviousData`
- [ ] Dropdown queries support lazy `enabled` + `refetch()` on open
- [ ] All loading states use `<Spinner />` — never `<p>Loading...</p>` or plain text
- [ ] All colors use `var(--token)` — zero hardcoded hex values
- [ ] All form labels use `text-xs` (12px) — never `text-sm`
- [ ] All form validation via `react-hook-form` + `zodResolver` — never `useState` inputs
- [ ] Static images imported via `@/assets/images` registry — no raw `src="/path"` strings
- [ ] Cross-feature imports only via `@/features/<domain>` barrel (`index.ts`)
- [ ] All imports use `@/` absolute path alias — no relative `../../` paths
- [ ] No 3rd-party UI library imports (`antd`, `@mui`, `chakra-ui`, etc.)
- [ ] Components receive data via props only — never fetch their own page-level data
- [ ] `useInvalidate<Domain>()` exported from every feature queries file
- [ ] `features/attendance/` reference module structure followed exactly for new modules

---

## ⚠️ SECTION 18: MOCK ARCHITECTURE (`axios-mock-adapter`) — MNC ZERO-TOUCH STANDARD

> **MANDATORY ARCHITECTURAL PRINCIPLE**: 
> All mock interceptors live **exclusively** in `src/mock/`.
> **ZERO mock logic or conditional `if (USE_MOCK)` checks are allowed inside any feature `*.api.ts` file.**
> All feature API files must be written as 100% pure, production-ready Axios calls.

### How Mock Mode Works

```
src/
├── mock/
│   ├── auth.mock.ts          # Static mock data objects (AuthUser, LoginResponse, etc.)
│   ├── attendance.mock.ts    # Static mock data objects (AttendanceRecord, etc.)
│   ├── mock-server.ts        # Central Axios Mock Adapter — routes, delays & responses
│   └── index.ts              # Mock barrel export (setupMockServer, mock data)
├── features/
│   └── attendance/
│       └── api/
│           └── attendance.api.ts  # 100% CLEAN Axios code (Zero mock imports/if-checks)
└── main.tsx                  # Dynamically boots mock-server ONLY when VITE_USE_MOCK=true
```

### Switching Between Mock & Real Backend

| State | Action in `.env.local` | API Files Impact |
|---|---|---|
| **Development (Mock Active)** | `VITE_USE_MOCK=true` | **Zero changes** to any `*.api.ts` |
| **Production / Real Backend** | `VITE_USE_MOCK=false` (or remove) | **Zero changes** to any `*.api.ts` |

### Rules for Developing New Features

1. **Feature `*.api.ts` files**: Write pure HTTP requests using `apiClient.get()`, `apiClient.post()`, etc. with Zod schema parsing. Never import anything from `@/mock`.
2. **Add Mock Data**: Create `src/mock/<module>.mock.ts` with strongly typed dummy data matching `types/types.ts`.
3. **Register Mock Routes**: Add the mock endpoints to `src/mock/mock-server.ts` using `mock.onGet()`, `mock.onPost()`, etc.
4. **Export from Barrel**: Export mock definitions from `src/mock/index.ts`.

### Mock Credentials (for testing in browser)

| Field | Value |
|---|---|
| Email | `superadmin@eduweconnect.com` |
| Password | `password123` |
| OTP | `123456` |

---

## SECTION 17: PROMISE & ASYNC PATTERNS (MNC Enterprise Standard)


### 🚨 #1 ABSOLUTE RULE — `useEffect` is COMPLETELY BANNED in the entire application

> There are **zero valid uses** of `useEffect` in this codebase.
> This is not just about data fetching — `useEffect` is banned for **every purpose** without exception.

```tsx
// ❌ BANNED — data fetching
useEffect(() => {
  fetch('/api/attendance').then(r => r.json()).then(setData)
}, [])

// ❌ BANNED — async data loading
useEffect(() => {
  async function load() { const data = await getAttendances(); setData(data) }
  load()
}, [])

// ❌ BANNED — even 'DOM side effects' like document title, scroll, focus
useEffect(() => { document.title = 'Attendance' }, [])
useEffect(() => { inputRef.current?.focus() }, [])

// ❌ BANNED — event listeners
useEffect(() => {
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])

// ❌ BANNED — timers
useEffect(() => {
  const id = setInterval(refetch, 5000)
  return () => clearInterval(id)
}, [])
```

**Replacements for every useEffect use case:**

| Old (banned) | Correct replacement |
|---|---|
| `useEffect` for data fetching | `useQuery(queryOptions)` |
| `useEffect` for mutations/side-effects | `useMutation` + `onSuccess/onError` |
| `useEffect` for document title | HTML `<title>` tag in page component |
| `useEffect` for focus | `autoFocus` prop on input element |
| `useEffect` for scroll position | CSS `scroll-behavior` or router `scrollRestoration` |
| `useEffect` for event listeners | Inline `onX` props — `onClick`, `onResize`, etc. |
| `useEffect` for intervals/polling | `refetchInterval` option in `queryOptions` |
| `useEffect` for websockets | Dedicated context provider in `contexts/` |
| `useEffect` for derived state | `useMemo` or compute inline during render |

---

### Rule: Which async pattern to use and where

| Pattern | Where allowed | Where BANNED |
|---|---|---|
| **`async/await`** | `api.ts` functions, mutations, route `loader()` | Inside JSX render |
| **`Promise.all`** | `api.ts` layer, route `loader()` only | Inside `useQuery`, inside `useEffect` |
| **`Promise.allSettled`** | `api.ts` layer, route `loader()` only | Inside `useQuery`, inside `useEffect` |
| **Multiple `useQuery` calls** | React components — auto-parallelizes | Do NOT wrap in `Promise.all` |
| **`useQueries`** | Dynamic list of parallel queries | — |
| **Raw `.then()` chains** | `lazy-with-retry.ts`, `api-client.ts` interceptor ONLY | Everywhere else |
| **`useEffect`** | **NOWHERE — completely banned** | Entire application — zero exceptions |

---

### `Promise.all` — WHERE it belongs (API layer only)

```ts
// ✅ CORRECT — Promise.all in api.ts (outside React lifecycle)
// api/dashboard.api.ts
export async function getDashboardData(): Promise<DashboardData> {
  const [students, fees, attendance] = await Promise.all([
    getStudentStats(),
    getFeesStats(),
    getAttendanceStats(),
  ])
  return { students, fees, attendance }
}

// ✅ CORRECT — Promise.all in route loader() (outside React lifecycle)
loader: async () => {
  const { attendanceKeys } = await import('@/features/attendance/queries/keys')
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: attendanceKeys.details() }),
  ])
  return null
}
```

---

### `Promise.all` INSIDE `useQuery` — FULLY BANNED

```ts
// ❌ BANNED — Promise.all inside useQuery (MNC anti-pattern)
// Reason: loses individual cache keys, loses deduplication, loses per-query states
useQuery({
  queryKey: ['dashboard'],
  queryFn: () => Promise.all([fetchStudents(), fetchFees()]),  // ← BANNED
})

// ✅ CORRECT — separate useQuery calls (TanStack auto-parallelizes, caches each)
const studentsQuery = useQuery(studentStatsQueryOptions())   // fires simultaneously
const feesQuery     = useQuery(feesStatsQueryOptions())      // fires simultaneously
// Both run in parallel. Each has its own cache, loading state, error state.
```

---

### `Promise.allSettled` — Dashboard widgets only (in API layer)

```ts
// ✅ CORRECT — in api.ts, widgets are independent, one fail must NOT crash others
export async function getDashboardWidgets() {
  const [studentsResult, feesResult, attendanceResult] = await Promise.allSettled([
    getStudentStats(),
    getFeesStats(),
    getAttendanceStats(),
  ])
  return {
    students:   studentsResult.status === 'fulfilled' ? studentsResult.value : null,
    fees:       feesResult.status === 'fulfilled'     ? feesResult.value     : null,
    attendance: attendanceResult.status === 'fulfilled' ? attendanceResult.value : null,
  }
}
```

---

### Dynamic parallel queries — use `useQueries`

```ts
// ✅ CORRECT — when number of queries depends on runtime data
import { useQueries } from '@tanstack/react-query'

const studentQueries = useQueries({
  queries: studentIds.map((id) => ({
    queryKey: studentKeys.detail(id),
    queryFn:  () => getStudentById(id),
    staleTime: 0,
  })),
})
// Each query is independently cached, tracked, and deduped
```

---

### FULLY BANNED patterns (all in one place)

```ts
// ❌ BANNED #1 — useEffect ANYWHERE (completely banned — zero exceptions)
useEffect(() => { fetchData().then(setData) }, [])   // data fetching
useEffect(() => { document.title = 'Page' }, [])     // DOM side-effect
useEffect(() => { inputRef.current?.focus() }, [])   // focus

// ❌ BANNED #2 — Promise.all inside useQuery
useQuery({ queryFn: () => Promise.all([fetchA(), fetchB()]) })

// ❌ BANNED #3 — sequential independent awaits (waterfall)
const a = await fetchA()    // waits...
const b = await fetchB()    // then waits again — combined latency

// ❌ BANNED #4 — floating promise (missing await, error swallowed)
queryClient.invalidateQueries({ queryKey: attendanceKeys.all })

// ❌ BANNED #5 — .then() chains in feature code
getAttendances(params).then(setData).catch(console.error)

// ❌ BANNED #6 — useState to hold server data
const [data, setData] = useState([])

// ✅ CORRECT — all replaced by TanStack Query
const { data, isLoading, isError } = useQuery(attendanceListQueryOptions(params))
await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
const [a, b] = await Promise.all([fetchA(), fetchB()])   // only in api.ts / loader
```

---

## SECTION 19: GLOBAL CLIENT STATE — Zustand

> **Non-server UI state** (sidebar open/close, active tenant, theme, modal state) must use **Zustand** — never `useState` lifted to a Context Provider, never stored in TanStack Query cache.
> **One store per concern** — not one giant global store.

```ts
// ✅ CORRECT — one focused store per concern
// store/sidebar.store.ts
import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  close: () => set({ isOpen: false }),
}))

// ❌ BANNED — lifting useState to Context
const SidebarContext = createContext({ isOpen: true }) // BANNED
// ❌ BANNED — storing UI state in TanStack Query cache
queryClient.setQueryData(['sidebar-open'], true) // BANNED
```

---

## SECTION 20: URL-DRIVEN TABLE STATE — `useSearchParams`

> All filters, sort, page, and pageSize in tables MUST live in `useSearchParams` — never local `useState` — so table views are shareable and bookmarkable via URL.

```tsx
// ✅ CORRECT — URL-driven table state
import { useSearchParams } from 'react-router-dom'
import { ATTENDANCE_DEFAULT_PAGE, ATTENDANCE_DEFAULT_PAGE_SIZE } from '../constants/constants'
import type { AttendanceListParams } from '../types/types'

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params: AttendanceListParams = {
    page:     Number(searchParams.get('page'))     || ATTENDANCE_DEFAULT_PAGE,
    pageSize: Number(searchParams.get('pageSize')) || ATTENDANCE_DEFAULT_PAGE_SIZE,
    classId:  searchParams.get('classId')  ?? undefined,
    date:     searchParams.get('date')     ?? undefined,
    status:   (searchParams.get('status')  ?? undefined) as AttendanceListParams['status'],
    type:     (searchParams.get('type')    ?? undefined) as AttendanceListParams['type'],
  }

  function handleParamsChange(next: Partial<AttendanceListParams>) {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      Object.entries(next).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') updated.set(k, String(v))
        else updated.delete(k)
      })
      updated.set('page', String(ATTENDANCE_DEFAULT_PAGE)) // reset to page 1 on filter change
      return updated
    })
  }

  function handleClear() {
    setSearchParams({
      page:     String(ATTENDANCE_DEFAULT_PAGE),
      pageSize: String(ATTENDANCE_DEFAULT_PAGE_SIZE),
    })
  }
}

// ❌ BANNED — local useState for table params
const [params, setParams] = useState<AttendanceListParams>({ page: 1, pageSize: 20 }) // BANNED
```

---

## SECTION 21: OPTIMISTIC UPDATES

> High-frequency actions (attendance marking, status toggles, chat sends) MUST use `onMutate` + rollback via `onError` instead of waiting for server round-trip. Always call `cancelQueries` inside `onMutate` first.

```ts
// ✅ CORRECT — Optimistic update pattern
export function useToggleAttendanceStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAttendanceDto & { id: string }) =>
      updateAttendanceApi(payload.id, payload),

    onMutate: async (variables) => {
      // 1. Cancel in-flight queries so they don't overwrite optimistic state
      await queryClient.cancelQueries({ queryKey: attendanceKeys.all })
      // 2. Snapshot current state for rollback
      const snapshot = queryClient.getQueryData(attendanceKeys.lists())
      // 3. Apply optimistic update immediately
      queryClient.setQueryData(attendanceKeys.lists(), (old: AttendanceListResponse | undefined) => ({
        ...old,
        data: old?.data.map((r) =>
          r.id === variables.id ? { ...r, status: variables.status } : r
        ) ?? [],
      }))
      return { snapshot } // context for rollback
    },

    onError: (_err, _vars, context) => {
      // Rollback to snapshot on failure
      if (context?.snapshot) {
        queryClient.setQueryData(attendanceKeys.lists(), context.snapshot)
      }
      toast.error(formatApiClientError(_err, 'Failed to update status.'))
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
    },
  })
}
```

---

## SECTION 22: MULTI-TENANT ISOLATION

> Every query key and API call MUST be scoped by `schoolId`/`tenantId` to prevent cross-tenant data collisions. `schoolId` is injected automatically by the Axios request interceptor from Zustand auth store — **never manually appended per feature**.

```ts
// ✅ Axios interceptor auto-injects schoolId header
// src/lib/api-client.ts
apiClient.interceptors.request.use((config) => {
  const { schoolId } = useAuthStore.getState() // Zustand store — outside React
  if (schoolId) config.headers['X-School-Id'] = schoolId
  return config
})

// ✅ Query keys MUST scope by schoolId
export const attendanceKeys = {
  all:   (schoolId: string) => ['attendance', schoolId] as const,
  lists: (schoolId: string) => [...attendanceKeys.all(schoolId), 'list'] as const,
  list:  (schoolId: string, params: AttendanceListParams) =>
           [...attendanceKeys.lists(schoolId), params] as const,
}

// ❌ BANNED — schoolId-less key (global cache collision across tenants)
export const attendanceKeys = { all: ['attendance'] as const } // BANNED
```

---

## SECTION 23: AUTH & SESSION SECURITY

> Access tokens stored in **httpOnly cookies** (set by NestJS backend with `Secure; SameSite=Strict`) — **never localStorage or sessionStorage**. Axios interceptor handles 401 silently: refresh once, retry original request, then force logout on second failure.

```ts
// ✅ 401 interceptor with silent refresh + force logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await refreshTokenApi()           // POST /auth/refresh (httpOnly cookie)
        return apiClient(original)        // retry original request
      } catch {
        useAuthStore.getState().logout()  // force logout on refresh failure
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

// ✅ Idle session timeout — show warning modal at 13 min, auto-logout at 15 min
// Implemented in a dedicated IdleTimerProvider context in src/contexts/
```

**Absolute bans:**
```ts
localStorage.setItem('token', accessToken)   // ❌ BANNED
sessionStorage.setItem('token', accessToken) // ❌ BANNED
```

---

## SECTION 24: ROLE-BASED ACCESS & AUDIT LOG

> Route access controlled by `<RoleGuard allowedRoles={[Role.ADMIN]}>`. **Zero inline role checks in JSX.** Every destructive or financial mutation writes an audit-log entry via `auditLogApi()` shared utility.

```tsx
// ✅ RoleGuard wraps routes in routes.tsx
import { RoleGuard } from '@/components/role-guard'
{
  path: 'finance',
  element: (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.ACCOUNTANT]}>
      <Lazy><FinancePage /></Lazy>
    </RoleGuard>
  ),
}

// ❌ BANNED — inline role check in JSX
{user.role === 'admin' && <DeleteButton />}   // BANNED

// ✅ Audit log on destructive/financial mutations
// src/lib/audit-log.ts
export async function auditLogApi(entry: {
  action:    string
  entity:    string
  entityId:  string
  actor:     string
  timestamp: string
}) {
  await apiClient.post('/audit-log', entry)
}

// Usage in mutation onSuccess:
onSuccess: async (_, variables) => {
  toast.success('Fee collected.')
  await auditLogApi({
    action:    'FEE_COLLECTED',
    entity:    'Fee',
    entityId:  variables.feeId,
    actor:     useAuthStore.getState().userId,
    timestamp: new Date().toISOString(),
  })
  await queryClient.invalidateQueries({ queryKey: feeKeys.all })
},
```

---

## SECTION 25: REAL-TIME LAYER — SocketProvider

> WebSocket connections MUST live in a single `SocketProvider` context with typed reconnect/backoff logic — **never opened ad-hoc inside components**.

```tsx
// ✅ CORRECT — single provider in src/contexts/socket-provider.tsx
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = React.useRef<WebSocket | null>(null)
  const retryRef  = React.useRef(0)

  function connect() {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL)
    ws.onclose = () => {
      const delay = Math.min(1000 * 2 ** retryRef.current, 30000) // exponential backoff, max 30s
      retryRef.current += 1
      setTimeout(connect, delay)
    }
    ws.onopen = () => { retryRef.current = 0 }
    socketRef.current = ws
  }

  React.useEffect(() => { connect(); return () => socketRef.current?.close() }, [])
  // Note: this is the ONE allowed useEffect — for WebSocket lifecycle at app root level only

  return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>
}

// ❌ BANNED — ad-hoc WebSocket inside a component
export function ChatWindow() {
  const ws = new WebSocket(url) // BANNED — opens a new connection per component mount
}
```

---

## SECTION 26: FILE UPLOADS & MEDIA

> Standardize on **one `<FileUpload>` component** in `@/components/ui` with max size, MIME type whitelist, and upload progress state. Never use raw `<input type="file">` inside feature pages.

```tsx
// ✅ CORRECT — centralized FileUpload component
import { FileUpload } from '@/components/ui'

<FileUpload
  accept={['image/jpeg', 'image/png', 'application/pdf']}
  maxSizeMb={5}
  onUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    await uploadResourceApi(formData)
  }}
/>

// ❌ BANNED — raw file input in feature page
<input type="file" onChange={handleFileChange} />  // BANNED
```

**Gallery / resource images** must be lazy-loaded with `loading="lazy"` and served from the asset registry (`@/assets/images`) or a CDN URL — never inline base64.

---

## SECTION 27: EXPORT, PRINT & LOCALE

> CSV/PDF export via shared utilities. Printable pages use `@media print`. Indian locale formatting via **one** `formatINR()` and **one** `formatDate()` utility — **never inline `Intl` calls scattered across features**.

### Shared utilities in `src/lib/`

```ts
// src/lib/format-currency.ts
// ₹1,23,456 — Indian numbering system
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

// src/lib/format-date.ts
// dd/mm/yyyy IST
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).format(new Date(date))
}

// src/lib/export-csv.ts
export function exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
  const headers = Object.keys(rows[0] ?? {})
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => r[h]).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${filename}.csv` })
  a.click()
  URL.revokeObjectURL(url)
}
```

```css
/* Printable pages (report cards, hall tickets, receipts) */
@media print {
  .no-print { display: none !important; }
  body { background: white; }
}
```

**Absolute bans:**
```ts
new Intl.NumberFormat('en-IN', ...).format(amount) // ❌ inline in JSX — use formatINR()
new Intl.DateTimeFormat(...).format(date)           // ❌ inline in JSX — use formatDate()
```

---

## SECTION 28: BULK OPERATIONS — `useBulkMutation`

> Bulk actions (bulk attendance marking, bulk fee collection) use a **single `useBulkMutation` pattern** with per-row progress and partial-failure reporting — **never `Promise.all` of individual mutations fired from a component**.

```ts
// ✅ CORRECT — useBulkMutation pattern
export function useBulkMarkAttendanceMutation() {
  const queryClient = useQueryClient()
  const [progress, setProgress] = React.useState<Record<string, 'pending' | 'success' | 'error'>>({})

  async function bulkMutate(records: CreateAttendanceDto[]) {
    setProgress(Object.fromEntries(records.map((r) => [r.records[0].memberId, 'pending'])))

    const results = await Promise.allSettled(
      records.map((r) =>
        createAttendanceApi(r)
          .then(() => setProgress((p) => ({ ...p, [r.records[0].memberId]: 'success' })))
          .catch(() => setProgress((p) => ({ ...p, [r.records[0].memberId]: 'error' })))
      )
    )

    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed > 0) toast.error(`${failed} record(s) failed to save.`)
    else toast.success('All attendance records saved.')

    await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
  }

  return { bulkMutate, progress }
}

// ❌ BANNED — raw Promise.all in component
const handleBulk = () => Promise.all(selected.map((id) => deleteMutation.mutate(id))) // BANNED
```

---

## SECTION 29: ERROR BOUNDARIES, OBSERVABILITY & QUALITY GATES

### Error Boundaries
```tsx
// ✅ Every route wrapped in <ErrorBoundary> so one broken widget can't crash the dashboard
import { ErrorBoundary } from 'react-error-boundary'

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<WidgetError />}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
```

### Sentry / Observability
```ts
// src/main.tsx — wire at app boot before React renders
import * as Sentry from '@sentry/react'
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, tracesSampleRate: 0.2 })

// All toast.error() calls must also report to Sentry:
export function toastError(message: string, error?: unknown) {
  toast.error(message)
  if (error) Sentry.captureException(error)
}
```

### ENV Validation — Zod `envSchema` at boot
```ts
// src/lib/env.ts — parsed at app boot; fail fast on missing vars
import { z } from 'zod'
const envSchema = z.object({
  VITE_API_URL:     z.string().url(),
  VITE_WS_URL:      z.string().url(),
  VITE_SENTRY_DSN:  z.string().optional(),
  VITE_USE_MOCK:    z.enum(['true', 'false']).default('false'),
})
export const env = envSchema.parse(import.meta.env)
// If any required var is missing → throws immediately at startup with a clear error message
```

### Quality Gates — Pre-Commit Checklist Update
```bash
# ALL must pass before every commit (not just tsc):
npx tsc --noEmit                        # 0 type errors
npx eslint . --max-warnings=0           # 0 ESLint warnings
npx prettier --check .                  # formatting consistent
npx vitest run                          # tests pass (min 80% coverage on mutations + form validation)
```

---

## SECTION 30: FORM MANAGEMENT (React Hook Form v7 — Full MNC Standard)

> **CORE PRINCIPLE**: All forms in the application must strictly use **React Hook Form v7** with **Zod (`@hookform/resolvers/zod`)**.
> Never manage form field values with `useState`.

### 1. Mandatory `useForm` Configuration
```tsx
const methods = useForm<MarkAttendanceFormValues>({
  resolver: zodResolver(markAttendanceFormSchema),
  mode: 'onSubmit', // Default submission validation
  defaultValues: {
    classId: '',
    date: new Date().toISOString().split('T')[0],
    type: AttendanceType.STUDENT,
    records: [{ memberId: '', status: AttendanceStatus.PRESENT, remarks: '' }],
  }, // MANDATORY — never omit defaultValues (required for isDirty and useFieldArray)
})
```

### 2. Controlled vs. Native Inputs
- **Native HTML Inputs (`<Input>`, `<Textarea>`):** Use `register` directly for maximum performance without re-renders:
  ```tsx
  <Input {...register('classId')} />
  ```
- **Controlled Custom Primitives (`<Dropdown>`, `<MultiSelectDropdown>`, `<Checkbox>`, `<Switch>`):** MUST use `<Controller />` or `useController`:
  ```tsx
  <Controller
    control={control}
    name="type"
    render={({ field }) => (
      <Dropdown
        value={field.value}
        onChange={field.onChange}
        options={TYPE_OPTIONS}
      />
    )}
  />
  ```

### 3. Dynamic Lists with `useFieldArray`
- Always pass a complete object to `append()` with initial values (never `append({})`):
  ```tsx
  const { fields, append, remove } = useFieldArray({ control, name: 'records' })
  // Append new item
  append({ memberId: '', status: AttendanceStatus.PRESENT, remarks: '' })
  ```
- Use safe indexed error access:
  ```tsx
  {errors.records?.[index]?.memberId && (
    <p className="text-xs text-red-600">{errors.records[index]?.memberId?.message}</p>
  )}
  ```

### 4. Server-Side Error Mapping (`setError`)
When the backend returns field-level validation errors (HTTP 400/422), map them directly into RHF fields:
```tsx
onError: (error: any) => {
  if (error.response?.data?.errors) {
    Object.entries(error.response.data.errors).forEach(([field, msg]) => {
      setError(field as any, { type: 'server', message: String(msg) })
    })
  } else {
    setError('root.serverError' as any, {
      type: 'server',
      message: formatApiClientError(error, 'Submission failed.'),
    })
  }
}
```

### 5. Post-Submission Reset & Clean State
After a successful mutation, always call `reset()` to sync form state and reset `isDirty`:
```tsx
onSuccess: () => {
  reset()
  onOpenChange(false)
}
```

### 6. Decoupled Form Architecture (MNC Standard: Pure Form vs. Containers)
Always decouple the **Pure Form** from the **Overlay Container**:
- **`<domain>-form.tsx`**: Contains `useForm`, inputs, field arrays, validation, and actions. 100% portable and reusable across desktop modals, mobile side sheets, and full pages.
- **`create-<domain>-modal.tsx`**: A thin `<Dialog>` wrapper that renders `<DomainForm onSuccess={() => setOpen(false)} />`.
- **`create-<domain>-drawer.tsx`**: A thin `<Sheet>` wrapper for mobile views reusing the exact same `<DomainForm />`.

```tsx
// ✅ Modal Container (Thin Wrapper)
export function CreateAttendanceModal({ open, onOpenChange }: CreateAttendanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
        <AttendanceForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
```

---

*Architecture validated against MNC enterprise standards — Google/Airbnb/Microsoft 2024–2026.*
