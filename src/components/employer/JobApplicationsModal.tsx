import { CalendarDays, Eye, Mail, Search, UserRound, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import type { EmployerCandidateItem, EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEmployerCandidates } from '@/hooks/useEmployerData'
import EmployerEmptyState from './EmployerEmptyState'
import ViewCandidateModal from './ViewCandidateModal'

type JobApplicationsModalProps = {
  job: EmployerJobItem
  isOpen: boolean
  onClose: () => void
}

const JobApplicationsModal = ({ job, isOpen, onClose }: JobApplicationsModalProps) => {
  const { i18n, t } = useTranslation()
  const { data, isLoading, error } = useEmployerCandidates(1, 100)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidateItem | null>(null)
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (value?: string | null) => {
    if (!value) return '-'

    return t(`employer.candidates.status.${value}`, { defaultValue: value })
  }

  const candidates = useMemo(() => {
    const byJob = data?.candidates.filter((candidate) => candidate.job.id === job.id) ?? []
    if (!searchTerm.trim()) return byJob

    const term = searchTerm.trim().toLowerCase()
    return byJob.filter(
      (candidate) =>
        candidate.seeker.fullName?.toLowerCase().includes(term) ||
        candidate.seeker.email?.toLowerCase().includes(term) ||
        candidate.seeker.skills.some((skill) => skill.toLowerCase().includes(term))
    )
  }, [data?.candidates, job.id, searchTerm])

  const handleViewCandidate = (candidate: EmployerCandidateItem) => {
    setSelectedCandidate(candidate)
    setIsCandidateModalOpen(true)
  }

  const handleCloseCandidate = () => {
    setIsCandidateModalOpen(false)
    setSelectedCandidate(null)
  }

  const handleClose = useCallback(() => {
    setSearchTerm('')
    setIsCandidateModalOpen(false)
    setSelectedCandidate(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleClose, isOpen])

  if (!isOpen) return null

  return createPortal(
    <>
      <div className='fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-950/58 p-3 pt-6 backdrop-blur-sm sm:p-6 lg:items-center lg:pt-6'>
        <button
          type='button'
          aria-label={t('employer.jobs.applicationsModal.close')}
          className='absolute inset-0 cursor-default'
          onClick={handleClose}
        />
        <div className='relative mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 transition-colors duration-500 dark:bg-[#1b202b] dark:ring-slate-300/14'>
          <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-violet-700 dark:text-violet-200'>
                {t('employer.jobs.applicationsModal.eyebrow', { count: job.applicantCount || 0 })}
              </p>
              <h2 className='mt-1 text-xl font-bold text-slate-950 sm:text-2xl dark:text-white'>
                {t('employer.jobs.applicationsModal.title')}
              </h2>
              <p className='mt-1 break-words text-sm text-slate-600 dark:text-slate-300'>{job.title}</p>
            </div>
            <button
              type='button'
              onClick={handleClose}
              className='self-end rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 sm:self-start dark:text-slate-300 dark:hover:bg-slate-200/12 dark:hover:text-white'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
            <div className='space-y-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('employer.jobs.applicationsModal.searchPlaceholder')}
                  className='rounded-lg pl-10'
                />
              </div>

              {isLoading ? (
                <EmployerEmptyState
                  title={t('employer.jobs.applicationsModal.loadingTitle')}
                  description={t('employer.jobs.applicationsModal.loadingDescription')}
                />
              ) : null}

              {error ? (
                <EmployerEmptyState title={t('employer.jobs.applicationsModal.failedTitle')} description={error} />
              ) : null}

              {!isLoading && !error && candidates.length === 0 ? (
                <EmployerEmptyState
                  title={t('employer.jobs.applicationsModal.emptyTitle')}
                  description={t('employer.jobs.applicationsModal.emptyDescription')}
                />
              ) : null}

              {!isLoading && !error && candidates.length > 0 ? (
                <>
                  <div className='grid min-w-0 gap-4 lg:hidden'>
                    {candidates.map((candidate) => (
                      <article
                        key={candidate.applicationId}
                        className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-300/14 dark:bg-slate-200/7'
                      >
                        <div className='flex items-start gap-3'>
                          {candidate.seeker.avatar ? (
                            <img
                              src={candidate.seeker.avatar}
                              alt={candidate.seeker.fullName}
                              className='h-12 w-12 rounded-full border border-slate-200 object-cover'
                            />
                          ) : (
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700'>
                              {candidate.seeker.fullName?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className='min-w-0 flex-1'>
                            <p className='break-words font-semibold text-slate-950 dark:text-white'>
                              {candidate.seeker.fullName || t('employer.candidates.table.unknown')}
                            </p>
                            <p className='mt-1 break-all text-sm text-slate-600 dark:text-slate-300'>
                              {candidate.seeker.email || '-'}
                            </p>
                          </div>
                        </div>

                        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                          <div>
                            <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                              {t('employer.candidates.table.stage')}
                            </p>
                            <span className='mt-1 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-400/14 dark:text-violet-100'>
                              {getStatusLabel(candidate.stage || candidate.status)}
                            </span>
                          </div>
                          <div>
                            <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>
                              {t('employer.candidates.table.appliedDate')}
                            </p>
                            <p className='mt-1 text-sm text-slate-700 dark:text-slate-300'>
                              {new Date(candidate.appliedAt).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className='mt-4 flex flex-wrap gap-1.5'>
                          {candidate.seeker.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-200/10 dark:text-slate-200'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <Button
                          variant='outline'
                          size='sm'
                          className='mt-4 w-full rounded-lg'
                          onClick={() => handleViewCandidate(candidate)}
                        >
                          <Eye className='h-4 w-4' />
                          {t('employer.candidates.table.view')}
                        </Button>
                      </article>
                    ))}
                  </div>

                  <div className='hidden max-w-full overflow-x-auto rounded-2xl border border-slate-200 lg:block dark:border-slate-300/14'>
                    <table className='min-w-[58rem] w-full'>
                      <thead>
                        <tr className='border-b border-slate-200 bg-slate-50 dark:border-slate-300/14 dark:bg-slate-200/8'>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.candidateName')}
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.email')}
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.stage')}
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.skills')}
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.appliedDate')}
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300'>
                            {t('employer.candidates.table.action')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((candidate) => (
                          <tr
                            key={candidate.applicationId}
                            className='border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/50 dark:border-slate-300/12 dark:hover:bg-slate-200/7'
                          >
                            <td className='max-w-[15rem] px-4 py-4'>
                              <div className='flex items-center gap-3'>
                                {candidate.seeker.avatar ? (
                                  <img
                                    src={candidate.seeker.avatar}
                                    alt={candidate.seeker.fullName}
                                    className='h-10 w-10 rounded-full border border-slate-200 object-cover'
                                  />
                                ) : (
                                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700'>
                                    {candidate.seeker.fullName?.charAt(0) || '?'}
                                  </div>
                                )}
                                <div className='min-w-0'>
                                  <p className='truncate font-semibold text-slate-950 dark:text-white'>
                                    {candidate.seeker.fullName || t('employer.candidates.table.unknown')}
                                  </p>
                                  <p className='mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400'>
                                    <UserRound className='h-3.5 w-3.5' />#{candidate.seeker.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className='max-w-[15rem] px-4 py-4'>
                              <p className='flex items-center gap-2 truncate text-sm text-slate-700 dark:text-slate-300'>
                                <Mail className='h-4 w-4 shrink-0 text-blue-600' />
                                {candidate.seeker.email || '-'}
                              </p>
                            </td>
                            <td className='px-4 py-4'>
                              <span className='inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-400/14 dark:text-violet-100'>
                                {getStatusLabel(candidate.stage || candidate.status)}
                              </span>
                            </td>
                            <td className='px-4 py-4'>
                              <div className='flex flex-wrap gap-1'>
                                {candidate.seeker.skills.slice(0, 2).map((skill) => (
                                  <span
                                    key={skill}
                                    className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-200/10 dark:text-slate-200'
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {candidate.seeker.skills.length > 2 ? (
                                  <span className='inline-block text-xs font-medium text-slate-500'>
                                    +{candidate.seeker.skills.length - 2}
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className='px-4 py-4'>
                              <p className='flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300'>
                                <CalendarDays className='h-4 w-4 shrink-0 text-emerald-600' />
                                {new Date(candidate.appliedAt).toLocaleDateString(locale, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </td>
                            <td className='px-4 py-4 text-right'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='rounded-lg'
                                onClick={() => handleViewCandidate(candidate)}
                              >
                                <Eye className='h-4 w-4' />
                                {t('employer.candidates.table.view')}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
            <Button variant='outline' onClick={handleClose} className='w-full rounded-lg sm:w-auto'>
              {t('employer.actions.close')}
            </Button>
          </div>
        </div>
      </div>

      {selectedCandidate ? (
        <ViewCandidateModal
          candidate={selectedCandidate}
          isOpen={isCandidateModalOpen}
          onClose={handleCloseCandidate}
        />
      ) : null}
    </>,
    document.body
  )
}

export default JobApplicationsModal
