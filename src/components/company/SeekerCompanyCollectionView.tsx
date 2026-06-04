import { type ReactNode, useMemo, useState } from 'react'
import { BriefcaseBusiness, Building2, CalendarDays, ChevronDown, ChevronUp, CircleDollarSign, ExternalLink, MapPin, Search, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { Company } from '@/@types/company'
import type { SeekerCompanyCollectionItem } from '@/hooks/useSeekerCompanies'
import { Card } from '@/components/ui/card'

type CollectionMetaLabels = {
  primary: string
  secondary: string
  jobsCount: string
}

type CollectionStatusFilter = {
  label: string
  value: string
  options: Array<{
    value: string
    label: string
  }>
  onChange: (value: string) => void
}

type SeekerCompanyCollectionViewProps = {
  eyebrow: string
  title: string
  description: string
  searchPlaceholder: string
  totalLabel: string
  totalItems: number
  emptyTitle: string
  emptyDescription: string
  metaLabels: CollectionMetaLabels
  items: SeekerCompanyCollectionItem[]
  isLoading: boolean
  error: string | null
  searchValue: string
  onSearchChange: (value: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  secondaryValueType?: 'text' | 'status'
  statusFilter?: CollectionStatusFilter
  jobDetails?: {
    title: string
    empty: string
  }
}

export const SeekerCompanyCollectionView = ({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  totalLabel,
  totalItems,
  emptyTitle,
  emptyDescription,
  metaLabels,
  items,
  isLoading,
  error,
  searchValue,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  secondaryValueType = 'text',
  statusFilter,
  jobDetails
}: SeekerCompanyCollectionViewProps) => {
  const { t } = useTranslation()
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(null)

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <section className='rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <div className='inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700'>
                <Building2 className='h-3.5 w-3.5' />
                {eyebrow}
              </div>

              <h1 className='mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3.1rem]'>{title}</h1>
              <p className='mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base'>{description}</p>
            </div>

            <div className='w-full max-w-sm rounded-[24px] border border-slate-200 bg-slate-50/80 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>{totalLabel}</p>
              <p className='mt-2 text-3xl font-semibold text-slate-950'>{totalItems}</p>
            </div>
          </div>

          <div className='mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]'>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={t('seekerCompanies.common.searchLabel')}
                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100'
              />
            </div>

            {statusFilter ? (
              <label className='flex flex-col gap-2'>
                <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{statusFilter.label}</span>
                <select
                  value={statusFilter.value}
                  onChange={(event) => statusFilter.onChange(event.target.value)}
                  className='h-[50px] rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100'
                >
                  {statusFilter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </section>

        <div className='mt-6 space-y-5'>
          {isLoading ? <CollectionSkeleton /> : null}
          {error ? <CollectionError message={error} /> : null}
          {!isLoading && !error && items.length === 0 ? <CollectionEmptyState title={emptyTitle} description={emptyDescription} /> : null}
          {!isLoading && !error && items.length > 0 ? (
            <>
              {items.map((item) => (
                <SeekerCompanyCollectionCard
                  key={item.company.company_id}
                  item={item}
                  metaLabels={metaLabels}
                  secondaryValueType={secondaryValueType}
                  jobDetails={jobDetails}
                  isExpanded={expandedCompanyId === item.company.company_id}
                  onToggleDetails={() =>
                    setExpandedCompanyId((currentId) =>
                      currentId === item.company.company_id ? null : item.company.company_id
                    )
                  }
                />
              ))}

              {totalPages > 1 ? (
                <div className='flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-sm text-slate-500'>
                    {t('seekerCompanies.common.pageLabel', { page, total: totalPages })}
                  </p>

                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={() => onPageChange(page - 1)}
                      disabled={page === 1}
                      className='inline-flex h-11 items-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {t('seekerCompanies.common.previous')}
                    </button>
                    <button
                      type='button'
                      onClick={() => onPageChange(page + 1)}
                      disabled={page === totalPages}
                      className='inline-flex h-11 items-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {t('seekerCompanies.common.next')}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const SeekerCompanyCollectionCard = ({
  item,
  metaLabels,
  secondaryValueType,
  jobDetails,
  isExpanded,
  onToggleDetails
}: {
  item: SeekerCompanyCollectionItem
  metaLabels: CollectionMetaLabels
  secondaryValueType: 'text' | 'status'
  jobDetails?: {
    title: string
    empty: string
  }
  isExpanded: boolean
  onToggleDetails: () => void
}) => {
  const { t, i18n } = useTranslation()
  const company: Company = item.company
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'
  const formattedPrimaryDate = formatDate(item.primaryDate, locale)
  const secondaryValue =
    secondaryValueType === 'status' ? t(`seekerCompanies.statuses.${item.secondaryValue}`, { defaultValue: item.secondaryValue }) : item.secondaryValue
  const translatedBadge = t(`seekerCompanies.statuses.${item.badge}`, { defaultValue: item.badge })
  const appliedJobs = useMemo(() => item.appliedJobs ?? [], [item.appliedJobs])

  return (
    <Card className='overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex min-w-0 flex-1 gap-4'>
          <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white text-2xl font-semibold text-violet-700 shadow-[0_16px_36px_rgba(124,58,237,0.12)]'>
            {company.company_image ? (
              <img src={company.company_image} alt={company.company_name} className='h-full w-full object-cover' />
            ) : (
              company.company_name.charAt(0).toUpperCase()
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap gap-2'>
              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  item.badgeTone === 'emerald'
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border border-violet-200 bg-violet-50 text-violet-700'
                }`}
              >
                {translatedBadge}
              </span>
              {company.company_industry ? (
                <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  {company.company_industry}
                </span>
              ) : null}
            </div>

            <h3 className='mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>{company.company_name}</h3>
            <div className='mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500'>
              {company.city ? <span>{company.city}</span> : null}
              {company.company_size ? <span>{company.company_size}</span> : null}
              {company.company_type ? <span>{company.company_type}</span> : null}
            </div>
          </div>
        </div>

        <Link
          to={`/companies/${company.company_id}`}
          className='inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(124,58,237,0.24)] transition hover:bg-violet-700'
        >
          {t('seekerCompanies.common.viewCompany')}
          <ExternalLink className='h-4 w-4' />
        </Link>
      </div>

      <div className='mt-5 grid gap-4 md:grid-cols-3'>
        <MetaCard label={metaLabels.primary} value={formattedPrimaryDate} />
        <MetaCard label={metaLabels.secondary} value={secondaryValue} />
        <MetaCard label={metaLabels.jobsCount} value={String(item.jobsCount)} />
      </div>

      {jobDetails ? (
        <div className='mt-5 border-t border-slate-200 pt-5'>
          <button
            type='button'
            onClick={onToggleDetails}
            className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
          >
            {isExpanded ? t('seekerCompanies.common.hideAppliedJobs') : t('seekerCompanies.common.showAppliedJobs')}
            {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
          </button>

          {isExpanded ? (
            <div className='mt-5 rounded-[26px] border border-slate-200 bg-slate-50/70 p-5'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                <BriefcaseBusiness className='h-4 w-4 text-violet-600' />
                {jobDetails.title}
              </div>

              {appliedJobs.length > 0 ? (
                <div className='mt-4 grid gap-4 xl:grid-cols-2'>
                  {appliedJobs.map((job) => (
                    <div key={job.applicationId} className='rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm'>
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                        <div className='min-w-0'>
                          <Link to={`/jobs/${job.jobId}`} className='text-base font-semibold text-slate-950 transition hover:text-violet-700'>
                            {job.title}
                          </Link>
                          <div className='mt-1 flex flex-wrap gap-2'>
                            <span className='rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700'>
                              {t(`seekerCompanies.statuses.${job.status}`, { defaultValue: job.status })}
                            </span>
                            {job.currentStage ? (
                              <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                                {job.currentStage}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <Link
                          to={`/jobs/${job.jobId}`}
                          className='inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                        >
                          {t('seekerCompanies.common.viewJob')}
                          <ExternalLink className='h-4 w-4' />
                        </Link>
                      </div>

                      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                        <JobInfoRow icon={<CalendarDays className='h-4 w-4' />} label={t('seekerCompanies.common.appliedDate')} value={formatDate(job.appliedDate, locale)} />
                        <JobInfoRow icon={<CalendarDays className='h-4 w-4' />} label={t('seekerCompanies.common.updatedDate')} value={formatDate(job.updatedDate, locale)} />
                        <JobInfoRow icon={<CircleDollarSign className='h-4 w-4' />} label={t('seekerCompanies.common.salary')} value={job.salary || t('seekerCompanies.common.notSpecified')} />
                        <JobInfoRow icon={<MapPin className='h-4 w-4' />} label={t('seekerCompanies.common.location')} value={job.workLocation || t('seekerCompanies.common.notSpecified')} />
                        <JobInfoRow icon={<BriefcaseBusiness className='h-4 w-4' />} label={t('seekerCompanies.common.jobType')} value={job.jobTypeName || job.workType || t('seekerCompanies.common.notSpecified')} />
                        <JobInfoRow icon={<BriefcaseBusiness className='h-4 w-4' />} label={t('seekerCompanies.common.category')} value={job.categoryName || t('seekerCompanies.common.notSpecified')} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='mt-4 text-sm text-slate-500'>{jobDetails.empty}</p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}

const MetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>{label}</p>
    <p className='mt-2 text-base font-semibold text-slate-950'>{value}</p>
  </div>
)

const JobInfoRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className='rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3'>
    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
      <span className='text-violet-600'>{icon}</span>
      {label}
    </div>
    <p className='mt-2 text-sm font-medium text-slate-900'>{value}</p>
  </div>
)

const CollectionSkeleton = () => (
  <div className='space-y-5'>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className='animate-pulse rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
        <div className='h-6 w-48 rounded-full bg-slate-200' />
        <div className='mt-6 grid gap-4 md:grid-cols-3'>
          <div className='h-20 rounded-[24px] bg-slate-200' />
          <div className='h-20 rounded-[24px] bg-slate-200' />
          <div className='h-20 rounded-[24px] bg-slate-200' />
        </div>
      </div>
    ))}
  </div>
)

const CollectionError = ({ message }: { message: string }) => (
  <div className='rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-600 shadow-[0_18px_56px_rgba(15,23,42,0.04)]'>
    {message}
  </div>
)

const CollectionEmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className='flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 text-center shadow-[0_18px_56px_rgba(15,23,42,0.04)]'>
    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600'>
      <SearchX className='h-7 w-7' />
    </div>
    <h3 className='mt-5 text-xl font-semibold text-slate-950'>{title}</h3>
    <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>{description}</p>
  </div>
)

const formatDate = (value: string, locale: string) =>
  new Date(value).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
