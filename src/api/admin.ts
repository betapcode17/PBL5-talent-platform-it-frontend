import { Bot, BriefcaseBusiness, Code2, GraduationCap, Landmark, Palette } from 'lucide-react'
import axiosInstance from '@/api/axiosInstance'
import type {
  AdminChartPoint,
  AdminCompanyListItem,
  AdminDistributionItem,
  AdminEmployerRegistrationRequestListItem,
  AdminEmployerRegistrationRoleCount,
  AdminEmployerRegistrationStatusCounts,
  AdminIndustryItem,
  AdminJobListItem,
  AdminRecentUser,
  AdminStatCardData,
  AdminUserListItem
} from '@/types/admin'

type AdminStatisticsResponse = {
  totalUsers: number
  totalJobs: number
  totalApps: number
  avgRating: number
  charts: {
    daily: AdminChartPoint[]
  }
}

type AdminUsersResponse = {
  users: AdminUserListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type AdminCompaniesResponse = {
  companies: AdminCompanyListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type AdminJobsResponse = {
  jobs: AdminJobListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type AdminEmployerRegistrationRequestsResponse = {
  requests: AdminEmployerRegistrationRequestListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  statusCounts: AdminEmployerRegistrationStatusCounts
  roleCounts: AdminEmployerRegistrationRoleCount[]
}

type AdminUsersQuery = {
  page?: number
  limit?: number
  search?: string
  role?: 'ADMIN' | 'SEEKER' | 'EMPLOYEE'
  active?: boolean
}

type AdminCompaniesQuery = {
  page?: number
  limit?: number
  search?: string
  industry?: string
  active?: boolean
}

type AdminJobsQuery = {
  page?: number
  limit?: number
  search?: string
  industry?: string
  level?: string
  categoryId?: number
  jobTypeId?: number
  minSalary?: string
  maxSalary?: string
  deadlineFrom?: string
  deadlineTo?: string
  active?: boolean
  sortBy?: 'createdDate' | 'deadline' | 'salary' | 'numberOfHires' | 'updatedDate'
  sortOrder?: 'asc' | 'desc'
}

type AdminEmployerRegistrationRequestsQuery = {
  page?: number
  limit?: number
  search?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  role?: string
}

export type AdminDashboardData = {
  statCards: AdminStatCardData[]
  chartData: AdminChartPoint[]
  recentUsers: AdminRecentUser[]
  userDistribution: AdminDistributionItem[]
  topIndustries: AdminIndustryItem[]
}

const icons = [Code2, Bot, Landmark, GraduationCap, Palette, BriefcaseBusiness]

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

const roleFor = (role: AdminUsersResponse['users'][number]['role']): AdminRecentUser['role'] => {
  if (role === 'EMPLOYEE') return 'HR'
  if (role === 'ADMIN') return 'Manager'
  return 'Developer'
}

const buildSparkline = (
  data: AdminChartPoint[],
  key: keyof Pick<AdminChartPoint, 'users' | 'jobs' | 'applications'>
) => {
  const values = data.slice(-12).map((item) => item[key])
  return values.length > 1 ? values : [0, ...values, 0]
}

const buildDistribution = async (totalUsers: number): Promise<AdminDistributionItem[]> => {
  const [seekers, employers, admins] = await Promise.all([
    axiosInstance.get<AdminUsersResponse>('/admin/users', { params: { role: 'SEEKER', limit: 1 } }),
    axiosInstance.get<AdminUsersResponse>('/admin/users', { params: { role: 'EMPLOYEE', limit: 1 } }),
    axiosInstance.get<AdminUsersResponse>('/admin/users', { params: { role: 'ADMIN', limit: 1 } })
  ])

  const rows = [
    { label: 'Job Seekers', count: seekers.data.total, color: '#8b5cf6' },
    { label: 'Employers', count: employers.data.total, color: '#2f80ed' },
    { label: 'Admins', count: admins.data.total, color: '#44c37d' }
  ]

  return rows.map((item) => ({
    label: item.label,
    value: totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0,
    amount: formatNumber(item.count),
    color: item.color
  }))
}

const buildIndustries = (companies: AdminCompaniesResponse['companies']): AdminIndustryItem[] => {
  const counts = companies.reduce<Record<string, number>>((accumulator, company) => {
    const name = company.industry || 'Other'
    return {
      ...accumulator,
      [name]: (accumulator[name] ?? 0) + 1
    }
  }, {})
  const total = Math.max(1, companies.length)

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([name, count], index) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      value: Math.round((count / total) * 100),
      icon: icons[index % icons.length]
    }))
}

