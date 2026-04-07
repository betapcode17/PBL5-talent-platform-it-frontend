import type { ChatCompany, ChatDetail, ChatMessage } from '@/@types/chat'
import { createChatApi, getChatDetailApi, getMessagesApi, getMyChatApi, sendMessageApi } from '@/api/chat'
import { create } from 'zustand'

type SidebarCompany = ChatCompany & {
  chat_id: number
  last_message_at: string | null
  last_message?: string
}

type CreateChatPayload = {
  companyId: number
  seekerId: number
}

interface ChatState {
  // State
  chatCompanies: SidebarCompany[]
  activeChatCompaniesId: number | null
  pendingChatCompaniesId: number | null
  activeChatDetail: ChatDetail | null
  chatMessages: ChatMessage[]
  isLoadingChatCompanies: boolean
  isLoadingChatMessages: boolean
  isLoadingChatDetail: boolean
  isSending: boolean
  error: string | null
  messagePollingInterval: NodeJS.Timeout | null

  // Actions
  setActiveChatCompany: (id: number | null) => Promise<void>
  getChatCompanies: () => Promise<void>
  getChatDetail: (chatId: number) => Promise<void>
  getChatMessages: (chatId: number, limit?: number, offset?: number) => Promise<void>
  sendChatMessages: (message: string) => Promise<void>
  createChatCompany: (payload: CreateChatPayload) => Promise<number | null>
  startMessagePolling: (chatId: number, interval?: number) => void
  stopMessagePolling: () => void
  clearError: () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  // initial state
  chatCompanies: [],
  activeChatCompaniesId: null,
  pendingChatCompaniesId: null,
  activeChatDetail: null,
  chatMessages: [],
  isLoadingChatCompanies: false,
  isLoadingChatMessages: false,
  isLoadingChatDetail: false,
  isSending: false,
  error: null,
  messagePollingInterval: null,
  // actions
  setActiveChatCompany: async (id) => {
    const { activeChatCompaniesId, pendingChatCompaniesId } = get()

    if (id === null) {
      set({
        activeChatCompaniesId: null,
        pendingChatCompaniesId: null,
        activeChatDetail: null,
        chatMessages: [],
        error: null
      })
      return
    }

    if (id === activeChatCompaniesId || id === pendingChatCompaniesId) {
      return
    }

    set({ pendingChatCompaniesId: id, error: null })

    try {
      await Promise.all([get().getChatDetail(id), get().getChatMessages(id)])
      set({ activeChatCompaniesId: id, pendingChatCompaniesId: null })
    } catch (err) {
      console.error('setActiveChatCompany error:', err)
      set({ error: 'Failed to load messages', pendingChatCompaniesId: null })
    }
  },

  getChatCompanies: async () => {
    set({ isLoadingChatCompanies: true, error: null })

    try {
      const chatSummaries = await getMyChatApi()
      const companies = Array.isArray(chatSummaries) ? chatSummaries : [chatSummaries]

      set({
        chatCompanies: companies.map((company) => ({
          chat_id: company.chat_id,
          company_id: company.company_id,
          company_name: company.Company?.company_name || `Company #${company.company_id}`,
          company_email: company.Company?.company_email,
          company_image: company.Company?.company_image,
          last_message_at: company.last_message_at,
          last_message: company.Message?.[0]?.content
        }))
      })
    } catch (err) {
      console.error('getChatCompanies error:', err)
      set({ error: 'Failed to load chat history' })
    } finally {
      set({ isLoadingChatCompanies: false })
    }
  },

  getChatDetail: async (chatId: number) => {
    set({ isLoadingChatDetail: true, error: null })

    try {
      const detail = await getChatDetailApi(chatId)
      set({ activeChatDetail: detail })
    } catch (err) {
      console.error('getChatDetail error:', err)
      set({ error: 'Failed to load chat detail' })
    } finally {
      set({ isLoadingChatDetail: false })
    }
  },

  getChatMessages: async (chatId: number, limit = 50, offset = 0, isPolling = false) => {
    if (!isPolling) {
      set({ isLoadingChatMessages: true, error: null })
    }

    try {
      // Gọi API lấy danh sách tin nhắn theo chatId
      const chatMessages = await getMessagesApi(chatId, limit, offset)
      set({ chatMessages, activeChatCompaniesId: chatId, pendingChatCompaniesId: null })
    } catch (err) {
      console.error('getChatMessages error:', err)
      if (!isPolling) {
        set({ error: 'Failed to load messages' })
      }
    } finally {
      if (!isPolling) {
        set({ isLoadingChatMessages: false })
      }
    }
  },
  sendChatMessages: async (message: string) => {
    const { activeChatCompaniesId, chatMessages, isSending } = get()

    const content = message.trim()
    if (!content) return

    if (!activeChatCompaniesId) {
      set({ error: 'Please select a conversation first.' })
      return
    }

    if (isSending) return

    const tempId = -Date.now()
    const optimisticMessage: ChatMessage = {
      message_id: tempId,
      content,
      sent_at: new Date().toISOString(),
      sender_type: 'SEEKER',
      sender_id: 0,
      is_read: true,
      employee_name: ''
    }

    set({
      isSending: true,
      error: null,
      chatMessages: [...chatMessages, optimisticMessage]
    })

    try {
      const sentMessage = await sendMessageApi({
        chatId: activeChatCompaniesId,
        content
      })

      set((state) => ({
        chatMessages: state.chatMessages.map((item) => (item.message_id === tempId ? sentMessage : item))
      }))

      set((state) => ({
        chatCompanies: state.chatCompanies.map((item) =>
          item.chat_id === activeChatCompaniesId
            ? {
                ...item,
                last_message_at: sentMessage.sent_at,
                last_message: sentMessage.content
              }
            : item
        )
      }))
    } catch (err) {
      console.error('sendChatMessages error:', err)
      set((state) => ({
        error: 'Failed to send message. Please try again.',
        chatMessages: state.chatMessages.filter((item) => item.message_id !== tempId)
      }))
    } finally {
      set({ isSending: false })
    }
  },

  createChatCompany: async ({ companyId, seekerId }) => {
    if (!companyId || !seekerId) {
      set({ error: 'companyId and seekerId are required to create a chat.' })
      return null
    }

    set({ error: null })

    try {
      const chat = await createChatApi({
        company_id: companyId,
        seeker_id: seekerId
      })

      await get().getChatCompanies()
      await get().setActiveChatCompany(chat.chat_id)

      return chat.chat_id
    } catch (err) {
      console.error('createChatCompany error:', err)
      set({ error: 'Failed to create chat conversation.' })
      return null
    }
  },

  startMessagePolling: (chatId: number, interval = 2000) => {
    const { messagePollingInterval, getChatMessages } = get()

    // Stop existing polling nếu có
    if (messagePollingInterval) {
      clearInterval(messagePollingInterval)
    }

    // Start new polling
    const newInterval = setInterval(() => {
      // Silently fetch new messages (không show loading)
      getChatMessages(chatId, 50, 0, true).catch((err) => {
        console.error('Polling messages error:', err)
      })
    }, interval)

    set({ messagePollingInterval: newInterval })
  },

  stopMessagePolling: () => {
    const { messagePollingInterval } = get()
    if (messagePollingInterval) {
      clearInterval(messagePollingInterval)
      set({ messagePollingInterval: null })
    }
  },

  clearError: () => set({ error: null })
}))
