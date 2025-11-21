# Navigation Documentation

## Overview

The Navigation feature provides a persistent left sidebar navigation panel that enables users to access all major sections of the application. It includes organization/workspace selection, primary navigation items, user menu, and expandable sub-navigation panels.

## Layout Structure

### Left Navigation Panel

**Location**: Fixed left sidebar, full height
**Width**: ~72px (narrow, icon-only navigation)
**Background**: Light gray (`bg-gray-50`)
**Border**: Right border (`border-r border-gray-200`)

**Structure** (top to bottom):
1. Organization Selector (top)
2. Primary Navigation (middle-top)
3. User Menu (middle-bottom)
4. Work Section (below user)
5. Tour Link (bottom)

## Components

### 1. Organization Selector

**Location**: Top of left nav panel

**Visual**: Circular icon with organization initial/avatar

**Behavior**:
- Click opens popover with organization/workspace hierarchy
- Shows current organization and workspace
- Allows switching between organizations/workspaces

**Popover Content**:

**Level 1: Organization**
- Circular avatar/icon (pink/red with "S" or org initial)
- Organization name (e.g., "Smartcat")
- Details: "{workspacesCount} workspaces · {plan} · {region}"
- Actions:
  - Settings gear icon → Navigates to `/org/settings`
  - "Change" button with right arrow → Opens organization switcher

**Level 2: Workspace**
- Circular avatar/icon (purple with user initials, e.g., "AK")
- Workspace name (e.g., "Anton Kulikov's Workspace")
- Details: "{membersCount} members · {plan} · {region}"
- Actions:
  - Settings gear icon → Workspace settings
  - Add member button (person icon with plus)
  - "Switch" button with right arrow → Opens workspace switcher

**Visual Design**:
- Rounded card/popover
- Shows hierarchy with vertical line connector
- Uses Radix UI Popover component

### 2. Primary Navigation

**Location**: Middle-top section of left nav panel

**Items**:

1. **Home**
   - Icon: House icon
   - Route: `/`
   - Label: "Home"
   - Purpose: Landing/dashboard page

2. **Hub**
   - Icon: Grid icon (9 squares)
   - Route: `/hub` (base route)
   - Label: "Hub"
   - Purpose: Main hub section with expandable sub-navigation
   - **Has Sub-Navigation**: Yes

3. **Chats**
   - Icon: Speech bubble icon
   - Route: `/chats`
   - Label: "Chats"
   - Purpose: AI chat interface
   - **Special Behavior**: Toggles sidebar when already on chats page

**Active State**:
- Highlighted background (`bg-gray-100`)
- Left border accent (`border-l-2 border-[var(--sc-primary)]`)
- Active route determined by `useLocation()` from React Router

**Click Behavior**:
- **Hub**: Expands/collapses sub-navigation panel
- **Chats**: If already on `/chats`, toggles sidebar instead of navigating
- **Home**: Navigates to home page

### 3. Hub Sub-Navigation

**Location**: Expands to the right of left nav panel when Hub is active

**Width**: ~200-240px (additional width)

**Behavior**:
- Expands when Hub is clicked or when navigating to any `/hub/*` route
- Collapses when clicking Hub again or navigating away
- Auto-expands when navigating to Hub routes
- Closes when Work sub-navigation opens

**Items** (top to bottom):

1. **Projects** → `/hub/projects`
   - Icon: Folder with document
2. **Drive** → `/hub/drive`
   - Icon: Document
3. **Smartwords** → `/hub/smartwords`
   - Icon: Circular icon with stylized "S"
4. **Orders** → `/hub/orders`
   - Icon: Arrow pointing right then down
5. **Payments** → `/hub/payments`
   - Icon: Clock with dollar sign
6. **Clients** → `/hub/clients`
   - Icon: Two person silhouettes
7. **Marketplace** → `/hub/marketplace`
   - Icon: Shopping cart
8. **Linguistic assets** → `/hub/linguistic-assets`
   - Icon: Two "Aa" letters
