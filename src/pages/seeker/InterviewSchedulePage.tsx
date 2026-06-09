import type { ReactNode } from 'react'
import { CalendarClock, Clock3, Copy, ExternalLink, Link2, MapPin, Search, SearchX, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SeekerActionToast } from '@/components/seeker/SeekerActionToast'
import { Card } from '@/components/ui/card'
import { SeekerStatusBadge } from '@/components/seeker/SeekerStatusBadge'
import { useSeekerInterviewsTracker } from '@/hooks/useSeekerCareer'
import { buildGoogleCalendarUrl } from '@/lib/interviewCalendar'

const PAGE_SIZE = 6
const ALL_STATUSES = 'ALL'

const InterviewSchedulePage = () => {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ALL_STATUSES)
  const [page, setPage] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { data, isLoading, error } = useSeekerInterviewsTracker()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const statusOptions = useMemo(
    () => [
      { value: ALL_STATUSES, label: t('seekerTracking.interviews.filters.allStatuses') },
      { value: 'SCHEDULED', label: t('seekerTracking.interviewStatus.SCHEDULED') },
      { value: 'COMPLETED', label: t('seekerTracking.interviewStatus.COMPLETED') },
      { value: 'CANCELLED', label: t('seekerTracking.interviewStatus.CANCELLED') }
    ],
    [t]
  )

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return (data?.interviews ?? []).filter((item) => {
      const statusMatches = status === ALL_STATUSES || item.status === status
      if (!statusMatches) return false

      if (!keyword) return true

      return [item.job.title, item.company.name, item.interviewer.fullName, item.type]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(keyword))
    })
  }, [data?.interviews, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const metrics = useMemo(() => {
    const interviews = data?.interviews ?? []

    return {
      total: interviews.length,
      upcoming: interviews.filter((item) => item.status === 'SCHEDULED').length,
      completed: interviews.filter((item) => item.status === 'COMPLETED').length,
      cancelled: interviews.filter((item) => item.status === 'CANCELLED').length
    }
  }, [data?.interviews])

  const handleCopyMeetingLink = async (meetingLink: string) => {
    await navigator.clipboard.writeText(meetingLink)
    setToastMessage(t('seekerTracking.common.meetingLinkCopied'))
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <section className='rounded-[34px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700'>
              <CalendarClock className='h-3.5 w-3.5' />
              {t('seekerTracking.interviews.eyebrow')}
            </div>
            <h1 className='mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]'>
              {t('seekerTracking.interviews.title')}
            </h1>
            <p className='mt-3 text-sm leading-7 text-slate-500 sm:text-base'>{t('seekerTracking.interviews.description')}</p>
          </div>

          <div className='grid w-full max-w-xl gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <MetricCard label={t('seekerTracking.interviews.metrics.total')} value={metrics.total} />
            <MetricCard label={t('seekerTracking.interviews.metrics.upcoming')} value={metrics.upcoming} />
            <MetricCard label={t('seekerTracking.interviews.metrics.completed')} value={metrics.completed} />
            <MetricCard label={t('seekerTracking.interviews.metrics.cancelled')} value={metrics.cancelled} />
          </div>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]'>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder={t('seekerTracking.interviews.filters.searchPlaceholder')}
              className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100'
            />
          </div>

          <label className='flex flex-col gap-2'>
            <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
              {t('seekerTracking.interviews.filters.status')}
            </span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className='h-[50px] rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100'
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className='mt-6 space-y-5'>
        {isLoading ? <TrackerSkeleton /> : null}
        {error ? <TrackerError message={error instanceof Error ? error.message : t('seekerTracking.common.loadError')} /> : null}
        {!isLoading && !error && paginatedItems.length === 0 ? (
          <TrackerEmpty title={t('seekerTracking.interviews.empty.title')} description={t('seekerTracking.interviews.empty.description')} />
        ) : null}

        {!isLoading && !error && paginatedItems.length > 0
          ? paginatedItems.map((item) => (
              <Card key={item.id} className='overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-6'>
                <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap gap-2'>
                      <SeekerStatusBadge
                        kind='interview'
                        value={item.status}
                        label={t(`seekerTracking.interviewStatus.${item.status}`, { defaultValue: item.status })}
                      />
                      <span className='inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500'>
                        {t(`seekerTracking.interviewType.${item.type}`, { defaultValue: item.type })}
                      </span>
                    </div>

                    <h2 className='mt-3 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl'>{item.job.title}</h2>
                    <p className='mt-1 text-sm font-medium text-sky-700'>{item.company.name}</p>

                    <div className='mt-5 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 sm:gap-4'>
                      <InfoCard label={t('seekerTracking.interviews.cards.schedule')} value={formatDateTime(item.schedule, locale)} icon={<CalendarClock className='h-4 w-4' />} />
                      <InfoCard
                        label={t('seekerTracking.interviews.cards.duration')}
                        value={t('seekerTracking.interviews.durationValue', { count: item.duration })}
                        icon={<Clock3 className='h-4 w-4' />}
                      />
                      <InfoCard
                        label={t('seekerTracking.interviews.cards.interviewer')}
                        value={item.interviewer.fullName || t('seekerTracking.common.notSpecified')}
                        icon={<UserRound className='h-4 w-4' />}
                      />
                      <InfoCard
                        label={t('seekerTracking.interviews.cards.applicationStatus')}
                        value={t(`seekerTracking.applicationStatus.${item.applicationStatus}`, { defaultValue: item.applicationStatus })}
                        icon={<MapPin className='h-4 w-4' />}
                      />
                    </div>

                    {item.link ? (
                      <div className='mt-5 rounded-[24px] border border-sky-200 bg-sky-50/80 px-4 py-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-700'>
                          {t('seekerTracking.interviews.cards.joinLink')}
                        </p>
                        <a
                          href={item.link}
                          target='_blank'
                          rel='noreferrer'
                          className='mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800'
                        >
                          <Link2 className='h-4 w-4' />
                          <span className='truncate'>{item.link}</span>
                        </a>
                      </div>
                    ) : null}

                    {item.feedback ? (
                      <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                          {t('seekerTracking.interviews.cards.feedback')}
                        </p>
                        <p className='mt-2 text-sm leading-6 text-slate-600'>{item.feedback}</p>
                      </div>
                    ) : null}

                    {item.reason ? (
                      <div className='mt-5 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700'>
                        <span className='font-semibold'>{t('seekerTracking.interviews.cards.reason')}</span> {item.reason}
                      </div>
                    ) : null}
                  </div>

                  <div className='flex shrink-0 flex-wrap gap-3 xl:max-w-[280px] xl:justify-end'>
                    <a
                      href={buildGoogleCalendarUrl(item)}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                    >
                      <CalendarClock className='h-4 w-4' />
                      {t('seekerTracking.common.openGoogleCalendar')}
                    </a>
                    {item.link ? (
                      <button
                        type='button'
                        onClick={() => void handleCopyMeetingLink(item.link!)}
                        className='inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                      >
                        <Copy className='h-4 w-4' />
                        {t('seekerTracking.common.copyMeetingLink')}
                      </button>
                    ) : null}
                    <Link
                      to={`/jobs/${item.job.id}`}
                      className='inline-flex h-12 items-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] transition hover:bg-sky-700'
                    >
                      {t('seekerTracking.common.viewJob')}
                      <ExternalLink className='h-4 w-4' />
                    </Link>
                    <Link
                      to='/seeker/applications'
                      className='inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                    >
                      {t('seekerTracking.common.viewApplications')}
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          : null}

        {!isLoading && !error && totalPages > 1 ? (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
            t={t}
          />
        ) : null}
      </div>

      {toastMessage ? (
        <SeekerActionToast
          title={t('seekerTracking.common.toastSuccessTitle')}
          message={toastMessage}
          closeLabel={t('seekerTracking.common.closeToast')}
          onClose={() => setToastMessage(null)}
        />
      ) : null}
    </div>
  )
}

const MetricCard = ({ label, value }: { label: string; value: number }) => (
  <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-2xl font-semibold text-slate-950'>{value}</p>
  </div>
)

const InfoCard = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <div className='min-w-0 rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
    <div className='flex min-w-0 items-start gap-2 text-[11px] font-semibold uppercase leading-5 tracking-[0.08em] text-slate-400'>
      <span className='mt-0.5 shrink-0 text-sky-600'>{icon}</span>
      <span className='min-w-0 break-words'>{label}</span>
    </div>
    <p className='mt-2 break-words text-sm font-semibold leading-6 text-slate-900'>{value}</p>
  </div>
)

