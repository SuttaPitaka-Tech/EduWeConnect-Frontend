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
| **Loading/Feedback** | `Spinner` · `Toaster` · `Alert` · `Skeleton/SkeletonRow/SkeletonCard` · `Progress` |
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

*Architecture validated against MNC enterprise standards — Google/Airbnb/Microsoft 2024–2026.*
