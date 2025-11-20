# Smartwords Allocation Documentation

## Overview

The Smartwords Allocation feature enables organization administrators to allocate and reclaim Smartwords packages to/from workspaces. This feature supports multiple allocation strategies and provides fine-grained control over Smartwords distribution.

## Key Concepts

### Allocation Modes

1. **Allocate**: Transfer Smartwords from organization-level balance to a workspace as a limited package
2. **Reclaim**: Return Smartwords from a workspace package back to organization-level balance

### Package Types

1. **Org-Allocated Packages**
   - Allocated by organization administrator
   - No special label
   - Can be fully or partially reclaimed
   - Count against organization's total allocation

2. **Workspace-Purchased Packages**
   - Purchased by the workspace itself
   - Labeled with "WS" badge
   - Marked as `isNonReclaimable: true`
   - Cannot be reclaimed by org admin
   - Do not count against org allocation (workspace owns them)

### Multiple Packages Per Workspace

A workspace can have multiple allocated packages simultaneously:
- Each package is tracked separately
- Each package has its own allocation and spent amounts
- Package rows appear in the table immediately after the main workspace row
- Packages are identified by `isPackageRow: true` flag

## Allocation Modal

### Trigger

Accessed via the Actions menu in the Workspaces table:
- Click "Allocate" option
- Modal opens with allocation form

### Form Fields

1. **Workspace Name**: Display only (shows target workspace)
2. **Current Workspace Allocation**: 
   - Shows existing allocation or "Not set"
   - If workspace has multiple packages, shows the main workspace allocation
3. **Current Organization Balance**: 
   - Shows available org-level balance
   - Used for validation (cannot exceed this amount)
4. **Amount Input**:
   - Numeric input field
   - +/- buttons for increment/decrement (1,000 Smartwords per click)
   - Manual input supported
   - Real-time validation

### Validation Rules

- Amount must be positive (> 0)
- Amount must be at least 1
- Amount cannot exceed available organization balance
- Form shows validation errors inline
- Confirm button disabled until valid amount entered

### Projected Results

Shows calculated values after allocation:
- **Workspace allocation**: Current + amount to allocate
- **Organization balance**: Current - amount to allocate

### Behavior

When confirming allocation:
1. Decreases organization-level balance by allocated amount
2. If workspace has no existing packages:
   - Sets `allocated` to the allocated amount
   - Creates main workspace allocation
3. If workspace already has packages:
   - Creates a new package row
   - New package has unique ID: `${workspaceId}-${timestamp}`
   - New package starts with `spent: 0`
   - Package row inserted after main workspace row
4. Automatically disables Full Access toggle (if enabled)
5. Updates progress bar visualization
6. Updates workspace table

## Reclaim Modal

### Trigger

Accessed via the Actions menu in the Workspaces table:
- Click "Reclaim" option
- Only available for reclaimable packages
- Disabled for workspace-purchased packages (`isNonReclaimable: true`)

### Form Fields

1. **Workspace Name**: Display only
2. **Allocated Package**: Shows current package allocation
3. **Used**: Shows amount already spent from this package (if any)
4. **Remaining (Reclaimable)**: 
   - Calculated as `allocated - spent`
   - Maximum amount that can be reclaimed
   - Pre-populates the amount input
5. **Amount Input**:
   - Pre-populated with maximum reclaimable amount
   - Numeric input field
   - +/- buttons for increment/decrement (1,000 Smartwords per click)
   - Manual input supported
   - Real-time validation

### Validation Rules

- Amount must be positive (> 0)
- Amount must be at least 1
- Amount cannot exceed remaining (reclaimable) balance
- Form shows validation errors inline
- Confirm button disabled until valid amount entered

### Projected Results

Shows calculated values after reclaim:
- **Workspace allocation**: Remaining after reclaim (allocated - amount reclaimed)
- **Organization balance**: Current + amount reclaimed

### Behavior

When confirming reclaim:
1. Increases organization-level balance by reclaimed amount
2. Decreases workspace allocated balance by reclaimed amount
3. **Spent amount remains unchanged** (tracks all consumption)
4. If fully reclaimed:
   - Sets `allocated` to `null` (shows "Not set")
   - Removes package row if it's a package row (`isPackageRow: true`)
   - Spent amount now counts as org-level consumption
5. Updates progress bar visualization
6. Updates workspace table

## Partial Reclaiming

Partial reclaiming is fully supported:
- Admin can reclaim any amount up to the remaining balance
- Remaining balance = `allocated - spent`
- After partial reclaim, package continues to exist with reduced allocation
- Spent amount is preserved

