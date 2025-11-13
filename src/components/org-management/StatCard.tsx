import { LucideIcon, Info } from 'lucide-react'
import { Avatar } from '@/components/navigation/Avatar'
import { Button } from '@/components/ui/button'
import * as Switch from '@radix-ui/react-switch'
import type { OrgSummary } from '@/types/orgManagement'

interface StatCardProps {
  label: string
  value: string | React.ReactNode
  icon?: LucideIcon
  orgAdmins?: OrgSummary['organizationAdmins']
  switchLabel?: string
  switchChecked?: boolean
  onSwitchChange?: (checked: boolean) => void
  buttonLabel?: string
  onButtonClick?: () => void
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  orgAdmins,
  switchLabel,
  switchChecked,
  onSwitchChange,
  buttonLabel,
  onButtonClick,
}: StatCardProps) {
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
        <div className={`flex items-center gap-2 ${switchLabel || buttonLabel ? 'mb-3' : ''}`}>
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
        <div className={`text-lg font-medium text-[var(--sc-text)] ${switchLabel || buttonLabel ? 'mb-3' : ''}`}>{value}</div>
      )}
      {(switchLabel || buttonLabel) && (
        <div className="pt-3 border-t border-gray-200 space-y-2">
          {switchLabel && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs text-[var(--sc-text)] opacity-70 leading-relaxed flex-1">{switchLabel}</span>
              <Switch.Root
                checked={switchChecked}
                onCheckedChange={onSwitchChange}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                  switchChecked ? 'bg-[var(--sc-primary)]' : 'bg-gray-300'
                } cursor-pointer`}
              >
                <Switch.Thumb
                  className={`block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    switchChecked ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </Switch.Root>
            </div>
          )}
          {buttonLabel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onButtonClick}
              className="w-full text-xs"
            >
              {buttonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

