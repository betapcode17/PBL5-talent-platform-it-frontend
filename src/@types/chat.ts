export interface ChatMessage {
  id: number
  conversationId: number
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface Conversation {
  id: number
  title: number
  lastMessage: string
  createdAt: Date
  updateAt: Date
}

export interface SendMessageRequest {
  conversationId?: string
  message: string
}

export interface SendMessageResponse {
  message: ChatMessage
  conversationId: string
}
