import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '@/components/ui/Container'
import JobCard from '@/components/ui/JobCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { featuredJobs } from '@/data/jobs'

const filterTabs = [
  { id: 'all', labelKey: 'home.featured.tabAll' },
  { id: 'backend', labelKey: 'home.featured.tabBackend' },
  { id: 'frontend', labelKey: 'home.featured.tabFrontend' },
  { id: 'ai', labelKey: 'home.featured.tabAi' },
  { id: 'remote', labelKey: 'home.featured.tabRemote' }
]

const FeaturedJobsSection = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')

  const filteredJobs = featuredJobs.filter((job) => {
    if (activeTab === 'all') return true
    if (activeTab === 'backend')
      return (
        job.title.toLowerCase().includes('backend') ||
        job.title.toLowerCase().includes('java') ||
        job.skills.includes('Java') ||
        job.skills.includes('Golang')
      )
    if (activeTab === 'frontend')
      return (
        job.title.toLowerCase().includes('frontend') ||
        job.title.toLowerCase().includes('react') ||
        job.skills.includes('React')
      )
    if (activeTab === 'ai')
      return (
        job.title.toLowerCase().includes('ai') ||
        job.skills.includes('Python') ||
        job.skills.includes('LLMs')
      )
    if (activeTab === 'remote')
      return job.location.toLowerCase().includes('remote') || job.badge === 'Remote'
    return true
  })

  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='space-y-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <SectionHeading
            eyebrow={t('home.featured.eyebrow')}
            title={t('home.featured.title')}
            subtitle={t('home.featured.subtitle')}
            accent
          />

          {/* Quick Filter Tabs */}
          <div className='flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1.5'>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  activeTab === tab.id
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Browse More CTA */}
        <div className='flex justify-center pt-6'>
          <Link
            to='/jobs'
            className='inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
          >
            <Sparkles className='h-4 w-4 text-violet-600' />
            <span>{t('home.featured.viewAllJobs')}</span>
            <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default FeaturedJobsSection
