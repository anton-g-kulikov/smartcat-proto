import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Info, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockWorkspaces } from '@/mocks/orgManagement'

// Get all HR workspace packages from mocks
const hrWorkspaces = mockWorkspaces.filter(ws => ws.name === 'HR')

// Calculate remaining Smartwords across all HR packages
const calculateRemainingSmartwords = () => {
  let totalRemaining = 0
  
  hrWorkspaces.forEach(ws => {
    if (ws.allocated !== null && ws.allocated > 0) {
      totalRemaining += Math.max(0, ws.allocated - (ws.spent || 0))
    }
  })
  
  return totalRemaining
}

// Get main HR workspace (not package row) for plan/name
const hrWorkspace = hrWorkspaces.find(ws => !ws.isPackageRow) || hrWorkspaces[0]

const mockSmartwordsBalance = calculateRemainingSmartwords()
const mockCurrentPlan = hrWorkspace?.subscription || 'Forever Free'
const workspaceName = hrWorkspace?.name || 'HR'

export function SmartwordsWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
          aria-label="Smartwords balance"
        >
          <div className="w-5 h-5 rounded-full bg-[var(--sc-primary,#6b4eff)] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">S</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {mockSmartwordsBalance.toLocaleString()}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Smartwords Balance
            </span>
            <button className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
              <Info className="w-3 h-3 text-gray-500" />
            </button>
          </div>

          {/* Workspace Info */}
          <div className="pb-3 border-b border-gray-200 space-y-1">
            <div className="text-sm font-semibold text-gray-900">{workspaceName}</div>
            <div className="text-xs text-gray-600">{mockCurrentPlan}</div>
          </div>

          {/* Balance Display */}
          <div className="text-4xl font-bold text-gray-900">
            {mockSmartwordsBalance.toLocaleString()}
          </div>

          {/* View Report Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              // Use HR workspace ID (ws3) as default for the widget
              const hrWorkspaceId = mockWorkspaces.find(ws => ws.id === 'ws3' && !ws.isPackageRow)?.id || 'ws3'
              navigate(`/smartwords-usage-report/${hrWorkspaceId}`)
              setIsOpen(false)
            }}
          >
            <TrendingUp className="w-4 h-4" />
            View report
          </Button>

          {/* Out of Smartwords Section */}
          {mockSmartwordsBalance === 0 && (
            <div className="rounded-lg bg-pink-50 border border-pink-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">S</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  You're out of Smartwords
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Upgrade your subscription to get more Smartwords at better prices!
              </p>
              <Button
                className="w-full bg-[var(--sc-primary,#6b4eff)] hover:opacity-90 text-white"
                onClick={() => {
                  // TODO: Navigate to upgrade page
                  console.log('View plans clicked')
                }}
              >
                View plans
              </Button>
            </div>
          )}

          {/* Current Plan Section */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Current Plan
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                {mockCurrentPlan}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

