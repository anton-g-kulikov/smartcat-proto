import { useState, useMemo, useEffect } from 'react'
import * as Select from '@radix-ui/react-select'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown, Download, Check } from 'lucide-react'
import type { SmartwordsOperation } from '@/types/smartwords'

type TimePeriod = 
  | 'this-month'
  | 'last-month'
  | 'this-quarter'
  | 'last-quarter'
  | 'this-year'
  | 'last-year'

interface StatisticsWidgetProps {
  operations: SmartwordsOperation[]
  onTimePeriodChange?: (range: { start: Date; end: Date } | null) => void
}

const getTimePeriodRange = (period: TimePeriod): { start: Date; end: Date } => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentQuarter = Math.floor(currentMonth / 3)

  switch (period) {
    case 'this-month': {
      const start = new Date(currentYear, currentMonth, 1)
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
      return { start, end }
    }
    case 'last-month': {
      const start = new Date(currentYear, currentMonth - 1, 1)
      const end = new Date(currentYear, currentMonth, 0, 23, 59, 59)
      return { start, end }
    }
    case 'this-quarter': {
      const quarterStartMonth = currentQuarter * 3
      const start = new Date(currentYear, quarterStartMonth, 1)
      const end = new Date(currentYear, quarterStartMonth + 3, 0, 23, 59, 59)
      return { start, end }
    }
    case 'last-quarter': {
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1
      const lastQuarterYear = currentQuarter === 0 ? currentYear - 1 : currentYear
      const quarterStartMonth = lastQuarter * 3
      const start = new Date(lastQuarterYear, quarterStartMonth, 1)
      const end = new Date(lastQuarterYear, quarterStartMonth + 3, 0, 23, 59, 59)
      return { start, end }
    }
    case 'this-year': {
      const start = new Date(currentYear, 0, 1)
      const end = new Date(currentYear, 11, 31, 23, 59, 59)
      return { start, end }
    }
    case 'last-year': {
      const start = new Date(currentYear - 1, 0, 1)
      const end = new Date(currentYear - 1, 11, 31, 23, 59, 59)
      return { start, end }
    }
  }
}

const formatPeriodLabel = (period: TimePeriod): string => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentQuarter = Math.floor(currentMonth / 3) + 1
  const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  switch (period) {
    case 'this-month':
      return `This month (${monthNames[currentMonth]} ${currentYear})`
    case 'last-month':
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return `Last month (${monthNames[lastMonth]} ${lastMonthYear})`
    case 'this-quarter':
      return `This quarter (${quarterNames[currentQuarter - 1]} ${currentYear})`
    case 'last-quarter':
      const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1
      const lastQuarterYear = currentQuarter === 1 ? currentYear - 1 : currentYear
      return `Last quarter (${quarterNames[lastQuarter - 1]} ${lastQuarterYear})`
    case 'this-year':
      return `This year (${currentYear})`
    case 'last-year':
      return `Last year (${currentYear - 1})`
  }
}

