import type { Company } from '@/@types/company'
import { useFollow } from '@/hooks/useFollow'
import { ArrowUpRight, Building2, Globe, MapPin, Users } from 'lucide-react'

export const CompanyHeader = ({ company }: { company: Company }) => {
  const { isFollowed, isLoading, toggleFollow, followerCount } = useFollow(company.company_id)

  return (
    <section className='px-4 pt-6'>
      <div className='overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]'>
        <div className='relative h-56 overflow-hidden sm:h-72'>
          {company.cover_image ? (
            <img src={company.cover_image} alt={company.company_name} className='h-full w-full object-cover' />
          ) : (
            <div className='h-full w-full bg-[linear-gradient(135deg,#1e1b4b_0%,#4338ca_40%,#a855f7_100%)]' />
          )}
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.72)_100%)]' />
        </div>

        <div className='relative px-5 pb-6 sm:px-8'>
          <div className='-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-end'>
              <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] sm:h-36 sm:w-36'>
                <img src={company.company_image} alt={company.company_name} className='h-full w-full object-cover' />
              </div>

              <div className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {company.company_industry ? (
                    <span className='rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700'>
                      {company.company_industry}
                    </span>
                  ) : null}
                  {company.company_type ? (
                    <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500'>
                      {company.company_type}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h1 className='text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]'>
                    {company.company_name}
                  </h1>
                  <div className='mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500'>
                    {company.city ? (
                      <span className='inline-flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-violet-500' />
                        {company.city}
                      </span>
                    ) : null}
                    {company.company_size ? (
                      <span className='inline-flex items-center gap-2'>
                        <Users className='h-4 w-4 text-violet-500' />
                        {company.company_size}
                      </span>
                    ) : null}
                    <span className='inline-flex items-center gap-2'>
                      <Building2 className='h-4 w-4 text-violet-500' />
                      {followerCount} người đang follow
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <button
                onClick={toggleFollow}
                disabled={isLoading}
                className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  isFollowed
                    ? 'bg-rose-600 text-white shadow-[0_12px_28px_rgba(225,29,72,0.24)] hover:bg-rose-700 disabled:bg-rose-500'
                    : 'bg-violet-600 text-white shadow-[0_12px_28px_rgba(124,58,237,0.24)] hover:bg-violet-700 disabled:bg-violet-500'
                }`}
              >
                {isLoading ? 'Đang xử lý...' : isFollowed ? 'Hủy theo dõi' : 'Theo dõi công ty'}
              </button>

              {company.company_website_url ? (
                <a
                  href={company.company_website_url}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                >
                  <Globe className='h-4 w-4' />
                  Website
                  <ArrowUpRight className='h-4 w-4' />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
