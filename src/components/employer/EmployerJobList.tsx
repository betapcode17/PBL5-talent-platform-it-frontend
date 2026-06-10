import { Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewJobModal from './ViewJobModal'

type EmployerJobListProps = {
  jobs: EmployerJobItem[]
}

const EmployerJobList = ({ jobs }: EmployerJobListProps) => {
  const { i18n, t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<EmployerJobItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs
    const term = searchTerm.toLowerCase()
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.category?.name.toLowerCase().includes(term) ||
        job.workLocation?.toLowerCase().includes(term) ||
        job.salary?.toLowerCase().includes(term)
    )
  }, [jobs, searchTerm])

  const handleViewJob = (job: EmployerJobItem) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  if (jobs.length === 0) {
    return (
      <EmployerEmptyState
        title={t('employer.jobs.empty.noJobsTitle')}
        description={t('employer.jobs.empty.noJobsDescription')}
      />
    )
  }

  return (
    <>
      <div className='min-w-0 space-y-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <Input
            placeholder={t('employer.jobs.filters.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='rounded-lg pl-10'
          />
        </div>

        {filteredJobs.length === 0 ? (
          <EmployerEmptyState
            title={t('employer.jobs.empty.noResultsTitle')}
            description={t('employer.jobs.empty.noResultsDescription')}
          />
        ) : (
          <>
            <div className='grid min-w-0 gap-4 lg:hidden'>
              {filteredJobs.map((job) => (
                <article key={job.id} className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-white/5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='break-words font-semibold text-slate-950 dark:text-white'>{job.title}</p>
                      <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>{job.jobType?.job_type || '-'}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                    </span>
                  </div>

                  <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.category')}</p>
                      <p className='mt-1 break-words text-sm text-slate-700 dark:text-slate-300'>{job.category?.name || '-'}</p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.location')}</p>
                      <p className='mt-1 break-words text-sm text-slate-700 dark:text-slate-300'>{job.workLocation || '-'}</p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.salary')}</p>
                      <p className='mt-1 break-words text-sm font-medium text-violet-700 dark:text-violet-300'>{job.salary || '-'}</p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.applicants')}</p>
                      <span className='mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700'>
                        {job.applicantCount}
                      </span>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.updated')}</p>
                      <p className='mt-1 text-sm text-slate-700 dark:text-slate-300'>
                        {new Date(job.updatedDate).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-4 w-full rounded-lg'
                    onClick={() => handleViewJob(job)}
                  >
                    <Eye className='h-4 w-4' />
                    {t('employer.actions.view')}
                  </Button>
                </article>
              ))}
            </div>

            <div className='hidden max-w-full overflow-x-auto rounded-2xl lg:block'>
              <table className='min-w-[62rem] w-full'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-white/5'>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.jobTitle')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.category')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.location')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.salary')}</th>
                    <th className='px-4 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.applicants')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.status')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.updated')}</th>
                    <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.jobs.table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className='border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-white/8 dark:hover:bg-white/5'>
                      <td className='max-w-[16rem] px-4 py-4'>
                        <p className='truncate font-semibold text-slate-950 dark:text-white'>{job.title}</p>
                        <p className='mt-1 truncate text-xs text-slate-500 dark:text-slate-400'>{job.jobType?.job_type}</p>
                      </td>
                      <td className='max-w-[12rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{job.category?.name || '-'}</td>
                      <td className='max-w-[13rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{job.workLocation || '-'}</td>
                      <td className='px-4 py-4'>
                        <span className='text-sm font-medium text-violet-700 dark:text-violet-300'>{job.salary || '-'}</span>
                      </td>
                      <td className='px-4 py-4 text-center'>
                        <span className='inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700'>
                          {job.applicantCount}
                        </span>
                      </td>
                      <td className='px-4 py-4'>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                        </span>
                      </td>
                      <td className='px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>
                        {new Date(job.updatedDate).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <Button variant='outline' size='sm' className='rounded-lg' onClick={() => handleViewJob(job)}>
                          <Eye className='h-4 w-4' />
                          {t('employer.actions.view')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedJob && <ViewJobModal job={selectedJob} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

export default EmployerJobList
