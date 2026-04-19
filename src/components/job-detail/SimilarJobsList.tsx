import { ArrowUpRight, BriefcaseBusiness, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CompanyJobSummary } from '@/types/job-detail'
import { formatRelativeDate } from '@/utils/jobDetail'

type SimilarJobsListProps = {
  jobs: CompanyJobSummary[]
}

const SimilarJobsList = ({ jobs }: SimilarJobsListProps) => {
  if (jobs.length === 0) {
    return null
  }

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-sm font-semibold uppercase tracking-[0.24em] text-slate-400'>Similar Roles</h2>
      </div>

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
                <p className='mt-1 text-sm text-slate-500'>
                  {job.company?.company_name ?? 'Hiring company'}
                  {job.salary ? ` · ${job.salary}` : ''}
                </p>

                <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500'>
                  {job.jobType?.job_type ? (
                    <span className='inline-flex items-center gap-1.5'>
                      <BriefcaseBusiness className='h-3.5 w-3.5 text-violet-500' />
                      {job.jobType.job_type}
                    </span>
                  ) : null}
                  {job.createdDate ? (
                    <span className='inline-flex items-center gap-1.5'>
                      <Clock3 className='h-3.5 w-3.5 text-violet-500' />
                      {formatRelativeDate(job.createdDate)}
                    </span>
                  ) : null}
                </div>
              </div>

              <ArrowUpRight className='h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-600' />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SimilarJobsList
