import { useState } from 'react'
import { Bookmark, Building2, ChevronRight, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import { cn } from '@/lib/utils'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import type { Job } from '@/types'

type JobCardProps = {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSearchQuery = useBrowseJobsStore((state) => state.setSearchQuery)
  const [isSaved, setIsSaved] = useState(false)

  const handleSkillClick = (skill: string) => {
    setSearchQuery(skill)
    navigate('/jobs')
  }

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  return (
    <article className='bento-card group flex flex-col justify-between p-6 transition-all duration-300'>
      <div>
        {/* Top Header: Logo, Badges, Bookmark */}
        <div className='mb-5 flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3.5'>
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-black tracking-wider text-white shadow-md transition-transform duration-300 group-hover:scale-105',
                job.logoTone
              )}
            >
              {job.logoText}
            </div>
            <div>
              <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500'>
                <Building2 className='h-3.5 w-3.5 text-slate-400' />
                {job.company}
              </span>
              <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                <MapPin className='h-3 w-3 text-slate-400' />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-1.5'>
            <Badge label={job.badge} tone={job.badgeTone} dot={job.badgeTone === 'new'} />
            <button
              type='button'
              onClick={handleBookmarkToggle}
              aria-label={isSaved ? t('jobDetail.saved') : t('jobDetail.saveJob')}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
            >
              <Bookmark className={cn('h-4 w-4', isSaved ? 'fill-violet-600 text-violet-600' : '')} />
            </button>
          </div>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className='block focus-visible:outline-none'>
          <h3 className='text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-violet-700 line-clamp-2'>
            {job.title}
          </h3>
        </Link>

        {/* Skills Tag Cloud */}
        <div className='mt-4 flex flex-wrap gap-1.5'>
          {job.skills.map((skill) => (
            <Tag
              key={skill}
              label={skill}
              onClick={() => handleSkillClick(skill)}
              className='cursor-pointer text-[11px] hover:border-violet-300'
            />
          ))}
        </div>
      </div>

      {/* Footer: Salary + Action Button */}
      <div className='mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
        <div>
          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>{t('home.featured.estimatedSalary')}</span>
          <p className='text-base font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400'>
            {job.salary}
          </p>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className='inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-violet-50 px-3.5 py-2 text-xs font-bold text-violet-700 transition-all duration-200 hover:bg-violet-600 hover:text-white group-hover:shadow-sm'
        >
          <span>{t('home.featured.viewJob')}</span>
          <ChevronRight className='h-3.5 w-3.5' />
        </Link>
      </div>
    </article>
  )
}

export default JobCard
