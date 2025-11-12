import { useState, FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

interface ChatInputProps {
  placeholder?: string
  onSubmit: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ placeholder = "Ask me anything...", onSubmit, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--sc-primary,#a855f7)] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--sc-primary,#a855f7)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  )
}

