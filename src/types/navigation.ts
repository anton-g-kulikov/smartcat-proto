import { LucideIcon } from 'lucide-react'

export type Organization = {
  id: string
  name: string
  initial: string // e.g., "S" for Smartcat
  avatarColor: string // e.g., "pink" or hex color
  workspacesCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  current?: boolean
}

export type Workspace = {
  id: string
  name: string
  initial: string // e.g., "AK" for Anton Kulikov
  avatarColor: string // e.g., "purple" or hex color
  membersCount: number
  plan: 'Enterprise' | 'Team' | 'Forever Free'
  region: string
  organizationId: string
  current?: boolean
}

export type User = {
  id: string
  name: string
  email: string
  initial: string // e.g., "AK"
  avatarColor: string // e.g., "purple" or hex color
  role: 'Administrator' | 'Member' | 'Viewer'
  region: string
  currency: string
  systemLanguage: string
}

export type NavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  active?: boolean
  hasSubNav?: boolean // For Hub
}

export type HubSubNavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
}

export type WorkSubNavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
}

