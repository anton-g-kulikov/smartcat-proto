import { useLocation, useNavigate } from 'react-router-dom'
import { hubSubNavItems } from '@/mocks/navigation'
import { cn } from '@/lib/utils'

interface HubSubNavProps {
  isOpen: boolean
}

export function HubSubNav({ isOpen }: HubSubNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-2 space-y-1">
        {hubSubNavItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                'hover:bg-gray-100',
                isActive && 'bg-gray-100 border-l-2 border-[var(--sc-primary)]'
              )}
            >
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

