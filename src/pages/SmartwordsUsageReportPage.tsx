import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { mockWorkspaces, mockWorkspaceOperations, mockOrgSummary } from '@/mocks/orgManagement'
import { Info, FileText, Calendar, ArrowUp, Circle } from 'lucide-react'
import { StatisticsWidget } from '@/components/smartwords/StatisticsWidget'
import { StatCard } from '@/components/org-management/StatCard'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { SmartwordsOperation } from '@/types/smartwords'
import type { WorkspaceRow } from '@/types/orgManagement'

const ITEMS_PER_PAGE = 10

// Calculate totals across all packages for a workspace
const calculateWorkspaceTotals = (workspaceId: string, workspaces: WorkspaceRow[]) => {
  // Find the main workspace (not package row) to get the name
  const mainWorkspace = workspaces.find(ws => ws.id === workspaceId && !ws.isPackageRow)
  if (!mainWorkspace) {
    return { totalAllocated: 0, totalSpent: 0, totalRemaining: 0, workspace: null }
  }

  // Get all packages for this workspace (main + package rows with same name)
  const workspacePackages = workspaces.filter(
    ws => ws.name === mainWorkspace.name && ws.allocated !== null && ws.allocated > 0
  )

  let totalAllocated = 0
  let totalSpent = 0
  let totalRemaining = 0

  workspacePackages.forEach(ws => {
    const remaining = Math.max(0, ws.allocated - (ws.spent || 0))
    totalAllocated += ws.allocated
    totalSpent += ws.spent || 0
    totalRemaining += remaining
  })

  return { totalAllocated, totalSpent, totalRemaining, workspace: mainWorkspace }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatLanguages = (languages?: string[]) => {
  if (!languages || languages.length === 0) return '-'
  if (languages.length <= 2) return languages.join(', ')
  return `${languages.slice(0, 2).join(', ')} +${languages.length - 2}`
}

export default function SmartwordsUsageReportPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  
  // Calculate totals for the specified workspace
  const { totalAllocated, totalSpent, totalRemaining, workspace } = calculateWorkspaceTotals(
    workspaceId || '',
    mockWorkspaces
  )

  if (!workspace) {
    return (
      <div className="min-h-full p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Workspace not found</p>
        </div>
      </div>
    )
  }

  const currentPlan = workspace.subscription || 'Forever Free'
  const workspaceName = workspace.name
  
  // Get workspace-specific operations (safely handle missing data)
  const workspaceOperations = (workspaceId && mockWorkspaceOperations[workspaceId]) ? mockWorkspaceOperations[workspaceId] : []
  
  // State for time period filter (shared with StatisticsWidget)
  const [timePeriodFilter, setTimePeriodFilter] = useState<{ start: Date; end: Date } | null>(null)
  
  // Filter operations by time period if set
  const filteredOperations = useMemo(() => {
    if (!timePeriodFilter) {
      return workspaceOperations
    }
    return workspaceOperations.filter(op => {
      const opDate = new Date(op.timestamp)
      return opDate >= timePeriodFilter.start && opDate <= timePeriodFilter.end
    })
  }, [workspaceOperations, timePeriodFilter])
  
  // Sort operations by timestamp (newest first)
  const sortedOperations = [...filteredOperations].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // Pagination state - reset when filter changes
  const [currentPage, setCurrentPage] = useState(1)
  
  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [timePeriodFilter])
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedOperations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedOperations = sortedOperations.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = useMemo(() => getPageNumbers(), [currentPage, totalPages])

  return (
    <div className="min-h-full p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Smartwords Usage Report</h1>
      </div>

      {/* Balance Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Allocated"
          value={totalAllocated.toLocaleString()}
          icon={Circle}
        />
        <StatCard
          label="Remaining"
          value={totalRemaining.toLocaleString()}
          icon={Circle}
        />
        <StatCard
          label="Current Plan"
          value={
            <div className="space-y-1">
              <div>{currentPlan}</div>
              {mockOrgSummary.renewalDate && (
                <div className="text-xs text-gray-600">
                  Renewal date: {new Date(mockOrgSummary.renewalDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>
          }
          icon={Circle}
        />
      </section>

      {/* Statistics Widget */}
      <StatisticsWidget 
        operations={workspaceOperations}
        onTimePeriodChange={setTimePeriodFilter}
      />

      {/* Operations History */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Operations History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {sortedOperations.length} {sortedOperations.length === 1 ? 'operation' : 'operations'}
              {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
        </div>

        {paginatedOperations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No operations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                    Word Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-600">
                    Smartwords Used
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOperations.map((operation) => (
                  <tr
                    key={operation.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(operation.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {operation.type === 'allocation' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {operation.projectName || operation.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">
                        {operation.wordCount?.toLocaleString() || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-semibold ${
                        operation.type === 'allocation' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {operation.type === 'allocation' ? '+' : ''}{operation.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {pageNumbers.map((page, index) => (
                  <PaginationItem key={page === 'ellipsis' ? `ellipsis-${index}` : page}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1)
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
