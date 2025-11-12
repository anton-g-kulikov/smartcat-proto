import { Plus, Search } from 'lucide-react'
import type { Chat } from '@/types/chats'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
}

export function ChatSidebar({ chats, activeChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  return (
    <div className="w-[280px] bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Chats</h2>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors",
                activeChatId === chat.id
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <p className="text-sm truncate">{chat.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--sc-primary,#a855f7)] text-white hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search</span>
        </button>
      </div>
    </div>
  )
}

