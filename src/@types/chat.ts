export interface CreateChatRequest {
  seeker_id: number
  company_id: number
}

export interface SendMessageRequest {
  chatId: number
  content: string
}

export interface ChatMessage {
  chat_id: any
  message_id: number
  content: string
  sent_at: string
  sender_type: 'SEEKER' | 'EMPLOYEE'
  sender_id: number
  is_read: boolean
}

export interface ChatCompany {
  company_id: number
  company_name: string
  company_email?: string
  company_image?: string
}

export interface ChatSummary {
  chat_id: number
  seeker_id: number
  company_id: number
  created_date: string
  last_message_at: string | null
  Company?: ChatCompany
  Seeker?: {
    seeker_id: number
    User?: {
      user_id: number
      full_name: string
    }
  }
  Message?: Array<Pick<ChatMessage, 'message_id' | 'content' | 'sent_at' | 'sender_type'>>
}

export interface ChatDetail extends ChatSummary {
  Seeker?: {
    seeker_id: number
    User?: {
      user_id: number
      full_name: string
    }
  }
  Company: ChatCompany
  Message: ChatMessage[]
}
