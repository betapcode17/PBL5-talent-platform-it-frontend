import type { LucideIcon } from 'lucide-react'

export type AdminTheme = 'dark' | 'light'

export type AdminStatTone = 'users' | 'jobs' | 'applications' | 'rating'

export interface AdminStatCardData {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  comparison: string
  tone: AdminStatTone
  sparkline: number[]
}

export interface AdminChartPoint {
  label: string
  users: number
  jobs: number
  applications: number
}

export interface AdminRecentUser {
  id: string
  name: string
  email: string
  initials: string
  role: 'Developer' | 'Designer' | 'Manager' | 'HR'
  status: 'Active' | 'Offline'
  joined: string
}

export interface AdminDistributionItem {
  label: string
  value: number
  amount: string
  color: string
}

export interface AdminIndustryItem {
  id: string
  name: string
  value: number
  icon: LucideIcon
}

export interface AdminUserListItem {
  id: number
  email: string
  fullName?: string | null
  phone?: string | null
  gender?: string | null
  userImage?: string | null
  role: 'ADMIN' | 'SEEKER' | 'EMPLOYEE'
  isActive: boolean
  registrationDate: string
  employee?: {
    id: number
    role: string
    joinedDate?: string | null
    company: {
      id: number
      name: string
      isActive: boolean
    }
  } | null
  seeker?: {
    id: number
    fileCv?: string | null
    createdDate: string
  } | null
}

export interface AdminCompanyListItem {
  id: number
  name: string
  description?: string | null
  type?: string | null
  industry?: string | null
  establishmentDate?: string | null
  size?: string | null
  country?: string | null
  city?: string | null
  websiteUrl?: string | null
  email?: string | null
  image?: string | null
  coverImage?: string | null
  isActive: boolean
  createdDate: string
  totalEmployees: number
  totalJobs: number
  totalFollowers: number
}

export interface AdminJobListItem {
  id: number
  title: string
  name: string
  description?: string | null
  salary?: string | null
  level?: string | null
  experience?: string | null
  education?: string | null
  numberOfHires?: number | null
  deadline?: string | null
  workLocation?: string | null
  workType?: string | null
  applicationsCount: number
  isActive: boolean
  createdDate: string
  updatedDate: string
  company: {
    id: number
    name: string
    email?: string | null
    image?: string | null
    industry?: string | null
    city?: string | null
  }
  category: {
    id: number
    name: string
  }
  jobType: {
    id: number
    name: string
  }
  createdBy?: {
    id: number
    name?: string | null
    email?: string | null
  } | null
}

export interface AdminPaginatedResponse {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminEmployerRegistrationRequestListItem {
  id: number
  fullName: string
  email: string
  phone: string
  role: string
  joinedDate?: string | null
  companyName: string
  companyAddress: string
  companyWebsiteUrl?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNote?: string | null
  generatedLoginEmail?: string | null
  approvedAt?: string | null
  rejectedAt?: string | null
  createdDate: string
  updatedDate: string
  companyId?: number | null
  createdUserId?: number | null
}

export interface AdminEmployerRegistrationStatusCounts {
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface AdminEmployerRegistrationRoleCount {
  role: string
  count: number
}
