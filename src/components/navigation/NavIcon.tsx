import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavIconProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function NavIcon({ icon: Icon, label, active, onClick, className }: NavIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-center p-3 rounded-lg transition-colors',
        'hover:bg-gray-100',
        active && 'bg-gray-100 border-l-2 border-[var(--sc-primary)]',
        className
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="w-5 h-5 text-gray-700" />
    </button>
  )
}

