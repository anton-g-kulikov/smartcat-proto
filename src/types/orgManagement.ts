export type OrgSummary = {
  id: string
  name: string
  logoUrl?: string
  avatarColor: string
  initial: string
  renewalDate: string
  subscription: 'Enterprise' | 'Team' | 'Forever Free'
  initialSmartwordsTotal: number // Original subscription amount (doesn't change)
  smartwordsTotal: number // Current total after allocations/moves
  smartwordsUsed: number
  workspacesCount: number
  organizationAdmins: {
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  smartwordsSharingEnabled: boolean
}

export type WorkspaceRow = {
  id: string
  name: string
  subscription: OrgSummary['subscription']
  admins: {
    id: string
    name: string
    avatarUrl?: string
    initial: string
    avatarColor: string
  }[]
  subscriptionAccess: boolean
  fullAccess: boolean
  allocated: number | null
  spent: number
  isMyWorkspace?: boolean
}

export type WorkspaceTab = 'all' | 'my'

