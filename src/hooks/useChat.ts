import { useEffect, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'

export const useChat = () => {
  const { user } = useAuthStore()
  const {
    conversations,
    activeConversationId,
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
  } = useChatStore()

  useEffect(() => {
    if (user) {
      getConversations()
    }
  }, [user, getConversations])

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
