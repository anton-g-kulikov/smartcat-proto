# Breadcrumbs Documentation

## Overview

The Breadcrumbs feature provides contextual navigation information by displaying the current page location within the application hierarchy. It shows the navigation path from the root to the current page, enabling users to understand where they are and navigate to parent pages.

## Purpose

- **Context Awareness**: Shows users their current location in the application
- **Navigation Aid**: Provides clickable links to parent pages (planned feature)
- **Visual Hierarchy**: Displays the path from root to current page

## Location

**Component**: `Breadcrumbs`

**Placement**: 
- Located in the Header component
- Shown on all pages except the home page (`/`)
- Positioned on the left side of the header

**Styling**: 
- Text size: `text-sm`
- Text color: `text-gray-600` (non-active), `text-gray-900 font-medium` (active)
- Separator: `/` character between segments

## Behavior

### Display Logic

Breadcrumbs are displayed when:
- Current route is NOT the home page (`/`)
- Determined by: `location.pathname !== '/'`

Breadcrumbs are hidden when:
- Current route is the home page (`/`)

### Path Generation

Breadcrumbs are generated from the current URL path:

1. **Split Path**: `pathname.split('/').filter(Boolean)` - removes empty segments
2. **Build Segments**: For each segment, create a breadcrumb item with:
   - `path`: Full path up to this segment (e.g., `/org/management`)
   - `label`: Human-readable label (from route mapping or capitalized segment)
   - `isLast`: Boolean indicating if this is the last segment

3. **Route Mapping**: Uses predefined route-to-label mapping for known routes

### Route Label Mapping

Predefined mappings for common routes:

```typescript
const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/org': 'Organization',
  '/org/settings': 'Settings',
  '/org/management': 'Organization management',
  '/chats': 'Chats',
  '/hub': 'Hub',
  '/hub/projects': 'Projects',
  '/hub/drive': 'Drive',
  '/hub/smartwords': 'Smartwords',
  '/hub/orders': 'Orders',
  '/hub/payments': 'Payments',
  '/hub/clients': 'Clients',
  '/hub/marketplace': 'Marketplace',
  '/hub/linguistic-assets': 'Linguistic assets',
  '/hub/integrations': 'Integrations',
  '/hub/reports': 'Reports',
  '/hub/team': 'Team',
  '/hub/settings': 'Settings',
  '/work': 'Work',
  '/work/region': 'Region',
  '/work/jobs': 'Jobs',
  '/work/payouts': 'Payouts',
  '/work/messages': 'Direct messages',
  '/smartwords-usage-report': 'Smartwords Usage Report',
}
```

### Fallback Label Generation

If a route is not in the mapping:
- Takes the segment name
- Capitalizes first letter: `segment.charAt(0).toUpperCase() + segment.slice(1)`
- Example: `/unknown/route` → "Unknown / Route"

## Special Cases

### Chat Routes

**Route Pattern**: `/chats/:chatId`

**Behavior**:
- Detects if pathname starts with `/chats/` and is not exactly `/chats`
- Extracts chat ID from URL
- Replaces last breadcrumb label with: `Chat {chatId}`
- Example: `/chats/chat-123` → "Chats / Chat chat-123"

### Smartwords Usage Report Routes

**Route Pattern**: `/smartwords-usage-report/:workspaceId`

**Behavior**:
- Detects if pathname starts with `/smartwords-usage-report/` and is not exactly `/smartwords-usage-report`
- Extracts workspace ID from URL
- Looks up workspace name from `mockWorkspaces`
- Replaces last breadcrumb label with workspace name
- Sets parent breadcrumb (second-to-last) to "Smartwords Usage Report"
- Example: `/smartwords-usage-report/ws3` → "Smartwords Usage Report / HR"

**Workspace Lookup**:
```typescript
const workspace = mockWorkspaces.find(ws => ws.id === workspaceId && !ws.isPackageRow)
if (workspace) {
  breadcrumbItems[breadcrumbItems.length - 1].label = workspace.name
}
```

## Visual Design

### Structure

```
Home / Organization / Organization management
```

### Styling

