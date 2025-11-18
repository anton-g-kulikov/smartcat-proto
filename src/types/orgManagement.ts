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
  allowNewWorkspacesOrgSubscription: boolean
  allowNewWorkspacesOrgSmartwords: boolean
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
  isPackageRow?: boolean // If true, only show package columns (allocated, used, current package)
  packageLabel?: string // Optional label for the package (e.g., "WS")
  isNonReclaimable?: boolean // If true, admin cannot reclaim this package
}

export type WorkspaceTab = 'all' | 'my'

