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
      <div className='-mt-2 min-w-0 space-y-5'>
        <div className='rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-300/14 dark:bg-slate-200/6'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              placeholder={t('employer.jobs.filters.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-sm shadow-none transition focus-visible:bg-white dark:border-slate-300/14 dark:bg-slate-950/20 dark:focus-visible:bg-slate-950/35'
            />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <EmployerEmptyState
            title={t('employer.jobs.empty.noResultsTitle')}
            description={t('employer.jobs.empty.noResultsDescription')}
          />
        ) : (
          <>
            <div className='grid max-h-[36rem] min-w-0 gap-4 overflow-y-auto pr-1 lg:hidden'>
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-slate-300/14 dark:bg-slate-200/7 dark:hover:border-violet-300/24'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='break-words font-semibold text-slate-950 dark:text-white'>{job.title}</p>
                      <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>
                        {job.jobType?.job_type || '-'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-100'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-200/10 dark:text-slate-200'
                      }`}
                    >
                      {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                    </span>
                  </div>

                  <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                        {t('employer.jobs.table.category')}
                      </p>
                      <p className='mt-1 break-words text-sm text-slate-700 dark:text-slate-300'>
                        {job.category?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                        {t('employer.jobs.table.location')}
                      </p>
                      <p className='mt-1 break-words text-sm text-slate-700 dark:text-slate-300'>
                        {job.workLocation || '-'}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                        {t('employer.jobs.table.salary')}
                      </p>
                      <p className='mt-1 break-words text-sm font-medium text-violet-700 dark:text-violet-300'>
                        {job.salary || '-'}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                        {t('employer.jobs.table.applicants')}
                      </p>
                      <span className='mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-sky-400/12 dark:text-sky-100'>
                        {job.applicantCount}
                      </span>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                        {t('employer.jobs.table.updated')}
                      </p>
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

            <div className='hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block dark:border-slate-300/14 dark:bg-slate-200/6'>
              <div className='max-h-[27.5rem] max-w-full overflow-auto overscroll-contain rounded-2xl'>
                <table className='min-w-[56rem] w-full'>
                  <thead className='sticky top-0 z-10'>
                    <tr className='border-b border-slate-200 bg-slate-50/95 backdrop-blur dark:border-slate-300/14 dark:bg-[#202635]/95'>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.jobTitle')}
                      </th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.category')}
                      </th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.location')}
                      </th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.salary')}
                      </th>
                      <th className='px-4 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.applicants')}
                      </th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.status')}
                      </th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.updated')}
                      </th>
                      <th className='px-4 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100 dark:divide-slate-300/10'>
                    {filteredJobs.map((job, index) => (
                      <tr
                        key={job.id}
                        className={`transition hover:bg-violet-50/45 dark:hover:bg-violet-400/8 ${
                          index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/35 dark:bg-slate-200/[0.03]'
                        }`}
                      >
                        <td className='max-w-[17rem] px-4 py-4'>
                          <p className='truncate text-[15px] font-semibold text-slate-950 dark:text-white'>
                            {job.title}
                          </p>
                          <p className='mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400'>
                            {job.jobType?.job_type || '-'}
                          </p>
                        </td>
                        <td className='max-w-[12rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>
                          {job.category?.name || '-'}
                        </td>
                        <td className='max-w-[10rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>
                          {job.workLocation || '-'}
                        </td>
                        <td className='px-4 py-4'>
                          <span className='inline-flex whitespace-nowrap rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 dark:bg-violet-400/12 dark:text-violet-100'>
                            {job.salary || '-'}
                          </span>
                        </td>
                        <td className='px-4 py-4 text-center'>
                          <span className='inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-50 px-2 text-sm font-semibold text-blue-700 dark:bg-sky-400/12 dark:text-sky-100'>
                            {job.applicantCount}
                          </span>
                        </td>
                        <td className='px-4 py-4'>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              job.isActive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-100'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-200/10 dark:text-slate-200'
                            }`}
                          >
                            {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                          </span>
                        </td>
                        <td className='whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300'>
                          {new Date(job.updatedDate).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </td>
                        <td className='px-4 py-4 text-right'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='rounded-xl border-slate-200 bg-white shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-300/14 dark:bg-slate-950/20 dark:hover:bg-violet-400/12 dark:hover:text-violet-100'
                            onClick={() => handleViewJob(job)}
                          >
                            <Eye className='h-4 w-4' />
                            {t('employer.actions.view')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedJob && <ViewJobModal job={selectedJob} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

export default EmployerJobList
