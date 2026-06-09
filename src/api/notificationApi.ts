import axiosInstance from './axiosInstance'
import axios from 'axios'
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationUnreadCountResponse
} from '@/@types/notification'

type GetNotificationsParams = {
  page?: number
  limit?: number
  isRead?: boolean
  type?: string
}

let notificationsApiUnavailable = false

const markUnavailableIf404 = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    notificationsApiUnavailable = true
  }
}

export const isNotificationsApiUnavailable = () => notificationsApiUnavailable

export const getNotificationsApi = async (params: GetNotificationsParams = {}) => {
  if (notificationsApiUnavailable) {
    return {
      items: [],
      total: 0,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 0
    }
  }

  try {
    const { data } = await axiosInstance.get<NotificationListResponse>('/notifications', {
      params,
      skipErrorLog: true
    })
    return data
  } catch (error) {
    markUnavailableIf404(error)
    throw error
  }
}

export const getUnreadNotificationCountApi = async () => {
  if (notificationsApiUnavailable) {
    return { unreadCount: 0 }
  }

  try {
    const { data } = await axiosInstance.get<NotificationUnreadCountResponse>('/notifications/unread-count', {
      skipErrorLog: true
    })
    return data
  } catch (error) {
    markUnavailableIf404(error)
    throw error
  }
}

export const markNotificationAsReadApi = async (notificationId: number) => {
  if (notificationsApiUnavailable) {
    throw new Error('Notifications API unavailable')
  }
  const { data } = await axiosInstance.patch<NotificationItem>(`/notifications/${notificationId}/read`)
  return data
}

export const markAllNotificationsAsReadApi = async () => {
  if (notificationsApiUnavailable) {
    return { success: true }
  }
  const { data } = await axiosInstance.patch<{ success: boolean }>('/notifications/read-all')
  return data
}

export const deleteNotificationApi = async (notificationId: number) => {
  if (notificationsApiUnavailable) {
    return { success: true }
  }
  const { data } = await axiosInstance.delete<{ success: boolean }>(`/notifications/${notificationId}`)
  return data
}
