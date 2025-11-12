import type { WorkspaceTab } from '@/types/orgManagement'

interface WorkspaceTabsProps {
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  allCount: number
  myCount: number
}

export function WorkspaceTabs({ activeTab, onTabChange, allCount, myCount }: WorkspaceTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      <button
        onClick={() => onTabChange('all')}
        className={`pb-2 px-1 text-sm font-medium transition-colors ${
          activeTab === 'all'
            ? 'text-[var(--sc-text)] border-b-2 border-[var(--sc-primary)]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        All {allCount}
      </button>
      <button
        onClick={() => onTabChange('my')}
        className={`pb-2 px-1 text-sm font-medium transition-colors ${
          activeTab === 'my'
            ? 'text-[var(--sc-text)] border-b-2 border-[var(--sc-primary)]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        My workspaces {myCount}
      </button>
    </div>
  )
}

