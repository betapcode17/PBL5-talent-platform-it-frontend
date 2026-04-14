// chatStore.ts
// useChat.ts
import { create } from 'zustand'

import type { ChatMessage, Conversation } from '@/@types/chatbot'

import {
  sendMessageApi,
  getConversationsApi,
  getMessagesApi,
  deleteConversationApi,
  createConversationApi
} from '@/api/chatbot'

interface ChatState {
  // state
  conversations: Conversation[]
  activeConversationId: number | null
  pendingConversationId: number | null
  messages: ChatMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isSending: boolean
  isWidgetOpen: boolean
  isFullScreen: boolean
  error: string | null

  // Action
  setWidgetOpen: (open: boolean) => void
  toggleWidget: () => void
  setFullScreen: (full: boolean) => void
  setActiveConversation: (id: number | null) => Promise<void>
  getConversations: () => Promise<void>
  getMessages: (conversationId: number) => Promise<void>
  sendMessage: (message: string, files?: File[], conversationId?: number) => Promise<void>
  createConversation: () => Promise<void>
  deleteConversation: (id: number) => Promise<void>
  clearError: () => void
}

export const useChatbotStore = create<ChatState>()((set, get) => ({
  // initial state
  conversations: [],
  activeConversationId: null,
  pendingConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  isWidgetOpen: false,
  isFullScreen: false,
  error: null,

  setWidgetOpen: (open) => set({ isWidgetOpen: open }),
  toggleWidget: () => set((s) => ({ isWidgetOpen: !s.isWidgetOpen })),
  setFullScreen: (full) => set({ isFullScreen: full }),

  setActiveConversation: async (id) => {
    const { activeConversationId, pendingConversationId } = get()

    if (id === null) {
      set({ activeConversationId: null, pendingConversationId: null, messages: [], error: null })
      return
    }

    if (id === activeConversationId || id === pendingConversationId) {
      return
    }

    set({ pendingConversationId: id, isLoadingMessages: true, error: null })

    try {
      const messages = await getMessagesApi(id)
      set({ activeConversationId: id, pendingConversationId: null, messages })
    } catch {
      set({ error: 'Failed to load messages', pendingConversationId: null })
    } finally {
      set({ isLoadingMessages: false })
    }
  },

  getConversations: async () => {
    set({ isLoadingConversations: true, error: null })
    try {
      const conversations = await getConversationsApi()
      set({ conversations: Array.isArray(conversations) ? conversations : [conversations] })
    } catch {
      set({ error: 'Failed to load chat history' })
    } finally {
      set({ isLoadingConversations: false })
    }
  },
  getMessages: async (conversationId) => {
    set({ isLoadingMessages: true, error: null })
    try {
      const messages = await getMessagesApi(conversationId)
      set({ messages, activeConversationId: conversationId, pendingConversationId: null })
    } catch {
      set({ error: 'Failed to load messages' })
    } finally {
      set({ isLoadingMessages: false })
    }
  },
  sendMessage: async (message: string, files?: File[], conversationId?: number) => {
    const { activeConversationId, messages } = get()
    const targetConvId = conversationId ?? activeConversationId

    const tempId = -Date.now()
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: message,
      attachments: files ? files.map((f) => ({ name: f.name, size: f.size, type: f.type })) : undefined,
      createdAt: new Date(),
      conversationId: targetConvId ?? 0
    }

    set({ messages: [...messages, tempUserMsg], isSending: true, error: null })

    try {
      const res = await sendMessageApi({
        conversationId: targetConvId ?? undefined,
        message,
        attachments: files
      })

      // Nếu chưa có conversation → set active
      if (!activeConversationId) {
        set({ activeConversationId: res.conversationId })
        get().getConversations() // refresh sidebar
      }

      // Thay temp message + thêm assistant response
      set((s) => ({
        messages: [
          ...s.messages.filter((m) => m.id !== tempId),
          { ...tempUserMsg, conversationId: res.conversationId },
          res.message
        ]
      }))
    } catch {
      set({ error: 'Failed to send message. Please try again.' })
    } finally {
      set({ isSending: false })
    }
  },
  createConversation: async () => {
    try {
      const conversation = await createConversationApi()
      set((s) => ({
        activeConversationId: conversation.id,
        pendingConversationId: null,
        messages: [],
        conversations: [conversation, ...s.conversations]
      }))
    } catch {
      set({ error: 'Failed to create new conversation' })
    }
  },

  deleteConversation: async (id) => {
    try {
      await deleteConversationApi(id)
      set((s) => ({
        conversations: s.conversations.filter((c) => c.id !== id),
        ...(s.activeConversationId === id || s.pendingConversationId === id
          ? { activeConversationId: null, pendingConversationId: null, messages: [] }
          : {})
      }))
    } catch {
      set({ error: 'Failed to delete conversation' })
    }
  },

  clearError: () => set({ error: null })
}))
