export type Message = {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // ISO date string
  feedback?: 'helpful' | 'not-helpful' | null
}

export type Chat = {
  id: string
  title: string // First user message or generated title
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  messages: Message[]
  active?: boolean
}

export type ChatHistoryItem = {
  id: string
  title: string
  preview: string // Truncated first message or response
  updatedAt: string
  active?: boolean
}

