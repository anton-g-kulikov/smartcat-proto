import { useState } from 'react'
import { mockOrgSummary, mockWorkspaces, mockOrganizations } from '@/mocks/orgManagement'
import type { WorkspaceTab, OrgSummary, WorkspaceRow } from '@/types/orgManagement'
import { PageHeader } from '@/components/org-management/PageHeader'
import { OrgHeaderSection } from '@/components/org-management/OrgHeaderSection'
import { StatsCardsRow } from '@/components/org-management/StatsCardsRow'
import { SmartwordBalanceSection } from '@/components/org-management/SmartwordBalanceSection'
import { WorkspacesSection } from '@/components/org-management/WorkspacesSection'

export default function OrgManagementPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('all')
  const [org, setOrg] = useState<OrgSummary>(mockOrgSummary)
  const [workspaces, setWorkspaces] = useState<WorkspaceRow[]>(mockWorkspaces)
  const [organizations, setOrganizations] = useState(mockOrganizations)

  const filteredWorkspaces = activeTab === 'all' 
    ? workspaces 
    : workspaces.filter(ws => ws.isMyWorkspace)

  // Handle moving Smartwords between organizations
  const handleMoveSmartwords = (targetOrgId: string, amount: number) => {
    // Update current organization (decrease total balance - moving Smartwords out)
    setOrg(prev => ({
      ...prev,
      smartwordsTotal: Math.max(0, prev.smartwordsTotal - amount),
    }))

    // Update target organization in the list (increase balance)
    setOrganizations(prev => 
      prev.map(org => 
        org.id === targetOrgId
          ? { ...org, currentBalance: org.currentBalance + amount }
          : org
      )
    )
  }

  // Handle allocating/reclaiming Smartwords to/from workspace
  const handleWorkspaceAllocation = (workspaceId: string, amount: number, mode: 'allocate' | 'reclaim') => {
    const delta = mode === 'allocate' ? amount : -amount

    // Update workspace allocated balance
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === workspaceId
          ? {
              ...ws,
              allocated: ws.allocated === null 
                ? (mode === 'allocate' ? amount : 0)
                : Math.max(0, (ws.allocated || 0) + delta),
            }
          : ws
      )
    )

    // Update organization balance
    // When allocating: decrease org total (moving Smartwords to workspace)
    // When reclaiming: increase org total (moving Smartwords back from workspace)
    setOrg(prev => ({
      ...prev,
      smartwordsTotal: Math.max(0, prev.smartwordsTotal - delta),
    }))
  }

  // Handle toggling full access
  const handleToggleFullAccess = (workspaceId: string, enabled: boolean) => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === workspaceId ? { ...ws, fullAccess: enabled } : ws
      )
    )
  }

  // Handle toggling subscription access
  const handleToggleSubscriptionAccess = (workspaceId: string, enabled: boolean) => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === workspaceId ? { ...ws, subscriptionAccess: enabled } : ws
      )
    )
  }

  return (
    <div className="min-h-full p-8 space-y-6">
      <PageHeader />
      <OrgHeaderSection org={org} />
      <StatsCardsRow org={org} />
      <SmartwordBalanceSection 
        org={org}
        organizations={organizations}
        onMoveSmartwords={handleMoveSmartwords}
      />
      <WorkspacesSection 
        workspaces={filteredWorkspaces}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={workspaces.length}
        myCount={workspaces.filter(ws => ws.isMyWorkspace).length}
        onToggleFullAccess={handleToggleFullAccess}
        onToggleSubscriptionAccess={handleToggleSubscriptionAccess}
        onAllocate={handleWorkspaceAllocation}
        currentOrgBalance={org.smartwordsTotal - org.smartwordsUsed}
      />
    </div>
  )
}

