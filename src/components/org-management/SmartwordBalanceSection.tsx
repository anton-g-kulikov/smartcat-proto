import { useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { MoveSmartwordsModal } from './MoveSmartwordsModal'
import type { OrgSummary } from '@/types/orgManagement'

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
  onMoveSmartwords: (targetOrgId: string, amount: number) => void
}

export function SmartwordBalanceSection({ org, organizations, onMoveSmartwords }: SmartwordBalanceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const availableBalance = org.smartwordsTotal - org.smartwordsUsed

  const handleMoveConfirm = (targetOrgId: string, amount: number) => {
    onMoveSmartwords(targetOrgId, amount)
  }

  return (
    <>
      <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--sc-text)]">Smartword balance</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Move Smartwords
          </button>
        </div>
        <ProgressBar 
          used={org.smartwordsUsed} 
          currentTotal={org.smartwordsTotal}
          initialTotal={org.initialSmartwordsTotal}
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

