import { Link } from 'react-router-dom'
import { 
  Building2, MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLink {
  path: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const availablePages: PageLink[] = [
  {
    path: '/org/management',
    label: 'Organization Management',
    description: 'Manage Smartwords balance and workspace provisioning',
    icon: Building2,
  },
  {
    path: '/chats',
    label: 'Chats',
    description: 'Chat interface for conversations with Smartcat Agents',
    icon: MessageCircle,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Description Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Smartcat UI Prototype
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            This is a prototyping environment for Smartcat features. Explore the available pages below to see different aspects of the application in development.
          </p>
        </div>

        {/* Available Pages Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={cn(
                    'group flex items-start gap-4 p-6 rounded-lg border border-gray-200',
                    'bg-white hover:border-[var(--sc-primary)] hover:shadow-md',
                    'transition-all cursor-pointer'
                  )}
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[var(--sc-primary)]/10 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-[var(--sc-primary)] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                      {page.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {page.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
