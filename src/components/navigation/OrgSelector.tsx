import { Settings, ChevronRight, UserPlus, Building2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Avatar } from './Avatar'
import { mockOrgSummary, mockWorkspaces as orgWorkspaces, mockOrganizations } from '@/mocks/orgManagement'
import { mockWorkspaces } from '@/mocks/navigation'
import type { Organization, Workspace } from '@/types/navigation'

export function OrgSelector() {
  const navigate = useNavigate()
  
  // Convert OrgSummary to Organization
  const org: Organization = {
    id: mockOrgSummary.id,
    name: mockOrgSummary.name,
    initial: mockOrgSummary.initial,
    avatarColor: mockOrgSummary.avatarColor,
    workspacesCount: mockOrgSummary.workspacesCount,
    plan: mockOrgSummary.subscription,
    region: 'Europe', // Default region
    current: true,
  }
  
  // Convert WorkspaceRow to Workspace and find HR workspace
  const hrWorkspace = orgWorkspaces.find(ws => ws.id === 'ws3' && !ws.isPackageRow)
  const currentWorkspace: Workspace = hrWorkspace ? {
    id: hrWorkspace.id,
    name: hrWorkspace.name,
    initial: hrWorkspace.admins[0]?.initial || 'HR',
    avatarColor: hrWorkspace.admins[0]?.avatarColor || '#ec4899',
    membersCount: 5, // Estimated based on typical HR team size
    plan: hrWorkspace.subscription,
    region: 'Europe',
    organizationId: org.id,
    current: true,
  } : {
    id: 'ws3',
    name: 'HR',
    initial: 'ES',
    avatarColor: '#ec4899',
    membersCount: 5,
    plan: 'Forever Free',
    region: 'Europe',
    organizationId: org.id,
    current: true,
  }

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
      <PopoverContent 
        className="w-80 p-0" 
        align="start" 
        side="right"
      >
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100"
                          aria-label="Change organization"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Change
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {mockOrganizations.map((mockOrg) => (
                          <DropdownMenuItem
                            key={mockOrg.id}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle organization change
                              console.log('Change to organization:', mockOrg.name)
                            }}
                          >
                            <Avatar initial={mockOrg.initial} color={mockOrg.avatarColor} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-gray-900">{mockOrg.name}</span>
                                {mockOrg.id === org.id && (
                                  <Check className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              <Avatar initial={currentWorkspace.initial} color={currentWorkspace.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-gray-900">{currentWorkspace.name}</h3>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100"
                          aria-label="Switch workspace"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Switch
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {mockWorkspaces.map((workspace) => (
                          <DropdownMenuItem
                            key={workspace.id}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle workspace switch
                              console.log('Switch to workspace:', workspace.name)
                            }}
                          >
                            <Avatar initial={workspace.initial} color={workspace.avatarColor} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-gray-900">{workspace.name}</span>
                                {workspace.id === currentWorkspace.id && (
                                  <Check className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {workspace.membersCount} members · {workspace.plan}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {currentWorkspace.membersCount} members · {currentWorkspace.plan} · {currentWorkspace.region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

