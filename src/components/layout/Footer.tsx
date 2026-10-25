import { Github, Globe, Linkedin, ShieldCheck, Sparkles, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter }
]

const footerGroups = [
  {
    titleKey: 'footer.forCandidates',
    links: [
      { labelKey: 'footer.browseJobs', href: '/jobs' },
      { labelKey: 'footer.remoteJobs', href: '/jobs' },
      { labelKey: 'footer.cvTemplates', href: '/jobs' },
      { labelKey: 'footer.salaries', href: '/jobs' }
    ]
  },
  {
    titleKey: 'footer.forEmployers',
    links: [
      { labelKey: 'footer.postJob', href: '/employer/jobs/create' },
      { labelKey: 'footer.candidateSearch', href: '/employer/candidates' },
      { labelKey: 'footer.pricing', href: '/employer' },
      { labelKey: 'footer.hiringSolutions', href: '/employer' }
    ]
  },
  {
    titleKey: 'footer.support',
    links: [
      { labelKey: 'footer.helpCenter', href: '/jobs' },
      { labelKey: 'footer.contactUs', href: '/jobs' },
      { labelKey: 'footer.privacyPolicy', href: '/jobs' },
      { labelKey: 'footer.termsOfService', href: '/jobs' }
    ]
  }
]

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className='border-t border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950'>
      <Container className='py-16'>
        <div className='grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]'>
          <div className='max-w-sm space-y-5'>
            <Logo />
            <p className='text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
              {t('footer.desc')}
            </p>

            {/* System Status Pill */}
            <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
              </span>
              <span>{t('footer.allSystemsOperational')}</span>
            </div>

            <div className='flex items-center gap-2.5 pt-1'>
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={item.label}
                    className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                  >
                    <Icon className='h-4 w-4' />
                  </a>
                )
              })}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.titleKey} className='space-y-4'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200'>
                {t(group.titleKey)}
              </h3>
              <ul className='space-y-2.5'>
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.href}
                      className='text-sm font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400'
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className='border-t border-slate-100 bg-slate-50/50 py-5 dark:border-slate-800 dark:bg-slate-900/40'>
        <Container className='flex flex-col gap-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400'>
          <p className='flex items-center gap-1.5'>
            <span>© {new Date().getFullYear()} ITJobVN Network. Engineered with</span>
            <Sparkles className='h-3.5 w-3.5 text-violet-600' />
            <span>for Vietnam&apos;s Tech Community.</span>
          </p>
          <div className='flex flex-wrap items-center gap-6'>
            <span className='inline-flex items-center gap-1.5'>
              <Globe className='h-3.5 w-3.5 text-slate-400' />
              {t('footer.region')}
            </span>
            <span className='inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400'>
              <ShieldCheck className='h-3.5 w-3.5' />
              {t('footer.verifiedCount')}
            </span>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
