# Smartcat Prototyping Project - Base Setup

This document describes the foundation setup for the Smartcat prototyping project. Individual features will be developed in dedicated git branches.

---

## Tech Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **UI Primitives**: Radix UI (headless, accessible components)
- **Routing**: React Router DOM
- **Package Manager**: npm
- **Design System**: Smartcat design tokens (CSS variables)

---

## Prerequisites

- Node 18+ (prefer LTS). Check with `node -v`.
- npm (built-in with Node)

---

## Project Structure

```
smartcat-proto/
├── src/
│   ├── pages/          # Feature pages (one per route)
│   ├── components/     # Shared/reusable components
│   │   └── ui/         # UI primitives (optional shadcn components)
│   ├── styles/         # Global styles and design system
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main app component with routing
├── public/             # Static assets
└── design-system-*.css # Smartcat design tokens (root level)
```

---

## Setup Steps

### 1) Create the Vite app

```bash
npm create vite@latest . -- --template react-ts
```

This initializes the project in the current directory.

### 2) Install base dependencies

```bash
# Styling + utilities
npm i tailwindcss postcss autoprefixer -D
npm i clsx tailwind-merge class-variance-authority lucide-react

# Headless a11y primitives (base set)
npm i @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip

# Routing
npm i react-router-dom
```

### 3) Initialize Tailwind

```bash
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js`.

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
```

### 4) Wire global CSS + design tokens

Copy `design-system-BwxtVFH-.css` to `src/styles/design-system.css`:

```bash
cp design-system-BwxtVFH-.css src/styles/design-system.css
```

Create/update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Smartcat tokens & component defaults */
@import url('./styles/design-system.css');

:root {
  /* Fallbacks if a token is missing */
  --sc-surface: #fff;
  --sc-text: #111827;
  --sc-primary: #6b4eff;
}

html, body, #root { 
  height: 100%; 
}

body { 
  background: var(--sc-app-bg, #f7f7fb); 
}
```

> If your design file already declares CSS variables, Tailwind can consume them using arbitrary values, e.g. `bg-[var(--sc-surface)]`.

### 5) Set up routing

Create `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add feature routes here as they're developed */}
      </Routes>
    </BrowserRouter>
  )
}
```

Create `src/pages/HomePage.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen text-[var(--sc-text)]">
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold">Smartcat Prototyping</h1>
        <p className="mt-2 text-sm opacity-80">
          Base setup with Smartcat design tokens. Features will be added in dedicated branches.
        </p>
      </main>
    </div>
  )
}
```

### 6) Update Vite config (if needed)

`vite.config.ts` should be minimal for now:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 7) Set up path aliases (for shadcn/ui)

Update `vite.config.ts` to support the `@/` import alias:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Also update `tsconfig.json` to include the path alias:

```json
{
  "compilerOptions": {
    // ... existing options
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 8) Verify setup

```bash
npm run dev
```

Open the local URL from the terminal. You should see the home page styled with Smartcat tokens.

---

### 9) Set up shadcn/ui CLI

shadcn/ui is a collection of copy-paste React components built on Radix UI and Tailwind CSS. Components are installed directly into your codebase (not via npm), so you own and can customize each one.

**Initialize shadcn/ui:**

```bash
npx shadcn@latest init
```

This will prompt you with questions. Recommended answers:
- **Style**: Default
- **Base color**: Slate (or match your design system)
- **CSS variables**: Yes (to work with your Smartcat tokens)
- **Where is your global CSS file?**: `src/index.css`
- **Would you like to use CSS variables for colors?**: Yes
- **Where is your tailwind.config.js located?**: `./tailwind.config.js`
- **Configure the import alias for components?**: `@/components`
- **Configure the import alias for utils?**: `@/lib/utils`

This creates:
- `components.json` - shadcn/ui configuration
- `src/lib/utils.ts` - utility functions (cn helper)
- Updates `tailwind.config.js` with shadcn/ui theme

**Add components as needed:**

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

Components will be added to `src/components/ui/` and can be imported like:
```tsx
import { Button } from "@/components/ui/button"
```

---

## Development Workflow

1. Create a new git branch for each feature
2. Develop the feature in `src/pages/`
3. Add feature-specific components in `src/components/` if needed
4. Update routing in `src/App.tsx`
5. Merge back to main when complete

---

## Next Steps

- See `org-management-feature-spec.md` for the first feature implementation
- Add additional features as separate specs in `_meta/`

