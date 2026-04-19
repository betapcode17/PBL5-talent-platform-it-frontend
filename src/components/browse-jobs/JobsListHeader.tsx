import { memo } from 'react'
import { ChevronDown, Flame, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type JobsListHeaderProps = {
  totalJobs: number
  from: number
  to: number
  isFetching?: boolean
}

const quickViews = [
  { label: 'Latest', icon: Flame, active: false },
  { label: 'Best Match', icon: Sparkles, active: true },
  { label: 'Saved Jobs', icon: Star, active: false }
]

const JobsListHeader = ({ totalJobs, from, to, isFetching = false }: JobsListHeaderProps) => {
  return (
    <div className='rounded-[26px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <h1 className='text-[1.95rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2.1rem]'>Recommended Jobs</h1>
            <p className='text-base text-slate-500'>
              Found {totalJobs.toLocaleString()} matching jobs for you
              {isFetching ? <span className='ml-2 text-violet-600'>Updating...</span> : null}
            </p>
          </div>

          <div className='flex flex-wrap gap-2.5'>
            {quickViews.map((view) => {
              const Icon = view.icon
              return (
                <button
                  key={view.label}
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition',
                    view.active
                      ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_20px_rgba(124,58,237,0.08)]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  {view.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className='grid shrink-0 gap-3 sm:grid-cols-2 lg:w-[280px] xl:w-[300px]'>
          <div className='rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3.5'>
            <p className='text-sm text-slate-400'>Showing</p>
            <p className='mt-1 text-[17px] font-semibold tracking-[-0.03em] text-slate-950'>
              {from}-{to} of {totalJobs.toLocaleString()}
            </p>
          </div>

          <button
            type='button'
            className='inline-flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition hover:border-violet-200 hover:bg-violet-50'
          >
            <div className='text-left'>
              <p className='text-sm text-slate-400'>Sort by</p>
              <p className='mt-1 text-sm font-semibold text-violet-700'>Newest First</p>
            </div>
            <ChevronDown className='h-4 w-4 text-slate-400' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(JobsListHeader)
