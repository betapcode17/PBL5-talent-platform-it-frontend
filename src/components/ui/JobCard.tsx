import { BriefcaseBusiness, MapPin } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { PrimaryButton } from '@/components/ui/Buttons'
import Tag from '@/components/ui/Tag'
import type { Job } from '@/types'

type JobCardProps = {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <article className='group rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_70px_rgba(124,58,237,0.08)]'>
      <div className='mb-6 flex items-start justify-between gap-4'>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${job.logoTone} text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]`}
        >
          {job.logoText}
        </div>
        <Badge label={job.badge} tone={job.badgeTone} />
      </div>

      <div className='space-y-2'>
        <h3 className='text-xl font-semibold tracking-[-0.03em] text-slate-950'>{job.title}</h3>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500'>
          <span className='inline-flex items-center gap-1.5'>
            <BriefcaseBusiness className='h-4 w-4 text-slate-400' />
            {job.company}
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <MapPin className='h-4 w-4 text-slate-400' />
            {job.location}
          </span>
        </div>
      </div>

      <div className='mt-5 flex flex-wrap gap-2'>
        {job.skills.map((skill) => (
          <Tag key={skill} label={skill} className='rounded-lg px-2.5 py-1 text-[11px] uppercase tracking-[0.05em]' />
        ))}
      </div>

      <div className='mt-7 flex items-end justify-between gap-4'>
        <div className='space-y-1'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400'>Salary</p>
          <p className='text-lg font-semibold tracking-[-0.02em] text-violet-700'>{job.salary}</p>
        </div>
        <PrimaryButton className='px-4 py-2.5 text-sm shadow-none'>Apply Now</PrimaryButton>
      </div>
    </article>
  )
}

export default JobCard
