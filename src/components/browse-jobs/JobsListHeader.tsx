import { memo, useEffect, useRef, useState } from 'react'
import { ChevronDown, Flame, Sparkles, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { BrowseJobsFilters } from '@/types/browse-jobs'

type JobsListHeaderProps = {
  totalJobs: number
  from: number
  to: number
  isFetching?: boolean
  quickView: BrowseJobsFilters['quickView']
  sortBy: BrowseJobsFilters['sortBy']
  onQuickViewChange: (value: BrowseJobsFilters['quickView']) => void
  onSortChange: (value: BrowseJobsFilters['sortBy']) => void
}

const quickViews = [
  { value: 'latest', labelKey: 'browseJobs.results.latest', icon: Flame },
  { value: 'bestMatch', labelKey: 'browseJobs.results.bestMatch', icon: Sparkles },
  { value: 'saved', labelKey: 'browseJobs.results.savedJobs', icon: Star }
] satisfies Array<{
  value: BrowseJobsFilters['quickView']
  labelKey: string
  icon: typeof Flame
}>

const sortOptions = [
  { value: 'bestMatch', labelKey: 'browseJobs.results.bestMatch' },
  { value: 'newest', labelKey: 'browseJobs.results.newestFirst' },
  { value: 'salaryHigh', labelKey: 'browseJobs.results.salaryHigh' },
  { value: 'salaryLow', labelKey: 'browseJobs.results.salaryLow' }
] satisfies Array<{
  value: BrowseJobsFilters['sortBy']
  labelKey: string
}>

const JobsListHeader = ({
  totalJobs,
  from,
  to,
  isFetching = false,
  quickView,
  sortBy,
  onQuickViewChange,
  onSortChange
}: JobsListHeaderProps) => {
  const { t } = useTranslation()
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)
  const selectedSort = sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='rounded-[24px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0 space-y-3'>
          <div className='space-y-1.5'>
            <h1 className='text-[1.95rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2.1rem]'>
              {t('browseJobs.results.title')}
            </h1>
            <p className='text-base text-slate-500'>
              {t('browseJobs.results.found', { count: totalJobs })}
              {isFetching ? <span className='ml-2 text-violet-600'>{t('browseJobs.results.updating')}</span> : null}
            </p>
          </div>

          <div className='flex gap-2 overflow-x-auto pb-1 sm:overflow-visible'>
            {quickViews.map((view) => {
              const Icon = view.icon
              const isActive = quickView === view.value

              return (
                <button
                  key={view.value}
                  type='button'
                  aria-pressed={isActive}
                  onClick={() => onQuickViewChange(view.value)}
                  className={cn(
                    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition',
                    isActive
                      ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_20px_rgba(124,58,237,0.08)]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  {t(view.labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        <div className='grid w-full max-w-full gap-2.5 sm:grid-cols-2 lg:w-[282px] lg:shrink-0 xl:w-[292px]'>
          <div className='min-h-[66px] rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5'>
            <p className='text-xs font-medium text-slate-400'>{t('browseJobs.results.showing')}</p>
            <p className='mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-950 whitespace-nowrap'>
              {t('browseJobs.results.showingRange', { from, to, count: totalJobs })}
            </p>
          </div>

          <div className='relative' ref={sortRef}>
            <button
              type='button'
              aria-expanded={isSortOpen}
              onClick={() => setIsSortOpen((current) => !current)}
              className='inline-flex min-h-[66px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition hover:border-violet-200 hover:bg-violet-50'
            >
              <div className='min-w-0 text-left'>
                <p className='text-xs font-medium text-slate-400'>{t('browseJobs.results.sortBy')}</p>
                <p className='mt-1 truncate text-sm font-semibold text-violet-700'>{t(selectedSort.labelKey)}</p>
              </div>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition', isSortOpen ? 'rotate-180' : '')} />
            </button>

            {isSortOpen ? (
              <div className='absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_46px_rgba(15,23,42,0.14)]'>
                {sortOptions.map((option) => {
                  const isSelected = option.value === sortBy

                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => {
                        onSortChange(option.value)
                        setIsSortOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                        isSelected ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      )}
                    >
                      {t(option.labelKey)}
                      {isSelected ? <span className='h-2 w-2 rounded-full bg-violet-600' /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(JobsListHeader)
