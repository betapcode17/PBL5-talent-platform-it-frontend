import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  candidates: {
    titleKey: 'footer.forCandidates',
    links: [
      { labelKey: 'footer.browseJobs', href: '/jobs' },
      { labelKey: 'footer.remoteJobs', href: '/jobs' },
      { labelKey: 'footer.cvTemplates', href: '/jobs' },
      { labelKey: 'footer.salaries', href: '/jobs' }
    ]
  },
  employers: {
    titleKey: 'footer.forEmployers',
    links: [
      { labelKey: 'footer.postJob', href: '/employer/jobs/create' },
      { labelKey: 'footer.candidateSearch', href: '/employer/candidates' },
      { labelKey: 'footer.pricing', href: '/employer' },
      { labelKey: 'footer.hiringSolutions', href: '/employer' }
    ]
  },
  support: {
    titleKey: 'footer.support',
    links: [
      { labelKey: 'footer.helpCenter', href: '/jobs' },
      { labelKey: 'footer.contactUs', href: '/jobs' },
      { labelKey: 'footer.privacyPolicy', href: '/jobs' },
      { labelKey: 'footer.termsOfService', href: '/jobs' }
    ]
  }
}

const AuthFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className='border-t bg-slate-50'>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <Link to='/' className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg border-b-2 border-purple-600'>
                <svg viewBox='0 0 24 24' className='h-6 w-6 text-violet-600' fill='currentColor'>
                  <rect x='3' y='3' width='7' height='7' rx='1' />
                  <rect x='14' y='3' width='7' height='7' rx='1' />
                  <rect x='3' y='14' width='7' height='7' rx='1' />
                  <rect x='14' y='14' width='7' height='7' rx='1' />
                </svg>
              </div>
              <span className='text-xl font-bold text-slate-800'>ITJobVN</span>
            </Link>
            <p className='text-sm leading-relaxed text-slate-500'>
              {t('footer.desc')}
            </p>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.titleKey}>
              <h3 className='mb-4 text-sm font-semibold text-slate-800'>{t(section.titleKey)}</h3>
              <ul className='space-y-3'>
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link to={link.href} className='text-sm text-slate-500 transition-colors hover:text-purple-600'>
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <div className='container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row'>
        <p className='text-sm text-slate-400'>© {new Date().getFullYear()} ITJobVN Network. Engineered with ❤️ for Vietnam&apos;s Tech Community.</p>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-slate-400'>{t('footer.region')}</span>
          <span className='text-sm text-slate-400'>{t('footer.verifiedCount')}</span>
        </div>
      </div>
    </footer>
  )
}

export default AuthFooter
