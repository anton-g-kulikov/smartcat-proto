import type { OrgSummary, WorkspaceRow } from '@/types/orgManagement'

export const mockOrgSummary: OrgSummary = {
  id: '1',
  name: 'Coca-Cola',
  logoUrl: undefined, // Use avatar fallback
  avatarColor: '#dc2626', // Red (matching mockup)
  initial: 'C',
  renewalDate: '2025-05-10T00:00:00Z',
  subscription: 'Enterprise',
  initialSmartwordsTotal: 2000000, // Original subscription amount (fixed)
  smartwordsTotal: 2000000, // Current total (can change with moves/allocations)
  smartwordsUsed: 1000000, // Approximately 50% used
  workspacesCount: 3,
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
    subscriptionAccess: true, // Toggle ON
    fullAccess: true, // Toggle ON
    allocated: null, // "Not set"
    spent: 0,
    isMyWorkspace: false,
  },
  {
    id: 'ws2',
    name: 'Coca-Cola (main)',
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
    subscriptionAccess: false, // Toggle OFF
    fullAccess: false, // Toggle OFF
    allocated: 0,
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
    subscriptionAccess: false, // Toggle OFF
    fullAccess: false, // Toggle OFF
    allocated: 0,
    spent: 0,
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

