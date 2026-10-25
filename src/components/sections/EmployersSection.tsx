import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { employers } from '@/data/employers'
import { cn } from '@/lib/utils'

const EmployersSection = () => {
  const { t } = useTranslation()

  return (
    <section className='bg-slate-50/60 py-16 sm:py-20'>
      <Container className='space-y-10'>
        <SectionHeading
          eyebrow={t('home.employers.eyebrow')}
          title={t('home.employers.title')}
          subtitle={t('home.employers.subtitle')}
          actionLabel={t('home.employers.actionLabel')}
          actionHref='/companies'
          accent
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {employers.map((employer) => (
            <Link
              key={employer.id}
              to={`/jobs?q=${encodeURIComponent(employer.name)}`}
              className='bento-card group flex items-center justify-between p-5 transition-all duration-300'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-black tracking-wider text-white shadow-md transition-transform duration-300 group-hover:scale-105',
                    employer.tone
                  )}
                >
                  {employer.shortName}
                </div>
                <div className='space-y-0.5'>
                  <h3 className='text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-violet-700'>
                    {employer.name}
                  </h3>
                  <p className='text-xs text-slate-500'>{employer.industry}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <span className='rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300'>
                  {t('home.employers.rolesCount', { count: employer.openRolesCount })}
                </span>
                <ArrowRight className='h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-violet-600' />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default EmployersSection
