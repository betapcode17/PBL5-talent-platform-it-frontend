import { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatbotStore } from '@/store/chatbotStore'
import { useAuthStore } from '@/store/authStore'

export const useChatbot = () => {
  const { user } = useAuthStore()
  const { pathname } = useLocation()
  const {
    conversations,
    activeConversationId,
    pendingConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    deletingConversationId,
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
    renameConversation,
    clearError
  } = useChatbotStore()

  useEffect(() => {
    if (pathname === '/chatbot' || isWidgetOpen) {
      getConversations()
    }
  }, [pathname, isWidgetOpen, getConversations])

  const handleSendMessage = useCallback(
    async (message: string, files?: File[]) => {
      const trimmed = message.trim()
      if (!trimmed || isSending) return
      await sendMessage(trimmed, files)
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
    deletingConversationId,
    isWidgetOpen,
    isFullScreen,
    error,
    setWidgetOpen,
    toggleWidget,
    setFullScreen,
    setActiveConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    clearError,
    handleSendMessage,
    handleSuggestionClick
  }
}
