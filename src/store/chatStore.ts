import type { ChatCompany, ChatDetail, ChatMessage } from '@/@types/chat'
import { createChatApi, getChatDetailApi, getMessagesApi, getMyChatApi, sendMessageApi } from '@/api/chat'
import { addToCache, getCachedMessages } from '@/utils/messageCache'
import { create } from 'zustand'

type SidebarCompany = ChatCompany & {
  chat_id: number
  seeker_id?: number
  seeker_name?: string
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
  isWebSocketConnected: boolean

  // Actions
  setActiveChatCompany: (id: number | null) => Promise<void>
  getChatCompanies: () => Promise<void>
  getChatDetail: (chatId: number) => Promise<void>
  getChatMessages: (chatId: number, limit?: number, offset?: number) => Promise<void>
  sendChatMessages: (message: string) => Promise<void>
  createChatCompany: (payload: CreateChatPayload) => Promise<number | null>
  addMessageReceived: (message: ChatMessage) => void
  joinChatRoom: (chatId: number) => void
  leaveChatRoom: (chatId: number) => void
  setWebSocketConnected: (connected: boolean) => void
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
  isWebSocketConnected: false,
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
        chatCompanies: companies.map((company) => {
          // Get the latest message based on sent_at timestamp
          let latestMessage: string | undefined
          if (company.Message && company.Message.length > 0) {
            const sortedMessages = [...company.Message].sort(
              (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
            )
            latestMessage = sortedMessages[0]?.content
          }

          return {
            chat_id: company.chat_id,
            company_id: company.company_id,
            seeker_id: company.Seeker?.seeker_id,
            company_name: company.Company?.company_name || `Company #${company.company_id}`,
            seeker_name: company.Seeker?.User?.full_name,
            company_email: company.Company?.company_email,
            company_image: company.Company?.company_image,
            last_message_at: company.last_message_at,
            last_message: latestMessage
          }
        })
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
      console.log('Chat Detail: ', detail)

      set({ activeChatDetail: detail })
    } catch (err) {
      console.error('getChatDetail error:', err)
      set({ error: 'Failed to load chat detail' })
    } finally {
      set({ isLoadingChatDetail: false })
    }
  },

  getChatMessages: async (chatId: number, limit = 50, offset = 0) => {
    set({ isLoadingChatMessages: true, error: null })

    try {
      // Load from cache first for quick display
      const cachedMessages = getCachedMessages(chatId)
      if (cachedMessages.length > 0) {
        console.log('[Store] Loaded from cache:', cachedMessages.length, 'messages')
        // Sort ascending by sent_at for display
        set({
          chatMessages: cachedMessages.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime())
        })
      }

      // Then fetch full data from API
      const chatMessages = await getMessagesApi(chatId, limit, offset)
      console.log('[Store] Loaded from API:', chatMessages.length, 'messages')

      set({
        chatMessages: chatMessages.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()),
        activeChatCompaniesId: chatId,
        pendingChatCompaniesId: null
      })
    } catch (err) {
      console.error('getChatMessages error:', err)
      set({ error: 'Failed to load messages' })
    } finally {
      set({ isLoadingChatMessages: false })
    }
  },
  sendChatMessages: async (message: string) => {
    const { activeChatCompaniesId, isSending } = get()

    const content = message.trim()
    if (!content) return

    if (!activeChatCompaniesId) {
      set({ error: 'Please select a conversation first.' })
      return
    }

    if (isSending) return

    set({
      isSending: true,
      error: null
    })

    try {
      // Send message via API - will be received back via WebSocket broadcast
      await sendMessageApi({
        chatId: activeChatCompaniesId,
        content
      })
      // Message will appear via WebSocket listener (addMessageReceived)
      console.log('[Store] Message sent, awaiting WebSocket broadcast...')
    } catch (err) {
      console.error('sendChatMessages error:', err)
      set({
        error: 'Failed to send message. Please try again.'
      })
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

  addMessageReceived: (message: ChatMessage) => {
    set((state) => {
      const chatId = message.chat_id

      // Save to cache
      addToCache(chatId, message)

      // Always update sidebar with last message (regardless of active chat)
      const updatedChatCompanies = state.chatCompanies.map((item) =>
        item.chat_id === chatId
          ? {
              ...item,
              last_message_at: message.sent_at,
              last_message: message.content
            }
          : item
      )

      // Only add to chatMessages if it's the active chat
      if (chatId && chatId === state.activeChatCompaniesId) {
        // Check for duplicates
        const isDuplicate = state.chatMessages.some((m) => m.message_id === message.message_id)
        if (isDuplicate) {
          return { chatCompanies: updatedChatCompanies }
        }

        return {
          chatMessages: [...state.chatMessages, message],
          chatCompanies: updatedChatCompanies
        }
      }

      // Even if not active chat, update sidebar
      return { chatCompanies: updatedChatCompanies }
    })
  },

  joinChatRoom: (chatId: number) => {
    console.log('Joining chat room via WebSocket:', chatId)
    // WebSocket join akan được xử lý ở hook useChatWebSocket
  },

  leaveChatRoom: (chatId: number) => {
    console.log('Leaving chat room via WebSocket:', chatId)
    // WebSocket leave sẽ được xử lý ở hook useChatWebSocket
  },

  setWebSocketConnected: (connected: boolean) => {
    set({ isWebSocketConnected: connected })
  },

  clearError: () => set({ error: null })
}))
