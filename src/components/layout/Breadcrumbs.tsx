import { useLocation, Link } from 'react-router-dom'
import { mockWorkspaces } from '@/mocks/orgManagement'

// Route to label mapping
const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/org': 'Organization',
  '/org/settings': 'Settings',
  '/org/management': 'Organization management',
  '/chats': 'Chats',
  '/hub': 'Hub',
  '/hub/projects': 'Projects',
  '/hub/drive': 'Drive',
  '/hub/smartwords': 'Smartwords',
  '/hub/orders': 'Orders',
  '/hub/payments': 'Payments',
  '/hub/clients': 'Clients',
  '/hub/marketplace': 'Marketplace',
  '/hub/linguistic-assets': 'Linguistic assets',
  '/hub/integrations': 'Integrations',
  '/hub/reports': 'Reports',
  '/hub/team': 'Team',
  '/hub/settings': 'Settings',
  '/work': 'Work',
  '/work/region': 'Region',
  '/work/jobs': 'Jobs',
  '/work/payouts': 'Payouts',
  '/work/messages': 'Direct messages',
  '/smartwords-usage-report': 'Smartwords Usage Report',
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathname = location.pathname

  // Build breadcrumb segments from the path
  const segments = pathname.split('/').filter(Boolean)
  
  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const label = routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    return {
      path,
      label,
      isLast: index === segments.length - 1,
    }
  })

  // If we're on a nested route like /chats/:chatId, handle it specially
  if (pathname.startsWith('/chats/') && pathname !== '/chats') {
    const chatId = segments[segments.length - 1]
    breadcrumbItems[breadcrumbItems.length - 1].label = `Chat ${chatId}`
  }

  // If we're on smartwords-usage-report/:workspaceId, show workspace name
  if (pathname.startsWith('/smartwords-usage-report/') && pathname !== '/smartwords-usage-report') {
    const workspaceId = segments[segments.length - 1]
    const workspace = mockWorkspaces.find(ws => ws.id === workspaceId && !ws.isPackageRow)
    if (workspace) {
      breadcrumbItems[breadcrumbItems.length - 1].label = workspace.name
    }
    // Set the parent breadcrumb to "Smartwords Usage Report"
    if (breadcrumbItems.length >= 2) {
      breadcrumbItems[breadcrumbItems.length - 2].label = 'Smartwords Usage Report'
    }
  }

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && <span className="mx-1">/</span>}
            {item.isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}


