import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreVertical, Settings, Users, FileText, ArrowUp, ArrowDown } from 'lucide-react'

interface ActionsMenuProps {
  workspaceId: string
  onManageAdmins?: () => void
  onUsageReport?: () => void
  onSettings?: () => void
  onAllocate?: () => void
  onReclaim?: () => void
}

export function ActionsMenu({
  workspaceId: _workspaceId,
  onManageAdmins,
  onUsageReport,
  onSettings,
  onAllocate,
  onReclaim,
}: ActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Actions menu"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] z-50"
          sideOffset={5}
        >
          {/* Group 1: Smartwords operations and Usage report */}
          {onUsageReport && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onSelect={onUsageReport}
            >
              <FileText className="w-4 h-4" />
              Usage report
            </DropdownMenu.Item>
          )}
          {onAllocate && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onSelect={onAllocate}
            >
              <ArrowUp className="w-4 h-4" />
              Allocate Smartwords
            </DropdownMenu.Item>
          )}
          {onReclaim && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onSelect={onReclaim}
            >
              <ArrowDown className="w-4 h-4" />
              Reclaim Smartwords
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          {/* Group 2: Manage admins and Settings */}
          {onManageAdmins && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onSelect={onManageAdmins}
            >
              <Users className="w-4 h-4" />
              Manage admins
            </DropdownMenu.Item>
          )}
          {onSettings && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onSelect={onSettings}
            >
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