export const getAdminDashboardApi = async (): Promise<AdminDashboardData> => {
  const [statistics, users, companies] = await Promise.all([
    axiosInstance.get<AdminStatisticsResponse>('/admin/statistics', {
      params: { dailyDays: 7 }
    }),
    axiosInstance.get<AdminUsersResponse>('/admin/users', {
      params: { page: 1, limit: 5 }
    }),
    axiosInstance.get<AdminCompaniesResponse>('/admin/companies', {
      params: { page: 1, limit: 100 }
    })
  ])

  const chartData = statistics.data.charts.daily
  const userDistribution = await buildDistribution(statistics.data.totalUsers)

  return {
    statCards: [
      {
        id: 'total-users',
        label: 'Total Users',
        value: formatNumber(statistics.data.totalUsers),
        trend: 'Live',
        trendDirection: 'up',
        comparison: 'current total',
        tone: 'users',
        sparkline: buildSparkline(chartData, 'users')
      },
      {
        id: 'total-jobs',
        label: 'Total Jobs',
        value: formatNumber(statistics.data.totalJobs),
        trend: 'Live',
        trendDirection: 'up',
        comparison: 'current total',
        tone: 'jobs',
        sparkline: buildSparkline(chartData, 'jobs')
      },
      {
        id: 'total-applications',
        label: 'Total Applications',
        value: formatNumber(statistics.data.totalApps),
        trend: 'Live',
        trendDirection: 'up',
        comparison: 'current total',
        tone: 'applications',
        sparkline: buildSparkline(chartData, 'applications')
      },
      {
        id: 'avg-rating',
        label: 'Avg Rating',
        value: `${statistics.data.avgRating || 0} / 5`,
        trend: 'Live',
        trendDirection: 'up',
        comparison: 'interviews',
        tone: 'rating',
        sparkline: chartData.map((item) => item.applications)
      }
    ],
    chartData,
    recentUsers: users.data.users.map((user) => {
      const name = user.fullName || user.email

      return {
        id: String(user.id),
        name,
        email: user.email,
        initials: initialsFor(name),
        role: roleFor(user.role),
        status: user.isActive ? 'Active' : 'Offline',
        joined: new Date(user.registrationDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
    }),
    userDistribution,
    topIndustries: buildIndustries(companies.data.companies)
  }
}

export const getAdminUsersApi = async (params: AdminUsersQuery = {}) => {
  const response = await axiosInstance.get<AdminUsersResponse>('/admin/users', { params })
  return response.data
}

export const getAdminCompaniesApi = async (params: AdminCompaniesQuery = {}) => {
  const response = await axiosInstance.get<AdminCompaniesResponse>('/admin/companies', { params })
  return response.data
}

export const getAdminJobsApi = async (params: AdminJobsQuery = {}) => {
  const response = await axiosInstance.get<AdminJobsResponse>('/admin/jobs', { params })
  return response.data
}

export const toggleAdminUserStatusApi = async (userId: number, shouldActivate: boolean) => {
  const action = shouldActivate ? 'activate' : 'deactivate'
  const response = await axiosInstance.patch(`/admin/users/${userId}/${action}`)
  return response.data
}

export const toggleAdminCompanyStatusApi = async (companyId: number, shouldActivate: boolean) => {
  const action = shouldActivate ? 'activate' : 'deactivate'
  const response = await axiosInstance.patch(`/admin/companies/${companyId}/${action}`)
  return response.data
}

export const toggleAdminJobStatusApi = async (jobId: number, shouldActivate: boolean) => {
  const action = shouldActivate ? 'activate' : 'deactivate'
  const response = await axiosInstance.patch(`/admin/jobs/${jobId}/${action}`)
  return response.data
}

export const getAdminEmployerRegistrationRequestsApi = async (
  params: AdminEmployerRegistrationRequestsQuery = {}
) => {
  const response = await axiosInstance.get<AdminEmployerRegistrationRequestsResponse>(
    '/admin/employer-registration-requests',
    { params }
  )
  return response.data
}

export const approveAdminEmployerRegistrationRequestApi = async (requestId: number, note?: string) => {
  const response = await axiosInstance.patch(`/admin/employer-registration-requests/${requestId}/approve`, {
    note
  })
  return response.data
}

export const rejectAdminEmployerRegistrationRequestApi = async (requestId: number, note?: string) => {
  const response = await axiosInstance.patch(`/admin/employer-registration-requests/${requestId}/reject`, {
    note
  })
  return response.data
}
