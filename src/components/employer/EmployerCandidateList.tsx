import { Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { EmployerCandidateItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CandidateLikeButton from '@/components/likes/CandidateLikeButton'
import { useCompanyLikes } from '@/hooks/useCompanyLikes'
import EmployerEmptyState from './EmployerEmptyState'
import ViewCandidateModal from './ViewCandidateModal'

type EmployerCandidateListProps = {
  candidates: EmployerCandidateItem[]
  companyId?: number | null
}

const EmployerCandidateList = ({ candidates, companyId }: EmployerCandidateListProps) => {
  const { i18n, t } = useTranslation()
  const { error: likesError, isLoading: isLoadingLikes } = useCompanyLikes(companyId)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('__ALL__')
  const [jobFilter, setJobFilter] = useState<string>('__ALL__')
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidateItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '-'

    return t(`employer.candidates.status.${status}`, { defaultValue: status })
  }

  const filteredCandidates = useMemo(() => {
    let filtered = candidates
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.seeker.fullName?.toLowerCase().includes(term) ||
          c.seeker.email?.toLowerCase().includes(term) ||
          c.job.title.toLowerCase().includes(term) ||
          c.seeker.skills.some((s) => s.toLowerCase().includes(term))
      )
    }
    if (stageFilter !== '__ALL__') {
      filtered = filtered.filter((c) => c.stage === stageFilter)
    }
    if (jobFilter !== '__ALL__') {
      filtered = filtered.filter((c) => c.job.title === jobFilter)
    }
    return filtered
  }, [candidates, searchTerm, stageFilter, jobFilter])

  const handleViewCandidate = (candidate: EmployerCandidateItem) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
  }

  if (candidates.length === 0) {
    return (
      <EmployerEmptyState
        title={t('employer.candidates.empty.noCandidatesTitle')}
        description={t('employer.candidates.empty.noCandidatesDescription')}
      />
    )
  }

  const stages = Array.from(new Set(candidates.map((c) => c.stage).filter(Boolean))) as string[]
  const jobs = Array.from(new Set(candidates.map((c) => c.job.title))) as string[]

  return (
    <>
      <div className='min-w-0 space-y-4'>
        <div className='flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
          <div className='relative min-w-0 flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              placeholder={t('employer.candidates.filters.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='rounded-lg pl-10'
            />
          </div>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className='w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium lg:w-auto lg:max-w-[16rem] dark:border-white/8 dark:bg-white/5 dark:text-slate-100'
          >
            <option value='__ALL__'>{t('employer.candidates.filters.allJobs')}</option>
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className='w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium lg:w-auto dark:border-white/8 dark:bg-white/5 dark:text-slate-100'
          >
            <option value='__ALL__'>{t('employer.candidates.filters.allStages')}</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {getStatusLabel(stage)}
              </option>
            ))}
          </select>
        </div>
        {likesError ? <p className='rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700'>{likesError}</p> : null}
        {isLoadingLikes ? <p className='text-sm font-medium text-slate-500'>{t('employer.candidates.like.loading')}</p> : null}

        {filteredCandidates.length === 0 ? (
          <EmployerEmptyState
            title={t('employer.candidates.empty.noResultsTitle')}
            description={t('employer.candidates.empty.noResultsDescription')}
          />
        ) : (
          <>
            <div className='grid min-w-0 gap-4 lg:hidden'>
              {filteredCandidates.map((candidate) => (
                <article
                  key={candidate.applicationId}
                  className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-white/5'
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
                      <p className='break-words font-semibold text-slate-950 dark:text-white'>{candidate.seeker.fullName || t('employer.candidates.table.unknown')}</p>
                      <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>{candidate.job.title}</p>
                      <p className='mt-1 break-all text-sm text-slate-600 dark:text-slate-300'>{candidate.seeker.email || '-'}</p>
                    </div>
                  </div>

                  <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.candidates.table.stage')}</p>
                      <span className='mt-1 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700'>
                        {getStatusLabel(candidate.stage || candidate.status)}
                      </span>
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.candidates.table.applied')}</p>
                      <p className='mt-1 text-sm text-slate-700 dark:text-slate-300'>
                        {new Date(candidate.appliedAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <p className='text-xs font-medium uppercase tracking-[0.12em] text-slate-400'>{t('employer.candidates.table.skills')}</p>
                    <div className='mt-2 flex flex-wrap gap-1.5'>
                      {candidate.seeker.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.seeker.skills.length > 3 ? (
                        <span className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500'>
                          +{candidate.seeker.skills.length - 3}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className='mt-4 grid gap-2 sm:grid-cols-2'>
                    <CandidateLikeButton seekerId={candidate.seeker.id} />
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full rounded-lg'
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      <Eye className='h-4 w-4' />
                      {t('employer.candidates.table.view')}
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            <div className='hidden max-w-full overflow-x-auto rounded-2xl lg:block'>
              <table className='min-w-[68rem] w-full'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-white/5'>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.candidateName')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.jobTitle')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.email')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.stage')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.skills')}</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.appliedDate')}</th>
                    <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300'>{t('employer.candidates.table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.applicationId}
                      className='border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-white/8 dark:hover:bg-white/5'
                    >
                      <td className='max-w-[16rem] px-4 py-4'>
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
                          <p className='truncate font-semibold text-slate-950 dark:text-white'>{candidate.seeker.fullName || t('employer.candidates.table.unknown')}</p>
                        </div>
                      </td>
                      <td className='max-w-[16rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{candidate.job.title}</td>
                      <td className='max-w-[15rem] truncate px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>{candidate.seeker.email || '-'}</td>
                      <td className='px-4 py-4'>
                        <span className='inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700'>
                          {getStatusLabel(candidate.stage || candidate.status)}
                        </span>
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex flex-wrap gap-1'>
                          {candidate.seeker.skills.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.seeker.skills.length > 2 && (
                            <span className='inline-block text-xs font-medium text-slate-500'>
                              +{candidate.seeker.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-4 py-4 text-sm text-slate-700 dark:text-slate-300'>
                        {new Date(candidate.appliedAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <div className='flex justify-end gap-2'>
                          <CandidateLikeButton seekerId={candidate.seeker.id} compact />
                          <Button
                            variant='outline'
                            size='sm'
                            className='rounded-lg'
                            onClick={() => handleViewCandidate(candidate)}
                          >
                            <Eye className='h-4 w-4' />
                            {t('employer.candidates.table.view')}
                          </Button>
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

      {selectedCandidate && (
        <ViewCandidateModal candidate={selectedCandidate} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default EmployerCandidateList
