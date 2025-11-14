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

  // Calculate available org balance (matching progress bar logic)
  // Only count spent from workspaces WITHOUT allocated packages
  // If a workspace has allocated packages, spent comes from allocation, not org balance (regardless of fullAccess)
  const orgLevelSpent = workspaces.reduce((sum, ws) => {
    // Count as org-level spent only if: allocated is null (no allocated packages)
    if (ws.allocated === null) {
      return sum + (ws.spent || 0)
    }
    return sum
  }, 0)
  
  // Calculate total allocated - include ALL allocated packages regardless of fullAccess
  const totalAllocated = workspaces
    .filter(ws => ws.allocated !== null && (ws.allocated || 0) > 0)
    .reduce((sum, ws) => sum + (ws.allocated || 0), 0)
  
  // Available org balance = initialTotal - totalAllocated - orgLevelSpent
  const availableOrgBalance = org.initialSmartwordsTotal - totalAllocated - orgLevelSpent

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
    setWorkspaces(prev => {
      const workspace = prev.find(ws => ws.id === workspaceId)
      if (!workspace) return prev

      const currentAllocated = workspace.allocated ?? 0
      const currentSpent = workspace.spent ?? 0
      const remainingBalance = currentAllocated - currentSpent
      
      // If allocating to a workspace that already has a package, create a new package row
      if (mode === 'allocate' && workspace.allocated !== null && workspace.allocated > 0) {
        // Create a new package row
        const newPackageRow: WorkspaceRow = {
          ...workspace,
          id: `${workspaceId}-${Date.now()}`, // Unique ID for the new package
          allocated: amount,
          spent: 0, // New package starts with no consumption
          isPackageRow: true, // Mark as package row
        }
        
        // Find the index of the workspace and insert the new package row right after it
        // Also find where other package rows for this workspace end
        const workspaceIndex = prev.findIndex(ws => ws.id === workspaceId)
        if (workspaceIndex === -1) return [...prev, newPackageRow]
        
        // Find the last package row for this workspace (if any)
        let insertIndex = workspaceIndex + 1
        for (let i = workspaceIndex + 1; i < prev.length; i++) {
          if (prev[i].name === workspace.name && prev[i].isPackageRow) {
            insertIndex = i + 1
          } else {
            break
          }
        }
        
        // Turn off fullAccess for the main workspace if it's on (since we're allocating a package)
        const updatedWithFullAccess = prev.map(ws =>
          ws.id === workspaceId && ws.fullAccess ? { ...ws, fullAccess: false } : ws
        )
        
        // Insert the new package row right after the workspace or after its existing packages
        return [
          ...updatedWithFullAccess.slice(0, insertIndex),
          newPackageRow,
          ...updatedWithFullAccess.slice(insertIndex),
        ]
      }

      // If reclaiming all remaining balance (or more), set allocated to null
      // This ensures "Not set" is shown and spent remains unchanged
      const willBeFullyReclaimed = mode === 'reclaim' && (amount >= remainingBalance)

      const updated = prev.map(ws =>
        ws.id === workspaceId
          ? {
              ...ws,
              allocated: ws.allocated === null 
                ? (mode === 'allocate' ? amount : null)
                : willBeFullyReclaimed
                  ? null // Set to null if fully reclaimed - this makes spent count as org-level consumption
                  : Math.max(0, (ws.allocated || 0) + delta),
              // spent remains unchanged - it tracks all consumption
              // When allocating, turn off fullAccess (USE ORG SMARTWORDS)
              fullAccess: mode === 'allocate' ? false : ws.fullAccess,
            }
          : ws
      )

      // If reclaiming from a package row and it becomes fully reclaimed, remove it
      if (mode === 'reclaim') {
        const updatedWorkspace = updated.find(ws => ws.id === workspaceId)
        if (updatedWorkspace?.isPackageRow && (updatedWorkspace.allocated === null || updatedWorkspace.allocated === 0)) {
          return updated.filter(ws => ws.id !== workspaceId)
        }
      }

      return updated
    })

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

  // Handle toggling org-level subscription access for new workspaces
  const handleToggleOrgSubscriptionAccess = (checked: boolean) => {
    setOrg(prev => ({
      ...prev,
      allowNewWorkspacesOrgSubscription: checked,
    }))
  }

  // Handle toggling org-level smartwords access for new workspaces
  const handleToggleOrgSmartwordsAccess = (checked: boolean) => {
    setOrg(prev => ({
      ...prev,
      allowNewWorkspacesOrgSmartwords: checked,
    }))
  }

  // Handle contact us button
  const handleContactUs = () => {
    // TODO: Implement contact us functionality
    console.log('Contact us clicked')
  }

  // Handle create new workspace button
  const handleCreateWorkspace = () => {
    // TODO: Implement create workspace functionality
    console.log('Create new workspace clicked')
  }

  // Handle add new admin button
  const handleAddAdmin = () => {
    // TODO: Implement add admin functionality
    console.log('Add new admin clicked')
  }

  return (
    <div className="min-h-full p-8 space-y-6">
      <PageHeader />
      <OrgHeaderSection org={org} />
      <StatsCardsRow 
        org={org}
        onToggleSubscriptionAccess={handleToggleOrgSubscriptionAccess}
        onToggleSmartwordsAccess={handleToggleOrgSmartwordsAccess}
        onContactUs={handleContactUs}
        onCreateWorkspace={handleCreateWorkspace}
        onAddAdmin={handleAddAdmin}
      />
      <SmartwordBalanceSection 
        org={org}
        organizations={organizations}
        workspaces={workspaces}
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
        currentOrgBalance={availableOrgBalance}
      />
    </div>
  )
}

