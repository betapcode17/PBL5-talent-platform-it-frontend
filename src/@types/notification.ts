export type NotificationRole = 'ADMIN' | 'SEEKER' | 'EMPLOYEE'

export type NotificationType =
  | 'USER_REGISTERED'
  | 'EMPLOYER_REGISTRATION_SUBMITTED'
  | 'EMPLOYER_REGISTRATION_APPROVED'
  | 'EMPLOYER_REGISTRATION_REJECTED'
  | 'JOB_CREATED'
  | 'JOB_REVIEW_REQUIRED'
  | 'REPORT_SUBMITTED'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'CV_VIEWED'
  | 'JOB_RECOMMENDED'
  | 'COMPANY_REPLIED'
  | 'JOB_BOOKMARKED'
  | 'JOB_APPROVED'
  | 'JOB_REJECTED'
  | 'SEEKER_MESSAGE'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_RESCHEDULED'
  | 'INTERVIEW_CANCELLED'
  | 'INTERVIEW_COMPLETED'
  | 'JOB_EXPIRING'

export interface NotificationItem {
  id: number
  title: string
  message: string
  type: NotificationType
  role: NotificationRole
  receiverId: number
  senderId: number | null
  dedupeKey?: string | null
  isRead: boolean
  readAt: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface NotificationListResponse {
  items: NotificationItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface NotificationUnreadCountResponse {
  unreadCount: number
}
