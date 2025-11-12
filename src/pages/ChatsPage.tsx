import { useState, useEffect } from 'react'
import { useOutletContext, useParams, useNavigate } from 'react-router-dom'
import { ChatSidebar } from '@/components/chats/ChatSidebar'
import { ChatConversation } from '@/components/chats/ChatConversation'
import { mockChats, generateMockAIResponse } from '@/mocks/chats'
import type { Chat, Message } from '@/types/chats'

interface ChatsPageContext {
  chatsToggleRef: React.MutableRefObject<(() => void) | null>
}

export default function ChatsPage() {
  const { chatsToggleRef } = useOutletContext<ChatsPageContext>()
  const { chatId } = useParams<{ chatId?: string }>()
  const navigate = useNavigate()
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Use chatId from URL params, or null if not provided
  const activeChatId = chatId || null

  // Register toggle function with parent
  useEffect(() => {
    chatsToggleRef.current = () => setIsSidebarOpen(prev => !prev)
    return () => {
      chatsToggleRef.current = null
    }
  }, [chatsToggleRef])

  // Auto-select the first (most recent) chat if no chat is selected
  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      // Navigate to the first chat (most recent, top of the list)
      const firstChatId = chats[0].id
      navigate(`/chats/${firstChatId}`, { replace: true })
    }
  }, [activeChatId, chats, navigate])

  const activeChat = chats.find(c => c.id === activeChatId) || null

  const handleChatSelect = (selectedChatId: string) => {
    // Navigate to the selected chat
    navigate(`/chats/${selectedChatId}`)
    // Update active state in chats
    setChats(prevChats =>
      prevChats.map(chat => ({
        ...chat,
        active: chat.id === selectedChatId
      }))
    )
  }

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      active: true,
    }
    setChats(prevChats => {
      // Remove active from all chats
      const updatedChats = prevChats.map(chat => ({ ...chat, active: false }))
      return [newChat, ...updatedChats]
    })
    // Navigate to the new chat
    navigate(`/chats/${newChat.id}`)
  }

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) return

    setIsGenerating(true)

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      chatId: activeChatId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const updatedTitle = chat.messages.length === 0 
            ? content.length > 40 
              ? content.substring(0, 40) + '...'
              : content
            : chat.title
          
          return {
            ...chat,
            title: updatedTitle,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date().toISOString(),
          }
        }
        return chat
      })
    )

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateMockAIResponse(content)
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        chatId: activeChatId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }

      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, aiMessage],
              updatedAt: new Date().toISOString(),
            }
          }
          return chat
        })
      )

      setIsGenerating(false)
    }, 1500)
  }

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not-helpful' | null) => {
    setChats(prevChats =>
      prevChats.map(chat => ({
        ...chat,
        messages: chat.messages.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        ),
      }))
    )
  }

  return (
    <div className="flex h-full relative">
      {isSidebarOpen && (
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      )}
      {activeChatId ? (
        <div className="flex-1 flex flex-col min-w-0">
          <ChatConversation
            chat={activeChat}
            onSendMessage={handleSendMessage}
            onFeedback={handleFeedback}
            isGenerating={isGenerating}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0 items-center justify-center bg-white">
          <p className="text-gray-500">Select a chat from the sidebar to start a conversation</p>
        </div>
      )}
    </div>
  )
}

