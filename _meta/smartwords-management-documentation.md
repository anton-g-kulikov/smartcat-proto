# Smartwords Management Documentation

## Overview

The Smartwords Management feature provides organization-level visibility and control over Smartwords balance and workspace provisioning. This feature allows organization administrators to monitor, allocate, and manage Smartwords across all workspaces within an organization.

## Key Concepts

### Organization-Level Smartwords Package

The organization maintains a shared pool of Smartwords that can be:
- **Allocated** to specific workspaces as limited packages
- **Shared** with workspaces that have Full Access enabled
- **Moved** between organizations
- **Tracked** through a visual progress bar showing allocation, spending, and remaining balance

### Workspace Access Modes

Workspaces can access Smartwords in two ways:

1. **Full Access (USE ORG SMARTWORDS)**
   - Workspace has unlimited access to the organization-level shared pool
   - Consumption counts directly against the org balance
   - No allocation limits
   - Toggle can be enabled/disabled per workspace

2. **Allocated Packages**
   - Distinct, limited Smartwords packages allocated to specific workspaces
   - Each package has a fixed allocation amount
   - Workspace can have multiple packages
   - Consumption counts against the package balance, not org balance

### Consumption Priority

When a workspace has both Full Access and allocated packages:
1. **First**: Consume from allocated packages (if any exist)
2. **Then**: Consume from org-level shared pool (if Full Access is enabled)

This ensures allocated packages are used before the shared pool.

## Features

### 1. Organization Header Section

**Location**: Top of the Organization Management page

**Components**:
- Organization avatar/logo (circular, colored background with initial)
- Organization name (large, bold text)
- "Contact us" button (purple background, white text)

**Purpose**: Displays the current organization being managed

### 2. Statistics Cards Row

**Location**: Below organization header

**Cards** (5 total):
1. **Subscription**: Shows subscription tier (Enterprise, Team, Forever Free)
2. **Smartwords**: Shows total Smartwords balance (formatted number)
3. **Renewal Date**: Shows subscription renewal date
4. **Workspaces**: Shows count of workspaces in the organization
5. **Organization Admins**: Shows admin avatars (max 2 visible, with "+N" indicator)

**Styling**: Each card uses `rounded-2xl bg-[var(--sc-surface)] shadow-card p-4`

### 3. Smartword Balance Section

**Location**: Below statistics cards

**Components**:
- Section header with "Org-level Smartwords Package" title
- "Move Smartwords" button (opens modal to transfer Smartwords between organizations)
- Progress bar visualization

**Progress Bar**:
- Shows three sections:
  - **Remaining** (dark purple): Available org-level balance
  - **Allocated** (pink): Total allocated to workspaces
  - **Spent** (light purple): Total spent from org-level balance
- Tick markers at 0 and initial total
- Tooltips on hover showing exact amounts
- Labels below showing section names and amounts

**Calculation Logic**:
```
Available Org Balance = initialSmartwordsTotal - totalAllocated - orgLevelSpent
```

