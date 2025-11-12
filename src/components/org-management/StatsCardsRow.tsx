import { Calendar, Folder, Users, Circle } from 'lucide-react'
import { StatCard } from './StatCard'
import type { OrgSummary } from '@/types/orgManagement'

interface StatsCardsRowProps {
  org: OrgSummary
}

export function StatsCardsRow({ org }: StatsCardsRowProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Subscription"
        value={org.subscription}
        icon={Circle}
      />
      <StatCard
        label="Smartwords"
        value={formatNumber(org.initialSmartwordsTotal)}
        icon={Circle}
      />
      <StatCard
        label="Renewal date"
        value={formatDate(org.renewalDate)}
        icon={Calendar}
      />
      <StatCard
        label="Workspaces"
        value={org.workspacesCount.toString()}
        icon={Folder}
      />
      <StatCard
        label="Organization admins"
        value=""
        icon={Users}
        orgAdmins={org.organizationAdmins}
      />
    </section>
  )
}

