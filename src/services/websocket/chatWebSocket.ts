import { io, Socket } from 'socket.io-client'
import type { ChatMessage } from '@/@types/chat'

interface SocketResponse {
  success?: boolean
  message?: string
  data?: unknown
  error?: string | null
}

class ChatWebSocketService {
  private socket: Socket | null = null
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private listeners: Map<string, Set<Function>> = new Map()

  /**
   * Kết nối đến WebSocket server
   * @param serverUrl - URL của WebSocket server
   * @param token - JWT token để authenticate
   */
  connect(serverUrl: string, token: string) {
    if (this.socket?.connected) {
      console.log('[WebSocket] Already connected')
      return
    }

    try {
      console.log('[WebSocket] Attempting to connect to:', serverUrl)
      console.log('[WebSocket] Token provided:', token ? `✓ (length: ${token.length})` : '✗ NO TOKEN')

      this.socket = io(serverUrl, {
        auth: {
          token
        },
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 20000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling']
      })

      this.setupEventListeners()
      console.log('[WebSocket] Socket instance created')
    } catch (err) {
      console.error('[WebSocket] Connection error:', err)
    }
  }

  /**
   * Setup các event listeners cho socket
   */
  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected - Socket ID:', this.socket?.id)
      console.log('[WebSocket] Transport:', this.socket?.io?.engine?.transport?.name ?? 'unknown')
      this.emit('connected', null)
    })

    this.socket.on('disconnect', (reason: string) => {
      console.log('[WebSocket] Disconnected')
      console.log('[WebSocket] Reason:', reason)
      this.emit('disconnected', null)
    })

    this.socket.on('reconnect_attempt', (attempt: number) => {
      console.log(`[WebSocket] Reconnect attempt ${attempt}...`)
    })

    this.socket.on('error', (error: unknown) => {
      console.error('[WebSocket]   Socket Error:', error)
      this.emit('error', error)
    })

    this.socket.on('connect_error', (error: unknown) => {
      console.error('[WebSocket] Connection Error:')
      console.error('  Type:', typeof error)
      console.error('  Error:', error)
      if (error instanceof Error) {
        console.error('  Message:', error.message)
        console.error('  Stack:', error.stack)
      } else if (typeof error === 'object' && error !== null) {
        console.error('  Details:', JSON.stringify(error, null, 2))
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('[WebSocket] Connection Error:', errorMessage)
    })

    // Chat events
    this.socket.on('message:new', (message: ChatMessage) => {
      console.log('[EVENT] message:new received:\n', JSON.stringify(message, null, 2))
      this.emit('message:new', message)
    })

    this.socket.on('message:updated', (message: ChatMessage) => {
      console.log('[EVENT] message:updated:', message)
      this.emit('message:updated', message)
    })

    this.socket.on('chat:typing', (data: { chatId: number; userId: number; typing: boolean }) => {
      console.log('[EVENT] chat:typing:', data)
      this.emit('chat:typing', data)
    })

    this.socket.on('chat:online', (data: { chatId: number; isOnline: boolean }) => {
      console.log('[EVENT] chat:online:', data)
      this.emit('chat:online', data)
    })
  }

  /**
   * Emit event cho subscribers
   */
  private emit(eventName: string, data: unknown) {
    const callbacks = this.listeners.get(eventName)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data)
        } catch (err) {
          console.error(`Error in listener for ${eventName}:`, err)
        }
      })
    }
  }

  /**
   * Subscribe tới event
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(eventName: string, callback: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set())
    }
    this.listeners.get(eventName)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventName)?.delete(callback)
    }
  }

  /**
   * Lắng nghe duy nhất một lần
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  once(eventName: string, callback: Function) {
    const unsubscribe = this.on(eventName, (data: unknown) => {
      callback(data)
      unsubscribe()
    })
    return unsubscribe
  }

  /**
   * Join một room chat
   */
  joinChat(chatId: number, userId: number, userRole: 'SEEKER' | 'EMPLOYEE') {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot join chat')
      return
    }

    this.socket.emit('chat:join', { chatId, userId, userRole }, (response: SocketResponse) => {
      console.log('[WebSocket] Joined chat room:', chatId, response)
    })
  }

  /**
   * Leave một room chat
   */
  leaveChat(chatId: number) {
    if (!this.socket?.connected) return

    this.socket.emit('chat:leave', { chatId }, (response: SocketResponse) => {
      console.log('[WebSocket] Left chat room:', chatId, response)
    })
  }

  /**
   * Gửi tin nhắn thông qua WebSocket
   */
  sendMessage(chatId: number, content: string) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot send message')
      return
    }

    this.socket.emit('message:send', { chatId, content }, (response: SocketResponse) => {
      console.log('[WebSocket] Message sent:', response)
    })
  }

  /**
   * Gửi typing indicator
   */
  sendTyping(chatId: number, isTyping: boolean) {
    if (!this.socket?.connected) return

    this.socket.emit('chat:typing', { chatId, isTyping })
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: number) {
    if (!this.socket?.connected) return

    this.socket.emit('message:read', { messageId })
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
      console.log('WebSocket disconnected')
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | null {
    return this.socket?.id ?? null
  }
}

// Export singleton instance
export const chatWebSocket = new ChatWebSocketService()
