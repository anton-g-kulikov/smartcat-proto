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
  
  // Calculate positions for allocated sections
  // Order: remaining (purple) -> allocated (pink) -> spent (light purple)
  const allocatedSections = allocations
    .filter(alloc => (alloc.allocated || 0) > 0)
    .map((alloc, index) => {
      const prevAllocated = allocations
        .slice(0, index)
        .reduce((sum, a) => sum + (a.allocated || 0), 0)
      const sectionStart = remaining + prevAllocated
      const sectionPercentage = ((alloc.allocated || 0) / initialTotal) * 100
      const sectionLeft = (sectionStart / initialTotal) * 100
      
      return {
        ...alloc,
        left: sectionLeft,
        width: sectionPercentage,
      }
    })
  
  // Only show 0 and initialTotal as tick markers
  const tickMarkers = [0, initialTotal]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative h-2 bg-purple-100 rounded-full overflow-hidden">
        {/* Remaining portion (dark purple) - leftmost */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ 
            width: `${remainingPercentage}%`,
            backgroundColor: 'var(--sc-primary)' // #6b4eff
          }}
        />
        {/* Allocated portions (pink sections) - middle */}
        {allocatedSections.map((section) => (
          <div
            key={section.id}
            className="absolute top-0 h-full rounded-full transition-all"
            style={{
              left: `${section.left}%`,
              width: `${section.width}%`,
              backgroundColor: 'rgb(236, 72, 153)', // Pink color for allocations
            }}
            title={`${section.name}: ${formatNumber(section.allocated || 0)}`}
          />
        ))}
        {/* Spent portion (light purple) - rightmost */}
        {spent > 0 && (
          <div
            className="absolute left-0 top-0 h-full bg-purple-50 rounded-full"
            style={{ 
              width: `${spentPercentage}%`, 
              left: `${remainingPercentage + allocatedPercentage}%` 
            }}
          />
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
        {/* Remaining section label (dark purple) - just the number */}
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
            {formatNumber(remaining)}
          </div>
        )}
        
        {/* Allocated sections labels */}
        {allocatedSections.map((section) => {
          // Only show label if section is wide enough (at least 5% of total)
          if (section.width < 5) return null
          
          // Always show the number, workspace name is optional
          const numberText = formatNumber(section.allocated)
          const fullLabel = `${section.name}: ${numberText}`
          
          // Estimate if we have enough space for the full label
          // If section is narrow (< 10%), show only the number
          // Otherwise, try to show the full label
          const showFullLabel = section.width >= 10
          const displayText = showFullLabel ? fullLabel : numberText
          
          return (
            <div
              key={section.id}
              className="absolute pointer-events-none"
              style={{
                left: `${section.left}%`,
                width: `${section.width}%`,
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
                title={fullLabel} // Show full text on hover
              >
                {displayText}
              </div>
            </div>
          )
        })}
        
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
            {formatNumber(spent)}
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
  )
}

