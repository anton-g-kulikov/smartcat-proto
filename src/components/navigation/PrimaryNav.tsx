import { useLocation, useNavigate } from 'react-router-dom'
import { NavIcon } from './NavIcon'
import { primaryNavItems } from '@/mocks/navigation'

interface PrimaryNavProps {
  onHubClick?: () => void
  onChatsToggle?: () => void
}

export function PrimaryNav({ onHubClick, onChatsToggle }: PrimaryNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path: string, hasSubNav?: boolean) => {
    if (hasSubNav && onHubClick) {
      onHubClick()
    } else if (path === '/chats' && location.pathname === '/chats' && onChatsToggle) {
      // If already on chats page, toggle sidebar instead of navigating
      onChatsToggle()
    } else {
      navigate(path)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {primaryNavItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.hasSubNav && location.pathname.startsWith(item.path))
        
        return (
          <NavIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={isActive}
            onClick={() => handleNavClick(item.path, item.hasSubNav)}
          />
        )
      })}
    </div>
  )
}

