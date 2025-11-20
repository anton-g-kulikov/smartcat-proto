# Smartwords Usage Report Documentation

## Overview

The Smartwords Usage Report provides detailed per-workspace tracking and analysis of Smartwords consumption. It displays allocation history, usage statistics, and operations history with time-based filtering and visualization.

## Purpose

The Usage Report enables:
- **Workspace-level visibility**: Track Smartwords consumption for individual workspaces
- **Trend analysis**: View usage patterns over time through charts and statistics
- **Operations tracking**: Detailed history of all Smartwords operations (allocations, translations, etc.)
- **Time period analysis**: Filter and analyze usage by different time periods

## Access

**Route**: `/smartwords-usage-report/:workspaceId`

**Navigation**:
- Accessed via Actions menu in Workspaces table
- Click "Usage report" option
- Navigates to report page for selected workspace

## Page Structure

### 1. Page Header

**Location**: Top of page

**Content**:
- Page title: "Smartwords Usage Report"

### 2. Balance Summary Cards

**Location**: Below page header

**Cards** (3 total, horizontal grid):

1. **Allocated**
   - Label: "Allocated"
   - Value: Total allocated across all packages for the workspace
   - Icon: Circle icon
   - Calculation: Sum of all packages' allocated amounts

2. **Remaining**
   - Label: "Remaining"
   - Value: Total remaining across all packages
   - Icon: Circle icon
   - Calculation: Sum of (allocated - spent) for all packages

3. **Current Plan**
   - Label: "Current Plan"
   - Value: Workspace subscription tier (Enterprise, Team, Forever Free)
   - Icon: Circle icon
   - Additional: Shows renewal date if available

**Styling**: Each card uses `rounded-2xl bg-white shadow-sm border border-gray-200 p-6`

### 3. Statistics Widget

**Location**: Below balance summary cards

**Purpose**: Track trends over time with visual charts and statistics

**Components**:

#### Time Period Selector
- Dropdown with predefined periods:
  - This month
  - Last month
  - This quarter
  - Last quarter
  - This year (default)
  - Last year
- Each option shows the period label and date range
- Selected period highlighted with checkmark

#### Chart Visualization
- **Type**: Area chart (step function)
- **X-axis**: Date (formatted as "Month Day, Year")
- **Y-axis**: Balance (formatted in thousands, e.g., "300k")
- **Data**: Balance over time (step function showing balance changes)
- **Styling**: Purple gradient fill, purple stroke
- **Tooltip**: Shows exact balance on hover

**Chart Data Calculation**:
- Calculates initial balance from operations before selected period
- For each operation in period:
  - Allocation operations: Increase balance
  - Translation/consumption operations: Decrease balance
- Creates data points at each operation timestamp
- Uses step function to show balance jumps

#### Summary Cards
Two cards below chart:
1. **TOTAL ADDED**: Sum of all allocation operations in period (green)
2. **TOTAL USED**: Sum of all consumption operations in period (red, negative)

#### Download CSV Button
- Button with download icon
- Exports filtered operations to CSV file
- Filename: `smartwords-report-{period}-{date}.csv`
- Includes: Date, Type, Project, Amount, Description

### 4. Operations History Table

**Location**: Below Statistics Widget

**Purpose**: Detailed list of all Smartwords operations

**Features**:
- Filtered by selected time period (from Statistics Widget)
- Sorted by timestamp (newest first)
- Paginated (10 items per page)
- Shows operation details

**Table Columns**:

1. **Date & Time**
   - Calendar icon
   - Formatted date/time: "Month Day, Year, HH:MM"
   - Example: "Jan 15, 2025, 02:30 PM"

2. **Project**
   - Icon indicator:
     - Allocation operations: Green up arrow
     - Translation operations: File icon
   - Project name or description
   - For allocations: Shows "Smartwords allocated to workspace"

3. **Word Count**
   - Number of words (for translation operations)
   - Formatted with thousand separators
   - Shows "-" for allocation operations

4. **Smartwords Used**
   - Right-aligned
   - Color coding:
     - Allocations: Green (positive, with "+" prefix)
     - Consumption: Black (negative)
   - Formatted with thousand separators

**Pagination**:
- Shows current page and total pages
- Previous/Next buttons
- Page number links with ellipsis for large page counts
- Resets to page 1 when time period filter changes

**Empty State**:
- Shows when no operations found for selected period
- File icon
- "No operations found" message

## Data Model

### Workspace Totals Calculation

For workspaces with multiple packages, totals are calculated across all packages:

```typescript
const calculateWorkspaceTotals = (workspaceId: string, workspaces: WorkspaceRow[]) => {
  // Find main workspace
  const mainWorkspace = workspaces.find(ws => ws.id === workspaceId && !ws.isPackageRow)
  
  // Get all packages for this workspace (main + package rows with same name)
  const workspacePackages = workspaces.filter(
    ws => ws.name === mainWorkspace.name && ws.allocated !== null && ws.allocated > 0
  )
  
  // Sum totals across all packages
  let totalAllocated = 0
  let totalSpent = 0
  let totalRemaining = 0
  
  workspacePackages.forEach(ws => {
    const allocated = ws.allocated || 0
    const remaining = Math.max(0, allocated - (ws.spent || 0))
    totalAllocated += allocated
    totalSpent += ws.spent || 0
    totalRemaining += remaining
  })
  
  return { totalAllocated, totalSpent, totalRemaining, workspace: mainWorkspace }
}
```