Where:
- `initialSmartwordsTotal`: Original subscription amount (doesn't change)
- `totalAllocated`: Sum of all allocated packages across all workspaces
- `orgLevelSpent`: Spent from workspaces WITHOUT allocated packages (or with Full Access after packages are exhausted)

### 4. Workspaces Section

**Location**: Below Smartword Balance section

**Components**:
- Section header with "Workspaces" title
- Tabs: "All {count}" and "My workspaces {count}"
- Workspaces table

**Workspaces Table Columns**:

1. **WORKSPACE**: Workspace name
2. **ADMINS**: Admin avatars (circular, max 2 visible, with "+N" indicator)
3. **USE ORG SUBSCRIPTION**: Toggle switch
   - ON: Workspace can use organization subscription benefits
   - OFF: Workspace uses its own subscription
4. **USE ORG SMARTWORDS**: Toggle switch (Full Access)
   - ON: Workspace has unlimited access to org-level shared pool
   - OFF: Workspace only uses allocated packages (if any)
5. **ALLOCATED PACKAGE**: Shows allocated amount or "Not set"
   - Can display package label (e.g., "WS") for workspace-purchased packages
6. **REMAINING**: Calculated as `allocated - spent` for each package
7. **ACTIONS**: Dropdown menu with options:
   - Manage admins
   - Usage report (navigates to `/smartwords-usage-report/:workspaceId`)
   - Settings
   - Allocate (opens allocation modal)
   - Reclaim (opens reclaim modal, disabled for non-reclaimable packages)

**Package Rows**:
- Workspaces can have multiple allocated packages
- Each additional package appears as a separate row (marked with `isPackageRow: true`)
- Package rows only show: ALLOCATED PACKAGE, REMAINING, and ACTIONS columns
- Package rows are inserted immediately after the main workspace row

**Special Package Types**:
- **Workspace-Purchased Packages**: 
  - Have "WS" label
  - Marked with `isNonReclaimable: true`
  - Cannot be reclaimed by org admin
  - Purchased by the workspace itself, not allocated by org admin

## User Interactions

### Toggling Full Access

**Action**: Click the "USE ORG SMARTWORDS" toggle switch

**Behavior**:
- Immediate visual feedback (optimistic update)
- When enabling Full Access: Workspace gains access to org-level shared pool
- When disabling Full Access: Workspace only uses allocated packages (if any)
- If allocating a package to a workspace with Full Access enabled, Full Access is automatically turned off

**Note**: Full Access and allocated packages can coexist. Consumption priority applies.

### Allocating Smartwords

**Action**: Click "Allocate" from Actions menu

**Modal Features**:
- Shows current workspace allocation (or "Not set")
- Shows current organization balance
- Numeric input with +/- buttons (increments of 1,000)
- Validation: Cannot exceed available org balance
- Shows projected balances after allocation
- Confirm button (disabled until valid amount entered)

**Behavior**:
- Decreases org-level balance
- Increases workspace allocated balance
- If workspace already has packages, creates a new package row
- Automatically turns off Full Access when allocating

### Reclaiming Smartwords

**Action**: Click "Reclaim" from Actions menu

**Modal Features**:
- Shows allocated package amount
- Shows used amount (if any)
- Shows remaining (reclaimable) amount
- Pre-populated with maximum reclaimable amount
- Numeric input with +/- buttons
- Validation: Cannot exceed remaining balance
- Shows projected balances after reclaim
- Confirm button (disabled until valid amount entered)

**Behavior**:
- Increases org-level balance
- Decreases workspace allocated balance
- Partial reclaiming is supported
- If fully reclaimed, package row is removed
- If fully reclaimed, allocated is set to `null` (shows "Not set")
- Non-reclaimable packages (workspace-purchased) cannot be reclaimed

### Moving Smartwords Between Organizations

**Action**: Click "Move Smartwords" button in Smartword Balance section

**Modal Features**:
- Shows current organization name and available balance
- Dropdown to select target organization
- Shows target organization's current balance
- Numeric input for amount to move
- Validation: Cannot exceed available balance

**Behavior**:
- Decreases source organization's balance
- Increases target organization's balance
- Updates both organizations' totals

## Data Model

### OrgSummary Type

```typescript
type OrgSummary = {
  id: string
  name: string
  logoUrl?: string
  avatarColor: string
  initial: string
  renewalDate: string
  subscription: 'Enterprise' | 'Team' | 'Forever Free'
  initialSmartwordsTotal: number  // Original subscription amount (fixed)
  smartwordsTotal: number          // Current total after allocations/moves
  smartwordsUsed: number           // Total used (includes all workspaces)
  workspacesCount: number
  organizationAdmins: {
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  smartwordsSharingEnabled: boolean
  allowNewWorkspacesOrgSubscription: boolean
  allowNewWorkspacesOrgSmartwords: boolean
}
```

### WorkspaceRow Type

```typescript
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
  subscriptionAccess: boolean      // USE ORG SUBSCRIPTION toggle
  fullAccess: boolean              // USE ORG SMARTWORDS toggle
  allocated: number | null         // Allocated package amount (null = "Not set")
  spent: number                    // Amount spent from this package
  isMyWorkspace?: boolean          // For "My workspaces" tab filtering
  isPackageRow?: boolean           // If true, only show package columns
  packageLabel?: string            // Optional label (e.g., "WS")
  isNonReclaimable?: boolean       // If true, cannot be reclaimed
}
```

## Business Rules

1. **Allocation Priority**: Allocated packages are consumed before org-level shared pool
2. **Full Access**: When enabled, workspace can access org-level pool after allocated packages are exhausted
3. **Package Labels**: Only workspace-purchased packages have "WS" label
4. **Non-Reclaimable**: Workspace-purchased packages cannot be reclaimed by org admin
5. **Multiple Packages**: Workspaces can have multiple allocated packages simultaneously
6. **Partial Reclaiming**: Admins can reclaim partial amounts from packages
7. **Auto-Disable Full Access**: Allocating a package automatically disables Full Access
8. **Spent Tracking**: Spent amount is tracked per package and doesn't change when reclaiming

## Component Structure

```
OrgManagementPage
├── OrgHeaderSection
│   ├── OrgAvatar
│   ├── OrgName
│   └── ContactUsButton
├── StatsCardsRow
│   └── StatCard (×5)
├── SmartwordBalanceSection
│   ├── SectionHeader
│   ├── ProgressBar
│   └── MoveSmartwordsModal
└── WorkspacesSection
    ├── SectionHeader
    ├── WorkspaceTabs
    └── WorkspacesTable
        ├── TableHeader
        ├── TableBody
        │   └── WorkspaceRow (main + package rows)
        └── AllocationModal
```

## Routes

- **Main Page**: `/org/management`
- **Usage Report**: `/smartwords-usage-report/:workspaceId` (accessed via Actions menu)

## Related Features

- **Smartwords Usage Report**: Detailed per-workspace usage tracking
- **Navigation**: Access via Hub sub-navigation or organization menu
- **Breadcrumbs**: Shows "Organization management" path

## Implementation Notes

- Uses TanStack Table for workspace table
- Uses Radix UI for modals, tooltips, and switches
- Mock data in `src/mocks/orgManagement.ts`
- Types defined in `src/types/orgManagement.ts`
- Main page component: `src/pages/OrgManagementPage.tsx`


