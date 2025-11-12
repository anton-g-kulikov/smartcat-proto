# Navigation Feature Specification

This document describes the navigation structure for the Smartcat prototyping project. The navigation includes a narrow left sidebar panel with organization and user popups, hub navigation with expandable sub-navigation, and routing to key pages.

> **Note**: This feature will be developed in a dedicated git branch. Mobile responsiveness is not required for this implementation.

---

## 1) Purpose

Provide consistent navigation across the Smartcat prototyping application with:
- Persistent narrow left navigation sidebar (~72px width)
- Organization/Workspace switcher (popup with hierarchy)
- User menu (popup with settings)
- Primary navigation (Home, Hub, Chats)
- Hub sub-navigation (expandable list of hub features)
- Route management for main pages

---

## 2) Layout Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  Left    │   Main Content Area          │
│  Nav     │   (Page-specific content)    │
│  (~72px) │                              │
│          │                              │
│  [Org]   │                              │
│  [Home]  │                              │
│  [Hub]   │                              │
│  [Chats] │                              │
│  [User]  │                              │
│  [Work]  │                              │
│  [Tour]  │                              │
└──────────┴──────────────────────────────┘
```

**Key Points:**
- No top bar/header - navigation is entirely left sidebar
- Left sidebar is narrow (~72px) with icon-only navigation
- Main content area takes remaining width
- Full height layout

---

## 3) Components

### 3.1 Left Navigation Panel

**Location**: Fixed left sidebar, full height, narrow width

**Width**: ~72px (icon-only navigation)

**Structure** (top to bottom):
1. **Organization Selector** (top) - Circular icon with organization initial/avatar
2. **Primary Navigation** (middle-top):
   - Home (house icon)
   - Hub (grid icon) - can expand to show sub-navigation
   - Chats (speech bubble icon)
3. **User Menu** (middle-bottom) - Circular icon with user initials/avatar
4. **Work Section** (below user) - Folder icon with "Work" label
5. **Tour Link** (bottom) - Book icon with "Tour" label

**Styling**:
- Uses Smartcat design tokens
- Light gray background
- Icon-only navigation (text appears on hover or in expanded state)
- Icons are vertically stacked
- Active state: highlighted background and/or left border

**Features**:
- Hub can expand to show sub-navigation (see 3.4)
- Icons are circular avatars for org/user, standard icons for nav items
- Hover states show labels/tooltips

### 3.2 Organization/Workspace Popup

**Trigger**: Click on organization icon (circular icon with "S" or org initial) at top of left nav

**Visual Design**:
- Rounded card/popover
- Shows hierarchy: Organization → Workspace
- Connected with vertical line between levels

**Content Structure**:

**Level 1: Organization (e.g., "Smartcat")**
- Circular avatar/icon (pink/red with "S")
- Organization name: "Smartcat"
- Details: "501 workspaces · Forever Free · Europe"
- Actions:
  - Settings gear icon button
  - "Change" button with right arrow

**Level 2: Workspace (e.g., "Anton Kulikov's Workspace")**
- Circular avatar/icon (purple with "AK")
- Workspace name: "Anton Kulikov's Workspace"
- Details: "6 members · Forever Free · Europe"
- Actions:
  - Settings gear icon button
  - Add member button (person icon with plus)
  - "Switch" button with right arrow

**Behavior**:
- Opens as popover from organization selector
- Closes on outside click or selection
- Uses Radix UI Popover component
- Visual connector line shows hierarchy relationship

**Routes**:
- Organization Settings: `/org/settings` (via settings gear on organization level)

### 3.3 User Popup

**Trigger**: Click on user icon (circular icon with user initials, e.g., "AK") in left nav

**Visual Design**:
- Rounded card/popover
- White background
- Structured sections with separators

**Content Structure**:

**User Information Section:**
- Circular avatar (purple with user initials, e.g., "AK")
- User name: "Anton Kulikov" (bold)
- Email: "a.kulikov@smartcat.ai"
- Role badge: "Administrator" (light blue pill-shaped)

**Settings Section:**
- **Region**: Globe icon, "Europe" value, right chevron (clickable)
- **Currency**: Clock with dollar icon, "USD" value, right chevron (clickable)
- **System language**: Language icon (Aa), "English" value, right chevron (clickable)
- **Account settings**: Gear icon, "Account settings" label

**Action Section:**
- Separator line
- **Log out**: Exit icon (arrow pointing right exiting box), "Log out" label

**Behavior**:
- Opens as popover from user area
- Closes on outside click or selection
- Uses Radix UI Popover component
- Settings items are clickable (placeholders for now)

### 3.4 Hub Navigation

**Location**: Middle section of left nav panel

**Primary Navigation Items**:
- **Home** → `/` (HomePage) - House icon
- **Hub** → Hub section (expandable) - Grid icon (9 squares)
- **Chats** → Chats section - Speech bubble icon

**Hub Sub-Navigation** (expands when Hub is active/clicked):
When Hub is selected, a sub-navigation panel appears showing:
- **Projects** - Folder with document icon
- **Drive** - Document icon
- **Smartwords** - Circular icon with stylized "S"
- **Orders** - Arrow pointing right then down icon
- **Payments** - Clock with dollar sign icon
- **Clients** - Two person silhouettes icon
- **Marketplace** - Shopping cart icon
- **Linguistic assets** - Two "Aa" letters icon
- **Integrations** - Two interlocking squares icon
- **Reports** - Circular arrow icon
- **Team** - Three person silhouettes icon
- **Settings** - Gear icon

**Hub Sub-Nav Behavior**:
- Expands to the right of the left nav panel
- Shows when Hub is active/selected
- Each item has icon and label
- Clicking navigates to respective route (routes TBD per feature)

**Features**:
- Active route highlighting (background color, left border)
- Icons for each nav item (using lucide-react)
- Hover states
- Click navigates to route
- Hub sub-navigation expands/collapses based on Hub selection

### 3.5 Additional Navigation Elements

**Work Section**:
- Location: Below user menu in left nav
- Icon: Folder/document icon
- Label: "Work"
- Purpose: User-specific workspace area

**Tour Link**:
- Location: Bottom of left nav
- Icon: Open book icon
- Label: "Tour"
- Purpose: Utility link for onboarding/tutorial

---

## 4) Pages & Routes

### 4.1 Home Page
- **Route**: `/`
- **Component**: `HomePage` (already exists, needs content update)
- **Description**: Landing/dashboard page with:
  - Greeting: "What's on your mind today, [User]?"
  - Input field: "Ask me anything..." with submit button
  - Suggested prompts (4 buttons)
  - Agent team section with tabs and agent cards
- **Status**: ✅ Exists, needs content implementation

### 4.2 Organization Settings Page
- **Route**: `/org/settings`
- **Component**: `OrgSettingsPage` (new, placeholder)
- **Description**: Organization settings and configuration
- **Status**: 📋 Placeholder - will be populated as separate feature
- **Content**: Simple placeholder with "Organization Settings" heading

### 4.3 Hub Sub-Navigation Routes (Future)
Routes for hub sub-navigation items will be added as features are developed:
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

---

## 5) Technical Implementation

### 5.1 Component Structure

```
src/
├── components/
│   ├── navigation/
│   │   ├── LeftNavPanel.tsx      # Main left sidebar (narrow, icon-only)
│   │   ├── OrgSelector.tsx       # Organization popup trigger + popover
│   │   ├── UserMenu.tsx          # User popup trigger + popover
│   │   ├── PrimaryNav.tsx        # Home, Hub, Chats navigation
│   │   ├── HubSubNav.tsx         # Hub sub-navigation panel
│   │   └── NavIcon.tsx           # Reusable nav icon component
│   └── ui/                       # shadcn/ui components (if needed)
├── pages/
│   ├── HomePage.tsx              # ✅ Exists, needs content
│   └── OrgSettingsPage.tsx       # 📋 New placeholder
└── App.tsx                       # Update with routes
```

### 5.2 Dependencies Needed

**Already installed**:
- ✅ `react-router-dom` - Routing
- ✅ `@radix-ui/react-popover` - Popups
- ✅ `lucide-react` - Icons

**May need to add**:
- `@radix-ui/react-avatar` (optional, for user/org avatars)
- `@radix-ui/react-separator` (for popup separators)

### 5.3 Routing Updates

Update `src/App.tsx` to include:
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/org/settings" element={<OrgSettingsPage />} />
  {/* Hub sub-navigation routes to be added per feature */}
</Routes>
```