9. **Integrations** → `/hub/integrations`
   - Icon: Two interlocking squares
10. **Reports** → `/hub/reports`
    - Icon: Circular arrow
11. **Team** → `/hub/team`
    - Icon: Three person silhouettes
12. **Settings** → `/hub/settings`
    - Icon: Gear

**Active State**:
- Active route highlighted with background color
- Left border accent for active item
- Uses `location.pathname.startsWith('/hub')` to determine active state

### 4. Work Sub-Navigation

**Location**: Expands to the right of left nav panel when Work is clicked

**Width**: ~200-240px (additional width)

**Purpose**: User-specific workspace area (different from Hub)

**Behavior**:
- Expands when Work button is clicked
- Collapses when clicking Work again
- Closes when Hub sub-navigation opens
- Auto-expands when navigating to `/work/*` routes

**Items** (from navigation spec):
- **Region** → `/work/region`
- **Jobs** → `/work/jobs`
- **Payouts** → `/work/payouts`
- **Direct messages** → `/work/messages`

**Active State**:
- Similar to Hub sub-navigation
- Uses `location.pathname.startsWith('/work')` to determine active state

### 5. User Menu

**Location**: Middle-bottom section of left nav panel

**Visual**: Circular icon with user initials/avatar (purple background)

**Behavior**:
- Click opens popover with user information and settings

**Popover Content**:

**User Information Section**:
- Circular avatar (purple with user initials, e.g., "AK")
- User name (bold, e.g., "Anton Kulikov")
- Email address (e.g., "a.kulikov@smartcat.ai")
- Role badge: "Administrator" (light blue pill-shaped)

**Settings Section**:
- **Region**: Globe icon, "{region}" value, right chevron (clickable)
- **Currency**: Clock with dollar icon, "{currency}" value, right chevron (clickable)
- **System language**: Language icon (Aa), "{systemLanguage}" value, right chevron (clickable)
- **Account settings**: Gear icon, "Account settings" label

**Action Section**:
- Separator line
- **Log out**: Exit icon (arrow pointing right exiting box), "Log out" label

**Visual Design**:
- Rounded card/popover
- White background
- Structured sections with separators
- Uses Radix UI Popover component

### 6. Tour Link

**Location**: Bottom of left nav panel

**Visual**: Book icon with "Tour" label

**Purpose**: Utility link for onboarding/tutorial

**Behavior**: Clickable button (functionality TBD)

## Navigation States

### Active Route Highlighting

- Current route is visually highlighted in primary nav
- Active state: Background color change (`bg-gray-100`) and left border accent (`border-l-2 border-[var(--sc-primary)]`)
- Hub shows expanded sub-navigation when active
- Uses `useLocation()` from React Router to detect active route

### Sub-Navigation Expansion

**Hub Sub-Navigation**:
- Expands when Hub is clicked
- Expands automatically when navigating to any `/hub/*` route
- Collapses when clicking Hub again or navigating away
- Closes when Work sub-navigation opens

**Work Sub-Navigation**:
- Expands when Work is clicked
- Expands automatically when navigating to any `/work/*` route
- Collapses when clicking Work again or navigating away
- Closes when Hub sub-navigation opens

**Mutual Exclusivity**:
- Only one sub-navigation panel can be open at a time
- Opening one automatically closes the other

### Popover States

**Organization Popover**:
- Opens on click of organization icon
- Closes on outside click, selection, or Escape key
- Uses Radix UI Popover (handles keyboard navigation)

**User Popover**:
- Opens on click of user icon
- Closes on outside click, selection, or Escape key
- Uses Radix UI Popover (handles keyboard navigation)

## Routes

### Primary Routes

- `/` - Home page
- `/chats` - Chats page (with optional `:chatId` parameter)
- `/hub` - Hub base route (expands sub-navigation)

### Hub Sub-Routes

