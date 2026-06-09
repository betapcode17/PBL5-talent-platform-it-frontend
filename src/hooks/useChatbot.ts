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
    streamStatus,
    deletingConversationId,
    isWidgetOpen,
    isFullScreen,
    chatMode,
    error,
    setWidgetOpen,
    toggleWidget,
    setFullScreen,
    setChatMode,
    setActiveConversation,
    getConversations,
    sendMessage,
    analyzeCv,
    analyzeCvAgainstJd,
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

  const handleCvUpload = useCallback(
    async (file: File, jdText?: string) => {
      if (isSending) return
      await analyzeCv(file, jdText)
    },
    [analyzeCv, isSending]
  )

  const handleCvJdMatch = useCallback(
    async (jdText: string) => {
      const trimmed = jdText.trim()
      if (!trimmed || isSending) return
      await analyzeCvAgainstJd(trimmed)
    },
    [analyzeCvAgainstJd, isSending]
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
    streamStatus,
    deletingConversationId,
    isWidgetOpen,
    isFullScreen,
    chatMode,
    error,
    setWidgetOpen,
    toggleWidget,
    setFullScreen,
    setChatMode,
    setActiveConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    clearError,
    handleSendMessage,
    handleSuggestionClick,
    handleCvUpload,
    handleCvJdMatch
  }
}
