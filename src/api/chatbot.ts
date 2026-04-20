import { aiAxiosInstance } from './axiosInstance'

import type { ChatMessage, Conversation, SendMessageRequest, SendMessageResponse } from '@/@types/chatbot'

export const sendMessageApi = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
  // If there are attachments, use FormData
  if (data.attachments && data.attachments.length > 0) {
    const formData = new FormData()
    formData.append('message', data.message)
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId.toString())
    }
    data.attachments.forEach((file) => {
      formData.append('attachments', file)
    })
    const res = await aiAxiosInstance.post('/chatbot/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  }

  const res = await aiAxiosInstance.post('/chatbot/message', data)
  return res.data
}

export const getConversationsApi = async (): Promise<Conversation[]> => {
  const res = await aiAxiosInstance.get('/chatbot/conversation')
  return res.data
}

export const getMessagesApi = async (conversationId: string | number): Promise<ChatMessage[]> => {
  const res = await aiAxiosInstance.get(`/chatbot/conversation/${conversationId}/message`)
  return res.data
}

export const deleteConversationApi = async (conversationId: string | number): Promise<void> => {
  await aiAxiosInstance.delete(`/chatbot/conversation/${conversationId}`)
}

export const renameConversationApi = async (conversationId: string, newTitle: string) => {
  const res = await aiAxiosInstance.post('/chatbot/conversation/rename', {
    conversationId,
    newTitle
  })
  return res.data
}

export const createConversationApi = async (): Promise<Conversation> => {
  const res = await aiAxiosInstance.post('/chatbot/conversation')
  return res.data
}
