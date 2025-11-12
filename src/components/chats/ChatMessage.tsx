import type { Message } from '@/types/chats'
import { FeedbackButtons } from './FeedbackButtons'

interface ChatMessageProps {
  message: Message
  onFeedback?: (messageId: string, feedback: 'helpful' | 'not-helpful' | null) => void
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-2.5 rounded-lg bg-[var(--sc-primary,#a855f7)] text-white">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg p-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          {onFeedback && (
            <FeedbackButtons messageId={message.id} onFeedback={onFeedback} />
          )}
        </div>
      </div>
    </div>
  )
}

