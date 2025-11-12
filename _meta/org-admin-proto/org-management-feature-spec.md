# Organization Management Feature Specification

This feature provides org-level visibility and control of **Smartword balance** and **workspace provisioning**, matching the Smartcat look & flows.

> **Note**: This feature will be developed in a dedicated git branch. See `project-setup-spec.md` for base setup instructions.

---

## 1) Purpose

Provide org-level visibility and control of **Smartword balance** and **workspace provisioning**, matching the Smartcat look & flows.

---

## 2) Actors & Permissions

- **Organization Admin** (primary actor): view balances, toggle workspace full-access, allocate/reclaim Smartwords, open actions.
- **Workspace Admin**: read-only summary for their workspace (if allowed).
- **Viewer**: read-only.

---

## 3) Core User Stories

1. As an Org Admin, I see subscription, Smartwords balance, renewal date, and workspace count at a glance.
2. I can monitor **total balance** and consumption progress.
3. I can search/filter/sort workspaces and view **Allocated** vs **Spent** per workspace.
4. I can enable/disable **Full SW Access** per workspace.
5. I can **Allocate/Reclaim** Smartwords to a workspace (modal).
6. I can open **Actions** for each row (view details, manage admins, usage report).
7. I can **Manage all workspaces** (bulk actions) and **Get more Smartwords** (CTA).

---

## 4) Layout

### 4.1) Top Header Bar
- **Breadcrumbs** (top-left): "Organization management / Smartwords sharing enabled" (text, clickable segments)
- **Main header row**:
  - Left: Hamburger menu icon (opens/closes left nav panel)
  - Center: Page title "Organization management"
  - Right: Three icons:
    - Smartwords balance indicator: Purple circle with "S {balance}" (e.g., "S 0")
    - Question mark icon (help/support)
    - Clock icon (recent activity/notifications)

### 4.2) Organization Header Section
- **Left side**:
  - Organization logo/avatar (circular, colored background with org initial or logo image)
  - Organization name (large, bold text, e.g., "Coca-Cola")
- **Right side**: 
  - "Contact us" button (dark purple background, white text, rounded-2xl)

### 4.3) Stats Row (5 Cards)
Horizontal grid of 5 information cards, each with:
- **Card 1 - Subscription**: Purple "i" icon + "Subscription" label + value (e.g., "Enterprise")
- **Card 2 - Smartwords**: Purple "S" icon + "Smartwords" label + formatted number (e.g., "2,000,000")
- **Card 3 - Renewal date**: Purple calendar icon + "Renewal date" label + formatted date (e.g., "May 10, 2025")
- **Card 4 - Workspaces**: Purple folder icon + "Workspaces" label + count (e.g., "3")
- **Card 5 - Organization admins**: Purple group icon + "Organization admins" label + admin avatars (circular profile pictures, max 2 visible, with "+N" indicator if more)

Each card: `rounded-2xl bg-[var(--sc-surface)] shadow-card p-4`

### 4.4) Smartword Balance Section
- **Header**: "Smartword balance" title (left) + "Get more Smartwords" button (right, gray/secondary style)
- **Progress bar**:
  - Horizontal bar showing used (dark gray) vs remaining (light gray)
  - Tick markers at: 0, 500,000, 1,000,000, 1,500,000, 2,000,000
  - Labels below bar showing these values
  - Visual representation: used portion from 0 to current usage, remaining portion to total

### 4.5) Workspaces Section
- **Header row**:
  - Left: "Workspaces" title
  - Right: 
    - "Manage all workspaces" button (gray/secondary)
    - Gear icon (settings)
- **Tabs** (below header):
  - "All {count}" tab (e.g., "All 3") - selected state with underline
  - "My workspaces {count}" tab (e.g., "My workspaces 1")
  - Tab styling: selected has underline, unselected is muted
- **Toolbar** (above table):
  - Search input (optional, can be added later)
  - Filters (optional, can be added later)

