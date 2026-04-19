import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useChatWebSocket } from './useChatWebSocket'
import type { ChatMessage } from '@/@types/chat'

export const useChat = () => {
  const { user, isAuthenticated } = useAuthStore()
  const userId = user?.id ?? null

  // Use selectors explicitly to ensure React sees updates
  const chatCompanies = useChatStore((state) => state.chatCompanies)
  const activeChatCompaniesId = useChatStore((state) => state.activeChatCompaniesId)
  const pendingChatCompaniesId = useChatStore((state) => state.pendingChatCompaniesId)
  const activeChatDetail = useChatStore((state) => state.activeChatDetail)
  const chatMessages = useChatStore((state) => state.chatMessages)
  const isLoadingChatCompanies = useChatStore((state) => state.isLoadingChatCompanies)
  const isLoadingChatMessages = useChatStore((state) => state.isLoadingChatMessages)
  const isLoadingChatDetail = useChatStore((state) => state.isLoadingChatDetail)
  const isSending = useChatStore((state) => state.isSending)
  const error = useChatStore((state) => state.error)
  const isWebSocketConnected = useChatStore((state) => state.isWebSocketConnected)

  const setActiveChatCompany = useChatStore((state) => state.setActiveChatCompany)
  const getChatCompanies = useChatStore((state) => state.getChatCompanies)
  const getChatDetail = useChatStore((state) => state.getChatDetail)
  const getChatMessages = useChatStore((state) => state.getChatMessages)
  const sendChatMessages = useChatStore((state) => state.sendChatMessages)
  const createChatCompany = useChatStore((state) => state.createChatCompany)
  const addMessageReceived = useChatStore((state) => state.addMessageReceived)
  const joinChatRoom = useChatStore((state) => state.joinChatRoom)
  const leaveChatRoom = useChatStore((state) => state.leaveChatRoom)
  const clearError = useChatStore((state) => state.clearError)

  // Debug: log everything returned from Zustand
  useEffect(() => {
    // Apenas uma verificação, sem logs excessivos
    if (chatMessages?.length > 0) {
      console.log('[useChat] Messages count:', chatMessages.length)
    }
  }, [chatMessages?.length])

  // Setup WebSocket and handle real-time messages
  const onMessageReceived = useCallback(
    (message: ChatMessage) => {
      addMessageReceived(message)
    },
    [addMessageReceived]
  )

  const { joinChat, leaveChat } = useChatWebSocket(onMessageReceived, undefined, undefined)

  // Load chat sidebar when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    getChatCompanies()
  }, [isAuthenticated, getChatCompanies])

  // Auto-select first chat after list load
  useEffect(() => {
    if (!isAuthenticated) return
    if (activeChatCompaniesId !== null) return
    if (chatCompanies.length === 0) return

    void setActiveChatCompany(chatCompanies[0].chat_id)
  }, [isAuthenticated, activeChatCompaniesId, chatCompanies, setActiveChatCompany])

  // Join/Leave chat room via WebSocket when active chat changes
  useEffect(() => {
    if (!activeChatCompaniesId) {
      return
    }

    joinChat(activeChatCompaniesId)
    joinChatRoom(activeChatCompaniesId)

    return () => {
      if (activeChatCompaniesId) {
        leaveChat(activeChatCompaniesId)
        leaveChatRoom(activeChatCompaniesId)
      }
    }
  }, [activeChatCompaniesId, joinChat, leaveChat, joinChatRoom, leaveChatRoom])

  const handleSelectChat = useCallback(
    async (chatId: number) => {
      await setActiveChatCompany(chatId)
    },
    [setActiveChatCompany]
  )

  const handleSendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim()
      if (!trimmed || isSending) return
      await sendChatMessages(trimmed)
    },
    [isSending, sendChatMessages]
  )

  const handleCreateChat = async (companyId: number) => {
    if (!userId) return null

    return createChatCompany({
      companyId,
      seekerId: userId
    })
  }

  const refreshActiveChat = useCallback(async () => {
    if (!activeChatCompaniesId) return
    await Promise.all([getChatDetail(activeChatCompaniesId), getChatMessages(activeChatCompaniesId)])
  }, [activeChatCompaniesId, getChatDetail, getChatMessages])

  return {
    user,
    isAuthenticated,
    chatCompanies,
    activeChatCompaniesId,
    pendingChatCompaniesId,
    activeChatDetail,
    chatMessages,
    isLoadingChatCompanies,
    isLoadingChatMessages,
    isLoadingChatDetail,
    isSending,
    error,
    isWebSocketConnected,
    setActiveChatCompany,
    getChatCompanies,
    getChatDetail,
    getChatMessages,
    clearError,
    handleSelectChat,
    handleSendMessage,
    handleCreateChat,
    refreshActiveChat
  }
}
