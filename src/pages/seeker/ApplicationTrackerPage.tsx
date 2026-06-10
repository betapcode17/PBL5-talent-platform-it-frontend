import {
  BriefcaseBusiness,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  MapPin,
  Search,
  SearchX
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SeekerActionToast } from '@/components/seeker/SeekerActionToast'
import { SeekerStatusBadge } from '@/components/seeker/SeekerStatusBadge'
import { Card } from '@/components/ui/card'
import { useSeekerApplicationsTracker } from '@/hooks/useSeekerCareer'
import { buildGoogleCalendarUrl, downloadInterviewCalendarFile } from '@/lib/interviewCalendar'

const PAGE_SIZE = 6
const ALL_STATUSES = 'ALL'

const ApplicationTrackerPage = () => {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ALL_STATUSES)
  const [page, setPage] = useState(1)
  const [expandedApplicationId, setExpandedApplicationId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { data, isLoading, error } = useSeekerApplicationsTracker()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const statusOptions = useMemo(
    () => [
      { value: ALL_STATUSES, label: t('seekerTracking.applications.filters.allStatuses') },
      { value: 'PENDING', label: t('seekerTracking.applicationStatus.PENDING') },
      { value: 'ACCEPTED', label: t('seekerTracking.applicationStatus.ACCEPTED') },
      { value: 'REJECTED', label: t('seekerTracking.applicationStatus.REJECTED') }
    ],
    [t]
  )

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return (data ?? []).filter((item) => {
      const statusMatches = status === ALL_STATUSES || item.status === status
      if (!statusMatches) return false

      if (!keyword) return true

      return [
        item.job.title,
        item.job.company.name,
        item.job.workLocation,
        item.job.categoryName,
        item.job.jobTypeName
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(keyword))
    })
  }, [data, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const metrics = useMemo(() => {
    const items = data ?? []

    return {
      total: items.length,
      pending: items.filter((item) => item.status === 'PENDING').length,
      accepted: items.filter((item) => item.status === 'ACCEPTED').length,
      interviews: items.filter((item) => item.interviews.length > 0).length
    }
  }, [data])

  const handleCopyMeetingLink = async (meetingLink: string) => {
    await navigator.clipboard.writeText(meetingLink)
    setToastMessage(t('seekerTracking.common.meetingLinkCopied'))
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <section className='rounded-[34px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8'>
        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)] xl:items-end'>
          <div className='min-w-0 max-w-3xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700'>
              <BriefcaseBusiness className='h-3.5 w-3.5' />
              {t('seekerTracking.applications.eyebrow')}
            </div>
            <h1 className='mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]'>
              {t('seekerTracking.applications.title')}
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base'>
              {t('seekerTracking.applications.description')}
            </p>
          </div>

          <div className='grid w-full gap-3 sm:grid-cols-2'>
            <MetricCard label={t('seekerTracking.applications.metrics.total')} value={metrics.total} />
            <MetricCard label={t('seekerTracking.applications.metrics.pending')} value={metrics.pending} />
            <MetricCard label={t('seekerTracking.applications.metrics.accepted')} value={metrics.accepted} />
            <MetricCard label={t('seekerTracking.applications.metrics.interviews')} value={metrics.interviews} />
          </div>
        </div>

        <div className='mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end'>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder={t('seekerTracking.applications.filters.searchPlaceholder')}
              className='h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100'
            />
          </div>

          <label className='flex flex-col gap-2'>
            <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
              {t('seekerTracking.applications.filters.status')}
            </span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className='h-[52px] rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100'
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
          <TrackerEmpty title={t('seekerTracking.applications.empty.title')} description={t('seekerTracking.applications.empty.description')} />
        ) : null}

        {!isLoading && !error && paginatedItems.length > 0
          ? paginatedItems.map((item) => {
              const nextInterview = item.nextInterview

              return (
                <Card key={item.applicationId} className='overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
                  <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='flex min-w-0 flex-1 gap-4'>
                      <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-100 via-cyan-50 to-white text-2xl font-semibold text-sky-700 shadow-[0_16px_36px_rgba(14,165,233,0.12)]'>
                        {item.job.company.image ? (
                          <img src={item.job.company.image} alt={item.job.company.name} className='h-full w-full object-cover' />
                        ) : (
                          item.job.company.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap gap-2'>
                          <SeekerStatusBadge
                            kind='application'
                            value={item.status}
                            label={t(`seekerTracking.applicationStatus.${item.status}`, { defaultValue: item.status })}
                          />
                          {item.currentStage ? (
                            <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                              {item.currentStage}
                            </span>
                          ) : null}
                        </div>

                        <h2 className='mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>{item.job.title}</h2>
                        <p className='mt-1 text-sm font-medium text-sky-700'>{item.job.company.name}</p>
                        <div className='mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500'>
                          {item.job.workLocation ? (
                            <span className='inline-flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              {item.job.workLocation}
                            </span>
                          ) : null}
                          {item.job.salary ? (
                            <span className='inline-flex items-center gap-2'>
                              <CircleDollarSign className='h-4 w-4' />
                              {item.job.salary}
                            </span>
                          ) : null}
                          {item.job.jobTypeName || item.job.workType ? (
                            <span className='inline-flex items-center gap-2'>
                              <FileText className='h-4 w-4' />
                              {item.job.jobTypeName || item.job.workType}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className='flex shrink-0 flex-wrap gap-3'>
                      <Link
                        to={`/jobs/${item.job.id}`}
                        className='inline-flex h-12 items-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] transition hover:bg-sky-700'
                      >
                        {t('seekerTracking.common.viewJob')}
                        <ExternalLink className='h-4 w-4' />
                      </Link>
                      {item.interviews.length > 0 ? (
                        <Link
                          to='/seeker/interviews'
                          className='inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                        >
                          {t('seekerTracking.common.viewInterviews')}
                        </Link>
                      ) : null}
                      {item.interviews.length > 0 ? (
                        <button
                          type='button'
                          onClick={() =>
                            setExpandedApplicationId((currentId) =>
                              currentId === item.applicationId ? null : item.applicationId
                            )
                          }
                          className='inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                        >
                          {expandedApplicationId === item.applicationId
                            ? t('seekerTracking.applications.actions.hideAllInterviews')
                            : t('seekerTracking.applications.actions.showAllInterviews')}
                          {expandedApplicationId === item.applicationId ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className='mt-5 grid gap-4 md:grid-cols-3'>
                    <MetaCard label={t('seekerTracking.applications.meta.appliedDate')} value={formatDate(item.appliedDate, locale)} />
                    <MetaCard label={t('seekerTracking.applications.meta.updatedDate')} value={formatDate(item.updatedDate, locale)} />
                    <MetaCard label={t('seekerTracking.applications.meta.interviewCount')} value={String(item.interviews.length)} />
                  </div>

                  {nextInterview ? (
                    <div className='mt-5 rounded-[26px] border border-sky-200 bg-[linear-gradient(135deg,rgba(240,249,255,1),rgba(248,250,252,1))] p-5'>
                      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <CalendarClock className='h-4 w-4 text-sky-600' />
                            <p className='text-sm font-semibold text-slate-900'>{t('seekerTracking.applications.nextInterview.title')}</p>
                          </div>
                          <p className='mt-2 text-sm leading-6 text-slate-600'>
                            {t('seekerTracking.applications.nextInterview.description', {
                              date: formatDateTime(nextInterview.schedule, locale),
                              interviewer: nextInterview.interviewer.fullName || t('seekerTracking.common.notSpecified')
                            })}
                          </p>
                        </div>
                        <SeekerStatusBadge
                          kind='interview'
                          value={nextInterview.status}
                          label={t(`seekerTracking.interviewStatus.${nextInterview.status}`, { defaultValue: nextInterview.status })}
                        />
                      </div>

                      <div className='mt-4 flex flex-wrap gap-3'>
                        <button
                          type='button'
                          onClick={() => {
                            const fileName = downloadInterviewCalendarFile(nextInterview)
                            setToastMessage(t('seekerTracking.common.calendarExported', { fileName }))
                          }}
                          className='inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-100'
                        >
                          <CalendarPlus className='h-4 w-4' />
                          {t('seekerTracking.common.exportCalendar')}
                        </button>
                        <a
                          href={buildGoogleCalendarUrl(nextInterview)}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                        >
                          <CalendarClock className='h-4 w-4' />
                          {t('seekerTracking.common.openGoogleCalendar')}
                        </a>
                        {nextInterview.link ? (
                          <>
                            <button
                              type='button'
                              onClick={() => void handleCopyMeetingLink(nextInterview.link!)}
                              className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                            >
                              <Copy className='h-4 w-4' />
                              {t('seekerTracking.common.copyMeetingLink')}
                            </button>
                            <a
                              href={nextInterview.link}
                              target='_blank'
                              rel='noreferrer'
                              className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                            >
                              <Link2 className='h-4 w-4' />
                              {t('seekerTracking.common.openInterviewLink')}
                            </a>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : item.status === 'REJECTED' && item.rejectionReason ? (
                    <div className='mt-5 rounded-[26px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700'>
                      <span className='font-semibold'>{t('seekerTracking.applications.rejectionLabel')}</span> {item.rejectionReason}
                    </div>
                  ) : null}

                  {expandedApplicationId === item.applicationId ? (
                    <div className='mt-5 rounded-[26px] border border-slate-200 bg-slate-50/80 p-5'>
                      <div className='flex items-center gap-2'>
                        <CalendarClock className='h-4 w-4 text-sky-600' />
                        <p className='text-sm font-semibold text-slate-900'>{t('seekerTracking.applications.actions.allInterviewsTitle')}</p>
                      </div>

                      <div className='mt-4 grid gap-4'>
                        {item.interviews.map((interview) => (
                          <div key={interview.id} className='rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm'>
                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                              <div className='min-w-0'>
                                <div className='flex flex-wrap gap-2'>
                                  <SeekerStatusBadge
                                    kind='interview'
                                    value={interview.status}
                                    label={t(`seekerTracking.interviewStatus.${interview.status}`, { defaultValue: interview.status })}
                                  />
                                  <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                                    {t(`seekerTracking.interviewType.${interview.type}`, { defaultValue: interview.type })}
                                  </span>
                                </div>
                                <p className='mt-3 text-base font-semibold text-slate-950'>{formatDateTime(interview.schedule, locale)}</p>
                                <p className='mt-1 text-sm text-slate-600'>
                                  {interview.interviewer.fullName || t('seekerTracking.common.notSpecified')} • {interview.company.name}
                                </p>
                              </div>

                              <div className='flex flex-wrap gap-3'>
                                <button
                                  type='button'
                                  onClick={() => {
                                    const fileName = downloadInterviewCalendarFile(interview)
                                    setToastMessage(t('seekerTracking.common.calendarExported', { fileName }))
                                  }}
                                  className='inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                                >
                                  <CalendarPlus className='h-4 w-4' />
                                  {t('seekerTracking.common.exportCalendarShort')}
                                </button>
                                <a
                                  href={buildGoogleCalendarUrl(interview)}
                                  target='_blank'
                                  rel='noreferrer'
                                  className='inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                                >
                                  <CalendarClock className='h-4 w-4' />
                                  {t('seekerTracking.common.openGoogleCalendar')}
                                </a>
                                {interview.link ? (
                                  <>
                                    <button
                                      type='button'
                                      onClick={() => void handleCopyMeetingLink(interview.link!)}
                                      className='inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                                    >
                                      <Copy className='h-4 w-4' />
                                      {t('seekerTracking.common.copyMeetingLink')}
                                    </button>
                                    <a
                                      href={interview.link}
                                      target='_blank'
                                      rel='noreferrer'
                                      className='inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                                    >
                                      <Link2 className='h-4 w-4' />
                                      {t('seekerTracking.common.joinInterview')}
                                    </a>
                                  </>
                                ) : null}
                              </div>
                            </div>

                            {interview.feedback ? (
                              <div className='mt-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
                                <span className='font-semibold text-slate-900'>{t('seekerTracking.interviews.cards.feedback')}:</span> {interview.feedback}
                              </div>
                            ) : null}

                            {interview.reason ? (
                              <div className='mt-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                                <span className='font-semibold'>{t('seekerTracking.interviews.cards.reason')}</span> {interview.reason}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>
              )
            })
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
  <div className='flex min-h-[112px] flex-col justify-between rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>{label}</p>
    <p className='mt-3 text-2xl font-semibold leading-none text-slate-950 sm:text-[1.75rem]'>{value}</p>
  </div>
)

const MetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-base font-semibold text-slate-950'>{value}</p>
  </div>
)

const TrackerSkeleton = () => (
  <div className='space-y-5'>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className='animate-pulse rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
        <div className='h-6 w-52 rounded-full bg-slate-200' />
        <div className='mt-6 grid gap-4 md:grid-cols-3'>
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

const formatDate = (value: string, locale: string) =>
  new Date(value).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

const formatDateTime = (value: string, locale: string) =>
  new Date(value).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

export default ApplicationTrackerPage