### 4.6) Table (TanStack Table)
- **Columns** (left to right):
  1. **Checkbox**: Unchecked square checkbox per row (for bulk selection)
  2. **WORKSPACE**: Workspace name (e.g., "Personal. F. Nielsen", "Coca-Cola (main)", "HR")
  3. **SUBSCRIPTION**: Subscription type badge/text (e.g., "Enterprise", "Forever Free")
  4. **ADMINS**: Admin avatars (circular profile pictures with initials or images) + names, stacked horizontally
  5. **FULL SW ACCESS**: Toggle switch + information icon (tooltip on hover)
     - Switch: ON (dark/purple) = full access enabled, OFF (light gray) = disabled
  6. **ALLOCATED BALANCE**: Number or "Not set" + information icon (tooltip)
  7. **SPENT BALANCE**: Number (e.g., "0") + information icon (tooltip)
  8. **ACTIONS**: Action icons (refresh/loop icon, settings/gear icon) + profile picture icon in header
- **Table features**:
  - Sticky header
  - Virtualized rows if > 200 items
  - Empty state, loading state, error state
  - Pagination (server-side ready), page size selector
  - Row hover states
  - Column header tooltips (via "i" icons)

---

## 5) Component Mapping & Structure

### 5.1) Component Hierarchy
```
OrgManagementPage
├── PageHeader (breadcrumbs + top bar)
│   ├── Breadcrumbs
│   ├── HamburgerMenuButton
│   ├── PageTitle
│   └── HeaderIcons (Smartwords balance, Help, Clock)
├── OrgHeaderSection
│   ├── OrgAvatar (reuse existing Avatar component)
│   ├── OrgName
│   └── ContactUsButton
├── StatsCardsRow
│   └── StatCard (×5)
│       ├── Icon
│       ├── Label
│       └── Value (or AdminAvatars for org admins card)
├── SmartwordBalanceSection
│   ├── SectionHeader
│   │   ├── Title
│   │   └── GetMoreSmartwordsButton
│   └── ProgressBar
│       ├── ProgressTrack
│       ├── ProgressFill
│       └── TickMarkers (with labels)
└── WorkspacesSection
    ├── SectionHeader
    │   ├── Title
    │   ├── ManageAllWorkspacesButton
    │   └── SettingsIcon
    ├── WorkspaceTabs
    │   ├── AllTab
    │   └── MyWorkspacesTab
    └── WorkspacesTable
        ├── TableHeader (sticky)
        ├── TableBody (virtualized if needed)
        │   └── WorkspaceRow
        │       ├── Checkbox
        │       ├── WorkspaceName
        │       ├── SubscriptionBadge
        │       ├── AdminAvatars
        │       ├── FullAccessSwitch (with tooltip)
        │       ├── AllocatedBalance (with tooltip)
        │       ├── SpentBalance (with tooltip)
        │       └── ActionsMenu (dropdown)
        ├── EmptyState
        ├── LoadingState
        └── ErrorState
```

### 5.2) Component Library Mapping
- **Buttons**: Tailwind classes + custom variants (primary purple, secondary gray)
- **Cards**: `rounded-2xl bg-[var(--sc-surface)] shadow-card`
- **Icons**: `lucide-react` (Info, Calendar, Folder, Users, Settings, RefreshCw, etc.)
- **Avatar**: Reuse existing `Avatar` component from `src/components/navigation/Avatar.tsx`
- **Switch**: `@radix-ui/react-switch`
- **Tooltip**: `@radix-ui/react-tooltip` (for "i" icons)
- **Dropdown Menu**: `@radix-ui/react-dropdown-menu` (for Actions menu)
- **Progress Bar**: Custom component using Tailwind (or `@radix-ui/react-progress`)
- **Table**: `@tanstack/react-table`
- **Modal/Dialog**: `@radix-ui/react-dialog` (for Allocate/Reclaim modal)
- **Tabs**: Custom tabs using Radix or simple button group
- **Breadcrumbs**: Custom component or simple text with separators

---

## 6) Data Model (Client Shape)

