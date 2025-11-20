# Features Documentation Index

This document provides an overview of all feature documentation available in the `_meta` folder. This documentation is intended for use in the next phase when implementing E2E tests for the prototype.

## Documentation Files

### 1. Smartwords Management
**File**: `smartwords-management-documentation.md`

**Overview**: Organization-level visibility and control over Smartwords balance and workspace provisioning.

**Key Topics**:
- Organization-level Smartwords package
- Workspace access modes (Full Access vs Allocated Packages)
- Consumption priority rules
- Organization header and statistics
- Smartword balance section with progress bar
- Workspaces table with allocation management
- Business rules and calculation logic

**Use Cases**:
- Monitoring org-level Smartwords balance
- Allocating Smartwords to workspaces
- Managing workspace access modes
- Moving Smartwords between organizations

### 2. Smartwords Allocation
**File**: `smartwords-allocation-documentation.md`

**Overview**: Detailed documentation of the allocation and reclaiming process for Smartwords packages.

**Key Topics**:
- Allocation and reclaim modals
- Package types (org-allocated vs workspace-purchased)
- Multiple packages per workspace
- Partial reclaiming support
- Package row management
- Integration with Full Access mode
- Validation rules and calculations

**Use Cases**:
- Allocating Smartwords to a workspace
- Reclaiming Smartwords from a workspace
- Managing multiple packages per workspace
- Understanding workspace-purchased packages

### 3. Smartwords Usage Report
**File**: `smartwords-usage-report-documentation.md`

**Overview**: Per-workspace tracking and analysis of Smartwords consumption with time-based filtering.

**Key Topics**:
- Balance summary cards
- Statistics widget with time period filtering
- Chart visualization (area chart with step function)
- Operations history table with pagination
- CSV export functionality
- Time period calculations
- Operation types and data model

**Use Cases**:
- Viewing workspace Smartwords usage
- Analyzing usage trends over time
- Exporting usage data
- Filtering operations by time period

### 4. Navigation
**File**: `navigation-documentation.md`

**Overview**: Persistent left sidebar navigation with organization/workspace selection, primary navigation, and expandable sub-navigation panels.

**Key Topics**:
- Left navigation panel structure
- Organization selector with popover
- Primary navigation (Home, Hub, Chats)
- Hub sub-navigation (12 items)
- Work sub-navigation (4 items)
- User menu with settings
- Active route highlighting
- Sub-navigation expansion behavior

**Use Cases**:
- Navigating between main sections
- Accessing Hub features
- Switching organizations/workspaces
- Accessing user settings

### 5. Breadcrumbs
**File**: `breadcrumbs-documentation.md`

**Overview**: Contextual navigation information showing current page location within the application hierarchy.

**Key Topics**:
- Breadcrumb generation from URL paths
- Route label mapping
- Special cases (chats, usage reports)
- Visual design and styling
- Clickable navigation (planned)
- Integration with Header component

**Use Cases**:
- Understanding current page location
- Navigating to parent pages (when implemented)
- Context awareness for users

## Feature Relationships

### Smartwords Features
- **Smartwords Management** → Main page for org-level Smartwords control
- **Smartwords Allocation** → Detailed allocation/reclaim process (used within Management)
- **Smartwords Usage Report** → Per-workspace usage tracking (accessed from Management)

### Navigation Features
- **Navigation** → Primary navigation system
- **Breadcrumbs** → Contextual navigation aid (shown in Header)

### Integration Points

1. **Navigation → Smartwords Management**
   - Accessible via Hub sub-navigation or organization menu
   - Breadcrumbs show "Organization / Organization management"

2. **Smartwords Management → Usage Report**
   - Accessed via Actions menu in Workspaces table
   - Navigates to `/smartwords-usage-report/:workspaceId`
   - Breadcrumbs show workspace name

3. **Navigation → Chats**
   - Primary navigation item
   - Special toggle behavior when already on chats page
   - Breadcrumbs show "Chats / Chat {chatId}"

## Testing Considerations

### For E2E Tests

When implementing E2E tests, consider:

1. **Smartwords Management**
   - Test allocation flow (modal → validation → confirmation)
   - Test reclaim flow (partial and full)
   - Test Full Access toggle
   - Test multiple packages per workspace
   - Test progress bar calculations
   - Test workspace-purchased packages (non-reclaimable)

2. **Smartwords Allocation**
   - Test modal validation (exceed balance, negative amounts)
   - Test partial reclaiming
   - Test package row creation/removal
   - Test integration with Full Access toggle

3. **Smartwords Usage Report**
   - Test time period filtering
   - Test chart rendering with different data sets
   - Test pagination in operations table
   - Test CSV export
   - Test workspace totals calculation (multiple packages)

4. **Navigation**
   - Test sub-navigation expansion/collapse
   - Test active route highlighting
   - Test organization/user popovers
   - Test route navigation
   - Test mutual exclusivity of sub-navigation panels

5. **Breadcrumbs**
   - Test breadcrumb generation for various routes
   - Test special cases (chats, usage reports)
   - Test workspace name lookup
   - Test clickable navigation (when implemented)

## Key Business Rules

### Smartwords Consumption Priority
1. First: Consume from allocated packages (if any exist)
2. Then: Consume from org-level shared pool (if Full Access is enabled)

### Package Types
- **Org-allocated**: No label, can be reclaimed
- **Workspace-purchased**: "WS" label, non-reclaimable

### Full Access Behavior
- Can coexist with allocated packages
- Automatically disabled when allocating a package
- Can be manually re-enabled

### Multiple Packages
- Workspaces can have multiple allocated packages
- Each package tracked separately
- Package rows appear after main workspace row

## Data Models

### Key Types

- `OrgSummary`: Organization-level data
- `WorkspaceRow`: Workspace data with allocation info
- `SmartwordsOperation`: Individual operation record
- `NavItem`: Navigation item structure
- `User`, `Organization`, `Workspace`: User/org data

See individual documentation files for complete type definitions.

## Component Locations

### Pages
- `src/pages/OrgManagementPage.tsx` - Smartwords Management
- `src/pages/SmartwordsUsageReportPage.tsx` - Usage Report

### Components
- `src/components/org-management/` - Management components
- `src/components/smartwords/` - Usage report components
- `src/components/navigation/` - Navigation components
- `src/components/layout/` - Layout components (Header, Breadcrumbs)

### Mocks
- `src/mocks/orgManagement.ts` - Organization and workspace data
- `src/mocks/navigation.ts` - Navigation data

### Types
- `src/types/orgManagement.ts` - Organization types
- `src/types/smartwords.ts` - Smartwords operation types
- `src/types/navigation.ts` - Navigation types

## Next Steps

1. **Review Documentation**: Ensure all features are accurately documented
2. **E2E Test Planning**: Use documentation to plan test scenarios
3. **Test Implementation**: Create E2E tests based on documented features
4. **Documentation Updates**: Update as features evolve or new features are added

## Notes

- This is a **prototype** - focus on prime use cases, not edge cases
- Features may evolve as the prototype develops
- Documentation should be updated as features change
- E2E tests should cover the documented prime use cases


