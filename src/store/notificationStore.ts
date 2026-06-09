import { create } from 'zustand'
import type { NotificationItem } from '@/@types/notification'
import {
  deleteNotificationApi,
  getNotificationsApi,
  isNotificationsApiUnavailable,
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi
} from '@/api/notificationApi'

type NotificationState = {
  items: NotificationItem[]
  unreadCount: number
  isLoading: boolean
  isDropdownOpen: boolean
  isAvailable: boolean
  error: string | null
  hasLoaded: boolean
  activeTab: 'all' | 'unread'
  setDropdownOpen: (open: boolean) => void
  setActiveTab: (tab: 'all' | 'unread') => Promise<void>
  fetchNotifications: (tab?: 'all' | 'unread') => Promise<void>
  fetchUnreadCount: () => Promise<void>
  bootstrap: () => Promise<void>
  prependNotification: (item: NotificationItem) => void
  applyReadUpdate: (item: NotificationItem) => void
  applyAllRead: () => void
  applyDeleted: (notificationId: number) => void
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  removeNotification: (notificationId: number) => Promise<void>
  reset: () => void
}

const upsertNotification = (items: NotificationItem[], next: NotificationItem) => {
  const withoutExisting = items.filter((item) => {
    if (item.id === next.id) {
      return false
    }

    if (next.dedupeKey && item.dedupeKey && item.dedupeKey === next.dedupeKey && item.type === next.type) {
      return false
    }

    return true
  })
  return [next, ...withoutExisting].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,
  isDropdownOpen: false,
  isAvailable: true,
  error: null,
  hasLoaded: false,
  activeTab: 'unread',

  setDropdownOpen: (open) => set({ isDropdownOpen: open }),
  setActiveTab: async (tab) => {
    set({ activeTab: tab })
    await get().fetchNotifications(tab)
  },

  fetchNotifications: async (tab) => {
    const nextTab = tab ?? get().activeTab
    set({ isLoading: true, error: null })
    try {
      const data = await getNotificationsApi({
        page: 1,
        limit: 10,
        isRead: nextTab === 'unread' ? false : undefined
      })
      set({ items: data.items, isLoading: false, hasLoaded: true, isAvailable: true })
    } catch (error) {
      if (isNotificationsApiUnavailable()) {
        set({
          items: [],
          unreadCount: 0,
          isLoading: false,
          hasLoaded: true,
          isAvailable: false,
          error: null
        })
        return
      }

      set({ isLoading: false, error: error instanceof Error ? error.message : 'Khong tai duoc notifications' })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await getUnreadNotificationCountApi()
      set({ unreadCount: data.unreadCount, isAvailable: true })
    } catch {
      if (isNotificationsApiUnavailable()) {
        set({ unreadCount: 0, isAvailable: false })
        return
      }

      set({ unreadCount: 0 })
    }
  },

  bootstrap: async () => {
    if (isNotificationsApiUnavailable()) {
      set({
        items: [],
        unreadCount: 0,
        isLoading: false,
        hasLoaded: true,
        isAvailable: false,
        error: null
      })
      return
    }

    await Promise.all([get().fetchNotifications(), get().fetchUnreadCount()])
  },

  prependNotification: (item) =>
    set((state) => ({
      items:
        state.activeTab === 'unread'
          ? item.isRead
            ? state.items
            : upsertNotification(state.items, item)
          : upsertNotification(state.items, item),
      unreadCount: item.isRead ? state.unreadCount : state.unreadCount + 1
    })),

  applyReadUpdate: (item) =>
    set((state) => ({
      items:
        state.activeTab === 'unread'
          ? state.items.filter((current) => current.id !== item.id)
          : state.items.map((current) => (current.id === item.id ? item : current)),
      unreadCount: Math.max(
        0,
        item.isRead && state.items.find((current) => current.id === item.id && !current.isRead)
          ? state.unreadCount - 1
          : state.unreadCount
      )
    })),

  applyAllRead: () =>
    set((state) => ({
      items: state.activeTab === 'unread' ? [] : state.items.map((item) => ({ ...item, isRead: true })),
      unreadCount: 0
    })),

  applyDeleted: (notificationId) =>
    set((state) => {
      const deletedItem = state.items.find((item) => item.id === notificationId)
      return {
        items: state.items.filter((item) => item.id !== notificationId),
        unreadCount: deletedItem && !deletedItem.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      }
    }),

  markAsRead: async (notificationId) => {
    const existing = get().items.find((item) => item.id === notificationId)
    if (existing?.isRead) return
    const updated = await markNotificationAsReadApi(notificationId)
    get().applyReadUpdate(updated)
  },

  markAllAsRead: async () => {
    await markAllNotificationsAsReadApi()
    get().applyAllRead()
  },

  removeNotification: async (notificationId) => {
    await deleteNotificationApi(notificationId)
    get().applyDeleted(notificationId)
  },

  reset: () =>
    set({
      items: [],
      unreadCount: 0,
      isLoading: false,
      isDropdownOpen: false,
      isAvailable: true,
      error: null,
      hasLoaded: false,
      activeTab: 'unread'
    })
}))