```ts
type OrgSummary = {
  id: string
  name: string
  logoUrl?: string // Optional logo image URL
  avatarColor: string // Fallback color for avatar (hex)
  initial: string // Fallback initial for avatar
  renewalDate: string // ISO date string
  subscription: 'Enterprise' | 'Team' | 'Forever Free'
  smartwordsTotal: number
  smartwordsUsed: number
  workspacesCount: number
  organizationAdmins: { 
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  smartwordsSharingEnabled: boolean // For breadcrumb display
}

type WorkspaceRow = {
  id: string
  name: string
  subscription: OrgSummary['subscription']
  admins: { 
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  fullAccess: boolean
  allocated: number | null // null = "Not set", number = allocated amount
  spent: number // SW spent by this WS
  isMyWorkspace?: boolean // For "My workspaces" tab filtering
}

type WorkspaceTab = 'all' | 'my'
```

---

## 7) API (Mock for Local; Adapt Later)

- `GET /api/org/:id/summary` → `OrgSummary`
- `GET /api/org/:id/workspaces?query=&subscription=&fullAccess=&page=&size=` → `{ rows: WorkspaceRow[], total: number }`
- `POST /api/workspace/:id/full-access` `{ enabled: boolean }`
- `POST /api/workspace/:id/allocate` `{ delta: number }` (positive to allocate, negative to reclaim)

For local dev, serve JSON from `src/mocks/` or add a tiny Express/Vite proxy later.

---

## 8) States & UX Rules

### 8.1) Loading States
- **Initial load**: Skeleton cards for stats (5 cards with shimmer effect); table skeleton rows (5-10 rows)
- **Data refresh**: Show loading spinner or maintain current data with subtle indicator
- **Switch toggle**: Immediate visual feedback, then API call

### 8.2) Empty States
- **No workspaces**: Show illustration/icon + "No workspaces yet" message; keep all actions disabled
- **No allocated balance**: Show "Not set" text (as seen in mockup)

### 8.3) Error States
- **API errors**: Inline alert banner with error message + "Retry" button
- **Validation errors**: Inline error text below input fields (in modals)

### 8.4) Interaction Rules
- **Switch toggle**: 
  - Optimistic update (immediate UI change)
  - API call in background
  - Revert on failure with toast notification
  - Disable switch during API call
- **Allocate/Reclaim modal**:
  - Numeric input with +/- buttons or direct input
  - Show current balance, new projected balance
  - Validate with Zod: non-negative totals, cannot exceed available balance
  - Show validation errors inline
  - Disable submit until valid
- **Tab switching**: 
  - Instant filter of table rows
  - Maintain scroll position if possible
  - Update count badges in tab labels
- **Checkbox selection**:
  - Individual row selection
  - Header checkbox for "select all" (when implemented)
  - Visual feedback on selection
- **Actions menu**:
  - Opens on click of action icons (refresh/settings)
  - Menu items: "View details", "Manage admins", "Usage report" (per spec)
  - Close on outside click or selection

---

## 9) Accessibility

- All interactive controls keyboard reachable (Radix handles roving focus).
- Provide `aria-label` for icons; table header labels; announce toast messages.

---

## 10) Performance

- Virtualize table for large lists; debounce search (300ms).
- Memoize column defs; avoid rerenders with stable callbacks.

---

## 11) Analytics (Optional)

Events: `org.view`, `workspace.toggle_full_access`, `workspace.allocate`, `table.search`, `table.filter`, `cta.get_more_sw`.

---

## 12) Acceptance Criteria (High Level)

- Stats cards match mock values and update when data changes.
- Balance bar shows correct % used, with accessible label.
- Table supports search, sort, filter, pagination; actions menu opens.
- Toggling Full Access updates backend (mock) and UI state.
- Allocation modal validates and updates balances.

---

## 13) Open Questions

- Exact copy for tooltips/help text? → **Resolved**: See Section 16
- Are allocations **hard caps** or **soft budgets**? → **TBD**: Assume hard caps for MVP
- Who can override Full Access globally? → **TBD**: Org Admin only for MVP
- Should breadcrumbs be clickable navigation? → **TBD**: Yes, for better UX
- Should "Get more Smartwords" button open a modal or external link? → **TBD**: External link to purchase page for MVP
- Should "Manage all workspaces" button open a modal or separate page? → **TBD**: Modal with bulk actions for MVP

---