### 5.4 Layout Wrapper

Create a layout component that wraps pages with the left nav:
```tsx
<AppLayout>
  <LeftNavPanel />
  <main className="flex-1">
    <Outlet /> {/* React Router outlet for page content */}
  </main>
</AppLayout>
```

---

## 6) Data Model

### 6.1 Organization (Mock)

```ts
type Organization = {
  id: string
  name: string
  initial: string // e.g., "S" for Smartcat
  avatarColor: string // e.g., "pink" or hex color
  workspacesCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  current?: boolean
}
```

### 6.2 Workspace (Mock)

```ts
type Workspace = {
  id: string
  name: string
  initial: string // e.g., "AK" for Anton Kulikov
  avatarColor: string // e.g., "purple" or hex color
  membersCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  organizationId: string
  current?: boolean
}
```

### 6.3 User (Mock)

```ts
type User = {
  id: string
  name: string
  email: string
  initial: string // e.g., "AK"
  avatarColor: string // e.g., "purple" or hex color
  role: 'Administrator' | 'Member' | 'Viewer'
  region: string
  currency: string
  systemLanguage: string
}
```

### 6.4 Navigation Item

```ts
type NavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  active?: boolean
  hasSubNav?: boolean // For Hub
}

type HubSubNavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
}
```

