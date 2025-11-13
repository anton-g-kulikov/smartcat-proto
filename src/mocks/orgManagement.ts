import type { OrgSummary, WorkspaceRow } from '@/types/orgManagement'

export const mockOrgSummary: OrgSummary = {
  id: '1',
  name: 'Coca-Cola',
  logoUrl: undefined, // Use avatar fallback
  avatarColor: '#dc2626', // Red (matching mockup)
  initial: 'C',
  renewalDate: '2025-05-10T00:00:00Z',
  subscription: 'Enterprise',
  initialSmartwordsTotal: 5000000, // Original subscription amount (fixed)
  smartwordsTotal: 1150000, // Current total (2M - 500K HR - 250K Marketing Team - 100K HR second)
  smartwordsUsed: 1000000, // Total used (includes all workspaces with org-level access)
  workspacesCount: 10,
  organizationAdmins: [
    {
      id: 'admin1',
      name: 'Admin One',
      initial: 'AO',
      avatarColor: '#a855f7',
    },
    {
      id: 'admin2',
      name: 'Admin Two',
      initial: 'AT',
      avatarColor: '#3b82f6',
    },
  ],
  smartwordsSharingEnabled: true,
  allowNewWorkspacesOrgSubscription: true,
  allowNewWorkspacesOrgSmartwords: true,
}

export const mockWorkspaces: WorkspaceRow[] = [
  {
    id: 'ws1',
    name: 'Personal. F. Nielsen',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'fn1',
        name: 'Frank Nielsen',
        initial: 'FN',
        avatarColor: '#8b5cf6',
      },
    ],
    subscriptionAccess: true, // Toggle ON (default)
    fullAccess: true, // Toggle ON
    allocated: null, // "Not set"
    spent: 600000, // Used Smartwords
    isMyWorkspace: false,
  },
  {
    id: 'ws2',
    name: 'Marketing Team',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'pb1',
        name: 'PB',
        initial: 'PB',
        avatarColor: '#6366f1',
      },
      {
        id: 'admin2',
        name: 'Admin Two',
        initial: 'AT',
        avatarColor: '#3b82f6',
      },
    ],
    subscriptionAccess: true, // Toggle ON (default)
    fullAccess: false, // Toggle OFF
    allocated: 250000, // 250K allocated
    spent: 0,
    isMyWorkspace: true, // For "My workspaces" tab
  },
  {
    id: 'ws3',
    name: 'HR',
    subscription: 'Forever Free',
    admins: [
      {
        id: 'es1',
        name: 'Ester Smith',
        initial: 'ES',
        avatarColor: '#ec4899',
      },
    ],
    subscriptionAccess: true, // Toggle ON (default)
    fullAccess: false, // Toggle OFF
    allocated: 500000, // 500K allocated by default
    spent: 200000, // 200K used from allocated balance (not from org-level)
    isMyWorkspace: false,
  },
  {
    id: 'ws3-2',
    name: 'HR',
    subscription: 'Forever Free',
    admins: [
      {
        id: 'es1',
        name: 'Ester Smith',
        initial: 'ES',
        avatarColor: '#ec4899',
      },
    ],
    subscriptionAccess: true, // Toggle ON (default)
    fullAccess: false, // Toggle OFF
    allocated: 100000, // 100K allocated - second package
    spent: 0, // No usage yet
    isMyWorkspace: false,
    isPackageRow: true, // Only show package columns
  },
  {
    id: 'ws4',
    name: 'Sales Team',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'js1',
        name: 'John Smith',
        initial: 'JS',
        avatarColor: '#10b981',
      },
      {
        id: 'mj1',
        name: 'Mary Johnson',
        initial: 'MJ',
        avatarColor: '#f59e0b',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 150000,
    isMyWorkspace: false,
  },
  {
    id: 'ws5',
    name: 'Engineering',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'dk1',
        name: 'David Kim',
        initial: 'DK',
        avatarColor: '#3b82f6',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 80000,
    isMyWorkspace: false,
  },
  {
    id: 'ws6',
    name: 'Product Team',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'sl1',
        name: 'Sarah Lee',
        initial: 'SL',
        avatarColor: '#8b5cf6',
      },
      {
        id: 'rm1',
        name: 'Robert Miller',
        initial: 'RM',
        avatarColor: '#ef4444',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 120000,
    isMyWorkspace: false,
  },
  {
    id: 'ws7',
    name: 'Customer Support',
    subscription: 'Team',
    admins: [
      {
        id: 'aw1',
        name: 'Alice Wilson',
        initial: 'AW',
        avatarColor: '#ec4899',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 45000,
    isMyWorkspace: false,
  },
  {
    id: 'ws8',
    name: 'Finance',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'tb1',
        name: 'Thomas Brown',
        initial: 'TB',
        avatarColor: '#6366f1',
      },
      {
        id: 'ew1',
        name: 'Emma White',
        initial: 'EW',
        avatarColor: '#14b8a6',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 95000,
    isMyWorkspace: false,
  },
  {
    id: 'ws9',
    name: 'Legal',
    subscription: 'Enterprise',
    admins: [
      {
        id: 'jd1',
        name: 'James Davis',
        initial: 'JD',
        avatarColor: '#f97316',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 35000,
    isMyWorkspace: false,
  },
  {
    id: 'ws10',
    name: 'Operations',
    subscription: 'Team',
    admins: [
      {
        id: 'lg1',
        name: 'Lisa Garcia',
        initial: 'LG',
        avatarColor: '#a855f7',
      },
      {
        id: 'cm1',
        name: 'Chris Martinez',
        initial: 'CM',
        avatarColor: '#06b6d4',
      },
    ],
    subscriptionAccess: true,
    fullAccess: true, // Access to org Smartwords
    allocated: null,
    spent: 110000,
    isMyWorkspace: false,
  },
]

// Mock organizations for Move Smartwords dropdown
export const mockOrganizations = [
  {
    id: '1',
    name: 'Coca-Cola',
    initial: 'C',
    avatarColor: '#dc2626',
    currentBalance: 1000000, // Available balance
  },
  {
    id: '2',
    name: 'PepsiCo',
    initial: 'P',
    avatarColor: '#2563eb',
    currentBalance: 500000,
  },
  {
    id: '3',
    name: 'Nestlé',
    initial: 'N',
    avatarColor: '#059669',
    currentBalance: 3000000,
  },
  {
    id: '4',
    name: 'Unilever',
    initial: 'U',
    avatarColor: '#dc2626',
    currentBalance: 1500000,
  },
]

