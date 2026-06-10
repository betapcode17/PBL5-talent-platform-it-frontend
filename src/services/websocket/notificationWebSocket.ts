import { io, type Socket } from 'socket.io-client'

class NotificationWebSocketService {
  private socket: Socket | null = null
  private currentToken: string | null = null
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private listeners: Map<string, Set<Function>> = new Map()

  connect(serverUrl: string, token: string) {
    if (this.socket?.connected && this.currentToken === token) return

    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }

    this.socket = io(`${serverUrl}/notifications`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling']
    })
    this.currentToken = token

    this.socket.on('connect', () => this.emit('connect', null))
    this.socket.on('disconnect', () => this.emit('disconnect', null))
    this.socket.on('connect_error', (error) => this.emit('error', error))
    this.socket.on('notification:new', (payload) => this.emit('notification:new', payload))
    this.socket.on('notification:read', (payload) => this.emit('notification:read', payload))
    this.socket.on('notification:all-read', (payload) => this.emit('notification:all-read', payload))
    this.socket.on('notification:deleted', (payload) => this.emit('notification:deleted', payload))
    this.socket.on('notification:unread-count', (payload) => this.emit('notification:unread-count', payload))
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(eventName: string, callback: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set())
    }
    this.listeners.get(eventName)?.add(callback)

    return () => {
      this.listeners.get(eventName)?.delete(callback)
    }
  }

  private emit(eventName: string, payload: unknown) {
    const callbacks = this.listeners.get(eventName)
    callbacks?.forEach((callback) => callback(payload))
  }

  markAsRead(notificationId: number) {
    this.socket?.emit('notifications:mark-read', { notificationId })
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
    this.currentToken = null
    this.listeners.clear()
  }

  isConnected() {
    return this.socket?.connected ?? false
  }
}

export const notificationWebSocket = new NotificationWebSocketService()