const TrackerSkeleton = () => (
  <div className='space-y-5'>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className='animate-pulse rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
        <div className='h-6 w-52 rounded-full bg-slate-200' />
        <div className='mt-6 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 sm:gap-4'>
          <div className='h-20 rounded-[24px] bg-slate-200' />
          <div className='h-20 rounded-[24px] bg-slate-200' />
          <div className='h-20 rounded-[24px] bg-slate-200' />
          <div className='h-20 rounded-[24px] bg-slate-200' />
        </div>
      </div>
    ))}
  </div>
)

const TrackerError = ({ message }: { message: string }) => (
  <div className='rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-600 shadow-[0_18px_56px_rgba(15,23,42,0.04)]'>
    {message}
  </div>
)

const TrackerEmpty = ({ title, description }: { title: string; description: string }) => (
  <div className='flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 text-center shadow-[0_18px_56px_rgba(15,23,42,0.04)]'>
    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600'>
      <SearchX className='h-7 w-7' />
    </div>
    <h3 className='mt-5 text-xl font-semibold text-slate-950'>{title}</h3>
    <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>{description}</p>
  </div>
)

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  t
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  t: (key: string, options?: Record<string, unknown>) => string
}) => (
  <div className='flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between'>
    <p className='text-sm text-slate-500'>{t('seekerTracking.common.pageLabel', { page, total: totalPages })}</p>
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className='inline-flex h-11 items-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {t('seekerTracking.common.previous')}
      </button>
      <button
        type='button'
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className='inline-flex h-11 items-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {t('seekerTracking.common.next')}
      </button>
    </div>
  </div>
)

const formatDateTime = (value: string, locale: string) =>
  new Date(value).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

export default InterviewSchedulePage
