import { BriefcaseBusiness, Building2, CalendarDays, Clock3, MapPin, Wallet } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type JobDetailHeaderProps = {
  title: string
  companyName: string
  companyImage?: string | null
  companyInitials: string
  location: string
  salary: string
  employmentType?: string | null
  workType?: string | null
  experienceLevel?: string | null
  category?: string | null
  isActive?: boolean
  postedLabel?: string | null
  updatedLabel?: string | null
  applicantsCount?: number | null
}

const metaClassName = 'inline-flex items-center gap-2 text-sm text-slate-600 sm:text-[15px]'

const JobDetailHeader = ({
  title,
  companyName,
  companyImage,
  companyInitials,
  location,
  salary,
  employmentType,
  workType,
  experienceLevel,
  category,
  isActive,
  postedLabel,
  updatedLabel,
  applicantsCount
}: JobDetailHeaderProps) => {
  const badges = [employmentType, workType, experienceLevel, category].filter(Boolean)

  return (
    <section className='rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-7'>
      <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
        <div className='flex min-w-0 gap-4 sm:gap-5'>
          <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-violet-100 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white text-lg font-semibold text-violet-700 shadow-[0_14px_30px_rgba(124,58,237,0.14)] sm:h-20 sm:w-20 sm:text-xl'>
            {companyImage ? (
              <img src={companyImage} alt={companyName} className='h-full w-full object-cover' />
            ) : (
              companyInitials
            )}
          </div>

          <div className='min-w-0 space-y-4'>
            <div className='space-y-2.5'>
              <div className='flex flex-wrap gap-2'>
                {badges.map((badge) => (
                  <Badge key={badge} label={badge as string} className='rounded-full px-3 py-1.5 text-[11px]' />
                ))}
                {isActive ? <Badge label='Active' tone='new' className='rounded-full px-3 py-1.5 text-[11px]' /> : null}
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-medium text-violet-700'>{companyName}</p>
                <h1 className='text-[2rem] font-semibold leading-tight tracking-[-0.05em] text-slate-950 sm:text-[2.6rem]'>
                  {title}
                </h1>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-x-5 gap-y-3'>
              <span className={metaClassName}>
                <MapPin className='h-4 w-4 text-violet-500' />
                {location}
              </span>
              <span className={metaClassName}>
                <Wallet className='h-4 w-4 text-violet-500' />
                {salary}
              </span>
              {category ? (
                <span className={metaClassName}>
                  <BriefcaseBusiness className='h-4 w-4 text-violet-500' />
                  {category}
                </span>
              ) : null}
              {postedLabel ? (
                <span className={metaClassName}>
                  <Clock3 className='h-4 w-4 text-violet-500' />
                  Posted {postedLabel}
                </span>
              ) : null}
              {updatedLabel ? (
                <span className={metaClassName}>
                  <CalendarDays className='h-4 w-4 text-violet-500' />
                  Updated {updatedLabel}
                </span>
              ) : null}
              {typeof applicantsCount === 'number' && applicantsCount > 0 ? (
                <span className={cn(metaClassName, 'rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5')}>
                  <Building2 className='h-4 w-4 text-violet-500' />
                  {applicantsCount} applicants
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JobDetailHeader
