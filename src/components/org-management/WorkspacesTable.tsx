import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { Avatar } from '@/components/navigation/Avatar'
import { FullAccessSwitch } from './FullAccessSwitch'
import { ActionsMenu } from './ActionsMenu'
import { AllocationModal } from './AllocationModal'
import { ReclaimOnShareDialog } from './ReclaimOnShareDialog'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'
import type { WorkspaceRow } from '@/types/orgManagement'

interface WorkspacesTableProps {
  workspaces: WorkspaceRow[]
  onToggleFullAccess: (workspaceId: string, enabled: boolean) => void
  onToggleSubscriptionAccess: (workspaceId: string, enabled: boolean) => void
  onAllocate: (workspaceId: string, amount: number, mode: 'allocate' | 'reclaim') => void
  currentOrgBalance: number
}

const columnHelper = createColumnHelper<WorkspaceRow>()

export function WorkspacesTable({ workspaces, onToggleFullAccess, onToggleSubscriptionAccess, onAllocate, currentOrgBalance }: WorkspacesTableProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [allocationModal, setAllocationModal] = useState<{
    open: boolean
    workspace: WorkspaceRow | null
    mode: 'allocate' | 'reclaim'
  }>({
    open: false,
    workspace: null,
    mode: 'allocate',
  })
  const [reclaimDialog, setReclaimDialog] = useState<{
    open: boolean
    workspace: WorkspaceRow | null
    totalAllocated?: number
    allPackages?: WorkspaceRow[]
  }>({
    open: false,
    workspace: null,
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4 text-[var(--sc-primary)] rounded border-gray-300"
          />
        ),
        cell: ({ row }) => {
          if (row.original.isPackageRow) return null
          return (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              className="w-4 h-4 text-[var(--sc-primary)] rounded border-gray-300"
            />
          )
        },
      }),
      columnHelper.accessor('name', {
        header: 'WORKSPACE',
        cell: (info) => {
          if (info.row.original.isPackageRow) return null
          return (
            <span className="font-medium text-[var(--sc-text)]">{info.getValue()}</span>
          )
        },
      }),
      columnHelper.accessor('admins', {
        header: 'ADMINS',
        cell: (info) => {
          if (info.row.original.isPackageRow) return null
          const admins = info.getValue()
          return (
            <div className="flex items-center gap-2">
              {admins.slice(0, 2).map((admin) => (
                <Avatar
                  key={admin.id}
                  initial={admin.initial}
                  color={admin.avatarColor}
                  size="sm"
                />
              ))}
              {admins.length > 2 && (
                <span className="text-xs text-gray-500">+{admins.length - 2}</span>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor('subscriptionAccess', {
        header: () => (
          <div className="flex items-center gap-1">
            <span>USE ORG SUBSCRIPTION</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Use Org Subscription"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                    sideOffset={5}
                  >
                    Allow this workspace to use the shared organization subscription benefits
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
        cell: (info) => {
          const workspace = info.row.original
          if (workspace.isPackageRow) return null
          return (
            <FullAccessSwitch
              checked={info.getValue()}
              onCheckedChange={(checked) => onToggleSubscriptionAccess(workspace.id, checked)}
            />
          )
        },
      }),
      columnHelper.accessor('fullAccess', {
        header: () => (
          <div className="flex items-center gap-1">
            <span>USE ORG SMARTWORDS</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Use Org Smartwords"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                    sideOffset={5}
                  >
                    Allow this workspace to use the shared organization Smartwords pool without allocation limits
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
        cell: (info) => {
          const workspace = info.row.original
          if (workspace.isPackageRow) return null
          const handleToggle = (checked: boolean) => {
            // If turning ON, check if workspace has any allocated packages (including package rows)
            if (checked && !workspace.fullAccess) {
              // Find all packages for this workspace (by name, including package rows)
              const allPackagesForWorkspace = workspaces.filter(
                ws => ws.name === workspace.name && ws.allocated !== null && (ws.allocated || 0) > 0
              )
              const totalAllocated = allPackagesForWorkspace.reduce((sum, ws) => sum + (ws.allocated || 0), 0)
              
              if (totalAllocated > 0) {
                // Show reclaim dialog with total allocated amount
                setReclaimDialog({ open: true, workspace, totalAllocated, allPackages: allPackagesForWorkspace })
              } else {
                // No packages to reclaim, toggle directly
                onToggleFullAccess(workspace.id, checked)
              }
            } else {
              // Otherwise, toggle directly
              onToggleFullAccess(workspace.id, checked)
            }
          }
          return (
            <FullAccessSwitch
              checked={info.getValue()}
              onCheckedChange={handleToggle}
            />
          )
        },
      }),
      columnHelper.accessor('allocated', {
        header: () => (
          <div className="flex items-center gap-1">
            <span>ALLOCATED PACKAGE</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Allocated Package"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                    sideOffset={5}
                  >
                    The amount of Smartwords specifically allocated to this workspace
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
        cell: (info) => {
          const value = info.getValue()
          return (
            <span className="text-sm text-gray-700">
              {value === null ? 'Not set' : formatNumber(value)}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'currentBalance',
        header: () => (
          <div className="flex items-center gap-1">
            <span>REMAINING</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Remaining"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                    sideOffset={5}
                  >
                    The remaining available balance in this workspace package
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
        cell: (info) => {
          const workspace = info.row.original
          const allocated = workspace.allocated ?? 0
          const spent = workspace.spent
          const currentBalance = Math.max(0, allocated - spent)
          return (
            <span className="text-sm text-gray-700">{formatNumber(currentBalance)}</span>
          )
        },
      }),
      columnHelper.accessor('spent', {
        header: () => (
          <div className="flex items-center gap-1">
            <span>CONSUMED</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Consumed Smartwords"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                    sideOffset={5}
                  >
                    The amount of Smartwords consumed by this workspace
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
        cell: (info) => (
          <span className="text-sm text-gray-400">{formatNumber(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span>ACTIONS</span>,
        cell: ({ row }) => {
          const workspace = row.original
          // For package rows, only show allocate/reclaim actions
          if (workspace.isPackageRow) {
            return (
              <ActionsMenu
                workspaceId={workspace.id}
                onAllocate={() =>
                  setAllocationModal({ open: true, workspace, mode: 'allocate' })
                }
                onReclaim={() =>
                  setAllocationModal({ open: true, workspace, mode: 'reclaim' })
                }
              />
            )
          }
          return (
            <ActionsMenu
              workspaceId={workspace.id}
              onViewDetails={() => console.log('View details', workspace.id)}
              onManageAdmins={() => console.log('Manage admins', workspace.id)}
              onUsageReport={() => console.log('Usage report', workspace.id)}
              onRefresh={() => console.log('Refresh', workspace.id)}
              onSettings={() => console.log('Settings', workspace.id)}
              onAllocate={() =>
                setAllocationModal({ open: true, workspace, mode: 'allocate' })
              }
              onReclaim={() =>
                setAllocationModal({ open: true, workspace, mode: 'reclaim' })
              }
            />
          )
        },
      }),
    ],
    [onToggleFullAccess, onToggleSubscriptionAccess, onAllocate]
  )

  const table = useReactTable({
    data: workspaces,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No workspaces found</p>
      </div>
    )
  }

  const handleAllocationConfirm = (amount: number) => {
    if (!allocationModal.workspace) return
    onAllocate(allocationModal.workspace.id, amount, allocationModal.mode)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allocationModal.workspace && (
        <AllocationModal
          open={allocationModal.open}
          onOpenChange={(open) =>
            setAllocationModal({ ...allocationModal, open })
          }
          workspaceName={allocationModal.workspace.name}
          currentWorkspaceBalance={allocationModal.workspace.allocated}
          currentOrgBalance={currentOrgBalance}
          mode={allocationModal.mode}
          onConfirm={handleAllocationConfirm}
          workspaceSpent={allocationModal.workspace.spent}
        />
      )}

      {reclaimDialog.workspace && (
        <ReclaimOnShareDialog
          open={reclaimDialog.open}
          onOpenChange={(open) => setReclaimDialog({ ...reclaimDialog, open })}
          workspaceName={reclaimDialog.workspace.name}
          allocatedAmount={reclaimDialog.totalAllocated || reclaimDialog.workspace.allocated || 0}
          packageCount={reclaimDialog.allPackages?.length || 1}
          onConfirm={() => {
            // Reclaim all packages for this workspace and enable sharing
            const workspace = reclaimDialog.workspace!
            const packagesToReclaim = reclaimDialog.allPackages || [workspace]
            
            // Reclaim each package
            packagesToReclaim.forEach(pkg => {
              if (pkg.allocated !== null && pkg.allocated > 0) {
                // Calculate remaining balance for each package
                const remaining = Math.max(0, (pkg.allocated || 0) - (pkg.spent || 0))
                if (remaining > 0) {
                  onAllocate(pkg.id, remaining, 'reclaim')
                }
              }
            })
            
            // Enable sharing for the main workspace
            onToggleFullAccess(workspace.id, true)
          }}
        />
      )}
    </>
  )
}

