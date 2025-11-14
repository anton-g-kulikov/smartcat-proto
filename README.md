# Smartcat Prototyping Project

A modern React-based prototyping platform for Smartcat features, built with TypeScript, Tailwind CSS, and Radix UI. This project serves as a foundation for rapid prototyping and feature development with Smartcat design tokens and components.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Deployment (GitHub Pages)](#-deployment-github-pages)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Feature Specifications](#feature-specifications)
- [Contributing](#contributing)

---

## 🎯 Overview

This project provides a prototyping environment for Smartcat features, allowing rapid development and testing of UI components and user flows. Features are developed in dedicated git branches and follow a structured approach with comprehensive specifications.

**Key Principles:**
- **Page-based architecture** - Features are organized as pages with dedicated components
- **Feature branches** - Each feature is developed in its own git branch
- **Design system integration** - Uses Smartcat design tokens and styling
- **Type-safe** - Full TypeScript support throughout
- **Accessible** - Built on Radix UI primitives for accessibility

---

## 🛠 Tech Stack

### Core
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool and dev server
- **React Router DOM 7** - Client-side routing

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Smartcat Design Tokens** - Custom CSS variables from production design system

### UI Components
- **Radix UI** - Headless, accessible component primitives
  - Dialog, Dropdown Menu, Popover, Select, Switch, Tooltip
- **shadcn/ui** - Copy-paste component library (configured)
- **Lucide React** - Icon library

### Data & Forms
- **TanStack Table** - Data tables
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging
- **class-variance-authority** - Component variant management

---

## ✨ Features

### ✅ Implemented Features

#### 1. Authentication System
- Frontend password protection for client demos
- Login page with username/password authentication
- Protected routes that require authentication
- Persistent authentication state (localStorage)
- Automatic redirect to login for unauthenticated users

**Routes:**
- `/login` - Authentication page (redirects if already authenticated)

#### 2. Navigation System
- **Left Navigation Panel** (~72px width, icon-only)
  - Organization selector with popup
  - Primary navigation (Home, Hub, Chats)
  - Hub sub-navigation (expandable)
  - User menu with settings
  - Work section
  - Tour link

**Routes:**
- `/login` - Authentication page (redirects if already authenticated)
- `/` - Home page
- `/chats` - Chats page
- `/chats/:chatId` - Individual chat conversation

#### 3. Organization Management
- Organization overview dashboard
- Smartword balance tracking
- Workspace management table
- Allocation/reclamation of Smartwords
- Full access toggle per workspace
- Statistics cards (Subscription, Smartwords, Renewal date, Workspaces)

**Routes:**
- `/org/management` - Organization management page

#### 4. Chats
- Chat interface with conversation view
- Chat sidebar with conversation list
- Message input with feedback
- Chat history and navigation

**Routes:**
- `/chats` - Chats list
- `/chats/:chatId` - Chat conversation

### 📋 Placeholder Features

- **Organization Settings** (`/org/settings`) - Placeholder page for future implementation
- **Hub Sub-Navigation Routes** - Routes for hub features (Projects, Drive, Smartwords, etc.) to be implemented per feature

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartcat-proto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The dev server will start on `http://localhost:5173` (or next available port)
   - Open the URL shown in your terminal

### First Time Setup

The project is already configured with:
- ✅ Vite + React + TypeScript
- ✅ Tailwind CSS with Smartcat design tokens
- ✅ React Router with layout structure
- ✅ shadcn/ui CLI configuration
- ✅ Path aliases (`@/` for `src/`)

---

## 📁 Project Structure

```
smartcat-proto/
├── _meta/                          # Project documentation and specs
│   ├── navigation/                 # Navigation feature specs
│   ├── org-admin-proto/            # Org management specs
│   ├── chats/                      # Chats feature specs
│   ├── project-setup-spec.md      # Base setup documentation
│   └── project-task-list.md        # Task tracking
│
├── src/
│   ├── components/                 # React components
│   │   ├── navigation/             # Navigation components
│   │   │   ├── LeftNavPanel.tsx
│   │   │   ├── OrgSelector.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   ├── PrimaryNav.tsx
│   │   │   ├── HubSubNav.tsx
│   │   │   └── ...
│   │   ├── layout/                 # Layout components
│   │   │   └── AppLayout.tsx
│   │   ├── auth/                   # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── org-management/        # Org management components
│   │   │   ├── WorkspacesTable.tsx
│   │   │   ├── AllocationModal.tsx
│   │   │   └── ...
│   │   ├── chats/                  # Chats components
│   │   │   ├── ChatConversation.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   └── ...
│   │   └── ui/                     # shadcn/ui components
│   │       └── popover.tsx
│   │
│   ├── contexts/                    # React contexts
│   │   └── AuthContext.tsx         # Authentication context
│   │
│   ├── pages/                      # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx           # Authentication page
│   │   ├── OrgManagementPage.tsx
│   │   ├── OrgSettingsPage.tsx
│   │   └── ChatsPage.tsx
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── navigation.ts
│   │   ├── orgManagement.ts
│   │   └── chats.ts
│   │
│   ├── mocks/                      # Mock data
│   │   ├── navigation.ts
│   │   ├── orgManagement.ts
│   │   └── chats.ts
│   │
│   ├── lib/                       # Utilities
│   │   └── utils.ts               # cn() helper and utilities
│   │
│   ├── hooks/                     # Custom React hooks
│   │
│   ├── styles/                    # Global styles
│   │   └── design-system.css      # Smartcat design tokens
│   │
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global CSS imports
│
├── docs/                          # Production build (for GitHub Pages)
├── public/                        # Static assets
├── components.json                # shadcn/ui configuration
├── tailwind.config.js             # Tailwind configuration
├── vite.config.ts                 # Vite configuration (configured for GitHub Pages)
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## 🔄 Development Workflow

### Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Create feature specification**
   - Add spec file in `_meta/feature-name/feature-spec.md`
   - Include requirements, components, routes, and acceptance criteria

3. **Implement the feature**
   - Create page component in `src/pages/`
   - Create feature-specific components in `src/components/feature-name/`
   - Add routes in `src/App.tsx`
   - Add types in `src/types/`
   - Add mock data in `src/mocks/` if needed

4. **Test and verify**
   - Test all routes and interactions
   - Verify styling matches design tokens
   - Check accessibility

5. **Merge to main**
   ```bash
   git checkout main
   git merge feature/feature-name
   ```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

Components will be added to `src/components/ui/` and can be imported:
```tsx
import { Button } from "@/components/ui/button"
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Build

```bash
npm run build
```
Builds the app for production. Outputs to `docs/` directory (configured for GitHub Pages deployment).

### Preview

```bash
npm run preview
```
Preview the production build locally.

---

## 🔐 Authentication

The prototype is protected with a simple frontend authentication system for client demos.

### How It Works

- All routes are protected and require authentication
- Users are redirected to `/login` if not authenticated
- Authentication state is persisted in localStorage (survives page refresh)
- This is a **frontend-only** protection suitable for prototype demos (not secure against determined attackers)

### Accessing the Prototype

1. Navigate to the deployed prototype URL
2. You'll be redirected to the login page
3. Enter the credentials above
4. After successful login, you'll have access to all prototype features

---

## 🚢 Deployment (GitHub Pages)

The prototype is configured for deployment to GitHub Pages.

### Prerequisites

- GitHub repository (public or private)
- GitHub Pages enabled in repository settings

### Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```
   This creates a `docs/` folder with the production build.

2. **Commit and push the `docs` folder**
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Build and deployment**:
     - **Source**: Select "Deploy from a branch"
     - **Branch**: Select `main`
     - **Folder**: Select `/docs`
   - Click **Save**

4. **Access your prototype**
   - Your site will be available at: `https://yourusername.github.io/smartcat-proto/`
   - Replace `smartcat-proto` with your actual repository name if different
   - Note: It may take a few minutes for the site to be available after first deployment

### Important Notes

- **Base Path**: The `vite.config.ts` is configured with `base: '/smartcat-proto/'`
  - If your repository name is different, update the `base` path in `vite.config.ts` to match your repo name
  - For example, if your repo is `my-prototype`, change it to `base: '/my-prototype/'`
  - If deploying to a user/organization page (e.g., `username.github.io`), change it to `base: '/'`

- **After each update**: Rebuild and push the `docs` folder to update the live site
  ```bash
  npm run build
  git add docs/
  git commit -m "Update deployment"
  git push
  ```

---

## 🏗 Architecture

### Routing

The app uses React Router with a layout wrapper:

```tsx
<AppLayout>
  <LeftNavPanel />
  <main>
    <Outlet /> {/* Page content */}
  </main>
</AppLayout>
```

All routes are defined in `src/App.tsx` and wrapped with `AppLayout` for consistent navigation.

### Component Organization

- **Pages** (`src/pages/`) - Top-level route components
- **Feature Components** (`src/components/feature-name/`) - Feature-specific components
- **Layout Components** (`src/components/layout/`) - Layout and structure
- **UI Components** (`src/components/ui/`) - Reusable UI primitives (shadcn/ui)

### State Management

Currently using:
- **React state** - Local component state
- **React Context** - Authentication state (`AuthContext`)
- **React Router** - URL state and navigation
- **Mock data** - Static data in `src/mocks/`

For future features, consider:
- TanStack Query for server state
- Zustand or Redux for complex state management

### Styling Approach

1. **Tailwind CSS** - Utility classes for layout and styling
2. **Smartcat Design Tokens** - CSS variables (`var(--sc-*)`)
3. **shadcn/ui Theme** - Additional theme variables for components
4. **Component Variants** - Using `class-variance-authority` for component variants

Example:
```tsx
<div className="bg-[var(--sc-surface)] text-[var(--sc-text)]">
  {/* Content */}
</div>
```

---

## 🎨 Design System

### Smartcat Design Tokens

The project uses Smartcat design tokens from `src/styles/design-system.css`. These are CSS variables that can be used throughout the application:

```css
var(--sc-surface)    /* Surface/background colors */
var(--sc-text)       /* Text colors */
var(--sc-primary)    /* Primary brand color */
var(--sc-app-bg)     /* App background */
/* ... and more */
```

### shadcn/ui Theme

Additional theme variables for shadcn/ui components:
- `--background`, `--foreground`
- `--primary`, `--secondary`
- `--muted`, `--accent`
- `--border`, `--input`, `--ring`
- etc.

### Using Design Tokens

**In Tailwind classes:**
```tsx
<div className="bg-[var(--sc-surface)] shadow-card">
```

**In CSS:**
```css
.my-component {
  background: var(--sc-surface);
  color: var(--sc-text);
}
```

---

## 📚 Feature Specifications

All feature specifications are located in `_meta/`:

### Navigation
- **Spec**: `_meta/navigation/navigation-spec.md`
- **Status**: ✅ Implemented
- **Routes**: Home, Hub, Chats, Organization/User menus

### Organization Management
- **Spec**: `_meta/org-admin-proto/org-management-feature-spec.md`
- **Status**: ✅ Implemented
- **Routes**: `/org/management`

### Chats
- **Spec**: `_meta/chats/chats-feature-spec.md`
- **Status**: ✅ Implemented
- **Routes**: `/chats`, `/chats/:chatId`

### Project Setup
- **Spec**: `_meta/project-setup-spec.md`
- **Status**: ✅ Complete
- **Description**: Base project setup and configuration

---

## 🤝 Contributing

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Follow React and TypeScript best practices
- **Prettier** - Consistent code formatting (if configured)

### Component Guidelines

1. **Use TypeScript** - All components should be typed
2. **Use functional components** - Prefer function components with hooks
3. **Extract reusable logic** - Create custom hooks when logic is reused
4. **Use design tokens** - Prefer Smartcat tokens over hardcoded values
5. **Accessibility** - Use Radix UI primitives for accessible components
6. **Component structure**:
   ```tsx
   import { type ComponentProps } from 'react'
   
   type MyComponentProps = {
     // Props
   }
   
   export function MyComponent({ ...props }: MyComponentProps) {
     // Component logic
     return (
       // JSX
     )
   }
   ```

### Adding New Features

1. Create feature branch
2. Add specification in `_meta/feature-name/`
3. Implement following the project structure
4. Add routes in `src/App.tsx`
5. Update this README if needed
6. Test thoroughly
7. Create pull request

### File Naming

- **Components**: PascalCase (`MyComponent.tsx`)
- **Pages**: PascalCase (`HomePage.tsx`)
- **Utilities**: camelCase (`utils.ts`)
- **Types**: camelCase (`navigation.ts`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)

---

## 🔍 Path Aliases

The project uses path aliases for cleaner imports:

```tsx
// Instead of
import { Button } from '../../../components/ui/button'

// Use
import { Button } from '@/components/ui/button'
```

**Available aliases:**
- `@/` → `src/`
- `@/components` → `src/components`
- `@/pages` → `src/pages`
- `@/lib` → `src/lib`
- etc.

---

## 📝 TypeScript

The project uses strict TypeScript configuration:

- **Strict mode**: Enabled
- **Path aliases**: Configured in `tsconfig.json`
- **Type definitions**: In `src/types/`
- **Component props**: Typed with TypeScript interfaces/types

---

## 🧪 Testing

Currently, the project uses mock data for development. Test documentation is in `test/test-documentation.md`.

**Future testing setup:**
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests (if needed)

---

## 🐛 Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run build
# Fix any TypeScript errors shown
```

**CSS import order:**
If you see PostCSS errors about `@import`, ensure `@import` statements come before `@tailwind` directives in `src/index.css`.

### Dev Server Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or use a different port
npm run dev -- --port 3000
```

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

[Add license information if applicable]

---

## 🙏 Acknowledgments

- Smartcat design team for design tokens and specifications
- Radix UI for accessible component primitives
- shadcn/ui for component patterns
- Vite team for excellent build tooling

---

## 📞 Support

For questions or issues:
1. Check feature specifications in `_meta/`
2. Review component code in `src/components/`
3. Check project setup documentation in `_meta/project-setup-spec.md`

---

**Last Updated**: November 2024

