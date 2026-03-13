import { useEffect, useCallback } from 'react'
import { useChatbotStore } from '@/store/chatbotStore'
import { useAuthStore } from '@/store/authStore'

export const useChatbot = () => {
  const { user } = useAuthStore()
  const {
    conversations,
    activeConversationId,
    pendingConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    isWidgetOpen,
    isFullScreen,
    error,
    setWidgetOpen,
    toggleWidget,
    setFullScreen,
    setActiveConversation,
    getConversations,
    sendMessage,
    createConversation,
    deleteConversation,
    clearError
  } = useChatbotStore()

  // Load conversations on mount (no auth required for chatbot API)
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // Reload conversation list whenever widget is opened
  useEffect(() => {
    if (isWidgetOpen) {
      getConversations()
    }
  }, [isWidgetOpen, getConversations])

  const handleSendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim()
      if (!trimmed || isSending) return
      await sendMessage(trimmed)
    },
    [isSending, sendMessage]
  )

  const handleSuggestionClick = useCallback(
    (question: string) => {
      handleSendMessage(question)
    },
    [handleSendMessage]
  )

  return {
    user,
    conversations,
    activeConversationId,
    pendingConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    isWidgetOpen,
    isFullScreen,
    error,
    setWidgetOpen,
    toggleWidget,
    setFullScreen,
    setActiveConversation,
    createConversation,
    deleteConversation,
    clearError,
    handleSendMessage,
    handleSuggestionClick
  }
}