export function StatisticsWidget({ operations, onTimePeriodChange }: StatisticsWidgetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('this-year')

  // Initialize time period filter on mount
  useEffect(() => {
    const { start, end } = getTimePeriodRange(selectedPeriod)
    if (onTimePeriodChange) {
      onTimePeriodChange({ start, end })
    }
  }, [selectedPeriod, onTimePeriodChange]) // Initialize and update when period changes

  // Filter operations by time period
  const filteredOperations = useMemo(() => {
    const { start, end } = getTimePeriodRange(selectedPeriod)
    
    // Notify parent component of time period change
    if (onTimePeriodChange) {
      onTimePeriodChange({ start, end })
    }
    
    return operations.filter(op => {
      const opDate = new Date(op.timestamp)
      return opDate >= start && opDate <= end
    })
  }, [operations, selectedPeriod, onTimePeriodChange])

  // Calculate totals
  const totals = useMemo(() => {
    let totalAdded = 0
    let totalUsed = 0

    filteredOperations.forEach(op => {
      if (op.type === 'allocation') {
        totalAdded += op.amount
      } else {
        totalUsed += op.amount
      }
    })

    return { totalAdded, totalUsed }
  }, [filteredOperations])

  // Generate chart data - balance over time (step function)
  const chartData = useMemo(() => {
    // Get all operations before the period to calculate initial balance
    const { start } = getTimePeriodRange(selectedPeriod)
    const operationsBeforePeriod = operations.filter(op => {
      const opDate = new Date(op.timestamp)
      return opDate < start
    })
    
    // Calculate initial balance from operations before period
    let initialBalance = 0
    operationsBeforePeriod.forEach(op => {
      if (op.type === 'allocation') {
        initialBalance += op.amount
      } else {
        initialBalance -= op.amount
      }
    })

    // Sort operations by date (oldest first)
    const sortedOps = [...filteredOperations].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const dataPoints: { date: string; balance: number }[] = []
    let runningBalance = initialBalance

    // Add starting point
    const { start: periodStart, end: periodEnd } = getTimePeriodRange(selectedPeriod)
    dataPoints.push({
      date: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      balance: initialBalance
    })

    // For each operation, add a point with the NEW balance at the operation date
    // stepAfter will keep the old balance until this point, then jump to the new balance
    sortedOps.forEach(op => {
      const date = new Date(op.timestamp)
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

      // Update balance
      if (op.type === 'allocation') {
        runningBalance += op.amount
      } else {
        runningBalance -= op.amount
      }

      // Add point with new balance (stepAfter will show the jump at this point)
      dataPoints.push({
        date: dateLabel,
        balance: runningBalance
      })
    })

    // Add ending point
    dataPoints.push({
      date: periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      balance: runningBalance
    })
    
    // If no operations, show at least start and end points
    if (sortedOps.length === 0) {
      return [
        {
          date: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          balance: initialBalance
        },
        {
          date: periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          balance: initialBalance
        }
      ]
    }

    return dataPoints
  }, [filteredOperations, selectedPeriod, operations])

  // Find max balance for Y-axis
  const maxBalance = useMemo(() => {
    if (chartData.length === 0) return 1500000
    const balances = chartData.map(d => d.balance)
    if (balances.length === 0) return 1500000
    const max = Math.max(...balances)
    if (max <= 0) return 300000 // Default to 300k if all balances are 0 or negative
    // Round up to nearest 300k
    return Math.ceil(max / 300000) * 300000 || 1500000
  }, [chartData])

  const handleDownloadCSV = () => {
    const csvHeaders = ['Date', 'Type', 'Project', 'Amount', 'Description']
    const csvRows = filteredOperations.map(op => [
      new Date(op.timestamp).toLocaleDateString(),
      op.type,
      op.projectName || '-',
      op.amount.toString(),
      op.description
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smartwords-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with time period selector and download */}
      <div className="flex items-center justify-between">
        <Select.Root value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
          <Select.Trigger className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--sc-primary)] bg-white">
            <Select.Value>
              {formatPeriodLabel(selectedPeriod)}
            </Select.Value>
            <Select.Icon>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <Select.Viewport className="p-1">
                <Select.Item value="this-month" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>This month</span>
                      <span className="text-gray-500 text-xs ml-4">
                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="last-month" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>Last month</span>
                      <span className="text-gray-500 text-xs ml-4">
                        {(() => {
                          const lastMonth = new Date()
                          lastMonth.setMonth(lastMonth.getMonth() - 1)
                          return lastMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        })()}
                      </span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Separator className="h-px bg-gray-200 my-1" />
                <Select.Item value="this-quarter" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>This quarter</span>
                      <span className="text-gray-500 text-xs ml-4">
                        {(() => {
                          const now = new Date()
                          const quarter = Math.floor(now.getMonth() / 3) + 1
                          return `Q${quarter} ${now.getFullYear()}`
                        })()}
                      </span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="last-quarter" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>Last quarter</span>
                      <span className="text-gray-500 text-xs ml-4">
                        {(() => {
                          const now = new Date()
                          const currentQuarter = Math.floor(now.getMonth() / 3) + 1
                          const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1
                          const lastQuarterYear = currentQuarter === 1 ? now.getFullYear() - 1 : now.getFullYear()
                          return `Q${lastQuarter} ${lastQuarterYear}`
                        })()}
                      </span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Separator className="h-px bg-gray-200 my-1" />
                <Select.Item value="this-year" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>This year</span>
                      <span className="text-gray-500 text-xs ml-4">{new Date().getFullYear()}</span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="last-year" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100">
                  <Select.ItemText className="text-sm text-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>Last year</span>
                      <span className="text-gray-500 text-xs ml-4">{new Date().getFullYear() - 1}</span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-2">
                    <Check className="w-4 h-4 text-[var(--sc-primary)]" />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download detailed CSV report
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sc-primary,#6b4eff)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--sc-primary,#6b4eff)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, maxBalance]}
              ticks={[0, 300000, 600000, 900000, 1200000, 1500000].filter(t => t <= maxBalance)}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Area
              type="stepBefore"
              dataKey="balance"
              stroke="var(--sc-primary,#6b4eff)"
              strokeWidth={2}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="text-sm text-gray-600 mb-1">TOTAL ADDED</div>
          <div className="text-2xl font-bold text-green-600">
            {totals.totalAdded.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="text-sm text-gray-600 mb-1">TOTAL USED</div>
          <div className="text-2xl font-bold text-red-600">
            -{totals.totalUsed.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

