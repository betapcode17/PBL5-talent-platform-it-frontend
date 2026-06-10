import { ArrowUpDown, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { EmployerInterviewItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewInterviewModal from './ViewInterviewModal'

type EmployerInterviewListProps = {
  interviews: EmployerInterviewItem[]
}

const EmployerInterviewList = ({ interviews }: EmployerInterviewListProps) => {
  const { i18n, t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date')
  const [statusFilter, setStatusFilter] = useState<string>('__ALL__')
  const [selectedInterview, setSelectedInterview] = useState<EmployerInterviewItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '-'

    return t(`employer.statuses.${status}`, { defaultValue: status })
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = interviews
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.candidate.fullName?.toLowerCase().includes(term) ||
          i.job.title.toLowerCase().includes(term) ||
          i.location?.toLowerCase().includes(term)
      )
    }
    if (statusFilter !== '__ALL__') {
      filtered = filtered.filter((i) => i.status === statusFilter)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.interviewDate ? new Date(a.interviewDate).getTime() : 0
        const dateB = b.interviewDate ? new Date(b.interviewDate).getTime() : 0
        return dateA - dateB
      }
      return 0
    })
    return sorted
  }, [interviews, searchTerm, sortBy, statusFilter])

  const handleViewInterview = (interview: EmployerInterviewItem) => {
    setSelectedInterview(interview)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInterview(null)
  }

  if (interviews.length === 0) {
    return (
      <EmployerEmptyState
        title={t('employer.interviews.empty.noInterviewsTitle')}
        description={t('employer.interviews.empty.noInterviewsDescription')}
      />
    )
  }

  return (
    <>
      <div className='min-w-0 space-y-4'>
        <div className='flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
          <div className='relative min-w-0 flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              placeholder={t('employer.interviews.filters.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='rounded-lg pl-10'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium lg:w-auto dark:border-white/8 dark:bg-white/5 dark:text-slate-100'
          >
            <option value='__ALL__'>{t('employer.interviews.filters.allStatus')}</option>
            <option value='SCHEDULED'>{t('employer.statuses.SCHEDULED')}</option>
            <option value='COMPLETED'>{t('employer.statuses.COMPLETED')}</option>
          </select>
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'status' : 'date')}
            className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 lg:w-auto dark:border-white/8 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8'
          >
            <ArrowUpDown className='h-4 w-4' />
            {sortBy === 'date' ? t('employer.interviews.filters.sortDate') : t('employer.interviews.filters.sortStatus')}
          </button>
        </div>

        {filteredAndSorted.length === 0 ? (
          <EmployerEmptyState
            title={t('employer.interviews.empty.noResultsTitle')}
            description={t('employer.interviews.empty.noResultsDescription')}
          />
        ) : (
          <>
            <div className='grid min-w-0 gap-4 lg:hidden'>
              {filteredAndSorted.map((interview) => (
                <article key={interview.id} className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-white/5'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700'>
                      {interview.candidate.fullName?.charAt(0) || '?'}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='break-words font-semibold text-slate-950 dark:text-white'>{interview.candidate.fullName || t('employer.interviews.table.unknown')}</p>
                      <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>{interview.job.title}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        interview.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : interview.status === 'SCHEDULED'
                            ? 'bg-violet-50 text-violet-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getStatusLabel(interview.status)}
                    </span>
                  </div>

                  <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.interviews.table.date')}</p>
                      <p className='mt-1 text-sm text-slate-700 dark:text-slate-300'>
                        {interview.interviewDate
                          ? new Date(interview.interviewDate).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.interviews.table.time')}</p>
                      <p className='mt-1 text-sm text-slate-700 dark:text-slate-300'>{interview.startTime || '-'}</p>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.interviews.table.interviewType')}</p>
                      <span className='mt-1 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                        {interview.interviewType || t('employer.interviews.table.notSpecified')}
                      </span>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.interviews.table.location')}</p>
                      <p className='mt-1 break-words text-sm text-slate-700 dark:text-slate-300'>{interview.location || '-'}</p>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-4 w-full rounded-lg'
                    onClick={() => handleViewInterview(interview)}
                  >
                    <Eye className='h-4 w-4' />
                    {t('employer.actions.view')}
                  </Button>
                </article>
              ))}
            </div>

            <div className='hidden max-w-full overflow-x-auto rounded-2xl lg:block'>
              <table className='min-w-[66rem] w-full'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-white/5'>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.candidate')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.jobTitle')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.dateTime')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.interviewType')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.location')}</th>
                    <th className='px-4 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.status')}</th>
                    <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.interviews.table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map((interview) => (
                    <tr key={interview.id} className='border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-white/8 dark:hover:bg-white/5'>
                      <td className='max-w-[15rem] px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700'>
                            {interview.candidate.fullName?.charAt(0) || '?'}
                          </div>
                          <p className='truncate font-semibold text-slate-950 dark:text-white'>{interview.candidate.fullName || t('employer.interviews.table.unknown')}</p>
                        </div>
                      </td>
                      <td className='max-w-[16rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{interview.job.title}</td>
                      <td className='px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>
                        {interview.interviewDate ? (
                          <div>
                            <p>
                              {new Date(interview.interviewDate).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            {interview.startTime && <p className='text-xs text-slate-500 dark:text-slate-400'>{interview.startTime}</p>}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className='px-4 py-4'>
                        <span className='inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                          {interview.interviewType || t('employer.interviews.table.notSpecified')}
                        </span>
                      </td>
                      <td className='max-w-[13rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{interview.location || '-'}</td>
                      <td className='px-4 py-4 text-center'>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            interview.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : interview.status === 'SCHEDULED'
                                ? 'bg-violet-50 text-violet-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {getStatusLabel(interview.status)}
                        </span>
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='rounded-lg'
                          onClick={() => handleViewInterview(interview)}
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
          </>
        )}
      </div>

      {selectedInterview && (
        <ViewInterviewModal interview={selectedInterview} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default EmployerInterviewList
