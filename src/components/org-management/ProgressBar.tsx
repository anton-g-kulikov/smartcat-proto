interface ProgressBarProps {
  used: number
  currentTotal: number // Current total after allocations/moves
  initialTotal: number // Initial subscription amount (for scale)
}

export function ProgressBar({ used, currentTotal, initialTotal }: ProgressBarProps) {
  const remaining = currentTotal - used
  const percentage = (used / initialTotal) * 100 // Scale based on initial total
  const remainingPercentage = (remaining / initialTotal) * 100
  
  const baseTickMarkers = [0, 500000, 1000000, 1500000, 2000000]
  const filteredTicks = baseTickMarkers.filter(tick => tick <= initialTotal)
  // Always include the initial total as the last tick marker if it's not already in the list
  const tickMarkers = filteredTicks.includes(initialTotal) 
    ? filteredTicks 
    : [...filteredTicks, initialTotal]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Used portion */}
        <div
          className="absolute left-0 top-0 h-full bg-gray-800 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        {/* Remaining portion */}
        <div
          className="absolute left-0 top-0 h-full bg-gray-100 rounded-full"
          style={{ width: `${remainingPercentage}%`, left: `${percentage}%` }}
        />
        {/* Tick markers */}
        {tickMarkers.map((tick) => {
          const tickPosition = (tick / initialTotal) * 100
          return (
            <div
              key={tick}
              className="absolute top-0 w-px h-full bg-gray-400"
              style={{ left: `${tickPosition}%` }}
            />
          )
        })}
      </div>

      {/* Labels */}
      <div className="relative h-4">
        {tickMarkers.map((tick) => {
          const tickPosition = (tick / initialTotal) * 100
          const isFirst = tick === 0
          const isLast = tick === tickMarkers[tickMarkers.length - 1]
          return (
            <div
              key={tick}
              className={`absolute text-xs text-gray-600 ${
                isFirst ? 'left-0' : isLast ? 'right-0' : 'transform -translate-x-1/2'
              }`}
              style={!isFirst && !isLast ? { left: `${tickPosition}%` } : undefined}
            >
              {formatNumber(tick)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

