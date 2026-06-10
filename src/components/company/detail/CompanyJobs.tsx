import { getCompanyJobs } from '@/api/jobs'
import type { CompanyJobSummary } from '@/types/job-detail'
import axios from 'axios'
import { ArrowUpRight, BriefcaseBusiness, Clock3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const CompanyJobs = ({ companyId }: { companyId: number }) => {
  const [jobs, setJobs] = useState<CompanyJobSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)

    getCompanyJobs(companyId, { page: 1, limit: 6, active: true }, controller.signal)
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
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [companyId])

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Open Roles</p>
          <h2 className='mt-2 text-xl font-semibold text-slate-950'>Việc làm đang tuyển</h2>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='animate-pulse rounded-[22px] border border-slate-200 p-4'>
              <div className='h-5 w-2/3 rounded-full bg-slate-200' />
              <div className='mt-3 h-4 w-1/2 rounded-full bg-slate-200' />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center'>
          <p className='text-sm font-medium text-slate-700'>Công ty hiện chưa có vị trí active.</p>
          <p className='mt-2 text-sm text-slate-500'>Danh sách việc làm sẽ hiển thị tại đây ngay khi có tin tuyển dụng mới.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className='group block rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_14px_32px_rgba(124,58,237,0.10)]'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <h3 className='line-clamp-2 text-base font-semibold text-slate-900 transition group-hover:text-violet-700'>
                    {job.title}
                  </h3>
                  <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500'>
                    {job.jobType?.job_type ? (
                      <span className='inline-flex items-center gap-1.5'>
                        <BriefcaseBusiness className='h-3.5 w-3.5 text-violet-500' />
                        {job.jobType.job_type}
                      </span>
                    ) : null}
                    {job.createdDate ? (
                      <span className='inline-flex items-center gap-1.5'>
                        <Clock3 className='h-3.5 w-3.5 text-violet-500' />
                        {new Date(job.createdDate).toLocaleDateString('vi-VN')}
                      </span>
                    ) : null}
                  </div>
                </div>

                <ArrowUpRight className='h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-600' />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
