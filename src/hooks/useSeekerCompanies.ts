import { useQuery } from '@tanstack/react-query'

import type { Company } from '@/@types/company'
import { getMyApplicationsApi, type MyApplicationItem } from '@/api/applications'
import { getMyFollowedCompaniesApi } from '@/api/follow'

export type AppliedJobSummary = {
  applicationId: number
  jobId: number
  title: string
  salary?: string | null
  workLocation?: string | null
  workType?: string | null
  categoryName?: string | null
  jobTypeName?: string | null
  appliedDate: string
  updatedDate: string
  status: string
  currentStage?: string | null
}

export type SeekerCompanyCollectionItem = {
  company: Company
  primaryDate: string
  secondaryValue: string
  badge: string
  badgeTone: 'violet' | 'emerald'
  jobsCount: number
  sortDate: string
  appliedJobs?: AppliedJobSummary[]
}

type CompanySource = {
  company_id: number
  company_name: string
  company_image?: string | null
  cover_image?: string | null
  company_industry?: string | null
  company_size?: string | null
  country?: string | null
  city?: string | null
  key_skills?: string | null
  company_type?: string | null
  company_website_url?: string | null
  is_active?: boolean
  created_date?: string
}

const toCompany = (
  source: CompanySource,
  fallbackDate: string
): Company => ({
  company_id: source.company_id,
  company_name: source.company_name,
  company_image: source.company_image ?? undefined,
  cover_image: source.cover_image ?? undefined,
  company_industry: source.company_industry ?? undefined,
  company_size: source.company_size ?? undefined,
  country: source.country ?? undefined,
  city: source.city ?? undefined,
  key_skills: source.key_skills ?? undefined,
  company_type: source.company_type ?? undefined,
  company_website_url: source.company_website_url ?? undefined,
  is_active: source.is_active ?? true,
  created_date: source.created_date ?? fallbackDate
})

export const useAppliedCompanies = () =>
  useQuery({
    queryKey: ['seeker', 'applied-companies'],
    queryFn: async (): Promise<SeekerCompanyCollectionItem[]> => {
      const response = await getMyApplicationsApi({ page: 1, limit: 100 })
      const companyMap = new Map<number, { company: Company; applications: MyApplicationItem[] }>()

      response.applications.forEach((application) => {
        const company = toCompany(application.job.company, application.appliedDate)
        const current = companyMap.get(company.company_id)

        if (!current) {
          companyMap.set(company.company_id, {
            company,
            applications: [application]
          })
          return
        }

        current.applications.push(application)
      })

      return [...companyMap.values()]
        .map(({ company, applications }) => {
          const latestApplication = [...applications].sort(
            (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
          )[0]
          const appliedJobs = [...applications]
            .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
            .map((application): AppliedJobSummary => toAppliedJobSummary(application))

          return {
            company,
            primaryDate: latestApplication.appliedDate,
            secondaryValue: String(applications.length),
            badge: latestApplication.status,
            badgeTone: 'violet' as const,
            jobsCount: applications.length,
            sortDate: latestApplication.appliedDate,
            appliedJobs
          }
        })
        .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
    }
  })

export const useSavedCompanies = () =>
  useQuery({
    queryKey: ['seeker', 'saved-companies'],
    queryFn: async (): Promise<SeekerCompanyCollectionItem[]> => {
      const response = await getMyFollowedCompaniesApi()

      return response
        .map((item) => ({
          company: toCompany(item.Company, item.followed_date),
          primaryDate: item.followed_date,
          secondaryValue: item.Company.is_active ? 'ACTIVE' : 'INACTIVE',
          badge: 'FOLLOWED',
          badgeTone: 'emerald' as const,
          jobsCount: 0,
          sortDate: item.followed_date
        }))
        .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
    }
  })

const toAppliedJobSummary = (application: MyApplicationItem): AppliedJobSummary => ({
  applicationId: application.id,
  jobId: application.job.id,
  title: application.job.title || application.job.name,
  salary: application.job.salary,
  workLocation: application.job.workLocation,
  workType: application.job.workType || application.job.jobType?.job_type,
  categoryName: application.job.category?.name,
  jobTypeName: application.job.jobType?.job_type,
  appliedDate: application.appliedDate,
  updatedDate: application.updatedDate,
  status: application.status,
  currentStage: application.currentStage
})
