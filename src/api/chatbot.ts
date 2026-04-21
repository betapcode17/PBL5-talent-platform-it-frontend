import { aiAxiosInstance } from './axiosInstance'

import type { ChatMessage, Conversation, SendMessageRequest } from '@/@types/chatbot'

export const sendMessageApi = async (data: SendMessageRequest) => {
  const formData = new FormData()

  formData.append('message', data.message)

  if (data.conversationId) {
    formData.append('conversationId', String(data.conversationId))
  }

  if (data.attachments?.length) {
    data.attachments.forEach((file) => {
      if (file instanceof File) {
        formData.append('attachments', file)
      }
    })
  }
  console.log(formData)
  const res = await aiAxiosInstance.post('/chatbot/message', formData)
  console.log(res.data)
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
