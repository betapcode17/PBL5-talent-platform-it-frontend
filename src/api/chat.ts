// chat api
import type { ChatDetail, ChatMessage, ChatSummary, CreateChatRequest, SendMessageRequest } from '@/@types/chat'
import axiosInstance from './axiosInstance'

export const createChatApi = async (data: CreateChatRequest): Promise<ChatSummary> => {
  const res = await axiosInstance.post<ChatSummary>('/chat', data)
  return res.data
}
export const getChatDetailApi = async (chatId: number): Promise<ChatDetail> => {
  const res = await axiosInstance.get<ChatDetail>(`/chat/${chatId}`)
  return res.data
}
export const getMyChatApi = async (): Promise<ChatSummary[]> => {
  const res = await axiosInstance.get<ChatSummary[]>('/chat/me')
  return res.data
}

export const sendMessageApi = async (data: SendMessageRequest): Promise<ChatMessage> => {
  const res = await axiosInstance.post<ChatMessage>('/message', data)
  return res.data
}

export const getMessagesApi = async (
  chatId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> => {
  const res = await axiosInstance.get<ChatMessage[]>('/message', {
    params: { chatId, limit, offset }
  })
  return res.data
}

// Backward compatibility for existing imports
export const SendMessageApi = sendMessageApi