---

## 7) States & Behavior

### 7.1 Active Route Highlighting
- Current route should be visually highlighted in primary nav
- Active state: background color change and/or left border
- Hub shows expanded sub-navigation when active
- Use `useLocation()` from React Router to detect active route

### 7.2 Hub Sub-Navigation Expansion
- Hub sub-navigation expands when Hub is active/selected
- Sub-nav panel appears to the right of left nav
- Each sub-nav item can be selected independently
- Sub-nav items highlight when their route is active

### 7.3 Popup States
- **Open**: Popover visible
- **Closed**: Popover hidden
- Close on:
  - Outside click
  - Selection/action
  - Escape key (handled by Radix)

### 7.4 Navigation States
- **Loading**: Show skeleton/spinner if needed (future)
- **Error**: Show error state if navigation fails (future)

---

## 8) Styling Guidelines

### 8.1 Design Tokens
- Use Smartcat CSS variables: `var(--sc-*)`
- Use shadcn/ui theme variables where appropriate
- Maintain consistency with Smartcat design system

### 8.2 Spacing & Layout
- Left nav: Fixed width ~72px (narrow, icon-only)
- Hub sub-nav: Additional width when expanded (~200-240px)
- Main content: Takes remaining width (flex-1)
- Padding: Consistent spacing using Tailwind utilities

### 8.3 Typography
- Use Smartcat typography tokens
- Nav items: Icon-only in collapsed state, labels on hover/expand
- Icons: Appropriate size (typically 20-24px)

### 8.4 Colors
- Active state: Background color change, left border accent
- Hover state: Subtle background change
- Organization avatar: Pink/red background with white text
- User avatar: Purple background with white text
- Borders: Use border color tokens

### 8.5 Avatar Styling
- Circular avatars with colored backgrounds
- White text/initials centered
- Organization: Pink/red color scheme
- User: Purple color scheme

---

## 9) Accessibility

- All interactive elements keyboard accessible
- Popovers support keyboard navigation (Radix handles this)
- ARIA labels for icons and buttons
- Focus indicators visible
- Screen reader announcements for route changes
- Tooltips/labels on hover for icon-only navigation

---

## 10) Acceptance Criteria

- [ ] Left navigation panel renders on all pages (~72px width)
- [ ] Organization selector opens popup with org/workspace hierarchy
- [ ] User menu opens popup with user info and settings
- [ ] Primary navigation (Home, Hub, Chats) works
- [ ] Hub expands to show sub-navigation when active
- [ ] Hub sub-navigation items are clickable
- [ ] Active route highlighting works correctly
- [ ] Navigation to Home (`/`) works
- [ ] Navigation to Org Settings (`/org/settings`) works
- [ ] Org Settings page shows placeholder content
- [ ] Popups close on outside click
- [ ] All routes accessible via navigation
- [ ] Styling matches Smartcat design tokens
- [ ] Avatar colors match design (pink for org, purple for user)
- [ ] Work section and Tour link render correctly

---

## 11) Mock Data

Create `src/mocks/navigation.ts`:

