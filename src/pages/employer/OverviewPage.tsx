import { BriefcaseBusiness, CalendarClock, MessageSquareMore, Plus, TrendingUp, UserCheck, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerStatCard from '@/components/employer/EmployerStatCard'
import EmployerJobList from '@/components/employer/EmployerJobList'
import EmployerCandidateList from '@/components/employer/EmployerCandidateList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerDashboard } from '@/hooks/useEmployerData'

const OverviewPage = () => {
  const { i18n, t } = useTranslation()
  const { data, isLoading, error } = useEmployerDashboard()
  const metrics = data?.metrics
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '-'

    return t(`employer.candidates.status.${status}`, { defaultValue: status })
  }

  return (
    <div className='min-w-0 space-y-6'>
      <EmployerPageHeader
        eyebrow={t('employer.overview.eyebrow')}
        title={t('employer.overview.welcomeTitle', {
          name: data?.profile.user.full_name || t('employer.profile.employeeFallback')
        })}
        description={
          data?.profile.company.company_name
            ? t('employer.overview.descriptionWithCompany', { company: data.profile.company.company_name })
            : t('employer.overview.descriptionFallback')
        }
        actions={
          <>
            <Button size='lg' className='w-full rounded-2xl bg-white text-slate-950 hover:bg-white/90 sm:w-auto' asChild>
              <Link to='/employer/jobs/create'>
                <Plus className='h-4 w-4' />
                {t('employer.overview.createJob')}
              </Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='w-full rounded-2xl border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white sm:w-auto'
              asChild
            >
              <Link to='/employer/candidates'>
                <Users className='h-4 w-4' />
                {t('employer.overview.viewCandidates')}
              </Link>
            </Button>
          </>
        }
      />

      {isLoading ? (
        <EmployerEmptyState
          title={t('employer.overview.loadingTitle')}
          description={t('employer.overview.loadingDescription')}
        />
      ) : null}
      {error ? <EmployerEmptyState title={t('employer.overview.failedTitle')} description={error} /> : null}

      {data ? (
        <>
          <section className='grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <EmployerStatCard
              title={t('employer.overview.stats.openJobs')}
              value={String(metrics?.openJobsCount ?? 0)}
              subtitle={t('employer.overview.stats.applicationsReceived', { count: metrics?.totalApplicants ?? 0 })}
              icon={BriefcaseBusiness}
              tone='from-fuchsia-500 to-violet-500'
            />
            <EmployerStatCard
              title={t('employer.overview.stats.newCandidates')}
              value={String(metrics?.newCandidatesCount ?? 0)}
              subtitle={t('employer.overview.stats.last7Days')}
              icon={Users}
              tone='from-sky-500 to-cyan-500'
            />
            <EmployerStatCard
              title={t('employer.overview.stats.interviewSchedule')}
              value={String(metrics?.scheduledInterviewsCount ?? 0)}
              subtitle={t('employer.overview.stats.beingScheduled')}
              icon={CalendarClock}
              tone='from-amber-500 to-orange-500'
            />
            <EmployerStatCard
              title={t('employer.overview.stats.successfulHires')}
              value={String(metrics?.hiredCount ?? 0)}
              subtitle={t('employer.overview.stats.activeChats', { count: metrics?.activeChatsCount ?? 0 })}
              icon={UserCheck}
              tone='from-emerald-500 to-teal-500'
            />
          </section>

          <section className='grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]'>
            <EmployerSectionCard
              title={t('employer.overview.funnel.title')}
              description={t('employer.overview.funnel.description')}
              contentClassName='space-y-4'
              action={
                <div className='rounded-2xl bg-emerald-50 px-3 py-2 text-right dark:bg-emerald-500/10'>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300'>
                    {t('employer.overview.funnel.snapshot')}
                  </p>
                  <p className='mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-700 dark:text-emerald-200'>
                    <TrendingUp className='h-4 w-4' />
                    {t('employer.overview.funnel.live')}
                  </p>
                </div>
              }
            >
              {[
                {
                  label: t('employer.overview.funnel.newCvs'),
                  count: data.pipeline.newApplicants,
                  accent: 'bg-sky-500',
                  width: Math.max(data.pipeline.newApplicants * 12, 16)
                },
                {
                  label: t('employer.overview.funnel.shortlisted'),
                  count: data.pipeline.shortlisted,
                  accent: 'bg-violet-500',
                  width: Math.max(data.pipeline.shortlisted * 12, 16)
                },
                {
                  label: t('employer.overview.funnel.interviews'),
                  count: data.pipeline.interviews,
                  accent: 'bg-amber-500',
                  width: Math.max(data.pipeline.interviews * 12, 16)
                },
                {
                  label: t('employer.overview.funnel.hired'),
                  count: data.pipeline.hired,
                  accent: 'bg-emerald-500',
                  width: Math.max(data.pipeline.hired * 12, 16)
                },
                {
                  label: t('employer.overview.funnel.rejected'),
                  count: data.pipeline.rejected,
                  accent: 'bg-slate-400',
                  width: Math.max(data.pipeline.rejected * 12, 16)
                }
              ].map((stage) => (
                <div key={stage.label} className='min-w-0 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/8 dark:bg-white/5'>
                  <div className='mb-3 flex items-center justify-between gap-3'>
                    <div className='min-w-0 flex items-center gap-3'>
                      <span className={`h-3 w-3 rounded-full ${stage.accent}`} />
                      <p className='truncate font-medium text-slate-900 dark:text-white'>{stage.label}</p>
                    </div>
                    <p className='shrink-0 text-sm text-slate-500 dark:text-slate-400'>
                      {t('employer.overview.funnel.profiles', { count: stage.count })}
                    </p>
                  </div>
                  <div className='h-2.5 rounded-full bg-slate-200 dark:bg-white/10'>
                    <div
                      className={`h-full rounded-full ${stage.accent}`}
                      style={{ width: `${Math.min(stage.width, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </EmployerSectionCard>

            <EmployerSectionCard
              title={t('employer.overview.today.title')}
              description={t('employer.overview.today.description')}
              contentClassName='space-y-4'
            >
              {data.todayInterviews.length === 0 ? (
                <EmployerEmptyState
                  title={t('employer.overview.today.emptyTitle')}
                  description={t('employer.overview.today.emptyDescription')}
                />
              ) : (
                data.todayInterviews.map((item) => (
                  <div key={item.id} className='min-w-0 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/8 dark:bg-white/5'>
                    <p className='break-words text-sm font-semibold text-violet-700 dark:text-violet-300'>
                      {item.interviewDate ? new Date(item.interviewDate).toLocaleString(locale) : t('employer.overview.today.noTime')}
                    </p>
                    <p className='mt-1 break-words font-medium text-slate-900 dark:text-white'>
                      {item.candidateName || t('employer.overview.today.candidate')}
                    </p>
                    <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-400'>{item.jobTitle}</p>
                    <div className='mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-slate-300'>
                      {getStatusLabel(item.status)}
                    </div>
                  </div>
                ))
              )}
            </EmployerSectionCard>
          </section>

          <section className='grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]'>
            <EmployerSectionCard
              title={t('employer.overview.activeJobs.title')}
              description={t('employer.overview.activeJobs.description')}
              action={
                <Button variant='outline' className='w-full rounded-2xl sm:w-auto' asChild>
                  <Link to='/employer/jobs'>{t('employer.overview.activeJobs.viewAll')}</Link>
                </Button>
              }
              contentClassName='space-y-4'
            >
              <EmployerJobList jobs={data.jobs.slice(0, 4)} />
            </EmployerSectionCard>

            <EmployerSectionCard
              title={t('employer.overview.topCandidates.title')}
              description={t('employer.overview.topCandidates.description')}
              action={
                <Button variant='outline' className='w-full rounded-2xl sm:w-auto' asChild>
                  <Link to='/employer/candidates'>
                    <MessageSquareMore className='h-4 w-4' />
                    {t('employer.overview.topCandidates.viewCandidates')}
                  </Link>
                </Button>
              }
              contentClassName='space-y-4'
            >
              <EmployerCandidateList candidates={data.candidates.slice(0, 4)} />
            </EmployerSectionCard>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default OverviewPage
