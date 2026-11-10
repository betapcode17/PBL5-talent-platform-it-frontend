import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { TopCompany } from '@/types/browse-jobs'
import { cn } from '@/lib/utils'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import { getTopCompaniesApi } from '@/api/company'

type TopCompaniesCardProps = {
  companies?: TopCompany[]
}

const TopCompaniesCard = ({ companies: initialCompanies }: TopCompaniesCardProps) => {
  const { t } = useTranslation()
  const setSearchQuery = useBrowseJobsStore((state) => state.setSearchQuery)
  const [companies, setCompanies] = useState<TopCompany[]>(initialCompanies || [])
  const [loading, setLoading] = useState(!initialCompanies || initialCompanies.length === 0)

  useEffect(() => {
    let isMounted = true
    getTopCompaniesApi(5)
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setCompanies(data)
        }
      })
      .catch((err) => {
        console.error('Error fetching top companies:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className='rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
      <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>{t('browseJobs.topCompanies.title')}</p>

      <div className='mt-5 space-y-2.5'>
        {loading && companies.length === 0 ? (
          <div className='space-y-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-2'>
                <div className='h-11 w-11 animate-pulse rounded-xl bg-slate-100' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-3/4 animate-pulse rounded bg-slate-100' />
                  <div className='h-3 w-1/2 animate-pulse rounded bg-slate-100' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          companies.map((company) => (
            <Link
              key={company.id}
              to='/jobs'
              onClick={() => setSearchQuery(company.name)}
              className='flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50'
            >
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-sm font-semibold shadow-sm',
                  company.logoTone
                )}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className='h-full w-full object-cover' />
                ) : (
                  company.logoText
                )}
              </div>
              <div className='min-w-0 space-y-0.5'>
                <p className='line-clamp-1 text-[16px] font-semibold text-slate-950'>{company.name}</p>
                <p className='text-xs font-medium text-slate-400'>
                  {t('browseJobs.topCompanies.jobs', { count: company.jobsCount })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}

export default memo(TopCompaniesCard)
