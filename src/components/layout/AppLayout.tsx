import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { LeftNavPanel } from '@/components/navigation/LeftNavPanel'
import { Toaster } from '@/components/ui/sonner'
import { Header } from './Header'

export function AppLayout() {
  const chatsToggleRef = useRef<(() => void) | null>(null)

  const handleChatsToggle = () => {
    if (chatsToggleRef.current) {
      chatsToggleRef.current()
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftNavPanel onChatsToggle={handleChatsToggle} />
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--sc-app-bg,#f7f7fb)]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ chatsToggleRef }} />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

