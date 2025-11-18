import { useState, useMemo } from 'react'
import { WorkspacesTable } from './WorkspacesTable'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import type { WorkspaceRow } from '@/types/orgManagement'

interface WorkspacesSectionProps {
  workspaces: WorkspaceRow[]
  onToggleFullAccess: (workspaceId: string, enabled: boolean) => void
  onToggleSubscriptionAccess: (workspaceId: string, enabled: boolean) => void
  onAllocate: (workspaceId: string, amount: number, mode: 'allocate' | 'reclaim') => void
  currentOrgBalance: number
}

const ITEMS_PER_PAGE = 10

export function WorkspacesSection({
  workspaces,
  onToggleFullAccess,
  onToggleSubscriptionAccess,
  onAllocate,
  currentOrgBalance,
}: WorkspacesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(workspaces.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedWorkspaces = workspaces.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
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
    <section className="rounded-2xl bg-[var(--sc-surface)] shadow-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--sc-text)]">Workspaces</h3>
      </div>

      {/* Table */}
      <WorkspacesTable
        workspaces={paginatedWorkspaces}
        onToggleFullAccess={onToggleFullAccess}
        onToggleSubscriptionAccess={onToggleSubscriptionAccess}
        onAllocate={onAllocate}
        currentOrgBalance={currentOrgBalance}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-4">
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
    </section>
  )
}

