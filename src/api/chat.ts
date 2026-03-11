import axiosInstance from './axiosInstance'

import type { ChatMessage, Conversation, SendMessageRequest, SendMessageResponse } from '@/@types/chat'

export const sendMessageApi = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
  const res = await axiosInstance.post('/chat/send', data)
  return res.data
}

export const getConversationsApi = async (): Promise<Conversation[]> => {
  const res = await axiosInstance.get('/chat/conversation')
  return res.data
}

export const getMessagesApi = async (conversationId: number): Promise<ChatMessage[]> => {
  const res = await axiosInstance.get(`/chat/conversation/${conversationId}/message`)
  return res.data
}

export const deleteConversationApi = async (conversationId: number): Promise<void> => {
  await axiosInstance.delete(`/chat/conversation/${conversationId}`)
}

export const createConversationApi = async (): Promise<Conversation> => {
  const res = await axiosInstance.post('/chat/conversation')
  return res.data
}
