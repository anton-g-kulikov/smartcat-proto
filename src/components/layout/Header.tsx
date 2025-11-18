import { useLocation } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { SmartwordsWidget } from './SmartwordsWidget'

export function Header() {
  const location = useLocation()
  
  // Determine if we should show breadcrumbs (not on home page)
  const showBreadcrumbs = location.pathname !== '/'
  
  // Show Smartwords widget on all pages except org management page
  const showSmartwordsWidget = location.pathname !== '/org/management'

  return (
    <header className="bg-[var(--sc-app-bg,#f7f7fb)] border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1">
          {showBreadcrumbs && <Breadcrumbs />}
        </div>
        {showSmartwordsWidget && (
          <div className="flex items-center">
            <SmartwordsWidget />
          </div>
        )}
      </div>
    </header>
  )
}