- **Container**: `text-sm text-gray-600`
- **Separator**: `/` character with `mx-1` margin
- **Non-active segments**: `text-gray-600 hover:text-gray-900 transition-colors` (with Link component)
- **Active segment** (last): `text-gray-900 font-medium` (span, not link)

### Active vs Non-Active

- **Non-active segments**: Clickable links (currently implemented, but navigation not yet functional)
- **Active segment**: Non-clickable text (last segment in path)
- **Hover state**: Non-active links change color on hover

## Clickable Navigation (Planned)

**Current Status**: Breadcrumbs are rendered as links but navigation functionality is not yet implemented.

**Planned Behavior**:
- Clicking a breadcrumb segment should navigate to that route
- Uses React Router `Link` component (already implemented)
- Navigation will be functional in future updates

**Implementation**:
```tsx
{item.isLast ? (
  <span className="text-gray-900 font-medium">{item.label}</span>
) : (
  <Link
    to={item.path}
    className="text-gray-600 hover:text-gray-900 transition-colors"
  >
    {item.label}
  </Link>
)}
```

## Component Structure

```
Breadcrumbs
└── nav (aria-label="Breadcrumb")
    └── ol (flex items-center space-x-1)
        └── li (for each breadcrumb item)
            ├── Separator "/" (if not first item)
            └── Link or span (depending on isLast)
```

## Integration

### Header Component

Breadcrumbs are integrated into the Header component:

```tsx
<Header>
  <div className="flex-1">
    {showBreadcrumbs && <Breadcrumbs />}
  </div>
  <SmartwordsWidget /> {/* On right side */}
</Header>
```

### Conditional Display

Header determines when to show breadcrumbs:

```tsx
const showBreadcrumbs = location.pathname !== '/'
```

## Examples

### Organization Management Page

**Route**: `/org/management`

**Breadcrumbs**: `Organization / Organization management`

**Segments**:
1. "Organization" (link to `/org`)
2. "Organization management" (active, non-link)

### Smartwords Usage Report

**Route**: `/smartwords-usage-report/ws3`

**Breadcrumbs**: `Smartwords Usage Report / HR`

**Segments**:
1. "Smartwords Usage Report" (link to `/smartwords-usage-report`)
2. "HR" (active, workspace name from lookup)

### Hub Projects

**Route**: `/hub/projects`

**Breadcrumbs**: `Hub / Projects`

**Segments**:
1. "Hub" (link to `/hub`)
2. "Projects" (active, non-link)

### Chat Conversation

**Route**: `/chats/chat-123`

**Breadcrumbs**: `Chats / Chat chat-123`

**Segments**:
1. "Chats" (link to `/chats`)
2. "Chat chat-123" (active, chat ID)

## Data Dependencies

### Mock Data

- **Workspaces**: `mockWorkspaces` from `src/mocks/orgManagement.ts`
  - Used for workspace name lookup in Smartwords Usage Report routes

### Route Information

- Uses `useLocation()` from React Router to get current pathname
- No additional API calls or data fetching required

## Accessibility

- **Semantic HTML**: Uses `<nav>` with `aria-label="Breadcrumb"`
- **Ordered List**: Uses `<ol>` for proper structure
- **Link Labels**: Descriptive labels for all clickable segments
- **Screen Readers**: Properly announces breadcrumb structure

## Implementation Notes

- Component: `src/components/layout/Breadcrumbs.tsx`
- Uses React Router `useLocation` and `Link` components
- Route labels defined in component (could be moved to config)
- Workspace lookup uses mock data (will need API integration later)
- Navigation functionality planned but not yet implemented

## Related Features

- **Header**: Contains breadcrumbs component
- **Navigation**: Breadcrumbs reflect navigation structure
- **Smartwords Usage Report**: Special handling for workspace ID in URL
- **Chats**: Special handling for chat ID in URL

## Future Enhancements

1. **Clickable Navigation**: Implement actual navigation when clicking breadcrumb segments
2. **Dynamic Labels**: Fetch labels from API instead of hardcoded mapping
3. **Workspace/Organization Names**: Fetch from API instead of mock data
4. **Custom Labels**: Support custom labels per route configuration
5. **Breadcrumb History**: Track navigation history for better context