## Implementation Dependencies

When implementing this feature, you'll need to install:

```bash
# Additional Radix components
npm i @radix-ui/react-dropdown-menu @radix-ui/react-switch @radix-ui/react-progress @radix-ui/react-dialog

# Table + forms
npm i @tanstack/react-table react-hook-form zod @hookform/resolvers

# Optional: Toast notifications (for error/success feedback)
npm i sonner # or use a custom toast solution
```

### Existing Dependencies (Already Installed)
- `@radix-ui/react-popover` ✓
- `@radix-ui/react-tooltip` ✓
- `lucide-react` ✓ (for icons)
- `react-router-dom` ✓
- `tailwindcss` ✓

---

## 14) Routing & Navigation

### 14.1) Route Configuration
Add to `src/App.tsx`:
```tsx
<Route path="/org/management" element={<OrgManagementPage />} />
```

### 14.2) Breadcrumb Navigation
- **Breadcrumb path**: "Organization management / Smartwords sharing enabled"
- **Clickable segments**: Each segment should be clickable (navigate to parent pages if applicable)
- **Styling**: Text with "/" separator, muted color for non-active segments

### 14.3) Integration with Existing Navigation
- The page should work within the existing `AppLayout` structure
- Hamburger menu button should toggle the left navigation panel (if not already handled)
- Page should be accessible from Hub sub-navigation or organization menu (to be determined)

---

## 15) Styling Specifications

