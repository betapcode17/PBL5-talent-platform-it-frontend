import { useEffect } from 'react'
import { apiBaseUrl } from '@/api/axiosInstance'
import { notificationWebSocket } from '@/services/websocket/notificationWebSocket'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import type { NotificationItem } from '@/@types/notification'

export const useNotificationSocket = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const bootstrap = useNotificationStore((state) => state.bootstrap)
  const prependNotification = useNotificationStore((state) => state.prependNotification)
  const applyReadUpdate = useNotificationStore((state) => state.applyReadUpdate)
  const applyAllRead = useNotificationStore((state) => state.applyAllRead)
  const applyDeleted = useNotificationStore((state) => state.applyDeleted)
  const isAvailable = useNotificationStore((state) => state.isAvailable)
  const reset = useNotificationStore((state) => state.reset)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      notificationWebSocket.disconnect()
      reset()
      return
    }

    let disposed = false

    void (async () => {
      await bootstrap()

      if (disposed || !useNotificationStore.getState().isAvailable) {
        notificationWebSocket.disconnect()
        return
      }

      notificationWebSocket.connect(import.meta.env.VITE_WS_URL || apiBaseUrl, accessToken)
    })()

    const unsubscribers = [
      notificationWebSocket.on('notification:new', (payload: NotificationItem) => prependNotification(payload)),
      notificationWebSocket.on('notification:read', (payload: NotificationItem) => applyReadUpdate(payload)),
      notificationWebSocket.on('notification:all-read', () => applyAllRead()),
      notificationWebSocket.on('notification:deleted', (payload: { notificationId: number }) =>
        applyDeleted(payload.notificationId)
      ),
      notificationWebSocket.on('notification:unread-count', (payload: { unreadCount: number }) =>
        useNotificationStore.setState({ unreadCount: payload.unreadCount })
      )
    ]

    return () => {
      disposed = true
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      notificationWebSocket.disconnect()
    }
  }, [accessToken, applyAllRead, applyDeleted, applyReadUpdate, bootstrap, isAuthenticated, isAvailable, prependNotification, reset])
}
