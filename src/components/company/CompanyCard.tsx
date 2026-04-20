import type { Company } from '@/@types/company'
import { getCompanyJobs } from '@/api/jobs'
import { Card } from '@/components/ui/card'
import { useFollow } from '@/hooks/useFollow'
import type { CompanyJobSummary } from '@/types/job-detail'
import axios from 'axios'
import { ArrowUpRight, BriefcaseBusiness, Building2, MapPin, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  company: Company
}

export const CompanyCard = ({ company }: Props) => {
  const navigate = useNavigate()
  const { followerCount } = useFollow(company.company_id)
  const [jobs, setJobs] = useState<CompanyJobSummary[]>([])
  const [showMoreJobs, setShowMoreJobs] = useState(false)
  const [isJobsLoading, setIsJobsLoading] = useState(false)

  const skills = useMemo(
    () =>
      company.key_skills
        ?.split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
        .slice(0, 4) ?? [],
    [company.key_skills]
  )

  useEffect(() => {
    setShowMoreJobs(false)
  }, [company.company_id])

  useEffect(() => {
    const controller = new AbortController()

    setIsJobsLoading(true)

    getCompanyJobs(
      company.company_id,
      {
        page: 1,
        limit: showMoreJobs ? 4 : 2,
        active: true
      },
      controller.signal
    )
      .then((response) => {
        setJobs(response.jobs ?? [])
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error('Error loading company jobs:', error)
          setJobs([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsJobsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [company.company_id, showMoreJobs])

  return (
    <Card
      onClick={() => navigate(`/companies/${company.company_id}`)}
      className='group overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]'
    >
      <div className='flex flex-col gap-6 lg:flex-row'>
        <div className='flex shrink-0 justify-center lg:block'>
          <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-[26px] border border-violet-100 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white shadow-[0_16px_36px_rgba(124,58,237,0.12)] sm:h-32 sm:w-32'>
            <img src={company.company_image} alt={company.company_name} className='h-full w-full object-cover' />
          </div>
        </div>

        <div className='min-w-0 flex-1 space-y-5'>
          <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
            <div className='min-w-0 space-y-3'>
              <div className='flex flex-wrap gap-2'>
                {company.company_industry ? (
                  <span className='rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700'>
                    {company.company_industry}
                  </span>
                ) : null}
                {company.company_type ? (
                  <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    {company.company_type}
                  </span>
                ) : null}
              </div>

              <div className='space-y-2'>
                <h3 className='line-clamp-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 transition group-hover:text-violet-700'>
                  {company.company_name}
                </h3>
                <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500'>
                  {company.city ? (
                    <span className='inline-flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-violet-500' />
                      {company.city}
                    </span>
                  ) : null}
                  {company.company_size ? (
                    <span className='inline-flex items-center gap-2'>
                      <Users className='h-4 w-4 text-violet-500' />
                      {company.company_size}
                    </span>
                  ) : null}
                  <span className='inline-flex items-center gap-2'>
                    <Building2 className='h-4 w-4 text-violet-500' />
                    {followerCount} người đang follow
                  </span>
                </div>
              </div>
            </div>

            <div className='flex shrink-0 flex-col items-start gap-2 xl:items-end'>
              <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Company Profile</p>
              <Link
                to={`/companies/${company.company_id}`}
                onClick={(e) => e.stopPropagation()}
                className='inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(124,58,237,0.24)] transition hover:bg-violet-700'
              >
                Xem công ty
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </div>
          </div>

          {skills.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill) => (
                <span
                  key={skill}
                  className='rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600'
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <div className='grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,1fr)]'>
            <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>
                  <BriefcaseBusiness className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Open Roles</p>
                  <p className='text-sm font-semibold text-slate-900'>Vị trí đang tuyển</p>
                </div>
              </div>

              {isJobsLoading ? (
                <div className='space-y-2'>
                  {Array.from({ length: showMoreJobs ? 4 : 2 }).map((_, index) => (
                    <div key={index} className='h-4 rounded-full bg-slate-200' />
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className='space-y-2.5'>
                  {jobs.map((job) => (
                    <p key={job.id} className='line-clamp-1 text-sm font-medium text-slate-700 transition group-hover:text-slate-900'>
                      {job.title}
                    </p>
                  ))}

                  {!showMoreJobs ? (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMoreJobs(true)
                      }}
                      className='pt-1 text-sm font-semibold text-violet-700 transition hover:text-violet-800 hover:underline'
                    >
                      Xem thêm
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className='text-sm text-slate-500'>Chưa có công việc đang tuyển.</p>
              )}
            </div>

            <div className='rounded-[24px] border border-slate-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Quick View</p>
              <div className='mt-3 space-y-3 text-sm text-slate-600'>
                <div className='flex items-start justify-between gap-4'>
                  <span className='text-slate-400'>Lĩnh vực</span>
                  <span className='text-right font-medium text-slate-900'>{company.company_industry || '-'}</span>
                </div>
                <div className='flex items-start justify-between gap-4'>
                  <span className='text-slate-400'>Quy mô</span>
                  <span className='text-right font-medium text-slate-900'>{company.company_size || '-'}</span>
                </div>
                <div className='flex items-start justify-between gap-4'>
                  <span className='text-slate-400'>Thành phố</span>
                  <span className='text-right font-medium text-slate-900'>{company.city || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
