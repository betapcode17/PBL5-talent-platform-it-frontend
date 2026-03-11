// chatStore.ts
// useChat.ts
import { create } from 'zustand'

import type { ChatMessage, Conversation } from '@/@types/chat'

import {
  sendMessageApi,
  getConversationsApi,
  getMessagesApi,
  deleteConversationApi,
  createConversationApi
} from '@/api/chat'

interface ChatState {
  // state
  conversations: Conversation[]
  activeConversationId: number | null
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
  setActiveConversation: (id: number | null) => void
  getConversations: () => Promise<void>
  getMessages: (conversationId: number) => Promise<void>
  sendMessage: (message: string, conversationId?: number) => Promise<void>
  createConversation: () => Promise<void>
  deleteConversation: (id: number) => Promise<void>
  clearError: () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  // initial state
  conversations: [],
  activeConversationId: null,
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

  setActiveConversation: (id) => {
    set({ activeConversationId: id, messages: [] })
    if (id) get().getMessages(id)
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
      set({ messages })
    } catch {
      set({ error: 'Failed to load messages' })
    } finally {
      set({ isLoadingMessages: false })
    }
  },
  sendMessage: async (message: string, conversationId?: number) => {
    const { activeConversationId, messages } = get()
    const targetConvId = conversationId ?? activeConversationId

    const tempId = -Date.now()
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: message,
      createdAt: new Date(),
      conversationId: targetConvId ?? 0
    }

    set({ messages: [...messages, tempUserMsg], isSending: true, error: null })

    try {
      const res = await sendMessageApi({
        conversationId: targetConvId ?? undefined,
        message
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
        ...(s.activeConversationId === id ? { activeConversationId: null, messages: [] } : {})
      }))
    } catch {
      set({ error: 'Failed to delete conversation' })
    }
  },

  clearError: () => set({ error: null })
}))
