import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type FeedbackType = 'helpful' | 'not-helpful' | null

interface FeedbackButtonsProps {
  messageId: string
  onFeedback?: (messageId: string, feedback: FeedbackType) => void
}

export function FeedbackButtons({ messageId, onFeedback }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null)

  const handleFeedback = (type: FeedbackType) => {
    setFeedback(type)
    onFeedback?.(messageId, type)
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={() => handleFeedback(feedback === 'helpful' ? null : 'helpful')}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          feedback === 'helpful'
            ? "bg-gray-100 text-gray-900"
            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
        )}
        aria-label="Mark as helpful"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>Helpful</span>
      </button>
      <button
        onClick={() => handleFeedback(feedback === 'not-helpful' ? null : 'not-helpful')}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          feedback === 'not-helpful'
            ? "bg-gray-100 text-gray-900"
            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
        )}
        aria-label="Mark as not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>Not helpful</span>
      </button>
    </div>
  )
}

