import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Folder, Book } from 'lucide-react'
import { OrgSelector } from './OrgSelector'
import { PrimaryNav } from './PrimaryNav'
import { UserMenu } from './UserMenu'
import { HubSubNav } from './HubSubNav'
import { WorkSubNav } from './WorkSubNav'
import { cn } from '@/lib/utils'

interface LeftNavPanelProps {
  onChatsToggle?: () => void
}

export function LeftNavPanel({ onChatsToggle }: LeftNavPanelProps) {
  const location = useLocation()
  const [isHubExpanded, setIsHubExpanded] = useState(
    location.pathname.startsWith('/hub')
  )
  const [isWorkExpanded, setIsWorkExpanded] = useState(
    location.pathname.startsWith('/work')
  )

  // Keep panels in sync with route changes
  useEffect(() => {
    const isHubRoute = location.pathname.startsWith('/hub')
    const isWorkRoute = location.pathname.startsWith('/work')
    
    if (isHubRoute) {
      setIsHubExpanded(true)
      setIsWorkExpanded(false)
    } else if (isWorkRoute) {
      setIsWorkExpanded(true)
      setIsHubExpanded(false)
    }
  }, [location.pathname])

  const handleHubClick = () => {
    setIsHubExpanded(!isHubExpanded)
    // Close Work panel when Hub opens
    if (!isHubExpanded) {
      setIsWorkExpanded(false)
    }
  }

  const handleWorkClick = () => {
    setIsWorkExpanded(!isWorkExpanded)
    // Close Hub panel when Work opens
    if (!isWorkExpanded) {
      setIsHubExpanded(false)
    }
  }

  const isWorkActive = location.pathname.startsWith('/work')

  return (
    <div className="flex h-full">
      {/* Main Left Nav Panel - ~72px width */}
      <div className="w-[72px] bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-4">
        {/* Organization Selector */}
        <OrgSelector />

        {/* Primary Navigation */}
        <div className="flex-1 flex flex-col justify-start">
          <PrimaryNav onHubClick={handleHubClick} onChatsToggle={onChatsToggle} />
        </div>

        {/* User Menu */}
        <UserMenu />

        {/* Work Section */}
        <button
          onClick={handleWorkClick}
          className={cn(
            'w-full flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
            'hover:bg-gray-100',
            isWorkActive && 'bg-gray-100 border-l-2 border-[var(--sc-primary)]'
          )}
          aria-label="Work"
        >
          <Folder className="w-5 h-5 text-gray-700" />
          <span className="text-xs text-gray-600">Work</span>
        </button>

        {/* Tour Link */}
        <button
          className="w-full flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Tour"
        >
          <Book className="w-5 h-5 text-gray-700" />
          <span className="text-xs text-gray-600">Tour</span>
        </button>
      </div>

      {/* Hub Sub-Navigation */}
      <HubSubNav isOpen={isHubExpanded} />
      
      {/* Work Sub-Navigation */}
      <WorkSubNav isOpen={isWorkExpanded} />
    </div>
  )
}

