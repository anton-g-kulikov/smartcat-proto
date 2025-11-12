import { Globe, DollarSign, Type, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar } from './Avatar'
import { mockUser } from '@/mocks/navigation'

export function UserMenu() {
  const user = mockUser

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="User menu"
        >
          <Avatar initial={user.initial} color={user.avatarColor} size="md" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="right">
        <div className="p-4 space-y-4">
          {/* User Information Section */}
          <div className="flex items-start gap-3">
            <Avatar initial={user.initial} color={user.avatarColor} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-1 border-t pt-4">
            <button className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>Region</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{user.region}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{user.currency}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-500" />
                <span>System language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{user.systemLanguage}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Account settings</span>
            </button>
          </div>

          {/* Action Section */}
          <div className="border-t pt-2">
            <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              <LogOut className="w-4 h-4 text-gray-500" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

