import { Calendar, Folder, Users, Circle } from 'lucide-react'
import { StatCard } from './StatCard'
import type { OrgSummary } from '@/types/orgManagement'

interface StatsCardsRowProps {
  org: OrgSummary
  onToggleSubscriptionAccess?: (checked: boolean) => void
  onToggleSmartwordsAccess?: (checked: boolean) => void
  onContactUs?: () => void
  onCreateWorkspace?: () => void
  onAddAdmin?: () => void
}

export function StatsCardsRow({ 
  org,
  onToggleSubscriptionAccess,
  onToggleSmartwordsAccess,
  onContactUs,
  onCreateWorkspace,
  onAddAdmin,
}: StatsCardsRowProps) {
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
        switchLabel="Allow NEW Workspaces use ORG Subscription"
        switchChecked={org.allowNewWorkspacesOrgSubscription}
        onSwitchChange={onToggleSubscriptionAccess}
      />
      <StatCard
        label="Smartwords"
        value={formatNumber(org.initialSmartwordsTotal)}
        icon={Circle}
        switchLabel="Allow NEW Workspaces use ORG Smartwords"
        switchChecked={org.allowNewWorkspacesOrgSmartwords}
        onSwitchChange={onToggleSmartwordsAccess}
      />
      <StatCard
        label="Renewal date"
        value={formatDate(org.renewalDate)}
        icon={Calendar}
        buttonLabel="Contact us"
        onButtonClick={onContactUs}
      />
      <StatCard
        label="Workspaces"
        value={org.workspacesCount.toString()}
        icon={Folder}
        buttonLabel="Create new workspace"
        onButtonClick={onCreateWorkspace}
      />
      <StatCard
        label="Organization admins"
        value=""
        icon={Users}
        orgAdmins={org.organizationAdmins}
        buttonLabel="Add new admin"
        onButtonClick={onAddAdmin}
      />
    </section>
  )
}

