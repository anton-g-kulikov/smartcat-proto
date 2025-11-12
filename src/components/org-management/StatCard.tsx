import { LucideIcon, Info } from 'lucide-react'
import { Avatar } from '@/components/navigation/Avatar'
import type { OrgSummary } from '@/types/orgManagement'

interface StatCardProps {
  label: string
  value: string | React.ReactNode
  icon?: LucideIcon
  orgAdmins?: OrgSummary['organizationAdmins']
}

export function StatCard({ label, value, icon: Icon, orgAdmins }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon ? (
          <Icon className="w-4 h-4 text-[var(--sc-primary)]" />
        ) : (
          !orgAdmins && <Info className="w-4 h-4 text-[var(--sc-primary)]" />
        )}
        <div className="text-xs opacity-70 text-[var(--sc-text)]">{label}</div>
      </div>
      {orgAdmins ? (
        <div className="flex items-center gap-2">
          {orgAdmins.slice(0, 2).map((admin) => (
            <Avatar
              key={admin.id}
              initial={admin.initial}
              color={admin.avatarColor}
              size="sm"
            />
          ))}
          {orgAdmins.length > 2 && (
            <span className="text-xs text-gray-500">+{orgAdmins.length - 2}</span>
          )}
        </div>
      ) : (
        <div className="text-lg font-medium text-[var(--sc-text)]">{value}</div>
      )}
    </div>
  )
}

