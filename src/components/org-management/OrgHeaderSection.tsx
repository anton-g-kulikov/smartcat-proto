import { Avatar } from '@/components/navigation/Avatar'
import * as Switch from '@radix-ui/react-switch'
import type { OrgSummary } from '@/types/orgManagement'

interface OrgHeaderSectionProps {
  org: OrgSummary
  multiOrgAdminEnabled?: boolean
  onMultiOrgAdminToggle?: (checked: boolean) => void
}

export function OrgHeaderSection({ org, multiOrgAdminEnabled = false, onMultiOrgAdminToggle }: OrgHeaderSectionProps) {
  return (
    <section className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {org.logoUrl ? (
          <img 
            src={org.logoUrl} 
            alt={org.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <Avatar 
            initial={org.initial}
            color={org.avatarColor}
            size="lg"
          />
        )}
        <h2 className="text-2xl font-bold text-[var(--sc-text)]">{org.name}</h2>
      </div>
      {onMultiOrgAdminToggle && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--sc-text)] opacity-70">Multi Org Admin</span>
          <Switch.Root
            checked={multiOrgAdminEnabled}
            onCheckedChange={onMultiOrgAdminToggle}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              multiOrgAdminEnabled ? 'bg-[var(--sc-primary)]' : 'bg-gray-300'
            } cursor-pointer`}
          >
            <Switch.Thumb
              className={`block h-4 w-4 transform rounded-full bg-white transition-transform ${
                multiOrgAdminEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </Switch.Root>
        </div>
      )}
    </section>
  )
}

