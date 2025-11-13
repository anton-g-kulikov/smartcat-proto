import { Avatar } from '@/components/navigation/Avatar'
import type { OrgSummary } from '@/types/orgManagement'

interface OrgHeaderSectionProps {
  org: OrgSummary
}

export function OrgHeaderSection({ org }: OrgHeaderSectionProps) {
  return (
    <section className="flex items-center">
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
    </section>
  )
}

