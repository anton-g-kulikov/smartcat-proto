import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { LeftNavPanel } from '@/components/navigation/LeftNavPanel'
import { Toaster } from '@/components/ui/sonner'

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
      <main className="flex-1 overflow-y-auto bg-[var(--sc-app-bg,#f7f7fb)]">
        <Outlet context={{ chatsToggleRef }} />
      </main>
      <Toaster />
    </div>
  )
}

