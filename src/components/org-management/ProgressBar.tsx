import * as Tooltip from '@radix-ui/react-tooltip'

interface WorkspaceAllocation {
  id: string
  name: string
  allocated: number
}

interface ProgressBarProps {
  initialTotal: number // Initial subscription amount (for scale)
  allocations?: WorkspaceAllocation[] // Workspace allocations to display
  totalSpent?: number // Total spent from all workspaces
}

export function ProgressBar({ initialTotal, allocations = [], totalSpent = 0 }: ProgressBarProps) {
  // Calculate total allocated across all workspaces
  const totalAllocated = allocations.reduce((sum, alloc) => sum + (alloc.allocated || 0), 0)
  // Spent amount (from workspaces) - this is what goes in the light purple section
  const spent = totalSpent
  // Remaining available balance = initialTotal - totalAllocated - spent
  // This represents what's still available at org level (excluding allocated and spent)
  const remaining = initialTotal - totalAllocated - spent
  
  // Calculate percentages based on initial total
  const remainingPercentage = (remaining / initialTotal) * 100
  const allocatedPercentage = (totalAllocated / initialTotal) * 100
  const spentPercentage = (spent / initialTotal) * 100
  
  // Calculate position for single combined allocated section
  // Order: remaining (purple) -> allocated (pink) -> spent (light purple)
  const allocatedLeft = (remaining / initialTotal) * 100
  
  // Only show 0 and initialTotal as tick markers
  const tickMarkers = [0, initialTotal]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <Tooltip.Provider>
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="relative h-2 bg-purple-100 rounded-full overflow-hidden">
          {/* Remaining portion (dark purple) - leftmost */}
          {remaining > 0 && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all cursor-pointer"
                  style={{ 
                    width: `${remainingPercentage}%`,
                    backgroundColor: 'var(--sc-primary)' // #6b4eff
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                  sideOffset={5}
                >
                  Remaining: {formatNumber(remaining)}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
          {/* Allocated portion (pink section) - middle, combined */}
          {totalAllocated > 0 && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  className="absolute top-0 h-full rounded-full transition-all cursor-pointer"
                  style={{
                    left: `${allocatedLeft}%`,
                    width: `${allocatedPercentage}%`,
                    backgroundColor: 'rgb(236, 72, 153)', // Pink color for allocations
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                  sideOffset={5}
                >
                  Allocated: {formatNumber(totalAllocated)}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
          {/* Spent portion (light purple) - rightmost */}
          {spent > 0 && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  className="absolute left-0 top-0 h-full bg-purple-50 rounded-full cursor-pointer"
                  style={{ 
                    width: `${spentPercentage}%`, 
                    left: `${remainingPercentage + allocatedPercentage}%` 
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
                  sideOffset={5}
                >
                  Spent: {formatNumber(spent)}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
        {/* Tick markers */}
        {tickMarkers.map((tick) => {
          const tickPosition = (tick / initialTotal) * 100
          return (
            <div
              key={tick}
              className="absolute top-0 w-px h-full"
              style={{ 
                left: `${tickPosition}%`,
                backgroundColor: 'rgba(107, 78, 255, 0.4)' // Primary color with opacity
              }}
            />
          )
        })}
      </div>
      
      {/* Section labels with amounts */}
      <div className="relative h-4 mt-1 overflow-visible">
        {/* Remaining section label (dark purple) */}
        {remaining > 0 && remainingPercentage > 5 && (
          <div
            className="absolute text-xs font-medium pointer-events-none"
            style={{
              left: `${remainingPercentage / 2}%`,
              transform: 'translateX(-50%)',
              color: 'var(--sc-primary)',
              whiteSpace: 'nowrap',
              maxWidth: `${remainingPercentage}%`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Remaining: {formatNumber(remaining)}
          </div>
        )}
        
        {/* Allocated section label - combined */}
        {totalAllocated > 0 && allocatedPercentage > 5 && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${allocatedLeft}%`,
              width: `${allocatedPercentage}%`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              className="text-xs font-medium"
              style={{
                color: 'rgb(236, 72, 153)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                padding: '0 2px',
              }}
            >
              Allocated: {formatNumber(totalAllocated)}
            </div>
          </div>
        )}
        
        {/* Spent section label (light purple) - matching section color */}
        {spent > 0 && spentPercentage > 5 && (
          <div
            className="absolute text-xs font-medium pointer-events-none"
            style={{
              left: `${remainingPercentage + allocatedPercentage + (spentPercentage / 2)}%`,
              transform: 'translateX(-50%)',
              color: 'rgb(196, 181, 253)', // Light purple matching bg-purple-50
              whiteSpace: 'nowrap',
              maxWidth: `${spentPercentage}%`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Spent: {formatNumber(spent)}
          </div>
        )}
      </div>

      {/* Scale labels (only 0 and max) */}
      <div className="relative h-4 overflow-visible">
        {tickMarkers.map((tick) => {
          const tickPosition = (tick / initialTotal) * 100
          const isFirst = tick === 0
          const isLast = tick === tickMarkers[tickMarkers.length - 1]
          return (
            <div
              key={tick}
              className="absolute text-xs font-medium pointer-events-none"
              style={{ 
                color: '#000000', // Black color
                ...(isFirst 
                  ? { left: '0' } 
                  : isLast 
                    ? { right: '0' } 
                    : { left: `${tickPosition}%`, transform: 'translateX(-50%)' }
                )
              }}
            >
              {formatNumber(tick)}
            </div>
          )
        })}
      </div>
      </div>
    </Tooltip.Provider>
  )
}

