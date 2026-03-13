import { aiAxiosInstance } from './axiosInstance'

import type { ChatMessage, Conversation, SendMessageRequest, SendMessageResponse } from '@/@types/chatbot'

export const sendMessageApi = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
  const res = await aiAxiosInstance.post('/chatbot/message', data)
  return res.data
}

export const getConversationsApi = async (): Promise<Conversation[]> => {
  const res = await aiAxiosInstance.get('/chatbot/conversation')
  return res.data
}

export const getMessagesApi = async (conversationId: number): Promise<ChatMessage[]> => {
  const res = await aiAxiosInstance.get(`/chatbot/conversation/${conversationId}/message`)
  return res.data
}

export const deleteConversationApi = async (conversationId: number): Promise<void> => {
  await aiAxiosInstance.delete(`/chatbot/conversation/${conversationId}`)
}

export const createConversationApi = async (): Promise<Conversation> => {
  const res = await aiAxiosInstance.post('/chatbot/conversation')
  return res.data
}
