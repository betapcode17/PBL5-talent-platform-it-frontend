import { useEffect, useCallback, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { chatWebSocket } from '@/services/websocket/chatWebSocket'
import type { ChatMessage } from '@/@types/chat'

export const useChatWebSocket = (
  onMessageReceived?: (message: ChatMessage) => void,
  onTyping?: (data: { chatId: number; userId: number; typing: boolean }) => void,
  onOnlineStatus?: (data: { chatId: number; isOnline: boolean }) => void
) => {
  const { user, isAuthenticated, accessToken } = useAuthStore()

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !accessToken) return

    // Kết nối đến WebSocket server
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000'
    chatWebSocket.connect(wsUrl, accessToken)

    return () => {}
  }, [isAuthenticated, user?.id, accessToken])

  // Subscribe tới message events
  useEffect(() => {
    if (!onMessageReceived) return

    console.log('[useChatWebSocket] Registering listener for message:new')
    const unsubscribe = chatWebSocket.on('message:new', (msg: any) => {
      console.log('[useChatWebSocket] Callback triggered for message:new', msg)
      onMessageReceived(msg)
    })
    return unsubscribe
  }, [onMessageReceived])

  // Subscribe tới typing events
  useEffect(() => {
    if (!onTyping) return

    const unsubscribe = chatWebSocket.on('chat:typing', onTyping)
    return unsubscribe
  }, [onTyping])

  // Subscribe tới online status events
  useEffect(() => {
    if (!onOnlineStatus) return

    const unsubscribe = chatWebSocket.on('chat:online', onOnlineStatus)
    return unsubscribe
  }, [onOnlineStatus])

  // Callback functions
  const joinChat = useCallback(
    (chatId: number) => {
      if (!user?.id || !user?.role) {
        console.warn('User info not available, cannot join chat')
        return
      }
      const userRole = (user.role === 'SEEKER' ? 'SEEKER' : 'EMPLOYEE') as 'SEEKER' | 'EMPLOYEE'
      chatWebSocket.joinChat(chatId, user.id, userRole)
    },
    [user?.id, user?.role]
  )

  const leaveChat = useCallback((chatId: number) => {
    chatWebSocket.leaveChat(chatId)
  }, [])

  const sendMessage = useCallback((chatId: number, content: string) => {
    chatWebSocket.sendMessage(chatId, content)
  }, [])

  const sendTyping = useCallback((chatId: number, isTyping: boolean) => {
    chatWebSocket.sendTyping(chatId, isTyping)
  }, [])

  const markAsRead = useCallback((messageId: number) => {
    chatWebSocket.markAsRead(messageId)
  }, [])

  const isConnected = useCallback(() => {
    return chatWebSocket.isConnected()
  }, [])

  return {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    markAsRead,
    isConnected,
    socket: chatWebSocket
  }
}

/**
 * useWebSocketConnection - Hook để track WebSocket connection status
 */
export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Set initial state
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsConnected(chatWebSocket.isConnected())

    const unsubscribe = chatWebSocket.on('connected', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    const unsubscribeDisconnect = chatWebSocket.on('disconnected', () => {
      console.log(' WebSocket disconnected')
      setIsConnected(false)
    })

    return () => {
      unsubscribe()
      unsubscribeDisconnect()
    }
  }, [])

  return isConnected
}

/**
 * Cleanup function - Call when app unmounts
 */
export const disconnectChatWebSocket = () => {
  chatWebSocket.disconnect()
}
