import { 
  Home, Grid, MessageCircle,
  FolderOpen, FileText, Circle, ArrowDownRight, 
  Clock, Users, ShoppingCart, Type, Link2, 
  RefreshCw, Users2, Settings, Globe, Tag, Send
} from 'lucide-react'
import type { Organization, Workspace, User, NavItem, HubSubNavItem, WorkSubNavItem } from '../types/navigation'

export const mockOrganization: Organization = {
  id: '1',
  name: 'Smartcat',
  initial: 'S',
  avatarColor: '#ff6b9d', // pink
  workspacesCount: 501,
  plan: 'Forever Free',
  region: 'Europe',
  current: true,
}

export const mockWorkspace: Workspace = {
  id: '1',
  name: "Anton Kulikov's Workspace",
  initial: 'AK',
  avatarColor: '#a855f7', // purple
  membersCount: 6,
  plan: 'Forever Free',
  region: 'Europe',
  organizationId: '1',
  current: true,
}

export const mockUser: User = {
  id: '1',
  name: 'Anton Kulikov',
  email: 'a.kulikov@smartcat.ai',
  initial: 'AK',
  avatarColor: '#a855f7', // purple
  role: 'Administrator',
  region: 'Europe',
  currency: 'USD',
  systemLanguage: 'English',
}

export const primaryNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    id: 'hub',
    label: 'Hub',
    path: '/hub',
    icon: Grid,
    hasSubNav: true,
  },
  {
    id: 'chats',
    label: 'Chats',
    path: '/chats',
    icon: MessageCircle,
  },
]

export const hubSubNavItems: HubSubNavItem[] = [
  { id: 'projects', label: 'Projects', path: '/hub/projects', icon: FolderOpen },
  { id: 'drive', label: 'Drive', path: '/hub/drive', icon: FileText },
  { id: 'smartwords', label: 'Smartwords', path: '/hub/smartwords', icon: Circle },
  { id: 'orders', label: 'Orders', path: '/hub/orders', icon: ArrowDownRight },
  { id: 'payments', label: 'Payments', path: '/hub/payments', icon: Clock },
  { id: 'clients', label: 'Clients', path: '/hub/clients', icon: Users },
  { id: 'marketplace', label: 'Marketplace', path: '/hub/marketplace', icon: ShoppingCart },
  { id: 'linguistic-assets', label: 'Linguistic assets', path: '/hub/linguistic-assets', icon: Type },
  { id: 'integrations', label: 'Integrations', path: '/hub/integrations', icon: Link2 },
  { id: 'reports', label: 'Reports', path: '/hub/reports', icon: RefreshCw },
  { id: 'team', label: 'Team', path: '/hub/team', icon: Users2 },
  { id: 'settings', label: 'Settings', path: '/hub/settings', icon: Settings },
]

export const workSubNavItems: WorkSubNavItem[] = [
  { id: 'region', label: 'Region', path: '/work/region', icon: Globe },
  { id: 'jobs', label: 'Jobs', path: '/work/jobs', icon: Tag },
  { id: 'payouts', label: 'Payouts', path: '/work/payouts', icon: Clock },
  { id: 'direct-messages', label: 'Direct messages', path: '/work/messages', icon: Send },
]

