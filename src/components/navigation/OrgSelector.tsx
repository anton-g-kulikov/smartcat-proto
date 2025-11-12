import { Settings, ChevronRight, UserPlus, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar } from './Avatar'
import { mockOrganization, mockWorkspace } from '@/mocks/navigation'

export function OrgSelector() {
  const navigate = useNavigate()
  const org = mockOrganization
  const workspace = mockWorkspace

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Select organization"
        >
          <Avatar initial={org.initial} color={org.avatarColor} size="md" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="right">
        <div className="p-4">
          {/* Organization Level */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar initial={org.initial} color={org.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-gray-900">{org.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded hover:bg-gray-100"
                      aria-label="Organization management"
                      onClick={() => navigate('/org/management')}
                      title="Organization management"
                    >
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-100"
                      aria-label="Organization settings"
                      onClick={() => navigate('/org/settings')}
                      title="Organization settings"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100"
                      aria-label="Change organization"
                    >
                      Change
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {org.workspacesCount} workspaces · {org.plan} · {org.region}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex items-center gap-3 pl-6">
              <div className="w-px h-8 bg-gray-200" />
            </div>

            {/* Workspace Level */}
            <div className="flex items-start gap-3">
              <Avatar initial={workspace.initial} color={workspace.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-gray-900">{workspace.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded hover:bg-gray-100"
                      aria-label="Workspace settings"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-100"
                      aria-label="Add member"
                    >
                      <UserPlus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100"
                      aria-label="Switch workspace"
                    >
                      Switch
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {workspace.membersCount} members · {workspace.plan} · {workspace.region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

