import type { CompanyDetail } from '@/@types/company'
import { useTranslation } from 'react-i18next'

export const CompanyOverview = ({ company }: { company: CompanyDetail }) => {
  const { t } = useTranslation()

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-7'>
      <div className='space-y-6'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-violet-500'>{t('company.overview')}</p>
          <h2 className='mt-2 text-2xl font-semibold text-slate-950'>{t('company.companyProfile')}</h2>
        </div>

        <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
          <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>{t('company.companyProfile')}</h3>
          <p className='mt-3 text-sm leading-7 text-slate-600'>{company.profile_description || t('company.notUpdated')}</p>
        </div>

        <div className='rounded-[24px] border border-violet-100 bg-[linear-gradient(135deg,rgba(238,242,255,0.95),rgba(250,245,255,0.95))] p-5'>
          <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-violet-500'>{t('company.whyJoin')}</h3>
          <p className='mt-3 text-sm leading-7 text-slate-700'>
            {company.why_love_working_here || t('company.notUpdated')}
          </p>
        </div>
      </div>
    </section>
  )
}
