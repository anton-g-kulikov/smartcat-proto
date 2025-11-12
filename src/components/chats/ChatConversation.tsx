import { useEffect, useRef } from 'react'
import type { Chat } from '@/types/chats'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { mockInitialInstruction } from '@/mocks/chats'

interface ChatConversationProps {
  chat: Chat | null
  onSendMessage: (message: string) => void
  onFeedback?: (messageId: string, feedback: 'helpful' | 'not-helpful' | null) => void
  isGenerating?: boolean
}

export function ChatConversation({ chat, onSendMessage, onFeedback, isGenerating }: ChatConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages, isGenerating])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--sc-primary,#a855f7)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">SC</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Smartcat</h1>
            <p className="text-sm text-gray-500">I'm here to help</p>
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-4">
        {!chat || chat.messages.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-500 text-center">{mockInitialInstruction}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {chat.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onFeedback={onFeedback}
              />
            ))}
            {isGenerating && (
              <div className="flex justify-start mb-6">
                <div className="max-w-3xl">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200">
        <ChatInput
          onSubmit={onSendMessage}
          placeholder={chat?.messages.length === 0 ? "How do I translate PDFs?" : "Ask me anything..."}
          disabled={isGenerating}
        />
      </div>
    </div>
  )
}

