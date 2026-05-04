import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Building2, Mail, MapPin, Globe, Users, Briefcase, TrendingUp } from 'lucide-react'

import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import { useAuthStore } from '@/store/authStore'
import { getCompanyByIdApi } from '@/api/company'

const EmployerCompanyInfoPage = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const companyId = user?.employee?.company?.company_id

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyByIdApi(companyId!),
    enabled: !!companyId
  })

  const company = data?.company

  if (isLoading) {
    return (
      <div className='min-w-0 space-y-6'>
        <EmployerPageHeader
          eyebrow={t('employer.company.eyebrow')}
          title={t('employer.company.title')}
          description={t('employer.company.noCompanyDescription')}
        />
        <div className='animate-pulse space-y-6'>
          <div className='h-48 rounded-3xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800' />
          <div className='grid gap-6 lg:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-32 rounded-2xl bg-slate-200 dark:bg-slate-700' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className='min-w-0 space-y-6'>
        <EmployerPageHeader
          eyebrow={t('employer.company.eyebrow')}
          title={t('employer.company.title')}
          description={t('employer.company.noCompanyDescription')}
        />
        <div className='rounded-3xl border-2 border-dashed border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-12 text-center dark:border-red-900/30 dark:from-red-950/20 dark:to-orange-950/20'>
          <div className='mx-auto mb-4 inline-flex h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30'>
            <Building2 className='m-auto h-8 w-8 text-red-500 dark:text-red-400' />
          </div>
          <p className='text-lg font-semibold text-red-600 dark:text-red-400'>
            {error ? t('employer.overview.failedTitle') : t('employer.company.noCompany')}
          </p>
          <p className='mt-2 text-sm text-red-500 dark:text-red-300'>
            {error ? 'Please try refreshing the page' : 'No company data available'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-w-0 space-y-8'>
      {/* Hero Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-2xl dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 lg:p-12'>
        {/* Background decoration */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10' />
          <div className='absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10' />
        </div>

        <div className='relative z-10'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex-1'>
              <h1 className='text-4xl font-bold text-white lg:text-5xl'>{company.company_name}</h1>
              <p className='mt-3 text-lg text-violet-100'>{company.profile_description || 'Welcome to our company'}</p>
              <div className='mt-6 flex flex-wrap gap-2'>
                {company.company_industry && (
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
                    {company.company_industry}
                  </span>
                )}
                {company.company_size && (
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
                    {company.company_size} {t('employer.company.staffCount').toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            label: t('employer.company.industry'),
            value: company.company_industry,
            icon: Briefcase,
            color: 'from-blue-600 to-cyan-600'
          },
          {
            label: t('employer.company.size'),
            value: company.company_size,
            icon: Users,
            color: 'from-purple-600 to-pink-600'
          },
          {
            label: t('employer.company.location'),
            value: company.city,
            icon: MapPin,
            color: 'from-orange-600 to-red-600'
          },
          {
            label: t('employer.company.email'),
            value: company.company_email,
            icon: Mail,
            color: 'from-green-600 to-emerald-600'
          }
        ].map((info, idx) => {
          const Icon = info.icon
          return (
            <div
              key={idx}
              className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 transition-all duration-300 hover:shadow-lg dark:from-slate-800/50 dark:to-slate-900/50'
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              />
              <div className='relative z-10'>
                <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${info.color} p-3 text-white`}>
                  <Icon className='h-5 w-5' />
                </div>
                <p className='text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                  {info.label}
                </p>
                <p className='mt-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2'>
                  {info.value || t('employer.company.notSpecified')}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Sections */}
      <div className='grid gap-8 lg:grid-cols-3'>
        {/* About Section - Span 2 columns */}
        {company.profile_description && (
          <div className='lg:col-span-2'>
            <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/30'>
              <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30'>
                    <Briefcase className='h-5 w-5 text-violet-600 dark:text-violet-400' />
                  </div>
                  <h2 className='text-xl font-bold text-slate-900 dark:text-white'>{t('employer.company.about')}</h2>
                </div>
              </div>
              <div className='px-8 py-6'>
                <p className='whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300'>
                  {company.profile_description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Stats */}
        <div className='space-y-6'>
          {/* Staff Count Card */}
          <div className='overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm dark:border-slate-700/50 dark:from-blue-950/20 dark:to-cyan-950/20'>
            <div className='bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-white' />
                <p className='text-sm font-semibold uppercase tracking-widest text-white/80'>
                  {t('employer.company.staffCount')}
                </p>
              </div>
            </div>
            <div className='px-6 py-6'>
              <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                {company.company_size || t('employer.company.notSpecified')}
              </p>
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>Total employees</p>
            </div>
          </div>

          {/* Industry Card */}
          <div className='overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm dark:border-slate-700/50 dark:from-purple-950/20 dark:to-pink-950/20'>
            <div className='bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-white' />
                <p className='text-sm font-semibold uppercase tracking-widest text-white/80'>
                  {t('employer.company.industry')}
                </p>
              </div>
            </div>
            <div className='px-6 py-6'>
              <p className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                {company.company_industry || t('employer.company.notSpecified')}
              </p>
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>Primary sector</p>
            </div>
          </div>

          {/* Website Card */}
          {company.company_website_url && (
            <div className='overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm dark:border-slate-700/50 dark:from-green-950/20 dark:to-emerald-950/20'>
              <div className='bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4'>
                <div className='flex items-center gap-2'>
                  <Globe className='h-5 w-5 text-white' />
                  <p className='text-sm font-semibold uppercase tracking-widest text-white/80'>
                    {t('employer.company.website')}
                  </p>
                </div>
              </div>
              <div className='px-6 py-6'>
                <a
                  href={company.company_website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 line-clamp-2 break-all'
                >
                  {company.company_website_url}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      {(company.company_email || company.city) && (
        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30'>
          <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50'>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white'>Contact Information</h2>
          </div>
          <div className='grid gap-6 px-8 py-6 sm:grid-cols-2'>
            {company.company_email && (
              <div className='flex gap-4'>
                <div className='rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30'>
                  <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-xs font-semibold uppercase text-slate-500 dark:text-slate-400'>Email</p>
                  <a
                    href={`mailto:${company.company_email}`}
                    className='mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    {company.company_email}
                  </a>
                </div>
              </div>
            )}
            {company.city && (
              <div className='flex gap-4'>
                <div className='rounded-lg bg-red-100 p-3 dark:bg-red-900/30'>
                  <MapPin className='h-5 w-5 text-red-600 dark:text-red-400' />
                </div>
                <div>
                  <p className='text-xs font-semibold uppercase text-slate-500 dark:text-slate-400'>Location</p>
                  <p className='mt-1 text-sm font-medium text-slate-900 dark:text-white'>{company.city}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerCompanyInfoPage
