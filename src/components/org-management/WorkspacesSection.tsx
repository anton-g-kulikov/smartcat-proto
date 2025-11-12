import { WorkspaceTabs } from './WorkspaceTabs'
import { WorkspacesTable } from './WorkspacesTable'
import type { WorkspaceRow, WorkspaceTab } from '@/types/orgManagement'

interface WorkspacesSectionProps {
  workspaces: WorkspaceRow[]
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  allCount: number
  myCount: number
  onToggleFullAccess: (workspaceId: string, enabled: boolean) => void
  onToggleSubscriptionAccess: (workspaceId: string, enabled: boolean) => void
  onAllocate: (workspaceId: string, amount: number, mode: 'allocate' | 'reclaim') => void
  currentOrgBalance: number
}

export function WorkspacesSection({
  workspaces,
  activeTab,
  onTabChange,
  allCount,
  myCount,
  onToggleFullAccess,
  onToggleSubscriptionAccess,
  onAllocate,
  currentOrgBalance,
}: WorkspacesSectionProps) {

  return (
    <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--sc-text)]">Workspaces</h3>
      </div>

      {/* Tabs */}
      <WorkspaceTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        allCount={allCount}
        myCount={myCount}
      />

      {/* Table */}
      <WorkspacesTable
        workspaces={workspaces}
        onToggleFullAccess={onToggleFullAccess}
        onToggleSubscriptionAccess={onToggleSubscriptionAccess}
        onAllocate={onAllocate}
        currentOrgBalance={currentOrgBalance}
      />
    </section>
  )
}