```ts
import { Home, Grid, MessageCircle, Folder, Book } from 'lucide-react'
import { 
  FolderOpen, FileText, Circle, ArrowRightDown, 
  Clock, Users, ShoppingCart, Type, Link2, 
  RefreshCw, Users2, Settings 
} from 'lucide-react'

export const mockOrganization: Organization = {
  id: '1',
  name: 'Smartcat',
  initial: 'S',
  avatarColor: '#ff6b9d', // pink
  workspacesCount: 501,
  plan: 'Forever Free',
  region: 'Europe',
  current: true,
}

export const mockWorkspace: Workspace = {
  id: '1',
  name: "Anton Kulikov's Workspace",
  initial: 'AK',
  avatarColor: '#a855f7', // purple
  membersCount: 6,
  plan: 'Forever Free',
  region: 'Europe',
  organizationId: '1',
  current: true,
}

export const mockUser: User = {
  id: '1',
  name: 'Anton Kulikov',
  email: 'a.kulikov@smartcat.ai',
  initial: 'AK',
  avatarColor: '#a855f7', // purple
  role: 'Administrator',
  region: 'Europe',
  currency: 'USD',
  systemLanguage: 'English',
}

export const primaryNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    id: 'hub',
    label: 'Hub',
    path: '/hub',
    icon: Grid,
    hasSubNav: true,
  },
  {
    id: 'chats',
    label: 'Chats',
    path: '/chats',
    icon: MessageCircle,
  },
]

export const hubSubNavItems: HubSubNavItem[] = [
  { id: 'projects', label: 'Projects', path: '/hub/projects', icon: FolderOpen },
  { id: 'drive', label: 'Drive', path: '/hub/drive', icon: FileText },
  { id: 'smartwords', label: 'Smartwords', path: '/hub/smartwords', icon: Circle },
  { id: 'orders', label: 'Orders', path: '/hub/orders', icon: ArrowRightDown },
  { id: 'payments', label: 'Payments', path: '/hub/payments', icon: Clock },
  { id: 'clients', label: 'Clients', path: '/hub/clients', icon: Users },
  { id: 'marketplace', label: 'Marketplace', path: '/hub/marketplace', icon: ShoppingCart },
  { id: 'linguistic-assets', label: 'Linguistic assets', path: '/hub/linguistic-assets', icon: Type },
  { id: 'integrations', label: 'Integrations', path: '/hub/integrations', icon: Link2 },
  { id: 'reports', label: 'Reports', path: '/hub/reports', icon: RefreshCw },
  { id: 'team', label: 'Team', path: '/hub/team', icon: Users2 },
  { id: 'settings', label: 'Settings', path: '/hub/settings', icon: Settings },
]
```

---

## 12) Implementation Notes

1. **Layout Component**: Create `AppLayout` that includes `LeftNavPanel` and wraps page content
2. **Narrow Sidebar**: Left nav is icon-only (~72px), labels appear on hover or in tooltips
3. **Hub Expansion**: Hub sub-navigation appears as a panel to the right when Hub is active
4. **Avatar Components**: Create reusable avatar component for org/user with colored backgrounds
5. **Route Protection**: Not needed for prototype, but structure should allow easy addition
6. **State Management**: Use React state for popups and hub expansion, React Router for navigation
7. **Icons**: Use `lucide-react` for all icons
8. **Popups**: Use Radix UI Popover for org and user menus
9. **Styling**: Prefer Tailwind classes with Smartcat design tokens
10. **Home Page Content**: Will need to implement greeting, input field, suggestions, and agent team section

---

## 13) Future Enhancements (Out of Scope)

- Mobile responsive navigation
- Collapsible sidebar
- Breadcrumb navigation
- Search functionality in nav
- Notification badges
- Multi-organization switching (beyond current org/workspace)
- User profile editing
- Organization management
- Hub sub-navigation route implementations (per feature)

---

## 14) Visual Reference

**Screenshots available in `_meta/navigation/`:**
- `homescreen.png` - Home page layout
- `hub menu.png` - Hub navigation with expanded sub-navigation
- `org menu.png` - Organization/Workspace selector popup
- `user menu.png` - User menu popup
- `menu-interaction.png` - Navigation interactions

---

## 15) Next Steps

1. Create navigation components structure
2. Implement `LeftNavPanel` with narrow icon-only layout (~72px)
3. Add `OrgSelector` with org/workspace hierarchy popup
4. Add `UserMenu` with user info and settings popup
5. Implement `PrimaryNav` (Home, Hub, Chats)
6. Implement `HubSubNav` with expandable sub-navigation
7. Create avatar components for org/user
8. Create `OrgSettingsPage` placeholder
9. Update `HomePage` with actual content (greeting, input, agents)
10. Update `App.tsx` with layout wrapper and routes
11. Add mock data
12. Style with Smartcat tokens
13. Test navigation flow
