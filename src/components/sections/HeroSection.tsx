import { useState, type FormEvent } from 'react'
import {
  Briefcase,
  Building2,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/ui/Buttons'
import Container from '@/components/ui/Container'
import Tag from '@/components/ui/Tag'
import { popularTags } from '@/data/jobs'
import { useBrowseJobsStore } from '@/store/browseJobsStore'

const locationOptions = [
  { id: 'all', labelKey: 'home.hero.allLocations', filterValue: '' },
  { id: 'hcm', labelKey: 'home.hero.hcm', filterValue: 'Ho Chi Minh City' },
  { id: 'hanoi', labelKey: 'home.hero.hanoi', filterValue: 'Hanoi' },
  { id: 'danang', labelKey: 'home.hero.danang', filterValue: 'Da Nang' },
  { id: 'remote', labelKey: 'home.hero.remote', filterValue: 'Remote' }
]

const HeroSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSearchQuery = useBrowseJobsStore((state) => state.setSearchQuery)
  const setSelectedLocation = useBrowseJobsStore((state) => state.setSelectedLocation)

  const [query, setQuery] = useState('')
  const [selectedLocId, setSelectedLocId] = useState('all')
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)

  const activeOption = locationOptions.find((opt) => opt.id === selectedLocId) ?? locationOptions[0]

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setSearchQuery(query.trim())
    setSelectedLocation(activeOption.filterValue)
    navigate('/jobs')
  }

  const handleTagClick = (tagLabel: string) => {
    setSearchQuery(tagLabel)
    navigate('/jobs')
  }

  return (
    <section className='relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.18),transparent_65%),radial-gradient(circle_at_85%_30%,rgba(14,165,233,0.12),transparent_40%),linear-gradient(180deg,#faf8ff_0%,#ffffff_100%)] py-16 sm:py-20 lg:py-24'>
      {/* Ambient background decoration */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent' />
      <div className='pointer-events-none absolute left-1/4 top-12 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl' />
      <div className='pointer-events-none absolute right-1/4 top-20 h-64 w-64 rounded-full bg-fuchsia-300/15 blur-3xl' />

      <Container className='relative'>
        <div className='mx-auto max-w-5xl text-center'>
          {/* Live verification badge */}
          <div className='inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 shadow-[0_2px_12px_rgba(124,58,237,0.08)] backdrop-blur'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            </span>
            <span className='text-xs font-semibold tracking-wide text-slate-700'>
              {t('home.hero.liveBadge')} <span className='text-slate-300'>•</span>{' '}
              <span className='bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent font-bold'>
                {t('home.hero.openingsBadge')}
              </span>
            </span>
            <Sparkles className='h-3.5 w-3.5 text-violet-600' />
          </div>

          {/* Heading */}
          <div className='mt-6 space-y-4'>
            <h1 className='text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[4.2rem]'>
              <span>{t('home.hero.titlePrefix')}{' '}</span>
              <span className='relative inline-block'>
                <span className='bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-500 bg-clip-text text-transparent'>
                  {t('home.hero.titleHighlight')}
                </span>
              </span>
            </h1>

            <p className='mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg'>
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleSearch}
            className='mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-300 focus-within:border-violet-300 focus-within:shadow-[0_24px_70px_-10px_rgba(124,58,237,0.18)]'
          >
            <div className='grid gap-2 md:grid-cols-[1.3fr_1fr_auto]'>
              {/* Job title / keyword input */}
              <label className='flex h-14 items-center gap-3 rounded-2xl bg-slate-50/70 px-4 transition-colors focus-within:bg-white md:bg-transparent'>
                <Search className='h-5 w-5 shrink-0 text-violet-600' />
                <input
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.hero.searchPlaceholder')}
                  className='w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400'
                />
              </label>

              {/* Location Selector */}
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className='flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-50/70 px-4 text-left transition-colors hover:bg-slate-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 md:border-l md:border-slate-200/80 md:bg-transparent'
                >
                  <span className='flex items-center gap-3 truncate'>
                    <MapPin className='h-5 w-5 shrink-0 text-violet-600' />
                    <span className='text-sm font-medium text-slate-700'>{t(activeOption.labelKey)}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isLocationDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {isLocationDropdownOpen && (
                  <div className='absolute left-0 top-full z-30 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]'>
                    {locationOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type='button'
                        onClick={() => {
                          setSelectedLocId(opt.id)
                          setIsLocationDropdownOpen(false)
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                          selectedLocId === opt.id
                            ? 'bg-violet-50 text-violet-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t(opt.labelKey)}
                        {selectedLocId === opt.id && <span className='h-1.5 w-1.5 rounded-full bg-violet-600' />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <PrimaryButton type='submit' className='h-14 rounded-2xl px-8 text-sm font-bold shadow-md'>
                <span>{t('home.hero.searchBtn')}</span>
                <Search className='h-4 w-4' />
              </PrimaryButton>
            </div>
          </form>

          {/* Popular Search Tags */}
          <div className='mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500'>
            <span className='mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <TrendingUp className='h-3.5 w-3.5 text-violet-500' />
              {t('home.hero.popularSearches')}
            </span>
            {popularTags.map((tag) => (
              <Tag
                key={tag.label}
                label={tag.label}
                onClick={() => handleTagClick(tag.label)}
                className='border-white/80 bg-white/90 shadow-sm'
              />
            ))}
          </div>

          {/* Bento Stats Strip */}
          <div className='mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4'>
            <div className='bento-card p-4 text-left sm:p-5'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'>
                  <Briefcase className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-xl font-extrabold text-slate-900 sm:text-2xl'>1,500+</p>
                  <p className='text-xs font-medium text-slate-500'>{t('home.hero.statJobs')}</p>
                </div>
              </div>
            </div>

            <div className='bento-card p-4 text-left sm:p-5'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'>
                  <Building2 className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-xl font-extrabold text-slate-900 sm:text-2xl'>350+</p>
                  <p className='text-xs font-medium text-slate-500'>{t('home.hero.statCompanies')}</p>
                </div>
              </div>
            </div>

            <div className='bento-card p-4 text-left sm:p-5'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'>
                  <Zap className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-xl font-extrabold text-slate-900 sm:text-2xl'>5,000+</p>
                  <p className='text-xs font-medium text-slate-500'>{t('home.hero.statEngineers')}</p>
                </div>
              </div>
            </div>

            <div className='bento-card p-4 text-left sm:p-5'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300'>
                  <Clock className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-xl font-extrabold text-slate-900 sm:text-2xl'>48h</p>
                  <p className='text-xs font-medium text-slate-500'>Rapid Cycles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
