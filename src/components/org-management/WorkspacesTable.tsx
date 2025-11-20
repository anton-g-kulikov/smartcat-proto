import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import * as Tooltip from '@radix-ui/react-tooltip'
import { Info, ChevronDown } from 'lucide-react'
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
  const navigate = useNavigate()
  const [allocationModal, setAllocationModal] = useState<{
    open: boolean
    workspace: WorkspaceRow | null
    mode: 'allocate' | 'reclaim'
  }>({
    open: false,
    workspace: null,
    mode: 'allocate',
  })
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set())

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const columns = useMemo(
    () => [
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
          return (
            <FullAccessSwitch
              checked={info.getValue()}
              onCheckedChange={(checked) => onToggleFullAccess(workspace.id, checked)}
            />
          )
        },
      }),
      columnHelper.accessor('allocated', {
        header: () => (
          <div className="flex items-center gap-1">
            <span>ALLOCATED SMARTWORDS</span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Information about Allocated Smartwords"
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
          const workspace = info.row.original
          const label = workspace.packageLabel
          return (
            <div className="flex items-center gap-2">
              {label && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {label}
                </span>
              )}
              <span className="text-sm text-gray-700">
                {value === null ? 'Not set' : formatNumber(value)}
              </span>
            </div>
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
      columnHelper.display({
        id: 'actions',
        header: () => <span>ACTIONS</span>,
        cell: ({ row }) => {
          const workspace = row.original
          // For package rows, only show reclaim action
          if (workspace.isPackageRow) {
            return (
              <ActionsMenu
                workspaceId={workspace.id}
                onReclaim={workspace.isNonReclaimable ? undefined : () =>
                  setAllocationModal({ open: true, workspace, mode: 'reclaim' })
                }
              />
            )
          }
          // For regular workspaces, only show reclaim if they have allocated packages
          const hasAllocated = hasAllocatedPackages(workspace)
          return (
            <ActionsMenu
              workspaceId={workspace.id}
              onManageAdmins={() => console.log('Manage admins', workspace.id)}
              onUsageReport={() => navigate(`/smartwords-usage-report/${workspace.id}`)}
              onSettings={() => console.log('Settings', workspace.id)}
              onAllocate={() =>
                setAllocationModal({ open: true, workspace, mode: 'allocate' })
              }
              onReclaim={hasAllocated && !workspace.isNonReclaimable ? () =>
                setAllocationModal({ open: true, workspace, mode: 'reclaim' })
              : undefined}
            />
          )
        },
      }),
    ],
    [onToggleFullAccess, onToggleSubscriptionAccess, onAllocate, navigate, workspaces]
  )

  // Group workspaces by name
  const groupedWorkspaces = useMemo(() => {
    const groups = new Map<string, { main: WorkspaceRow; packages: WorkspaceRow[] }>()
    
    workspaces.forEach((ws) => {
      if (ws.isPackageRow) {
        const main = workspaces.find((w) => w.name === ws.name && !w.isPackageRow)
        if (main) {
          const existing = groups.get(ws.name)
          if (existing) {
            existing.packages.push(ws)
          } else {
            groups.set(ws.name, { main, packages: [ws] })
          }
        }
      } else {
        if (!groups.has(ws.name)) {
          groups.set(ws.name, { main: ws, packages: [] })
        }
      }
    })
    
    return Array.from(groups.values())
  }, [workspaces])

  // Helper function to check if a workspace has allocated packages
  const hasAllocatedPackages = (workspace: WorkspaceRow): boolean => {
    // Check if workspace has a direct allocation
    if (workspace.allocated !== null && workspace.allocated > 0) {
      return true
    }
    // Check if workspace has package rows
    const group = groupedWorkspaces.find(g => g.main.id === workspace.id)
    return group ? group.packages.length > 0 : false
  }

  const table = useReactTable({
    data: workspaces,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

  // Render a workspace row (for regular rows and accordion headers)
  const renderWorkspaceRow = (workspace: WorkspaceRow, isAccordionHeader = false) => {
    const row = table.getRowModel().rows.find((r) => r.original.id === workspace.id)
    if (!row) return null

    return (
      <tr
        key={workspace.id}
        className={`border-b border-gray-100 ${isAccordionHeader ? '' : 'hover:bg-gray-50'} transition-colors`}
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-4 py-3">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    )
  }

  // Render a package row (for accordion content)
  const renderPackageRow = (packageRow: WorkspaceRow) => {
    const row = table.getRowModel().rows.find((r) => r.original.id === packageRow.id)
    if (!row) return null

    return (
      <tr
        key={packageRow.id}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors bg-gray-50"
      >
        {row.getVisibleCells().map((cell) => {
          const columnId = cell.column.id
          // Hide workspace name, admins, and toggles for package rows
          if (columnId === 'name' || columnId === 'admins' || columnId === 'subscriptionAccess' || columnId === 'fullAccess') {
            return <td key={cell.id} className="px-4 py-3"></td>
          }
          return (
            <td key={cell.id} className="px-4 py-3 pl-8">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
        })}
      </tr>
    )
  }

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces((prev) => {
      const next = new Set(prev)
      if (next.has(workspaceId)) {
        next.delete(workspaceId)
      } else {
        next.add(workspaceId)
      }
      return next
    })
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
            {groupedWorkspaces.map((group) => {
              const hasPackages = group.packages.length > 0
              const isExpanded = expandedWorkspaces.has(group.main.id)
              
              if (hasPackages) {
                // Calculate sums for accordion header
                const totalAllocated = group.packages.reduce((sum, pkg) => sum + (pkg.allocated || 0), 0)
                const totalSpent = group.packages.reduce((sum, pkg) => sum + (pkg.spent || 0), 0)
                const totalRemaining = totalAllocated - totalSpent

                return (
                  <React.Fragment key={group.main.id}>
                    <tr 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleWorkspace(group.main.id)}
                    >
                      {table.getHeaderGroups()[0].headers.map((header) => {
                        const columnId = header.column.id
                        let content: React.ReactNode = null

                        if (columnId === 'name') {
                          content = (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--sc-text)]">
                                {group.main.name}
                              </span>
                              <ChevronDown 
                                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          )
                        } else if (columnId === 'admins') {
                          const admins = group.main.admins
                          content = (
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
                        } else if (columnId === 'subscriptionAccess') {
                          content = (
                            <FullAccessSwitch
                              checked={group.main.subscriptionAccess}
                              onCheckedChange={(checked) => onToggleSubscriptionAccess(group.main.id, checked)}
                            />
                          )
                        } else if (columnId === 'fullAccess') {
                          content = (
                            <FullAccessSwitch
                              checked={group.main.fullAccess}
                              onCheckedChange={(checked) => onToggleFullAccess(group.main.id, checked)}
                            />
                          )
                        } else if (columnId === 'allocated') {
                          content = (
                            <span className="text-sm text-gray-700 font-medium">
                              {formatNumber(totalAllocated)}
                            </span>
                          )
                        } else if (columnId === 'currentBalance') {
                          content = (
                            <span className="text-sm text-gray-700 font-medium">
                              {formatNumber(Math.max(0, totalRemaining))}
                            </span>
                          )
                        } else if (columnId === 'actions') {
                          // For accordion headers, we know hasPackages is true, so we show reclaim
                          const hasAllocated = hasPackages || hasAllocatedPackages(group.main)
                          content = (
                            <ActionsMenu
                              workspaceId={group.main.id}
                              onManageAdmins={() => console.log('Manage admins', group.main.id)}
                              onUsageReport={() => navigate(`/smartwords-usage-report/${group.main.id}`)}
                              onSettings={() => console.log('Settings', group.main.id)}
                              onAllocate={() =>
                                setAllocationModal({ open: true, workspace: group.main, mode: 'allocate' })
                              }
                              onReclaim={hasAllocated && !group.main.isNonReclaimable ? () =>
                                setAllocationModal({ open: true, workspace: group.main, mode: 'reclaim' })
                              : undefined}
                            />
                          )
                        }

                        return (
                          <td key={header.id} className="px-4 py-3" onClick={(e) => {
                            // Don't toggle when clicking on interactive elements
                            if (columnId === 'subscriptionAccess' || columnId === 'fullAccess' || columnId === 'actions') {
                              e.stopPropagation()
                            }
                          }}>
                            {content}
                          </td>
                        )
                      })}
                    </tr>
                    {isExpanded && group.packages.map((pkg) => renderPackageRow(pkg))}
                  </React.Fragment>
                )
              } else {
                // Regular workspace without packages
                return <React.Fragment key={group.main.id}>{renderWorkspaceRow(group.main)}</React.Fragment>
              }
            })}
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

    </>
  )
}

