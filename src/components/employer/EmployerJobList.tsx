import { MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { deleteEmployerJobApi } from '@/api/employer'
import type { EmployerJobItem } from '@/@types/employer'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewJobModal from './ViewJobModal'

type EmployerJobListProps = {
  jobs: EmployerJobItem[]
}

const EmployerJobList = ({ jobs }: EmployerJobListProps) => {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [jobItems, setJobItems] = useState(jobs)
  const [selectedJob, setSelectedJob] = useState<EmployerJobItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeletingJobId, setIsDeletingJobId] = useState<number | null>(null)
  const [openActionJobId, setOpenActionJobId] = useState<number | null>(null)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  useEffect(() => {
    setJobItems(jobs)
  }, [jobs])

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobItems
    const term = searchTerm.toLowerCase()

    return jobItems.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.category?.name.toLowerCase().includes(term) ||
        job.workLocation?.toLowerCase().includes(term) ||
        job.salary?.toLowerCase().includes(term)
    )
  }, [jobItems, searchTerm])

  const handleViewJob = (job: EmployerJobItem) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    setOpenActionJobId(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  const handleEditJob = (job: EmployerJobItem) => {
    setOpenActionJobId(null)
    navigate(`/employer/jobs/${job.id}/edit`, { state: { job } })
  }

  const toggleActionMenu = (jobId: number) => {
    setOpenActionJobId((currentId) => (currentId === jobId ? null : jobId))
  }

  const handleDeleteJob = async (job: EmployerJobItem) => {
    const confirmed = window.confirm(
      t('employer.jobs.delete.confirm', {
        defaultValue: `Bạn có chắc muốn xóa tin tuyển dụng "${job.title}" không?`,
        title: job.title
      })
    )

    if (!confirmed) return

    setIsDeletingJobId(job.id)
    setOpenActionJobId(null)

    try {
      await deleteEmployerJobApi(job.id)
      setJobItems((currentJobs) => currentJobs.filter((item) => item.id !== job.id))

      if (selectedJob?.id === job.id) {
        handleCloseModal()
      }
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null

      window.alert(
        message ||
          t('employer.jobs.delete.failed', {
            defaultValue: 'Không thể xóa việc làm lúc này.'
          })
      )
    } finally {
      setIsDeletingJobId(null)
    }
  }

  if (jobItems.length === 0) {
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
            onChange={(event) => setSearchTerm(event.target.value)}
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
                <article
                  key={job.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => handleViewJob(job)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleViewJob(job)
                    }
                  }}
                  className='min-w-0 cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-white/8 dark:bg-white/5'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='break-words font-semibold text-slate-950 dark:text-white'>{job.title}</p>
                      <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>{job.jobType?.job_type || '-'}</p>
                    </div>

                    <div className='relative flex shrink-0 items-start gap-2'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                      </span>
                      <button
                        type='button'
                        aria-label={t('employer.jobs.table.action')}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleActionMenu(job.id)
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </button>

                      {openActionJobId === job.id ? (
                        <ActionMenu
                          isDeleting={isDeletingJobId === job.id}
                          editLabel={t('employer.actions.edit')}
                          deleteLabel={t('employer.actions.delete', { defaultValue: 'Xóa' })}
                          deletingLabel={t('employer.jobs.delete.deleting', { defaultValue: 'Đang xóa...' })}
                          onEdit={(event) => {
                            event.stopPropagation()
                            handleEditJob(job)
                          }}
                          onDelete={(event) => {
                            event.stopPropagation()
                            void handleDeleteJob(job)
                          }}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <InfoCell label={t('employer.jobs.table.category')} value={job.category?.name || '-'} />
                    <InfoCell label={t('employer.jobs.table.location')} value={job.workLocation || '-'} />
                    <InfoCell label={t('employer.jobs.table.salary')} value={job.salary || '-'} accent />
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.jobs.table.applicants')}</p>
                      <span className='mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700'>
                        {job.applicantCount}
                      </span>
                    </div>
                    <InfoCell
                      label={t('employer.jobs.table.updated')}
                      value={new Date(job.updatedDate).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    />
                  </div>
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
                    <tr
                      key={job.id}
                      onClick={() => handleViewJob(job)}
                      className='cursor-pointer border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-white/8 dark:hover:bg-white/5'
                    >
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
                        <div className='relative flex justify-end'>
                          <button
                            type='button'
                            aria-label={t('employer.jobs.table.action')}
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleActionMenu(job.id)
                            }}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </button>

                          {openActionJobId === job.id ? (
                            <ActionMenu
                              isDeleting={isDeletingJobId === job.id}
                              editLabel={t('employer.actions.edit')}
                              deleteLabel={t('employer.actions.delete', { defaultValue: 'Xóa' })}
                              deletingLabel={t('employer.jobs.delete.deleting', { defaultValue: 'Đang xóa...' })}
                              onEdit={(event) => {
                                event.stopPropagation()
                                handleEditJob(job)
                              }}
                              onDelete={(event) => {
                                event.stopPropagation()
                                void handleDeleteJob(job)
                              }}
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedJob ? <ViewJobModal job={selectedJob} isOpen={isModalOpen} onClose={handleCloseModal} /> : null}
    </>
  )
}

const InfoCell = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{label}</p>
    <p className={`mt-1 break-words text-sm ${accent ? 'font-medium text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-300'}`}>{value}</p>
  </div>
)

const ActionMenu = ({
  isDeleting,
  editLabel,
  deleteLabel,
  deletingLabel,
  onEdit,
  onDelete
}: {
  isDeleting: boolean
  editLabel: string
  deleteLabel: string
  deletingLabel: string
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
}) => (
  <div className='absolute right-0 top-11 z-20 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl'>
    <button
      type='button'
      onClick={onEdit}
      className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
    >
      <Pencil className='h-4 w-4' />
      {editLabel}
    </button>
    <button
      type='button'
      disabled={isDeleting}
      onClick={onDelete}
      className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60'
    >
      <Trash2 className='h-4 w-4' />
      {isDeleting ? deletingLabel : deleteLabel}
    </button>
  </div>
)

export default EmployerJobList