### SmartwordsOperation Type

```typescript
type SmartwordsOperation = {
  id: string
  timestamp: string              // ISO date string
  type: 'translation' | 'allocation' | 'reclaim' | 'transfer'
  projectName?: string
  projectId?: string
  amount: number                 // Positive for spending, negative for allocation/transfer in
  description: string
  sourceLanguage?: string
  targetLanguages?: string[]
  fileType?: string
  wordCount?: number
}
```

**Operation Types**:
- `translation`: Smartwords consumed for translation work
- `allocation`: Smartwords allocated to workspace
- `reclaim`: Smartwords reclaimed from workspace
- `transfer`: Smartwords transferred (not currently used)

## Time Period Filtering

### Filter Behavior

- **Statistics Widget**: User selects time period from dropdown
- **Operations Table**: Automatically filtered by selected period
- **Chart**: Shows balance changes only within selected period
- **Summary Cards**: Calculate totals only for selected period
- **Pagination**: Resets to page 1 when filter changes

### Time Period Calculations

Periods are calculated relative to current date:

- **This month**: First day of current month to last day of current month
- **Last month**: First day of previous month to last day of previous month
- **This quarter**: First day of current quarter to last day of current quarter
- **Last quarter**: First day of previous quarter to last day of previous quarter
- **This year**: January 1 to December 31 of current year
- **Last year**: January 1 to December 31 of previous year

### Initial Balance Calculation

For chart visualization:
- Calculates balance from all operations BEFORE the selected period
- Uses this as the starting balance for the chart
- Ensures chart shows accurate balance progression

## Statistics Widget Details

### Chart Features

- **Step Function**: Uses `stepBefore` type to show balance jumps at operation timestamps
- **Gradient Fill**: Purple gradient from 30% opacity to 0%
- **Responsive**: Adapts to container width
- **Y-axis Scaling**: Automatically scales to show all data points
- **Tick Marks**: Shows values in thousands (e.g., "300k", "600k")

### Summary Calculations

```typescript
let totalAdded = 0
let totalUsed = 0

filteredOperations.forEach(op => {
  if (op.type === 'allocation') {
    totalAdded += op.amount
  } else {
    totalUsed += op.amount
  }
})
```

## CSV Export

### Export Format

CSV file contains:
- **Headers**: Date, Type, Project, Amount, Description
- **Rows**: One per operation in filtered period
- **Date Format**: Locale date string
- **Amount**: Numeric value

### File Naming

Format: `smartwords-report-{period}-{date}.csv`

Example: `smartwords-report-this-year-2025-01-15.csv`

## Component Structure

```
SmartwordsUsageReportPage
├── Page Header
├── Balance Summary Cards (3 cards)
├── StatisticsWidget
│   ├── Time Period Selector
│   ├── Chart (AreaChart from recharts)
│   ├── Summary Cards (TOTAL ADDED, TOTAL USED)
│   └── Download CSV Button
└── Operations History Table
    ├── Table Header
    ├── Table Body (paginated)
    └── Pagination Controls
```

## Integration Points

### Data Source

- Operations: `mockWorkspaceOperations[workspaceId]` from `src/mocks/orgManagement.ts`
- Workspace info: `mockWorkspaces` filtered by `workspaceId`
- Organization info: `mockOrgSummary` for renewal date

### Navigation

- Accessed from Workspaces table Actions menu
- Breadcrumbs show workspace name
- URL parameter: `:workspaceId`

## User Interactions

### Time Period Selection

1. User clicks time period dropdown
2. Selects period (e.g., "This year")
3. Statistics Widget updates:
   - Chart recalculates with filtered data
   - Summary cards recalculate totals
4. Operations table automatically filters
5. Pagination resets to page 1

### Pagination

1. User clicks page number or Previous/Next
2. Table shows operations for selected page
3. Page indicator updates
4. Scroll position maintained

### CSV Download

1. User clicks "Download detailed CSV report"
2. Browser downloads CSV file
3. File contains all operations from filtered period

## Related Features

- **Smartwords Management**: Source of workspace data
- **Smartwords Allocation**: Creates allocation operations
- **Navigation**: Access via Actions menu
- **Breadcrumbs**: Shows workspace name in breadcrumb path

## Implementation Notes

- Uses `recharts` library for chart visualization
- Uses Radix UI Select for time period dropdown
- Main page component: `src/pages/SmartwordsUsageReportPage.tsx`
- Statistics widget: `src/components/smartwords/StatisticsWidget.tsx`
- Operations data: `src/mocks/orgManagement.ts` → `mockWorkspaceOperations`


