import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'

export const useChat = () => {
  const { user, isAuthenticated } = useAuthStore()
  const userId = user?.id ?? null

  const {
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
    setActiveChatCompany,
    getChatCompanies,
    getChatDetail,
    getChatMessages,
    sendChatMessages,
    createChatCompany,
    startMessagePolling,
    stopMessagePolling,
    clearError
  } = useChatStore()

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

  // Start polling when chat is active, stop when inactive
  useEffect(() => {
    if (!activeChatCompaniesId) {
      stopMessagePolling()
      return
    }

    // Start polling mỗi 2 giây
    startMessagePolling(activeChatCompaniesId, 2000)

    return () => {
      stopMessagePolling()
    }
  }, [activeChatCompaniesId, startMessagePolling, stopMessagePolling])

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
