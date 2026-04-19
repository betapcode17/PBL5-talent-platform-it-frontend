import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TopCompany } from '@/types/browse-jobs'
import { cn } from '@/lib/utils'

type TopCompaniesCardProps = {
  companies: TopCompany[]
}

const TopCompaniesCard = ({ companies }: TopCompaniesCardProps) => {
  return (
    <section className='rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
      <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Top Companies</p>

      <div className='mt-5 space-y-2.5'>
        {companies.map((company) => (
          <button
            key={company.id}
            type='button'
            className='flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50'
          >
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-slate-900',
                company.logoTone
              )}
            >
              {company.logoText}
            </div>
            <div className='space-y-1'>
              <p className='text-[17px] font-semibold text-slate-950'>{company.name}</p>
              <p className='text-sm text-slate-400'>{company.jobsCount} Jobs</p>
            </div>
          </button>
        ))}
      </div>

      <Link
        to='/companies'
        className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900'
      >
        View all companies
        <ArrowRight className='h-4 w-4' />
      </Link>
    </section>
  )
}

export default memo(TopCompaniesCard)