- `/hub/projects`
- `/hub/drive`
- `/hub/smartwords`
- `/hub/orders`
- `/hub/payments`
- `/hub/clients`
- `/hub/marketplace`
- `/hub/linguistic-assets`
- `/hub/integrations`
- `/hub/reports`
- `/hub/team`
- `/hub/settings`

### Work Sub-Routes

- `/work/region`
- `/work/jobs`
- `/work/payouts`
- `/work/messages`

### Organization Routes

- `/org/settings` - Organization settings (accessed via org selector)

## Special Behaviors

### Chats Toggle

When on the Chats page (`/chats`):
- Clicking Chats icon toggles the chat sidebar instead of navigating
- Uses `onChatsToggle` callback passed from `AppLayout`
- Implemented via `chatsToggleRef` pattern

### Auto-Expansion

Sub-navigation panels auto-expand when:
- Navigating directly to a route (e.g., `/hub/projects`)
- Route matches the sub-navigation prefix (e.g., `/hub/*` or `/work/*`)

## Data Model

### Navigation Item

```typescript
type NavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  active?: boolean
  hasSubNav?: boolean  // For Hub
}
```

### Hub Sub-Nav Item

```typescript
type HubSubNavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
}
```

### Organization (Mock)

```typescript
type Organization = {
  id: string
  name: string
  initial: string
  avatarColor: string
  workspacesCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  current?: boolean
}
```

### Workspace (Mock)

```typescript
type Workspace = {
  id: string
  name: string
  initial: string
  avatarColor: string
  membersCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  organizationId: string
  current?: boolean
}
```

### User (Mock)

```typescript
type User = {
  id: string
  name: string
  email: string
  initial: string
  avatarColor: string
  role: 'Administrator' | 'Member' | 'Viewer'
  region: string
  currency: string
  systemLanguage: string
}
```

## Component Structure

```
LeftNavPanel
├── OrgSelector
│   └── Popover (Organization/Workspace hierarchy)
├── PrimaryNav
│   ├── NavIcon (Home)
│   ├── NavIcon (Hub) → HubSubNav
│   └── NavIcon (Chats)
├── UserMenu
│   └── Popover (User info + settings)
├── Work Button → WorkSubNav
└── Tour Button

HubSubNav
└── HubSubNavItem (×12)

WorkSubNav
└── WorkSubNavItem (×4)
```

## Styling

### Design Tokens

- Uses Smartcat CSS variables: `var(--sc-primary)`, `var(--sc-surface)`, etc.
- Background: `bg-gray-50` for left nav panel
- Border: `border-r border-gray-200` for right border
- Active state: `bg-gray-100` with `border-l-2 border-[var(--sc-primary)]`

### Avatar Colors

- **Organization**: Pink/red background (`#ff6b9d`)
- **User**: Purple background (`#a855f7`)

### Icon Sizing

- Navigation icons: `w-5 h-5` (20px)
- Avatar icons: Varies by context

### Spacing

- Left nav panel: `py-4 gap-4` (vertical padding and gap)
- Sub-navigation: Additional width (~200-240px)

## Accessibility

- All interactive elements keyboard accessible
- Popovers support keyboard navigation (Radix handles this)
- ARIA labels for icons and buttons
- Focus indicators visible
- Screen reader announcements for route changes
- Tooltips/labels on hover for icon-only navigation

## Implementation Notes

- Uses `react-router-dom` for routing
- Uses Radix UI Popover for organization and user menus
- Uses `lucide-react` for all icons
- Main component: `src/components/navigation/LeftNavPanel.tsx`
- Sub-navigation components: `src/components/navigation/HubSubNav.tsx`, `src/components/navigation/WorkSubNav.tsx`
- Mock data: `src/mocks/navigation.ts`
- Integration: `src/components/layout/AppLayout.tsx` wraps pages with navigation

## Related Features

- **Breadcrumbs**: Shows current navigation path
- **App Layout**: Wraps pages with navigation panel
- **Chats**: Special toggle behavior when on chats page
- **Organization Management**: Accessible via Hub sub-navigation or organization menu
