import { useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { MoveSmartwordsModal } from './MoveSmartwordsModal'
import type { OrgSummary, WorkspaceRow } from '@/types/orgManagement'

interface OrganizationOption {
  id: string
  name: string
  initial: string
  avatarColor: string
  currentBalance: number
}

interface SmartwordBalanceSectionProps {
  org: OrgSummary
  organizations: OrganizationOption[]
  workspaces: WorkspaceRow[]
  onMoveSmartwords: (targetOrgId: string, amount: number) => void
}

export function SmartwordBalanceSection({ org, organizations, workspaces, onMoveSmartwords }: SmartwordBalanceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMoveConfirm = (targetOrgId: string, amount: number) => {
    onMoveSmartwords(targetOrgId, amount)
  }

  // Prepare allocations data for progress bar
  // Show ALL allocated packages regardless of fullAccess status
  // Group multiple packages for the same workspace together
  const allocationsMap = workspaces
    .filter(ws => ws.allocated !== null && (ws.allocated || 0) > 0)
    .reduce((acc, ws) => {
      const existing = acc.get(ws.name)
      if (existing) {
        // Combine with existing allocation for this workspace
        acc.set(ws.name, {
          id: existing.id, // Keep the first workspace ID
          name: ws.name,
          allocated: existing.allocated + (ws.allocated || 0),
        })
      } else {
        // First allocation for this workspace
        acc.set(ws.name, {
          id: ws.id,
          name: ws.name,
          allocated: ws.allocated || 0,
        })
      }
      return acc
    }, new Map<string, { id: string; name: string; allocated: number }>())
  
  const allocations = Array.from(allocationsMap.values())
  
  // Calculate total spent from org-level balance
  // Only count spent from workspaces WITHOUT allocated packages
  // If a workspace has allocated packages, spent comes from allocation, not org balance (regardless of fullAccess)
  const totalSpent = workspaces.reduce((sum, ws) => {
    // Count as org-level spent only if: allocated is null (no allocated packages)
    // If allocated is set, spent comes from allocation, not org balance
    if (ws.allocated === null) {
      return sum + (ws.spent || 0)
    }
    return sum
  }, 0)
  
  // Calculate total allocated - include ALL allocated packages regardless of fullAccess
  const totalAllocated = workspaces
    .filter(ws => ws.allocated !== null && (ws.allocated || 0) > 0)
    .reduce((sum, ws) => sum + (ws.allocated || 0), 0)
  
  // Calculate available org balance (matching progress bar logic)
  // Available org balance = initialTotal - totalAllocated - orgLevelSpent
  const availableBalance = org.initialSmartwordsTotal - totalAllocated - totalSpent

  return (
    <>
      <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--sc-text)]">Org-level Smartwords Package</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Move Smartwords
          </button>
        </div>
        <ProgressBar 
          initialTotal={org.initialSmartwordsTotal}
          allocations={allocations}
          totalSpent={totalSpent}
        />
      </section>

      <MoveSmartwordsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentOrgName={org.name}
        currentOrgId={org.id}
        currentOrgBalance={availableBalance}
        organizations={organizations}
        onConfirm={handleMoveConfirm}
      />
    </>
  )
}

