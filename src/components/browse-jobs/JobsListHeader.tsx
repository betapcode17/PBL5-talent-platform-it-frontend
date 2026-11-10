import { memo, useRef, useState, useEffect } from 'react'
import { ChevronDown, Flame, Sparkles, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useBrowseJobsStore } from '@/store/browseJobsStore'

type JobsListHeaderProps = {
  totalJobs: number
  from: number
  to: number
  isFetching?: boolean
}

const quickViews = [
  { id: 'latest' as const, labelKey: 'browseJobs.results.latest', icon: Flame },
  { id: 'bestMatch' as const, labelKey: 'browseJobs.results.bestMatch', icon: Sparkles },
  { id: 'savedJobs' as const, labelKey: 'browseJobs.results.savedJobs', icon: Star }
]

const sortOptions = [
  { id: 'newest' as const, labelKey: 'browseJobs.results.newestFirst' },
  { id: 'salaryHigh' as const, labelKey: 'browseJobs.results.salaryHigh' },
  { id: 'salaryLow' as const, labelKey: 'browseJobs.results.salaryLow' }
]

const JobsListHeader = ({ totalJobs, from, to, isFetching = false }: JobsListHeaderProps) => {
  const { t } = useTranslation()
  const activeTab = useBrowseJobsStore((state) => state.activeTab || 'bestMatch')
  const setActiveTab = useBrowseJobsStore((state) => state.setActiveTab)
  const sortBy = useBrowseJobsStore((state) => state.sortBy || 'newest')
  const setSortBy = useBrowseJobsStore((state) => state.setSortBy)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentSortLabel = sortOptions.find((opt) => opt.id === sortBy)?.labelKey || 'browseJobs.results.newestFirst'

  return (
    <div className='rounded-[26px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <h1 className='text-[1.95rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2.1rem]'>
              {t('browseJobs.results.title')}
            </h1>
            <p className='text-base text-slate-500'>
              {t('browseJobs.results.found', { count: totalJobs })}
              {isFetching ? <span className='ml-2 text-violet-600'>{t('browseJobs.results.updating')}</span> : null}
            </p>
          </div>

          <div className='flex flex-wrap gap-2.5'>
            {quickViews.map((view) => {
              const Icon = view.icon
              const isActive = activeTab === view.id
              return (
                <button
                  key={view.id}
                  type='button'
                  onClick={() => setActiveTab(view.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition cursor-pointer',
                    isActive
                      ? 'border-violet-300 bg-violet-50 text-violet-700 shadow-[0_8px_20px_rgba(124,58,237,0.12)] font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-violet-600' : 'text-slate-400')} />
                  {t(view.labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        <div className='grid shrink-0 gap-3 sm:grid-cols-2 lg:w-[280px] xl:w-[300px]'>
          <div className='rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3.5'>
            <p className='text-sm text-slate-400'>{t('browseJobs.results.showing')}</p>
            <p className='mt-1 text-[17px] font-semibold tracking-[-0.03em] text-slate-950'>
              {t('browseJobs.results.showingRange', { from, to, count: totalJobs })}
            </p>
          </div>

          <div className='relative' ref={dropdownRef}>
            <button
              type='button'
              onClick={() => setIsSortOpen((prev) => !prev)}
              className='inline-flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition hover:border-violet-200 hover:bg-violet-50 cursor-pointer'
            >
              <div className='text-left'>
                <p className='text-sm text-slate-400'>{t('browseJobs.results.sortBy')}</p>
                <p className='mt-1 text-sm font-semibold text-violet-700'>{t(currentSortLabel)}</p>
              </div>
              <ChevronDown
                className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isSortOpen && 'rotate-180')}
              />
            </button>

            {isSortOpen && (
              <div className='absolute right-0 z-20 mt-2 w-full min-w-[200px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl'>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type='button'
                    onClick={() => {
                      setSortBy(opt.id)
                      setIsSortOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left',
                      sortBy === opt.id
                        ? 'bg-violet-50 text-violet-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                    )}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(JobsListHeader)