## Package Row Management

### Creating Package Rows

When allocating to a workspace that already has packages:
1. New package row is created with unique ID
2. Row is marked with `isPackageRow: true`
3. Row is inserted immediately after the main workspace row
4. If workspace has multiple package rows, new row is inserted after the last package row for that workspace

### Removing Package Rows

Package rows are removed when:
- Fully reclaimed (allocated becomes 0 or null)
- Only package rows are removed, not main workspace rows

### Package Row Display

Package rows only show:
- **ALLOCATED PACKAGE**: Package amount (with label if workspace-purchased)
- **REMAINING**: Calculated balance (allocated - spent)
- **ACTIONS**: Allocate/Reclaim menu

Package rows do NOT show:
- Workspace name (inherited from main row)
- Admins
- USE ORG SUBSCRIPTION toggle
- USE ORG SMARTWORDS toggle

## Workspace-Purchased Packages

### Characteristics

- Labeled with "WS" badge in the ALLOCATED PACKAGE column
- Marked with `isNonReclaimable: true`
- Purchased by the workspace itself (not allocated by org admin)
- Cannot be reclaimed by organization administrator
- Reclaim option is disabled in Actions menu

### Identification

In the code:
```typescript
{
  allocated: 200000,
  packageLabel: 'WS',
  isNonReclaimable: true,
  isPackageRow: true
}
```

## Integration with Full Access

### Automatic Behavior

When allocating a package:
- Full Access toggle is automatically turned OFF
- This ensures the workspace uses the allocated package first
- Full Access can be manually re-enabled if needed

### Coexistence

Full Access and allocated packages can coexist:
- Workspace will first consume from allocated packages
- After allocated packages are exhausted, workspace consumes from org-level shared pool (if Full Access is enabled)

## Calculation Logic

### Available Organization Balance

```
availableOrgBalance = initialSmartwordsTotal - totalAllocated - orgLevelSpent
```

Where:
- `initialSmartwordsTotal`: Original subscription amount (fixed)
- `totalAllocated`: Sum of all allocated packages (excluding workspace-purchased)
- `orgLevelSpent`: Spent from workspaces without allocated packages

### Remaining Package Balance

```
remainingBalance = Math.max(0, allocated - spent)
```

### Reclaimable Amount

```
reclaimableAmount = Math.max(0, allocated - spent)
```

## Component Structure

```
AllocationModal
├── Dialog.Root (Radix UI)
├── Dialog.Overlay
└── Dialog.Content
    ├── Header (Title + Close button)
    └── Form
        ├── Workspace Info Section
        ├── Amount Input (with +/- buttons)
        ├── Validation Errors
        ├── Projected Results Section
        └── Action Buttons (Cancel + Confirm)
```

## Data Flow

### Allocation Flow

```
User clicks "Allocate"
  → Opens AllocationModal
  → User enters amount
  → Validation
  → User clicks "Confirm"
  → handleWorkspaceAllocation(workspaceId, amount, 'allocate')
  → Updates workspaces state
  → Updates org state
  → Closes modal
  → Updates UI (table, progress bar)
```

### Reclaim Flow

```
User clicks "Reclaim"
  → Opens AllocationModal (mode: 'reclaim')
  → Modal pre-populates with max reclaimable
  → User adjusts amount (optional)
  → Validation
  → User clicks "Confirm"
  → handleWorkspaceAllocation(workspaceId, amount, 'reclaim')
  → Updates workspaces state
  → Updates org state
  → Removes package row if fully reclaimed
  → Closes modal
  → Updates UI (table, progress bar)
```

## Edge Cases Handled

1. **Allocating to workspace with existing packages**: Creates new package row
2. **Fully reclaiming a package**: Removes package row, sets allocated to null
3. **Reclaiming more than remaining**: Validation prevents this
4. **Allocating more than org balance**: Validation prevents this
5. **Workspace-purchased packages**: Reclaim option disabled

## Related Features

- **Smartwords Management**: Main page where allocation happens
- **Smartwords Usage Report**: Shows allocation history per workspace
- **Progress Bar**: Visualizes allocation impact on org balance

## Implementation Notes

- Uses `react-hook-form` with `zod` validation
- Uses Radix UI Dialog for modal
- Modal component: `src/components/org-management/AllocationModal.tsx`
- Allocation logic: `src/pages/OrgManagementPage.tsx` → `handleWorkspaceAllocation`


