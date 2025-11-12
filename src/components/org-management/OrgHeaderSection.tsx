import { Avatar } from '@/components/navigation/Avatar'
import type { OrgSummary } from '@/types/orgManagement'

interface OrgHeaderSectionProps {
  org: OrgSummary
}

export function OrgHeaderSection({ org }: OrgHeaderSectionProps) {
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
      <button className="px-4 py-2 rounded-2xl bg-[var(--sc-primary)] text-white hover:opacity-90 transition-opacity font-medium">
        Contact us
      </button>
    </section>
  )
}

