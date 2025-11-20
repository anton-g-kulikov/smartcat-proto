import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkVersionAndInvalidateCache } from './lib/cache-invalidation'

// Check version and invalidate cache if version changed
// This must run before React renders to ensure clean state
checkVersionAndInvalidateCache()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

