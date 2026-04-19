import { memo } from 'react'
import { Bookmark, BriefcaseBusiness, Clock3, MapPin, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import Tag from '@/components/ui/Tag'
import type { BrowseJob } from '@/types/browse-jobs'
import { cn } from '@/lib/utils'

type JobCardProps = {
  job: BrowseJob
}

const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate()

  return (
    <article className='group rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_64px_rgba(124,58,237,0.08)] sm:p-6'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex min-w-0 gap-4'>
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-white/60 bg-gradient-to-br text-sm font-semibold text-slate-900 shadow-[0_10px_22px_rgba(15,23,42,0.08)]',
              job.logoTone
            )}
          >
            {job.logoText}
          </div>

          <div className='min-w-0 space-y-3.5'>
            <div className='space-y-2.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600'>
                  {job.employmentType}
                </span>
                <span className='rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700'>
                  {job.workType}
                </span>
                <span className='rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600'>
                  {job.experience}
                </span>
              </div>

              <h3 className='text-[1.6rem] font-semibold leading-tight tracking-[-0.05em] text-slate-950 sm:text-[1.7rem]'>{job.title}</h3>

              <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-slate-600'>
                <span className='font-medium text-slate-700'>{job.company}</span>
                <span className='text-slate-300'>/</span>
                <span className='inline-flex items-center gap-1.5'>
                  <MapPin className='h-4 w-4 text-slate-400' />
                  {job.location}
                </span>
                <span className='text-slate-300'>/</span>
                <span className='inline-flex items-center gap-1.5 text-slate-500'>
                  <BriefcaseBusiness className='h-4 w-4 text-slate-400' />
                  Developer Hiring
                </span>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {job.skills.map((skill) => (
                <Tag key={skill} label={skill} className='rounded-full bg-slate-50 px-3 py-1 text-xs' />
              ))}
              {job.extraSkillsCount ? (
                <Tag
                  label={`+${job.extraSkillsCount} skills`}
                  className='rounded-full border-violet-100 bg-violet-50 px-3 py-1 text-xs text-violet-700'
                />
              ) : null}
            </div>

            <div className='flex flex-wrap items-center gap-x-6 gap-y-2.5'>
              <span className='inline-flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-emerald-600'>
                <Wallet className='h-[18px] w-[18px] text-slate-500' />
                {job.salary}
              </span>
              <span className='inline-flex items-center gap-2 text-sm text-slate-500'>
                <Clock3 className='h-[18px] w-[18px] text-slate-400' />
                {job.postedAt}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between gap-3 lg:min-h-[170px] lg:flex-col lg:items-end'>
          <button
            type='button'
            aria-label='Save job'
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
          >
            <Bookmark className={cn('h-[18px] w-[18px]', job.isBookmarked ? 'fill-slate-400 text-slate-400' : '')} />
          </button>

          <div className='flex flex-col gap-2.5 sm:flex-row lg:flex-col'>
            <OutlineButton onClick={() => navigate(`/jobs/${job.id}`)} className='h-[42px] w-[136px] rounded-xl px-4 text-sm'>
              View Details
            </OutlineButton>
            <PrimaryButton className='h-[42px] w-[136px] rounded-xl px-4 text-sm'>Apply</PrimaryButton>
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(JobCard)
