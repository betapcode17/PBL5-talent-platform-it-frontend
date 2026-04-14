export interface FileAttachment {
  id?: string
  name: string
  size: number
  type: string
  url?: string
}

export interface ChatMessage {
  id?: number
  conversationId: number
  role: 'user' | 'assistant'
  content: string
  attachments?: FileAttachment[]
  createdAt: Date
}

export interface Conversation {
  id: number
  title: string
  lastMessage: string
  createdAt: Date
  updateAt: Date
}

export interface SendMessageRequest {
  conversationId?: number
  message: string
  attachments?: File[]
}

export interface SendMessageResponse {
  message: ChatMessage
  conversationId: number
}