### 15.1) Color Tokens
- **Primary**: `var(--sc-primary)` (purple: #6b4eff)
- **Surface**: `var(--sc-surface)` (white: #fff)
- **Text**: `var(--sc-text)` (dark: #111827)
- **App Background**: `var(--sc-app-bg, #f7f7fb)` (light gray)
- **Card Shadow**: `shadow-card` (0 2px 12px rgba(16, 24, 40, 0.08))

### 15.2) Typography
- **Page Title**: `text-xl font-semibold` (Organization management)
- **Org Name**: Large, bold (e.g., `text-2xl font-bold`)
- **Card Labels**: `text-xs opacity-70`
- **Card Values**: `text-lg font-medium`
- **Table Headers**: `text-xs font-medium uppercase` (e.g., "WORKSPACE", "SUBSCRIPTION")

### 15.3) Spacing & Layout
- **Page Padding**: `p-8` (main content area)
- **Section Spacing**: `space-y-6` between major sections
- **Card Padding**: `p-4` for stat cards, `p-6` for larger sections
- **Grid Gaps**: `gap-4` for stat cards grid

### 15.4) Component Styling
- **Buttons**:
  - Primary: `bg-[var(--sc-primary)] text-white rounded-2xl px-4 py-2`
  - Secondary: `bg-gray-200 text-gray-700 rounded-lg px-3 py-1.5`
- **Cards**: `rounded-2xl bg-[var(--sc-surface)] shadow-card`
- **Progress Bar**: 
  - Track: `h-2 bg-gray-200 rounded-full`
  - Fill: `h-full bg-gray-800 rounded-full` (used portion)
  - Remaining: `bg-gray-100` (light gray)
- **Switch**: Use Radix Switch with custom styling (purple when ON, gray when OFF)
- **Tabs**: Selected tab has underline, unselected is muted text
- **Table Rows**: Hover state with subtle background change

---

## 16) Tooltip Content Specifications

### 16.1) Information Icons ("i" icons)
- **FULL SW ACCESS**: "Allow this workspace to use the shared organization Smartwords pool without allocation limits"
- **ALLOCATED BALANCE**: "The amount of Smartwords specifically allocated to this workspace"
- **SPENT BALANCE**: "The amount of Smartwords consumed by this workspace"

### 16.2) Header Icons
- **Smartwords Balance Icon**: "Current organization Smartwords balance"
- **Question Mark Icon**: "Help and support"
- **Clock Icon**: "Recent activity and notifications"

---

## 17) Modal Specifications

### 17.1) Allocate/Reclaim Smartwords Modal
**Trigger**: Click "Allocate" or "Reclaim" action (from Actions menu or direct button)

**Modal Structure**:
- **Title**: "Allocate Smartwords" or "Reclaim Smartwords"
- **Content**:
  - Current workspace balance display
  - Current organization balance display
  - Input field: Numeric input with +/- buttons
  - Projected balances (after operation)
  - Validation messages (if any)
- **Actions**:
  - Cancel button (secondary)
  - Confirm button (primary, disabled until valid)
- **Validation Rules**:
  - Cannot allocate more than available org balance
  - Cannot reclaim more than workspace allocated balance
  - Must be positive number
  - Cannot exceed limits

**Form Fields**:
```ts
type AllocationForm = {
  amount: number // Positive for allocate, negative for reclaim
}
```

**Validation Schema (Zod)**:
```ts
import { z } from 'zod'

const allocationSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(1, 'Minimum amount is 1')
    .max(availableBalance, `Cannot exceed available balance of ${availableBalance}`)
})
```

---

## 18) Example Page Structure

Create `src/pages/OrgManagementPage.tsx`:

```tsx
import { useState } from 'react'
import { mockOrgSummary, mockWorkspaces } from '@/mocks/orgManagement'
import type { WorkspaceTab } from '@/types/orgManagement'

export default function OrgManagementPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('all')
  const org = mockOrgSummary
  const workspaces = mockWorkspaces

  const filteredWorkspaces = activeTab === 'all' 
    ? workspaces 
    : workspaces.filter(ws => ws.isMyWorkspace)

  return (
    <div className="min-h-full p-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600">
        Organization management / Smartwords sharing enabled
      </div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger menu button */}
          <button aria-label="Toggle navigation">☰</button>
          <h1 className="text-xl font-semibold">Organization management</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Header icons */}
          <div className="w-8 h-8 rounded-full bg-[var(--sc-primary)] text-white flex items-center justify-center text-xs">
            S 0
          </div>
          <button aria-label="Help">?</button>
          <button aria-label="Recent activity">🕐</button>
        </div>
      </div>

      {/* Organization Header */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Org Avatar */}
          <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-bold">
            {org.initial}
          </div>
          <h2 className="text-2xl font-bold">{org.name}</h2>
        </div>
        <button className="px-4 py-2 rounded-2xl bg-[var(--sc-primary)] text-white">
          Contact us
        </button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Subscription, Smartwords, Renewal date, Workspaces, Org Admins cards */}
      </section>

      {/* Smartword Balance Section */}
      <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6">
        {/* Progress bar implementation */}
      </section>

      {/* Workspaces Section */}
      <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6">
        {/* Table implementation */}
      </section>
    </div>
  )
}
```

---

## Mock Data Structure

Create `src/mocks/orgManagement.ts`:

```ts
import type { OrgSummary, WorkspaceRow } from '@/types/orgManagement'

export const mockOrgSummary: OrgSummary = {
  id: '1',
  name: 'Coca-Cola',
  logoUrl: undefined, // Use avatar fallback
  avatarColor: '#dc2626', // Red (matching mockup)
  initial: 'C',
  renewalDate: '2025-05-10T00:00:00Z',
  subscription: 'Enterprise',
  smartwordsTotal: 2000000,
  smartwordsUsed: 1000000, // Approximately 50% used
  workspacesCount: 3,
  organizationAdmins: [
    {
      id: 'admin1',
      name: 'Admin One',
      initial: 'AO',
      avatarColor: '#a855f7',
    },
    {
      id: 'admin2',
      name: 'Admin Two',
      initial: 'AT',
      avatarColor: '#3b82f6',
    },
  ],
  smartwordsSharingEnabled: true,
}

export const mockWorkspaces: WorkspaceRow[] = [
  {
    id: 'ws1',
    name: 'Personal. F. Nielsen',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'fn1',
        name: 'Frank Nielsen',
        initial: 'FN',
        avatarColor: '#8b5cf6',
      },
    ],
    fullAccess: true, // Toggle ON
    allocated: null, // "Not set"
    spent: 0,
    isMyWorkspace: false,
  },
  {
    id: 'ws2',
    name: 'Coca-Cola (main)',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'pb1',
        name: 'PB',
        initial: 'PB',
        avatarColor: '#6366f1',
      },
      {
        id: 'admin2',
        name: 'Admin Two',
        initial: 'AT',
        avatarColor: '#3b82f6',
      },
    ],
    fullAccess: false, // Toggle OFF
    allocated: 0,
    spent: 0,
    isMyWorkspace: true, // For "My workspaces" tab
  },
  {
    id: 'ws3',
    name: 'HR',
    subscription: 'Forever Free',
    admins: [
      {
        id: 'es1',
        name: 'Ester Smith',
        initial: 'ES',
        avatarColor: '#ec4899',
      },
    ],
    fullAccess: false, // Toggle OFF
    allocated: 0,
    spent: 0,
    isMyWorkspace: false,
  },
]
```

Create `src/types/orgManagement.ts`:

```ts
export type OrgSummary = {
  id: string
  name: string
  logoUrl?: string
  avatarColor: string
  initial: string
  renewalDate: string
  subscription: 'Enterprise' | 'Team' | 'Forever Free'
  smartwordsTotal: number
  smartwordsUsed: number
  workspacesCount: number
  organizationAdmins: {
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  smartwordsSharingEnabled: boolean
}

export type WorkspaceRow = {
  id: string
  name: string
  subscription: OrgSummary['subscription']
  admins: {
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  fullAccess: boolean
  allocated: number | null
  spent: number
  isMyWorkspace?: boolean
}

export type WorkspaceTab = 'all' | 'my'
```

---

## 19) File Structure & Implementation Checklist

### 19.1) Files to Create

```
src/
├── pages/
│   └── OrgManagementPage.tsx          # Main page component
├── components/
│   └── org-management/
│       ├── PageHeader.tsx             # Breadcrumbs + top header bar
│       ├── OrgHeaderSection.tsx       # Org avatar + name + Contact us
│       ├── StatCard.tsx               # Reusable stat card component
│       ├── StatsCardsRow.tsx          # Grid of 5 stat cards
│       ├── SmartwordBalanceSection.tsx # Progress bar section
│       ├── ProgressBar.tsx            # Progress bar with tick markers
│       ├── WorkspacesSection.tsx      # Workspaces table section
│       ├── WorkspaceTabs.tsx          # Tab component (All / My workspaces)
│       ├── WorkspacesTable.tsx        # TanStack Table implementation
│       ├── WorkspaceRow.tsx           # Table row component
│       ├── FullAccessSwitch.tsx       # Switch with tooltip
│       ├── ActionsMenu.tsx            # Dropdown menu for row actions
│       └── AllocationModal.tsx        # Allocate/Reclaim modal
├── types/
│   └── orgManagement.ts               # TypeScript types (see Section 6)
├── mocks/
│   └── orgManagement.ts               # Mock data (see Mock Data Structure)
└── hooks/
    └── useOrgManagement.ts             # Custom hook for data fetching/state
```

### 19.2) Files to Update

- `src/App.tsx` - Add route for `/org/management`
- `package.json` - Install dependencies (see Section 15)

### 19.3) Implementation Checklist

#### Phase 1: Setup & Data Layer
- [ ] Create TypeScript types (`src/types/orgManagement.ts`)
- [ ] Create mock data (`src/mocks/orgManagement.ts`)
- [ ] Install required dependencies
- [ ] Add route to `App.tsx`

#### Phase 2: Basic Layout
- [ ] Create `OrgManagementPage.tsx` with basic structure
- [ ] Implement `PageHeader` component (breadcrumbs + top bar)
- [ ] Implement `OrgHeaderSection` component
- [ ] Implement `StatsCardsRow` with 5 stat cards
- [ ] Verify layout matches mockup

#### Phase 3: Smartword Balance Section
- [ ] Create `SmartwordBalanceSection` component
- [ ] Implement `ProgressBar` with tick markers and labels
- [ ] Add "Get more Smartwords" button
- [ ] Format numbers correctly (e.g., "2,000,000")

#### Phase 4: Workspaces Table
- [ ] Create `WorkspacesSection` component
- [ ] Implement `WorkspaceTabs` component
- [ ] Set up TanStack Table structure
- [ ] Implement table columns (Checkbox, Workspace, Subscription, Admins, Full SW Access, Allocated, Spent, Actions)
- [ ] Add table header with tooltips
- [ ] Implement row rendering with all data

#### Phase 5: Interactive Components
- [ ] Implement `FullAccessSwitch` with Radix Switch
- [ ] Add tooltips to information icons
- [ ] Implement `ActionsMenu` dropdown
- [ ] Add checkbox selection (individual rows)
- [ ] Implement tab filtering

#### Phase 6: Modals & Forms
- [ ] Create `AllocationModal` component
- [ ] Implement form with react-hook-form + Zod validation
- [ ] Add numeric input with +/- buttons
- [ ] Show projected balances
- [ ] Handle form submission

#### Phase 7: State Management & API Integration
- [ ] Create `useOrgManagement` hook
- [ ] Implement data fetching (mock for now)
- [ ] Add loading states (skeletons)
- [ ] Add error states
- [ ] Implement optimistic updates for switch toggle
- [ ] Add toast notifications

#### Phase 8: Polish & Accessibility
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Add focus states
- [ ] Test with screen reader
- [ ] Verify responsive design
- [ ] Add hover states
- [ ] Ensure color contrast meets WCAG standards

#### Phase 9: Testing & Documentation
- [ ] Test all user interactions
- [ ] Verify data formatting (dates, numbers)
- [ ] Test edge cases (empty states, errors)
- [ ] Document component props and usage

---

## 20) Additional Implementation Notes

### 20.1) Number Formatting
- Use `Intl.NumberFormat` for Smartwords numbers: `new Intl.NumberFormat().format(value)`
- Example: `2000000` → `"2,000,000"`

### 20.2) Date Formatting
- Use `Intl.DateTimeFormat` for dates: `new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)`
- Example: `2025-05-10` → `"May 10, 2025"`

### 20.3) Avatar Handling
- Reuse existing `Avatar` component from `src/components/navigation/Avatar.tsx`
- For multiple avatars (e.g., admins), stack them horizontally with negative margin for overlap effect
- Show "+N" indicator if more than 2-3 avatars

### 20.4) Table Virtualization
- Only implement virtualization if workspace count > 200
- Use `@tanstack/react-virtual` if needed
- For MVP, simple pagination is acceptable

### 20.5) Responsive Design
- Stat cards: 1 column on mobile, 2 on tablet, 5 on desktop
- Table: Horizontal scroll on mobile, or stack columns vertically
- Hide less critical columns on smaller screens

---

## 21) Design Tokens Reference

Based on the codebase analysis, use these CSS variables:

```css
--sc-surface: #fff
--sc-text: #111827
--sc-primary: #6b4eff
--sc-app-bg: #f7f7fb (fallback)
```

Tailwind classes:
- `rounded-2xl` for card corners
- `shadow-card` for card shadows
- `bg-[var(--sc-surface)]` for card backgrounds
- `text-[var(--sc-text)]` for text color

---

## 22) Icon Mapping (lucide-react)

Use these icons from `lucide-react`:

- **Info icon** ("i"): `Info` - For tooltip triggers
- **Calendar icon**: `Calendar` - For renewal date card
- **Folder icon**: `Folder` - For workspaces card
- **Users/Group icon**: `Users` or `UserCircle` - For organization admins card
- **Smartwords icon**: `Circle` or custom "S" - For Smartwords card
- **Settings icon**: `Settings` or `Gear` - For settings button
- **Refresh icon**: `RefreshCw` - For refresh action in table
- **Help icon**: `HelpCircle` or `QuestionMarkCircle` - For help button
- **Clock icon**: `Clock` - For recent activity
- **Menu icon**: `Menu` - For hamburger menu
- **Checkbox**: Use native HTML checkbox or Radix checkbox
- **Switch**: `@radix-ui/react-switch` (no icon needed)
- **Actions menu**: `MoreVertical` or `MoreHorizontal` - For actions dropdown trigger

All icons should use purple color (`text-[var(--sc-primary)]`) when they represent primary actions or are in stat cards.

