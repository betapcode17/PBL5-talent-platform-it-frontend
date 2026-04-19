import { ArrowUpRight, Building2, Globe, MapPin, Users } from 'lucide-react'
import { OutlineButton } from '@/components/ui/Buttons'
import { cn } from '@/lib/utils'

type JobCompanyCardProps = {
  companyName: string
  companyImage?: string | null
  companyInitials: string
  companyType?: string | null
  companyIndustry?: string | null
  companyLocation?: string | null
  companyOverview: string
  companyWebsiteUrl?: string | null
  onFallbackViewCompany: () => void
}

const JobCompanyCard = ({
  companyName,
  companyImage,
  companyInitials,
  companyType,
  companyIndustry,
  companyLocation,
  companyOverview,
  companyWebsiteUrl,
  onFallbackViewCompany
}: JobCompanyCardProps) => {
  const meta = [companyIndustry, companyType].filter(Boolean).join(' · ')

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='flex items-start gap-4'>
        <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-violet-100 bg-gradient-to-br from-violet-100 to-fuchsia-50 text-sm font-semibold text-violet-700 shadow-[0_10px_24px_rgba(124,58,237,0.12)]'>
          {companyImage ? <img src={companyImage} alt={companyName} className='h-full w-full object-cover' /> : companyInitials}
        </div>

        <div className='min-w-0'>
          <h2 className='text-lg font-semibold text-slate-950'>{companyName}</h2>
          {meta ? <p className='mt-1 text-sm text-slate-500'>{meta}</p> : null}
        </div>
      </div>

      <div className='mt-4 space-y-3 text-sm text-slate-600'>
        {companyLocation ? (
          <div className='flex items-start gap-2'>
            <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
            <span>{companyLocation}</span>
          </div>
        ) : null}

        {companyIndustry ? (
          <div className='flex items-start gap-2'>
            <Building2 className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
            <span>{companyIndustry}</span>
          </div>
        ) : null}

        {companyType ? (
          <div className='flex items-start gap-2'>
            <Users className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
            <span>{companyType}</span>
          </div>
        ) : null}

        {companyWebsiteUrl ? (
          <div className='flex items-start gap-2'>
            <Globe className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
            <span className='truncate'>{companyWebsiteUrl}</span>
          </div>
        ) : null}
      </div>

      <p className='mt-4 text-sm leading-7 text-slate-600'>{companyOverview}</p>

      {companyWebsiteUrl ? (
        <a
          href={companyWebsiteUrl}
          target='_blank'
          rel='noreferrer'
          className={cn(
            'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 hover:text-violet-800'
          )}
        >
          View Company
          <ArrowUpRight className='h-4 w-4' />
        </a>
      ) : (
        <OutlineButton onClick={onFallbackViewCompany} className='mt-5 w-full rounded-2xl'>
          View Company
        </OutlineButton>
      )}
    </section>
  )
}

export default JobCompanyCard
