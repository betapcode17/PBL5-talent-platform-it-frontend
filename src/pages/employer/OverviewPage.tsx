import { BriefcaseBusiness, CalendarClock, MessageSquareMore, Plus, TrendingUp, UserCheck, Users } from 'lucide-react'
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
  const { data, isLoading, error } = useEmployerDashboard()

  const metrics = data?.metrics

  return (
    <div className='space-y-6'>
      <EmployerPageHeader
        eyebrow='Recruitment command center'
        title={`Welcome ${data?.profile.user.full_name || 'Employer'}, how is your pipeline looking today?`}
        description={
          data?.profile.company.company_name
            ? `You are managing recruitment activities for ${data.profile.company.company_name}. Data below is fetched directly from the current system backend.`
            : 'Track recruitment performance, new candidates, and interview schedules in one place.'
        }
        actions={
          <>
            <Button size='lg' className='rounded-2xl bg-white text-slate-950 hover:bg-white/90'>
              <Plus className='h-4 w-4' />
              Create New Job Post
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='rounded-2xl border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white'
              asChild
            >
              <Link to='/employer/candidates'>
                <Users className='h-4 w-4' />
                View Candidate List
              </Link>
            </Button>
          </>
        }
      />

      {isLoading ? (
        <EmployerEmptyState
          title='Loading dashboard'
          description='System is aggregating recruitment data from backend.'
        />
      ) : null}
      {error ? <EmployerEmptyState title='Failed to load dashboard' description={error} /> : null}

      {data ? (
        <>
          <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <EmployerStatCard
              title='Open Job Postings'
              value={String(metrics?.openJobsCount ?? 0)}
              subtitle={`${metrics?.totalApplicants ?? 0} applications received`}
              icon={BriefcaseBusiness}
              tone='from-fuchsia-500 to-violet-500'
            />
            <EmployerStatCard
              title='New Candidates'
              value={String(metrics?.newCandidatesCount ?? 0)}
              subtitle='In the last 7 days'
              icon={Users}
              tone='from-sky-500 to-cyan-500'
            />
            <EmployerStatCard
              title='Interview Schedule'
              value={String(metrics?.scheduledInterviewsCount ?? 0)}
              subtitle='Being scheduled'
              icon={CalendarClock}
              tone='from-amber-500 to-orange-500'
            />
            <EmployerStatCard
              title='Successful Hires'
              value={String(metrics?.hiredCount ?? 0)}
              subtitle={`${metrics?.activeChatsCount ?? 0} active chats`}
              icon={UserCheck}
              tone='from-emerald-500 to-teal-500'
            />
          </section>

          <section className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
            <EmployerSectionCard
              title='Recruitment Funnel'
              description='Aggregated from current application statuses in the system.'
              contentClassName='space-y-4'
              action={
                <div className='rounded-2xl bg-emerald-50 px-3 py-2 text-right'>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600'>Snapshot</p>
                  <p className='mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-700'>
                    <TrendingUp className='h-4 w-4' />
                    Live
                  </p>
                </div>
              }
            >
              {[
                {
                  label: 'New CVs',
                  count: data.pipeline.newApplicants,
                  accent: 'bg-sky-500',
                  width: Math.max(data.pipeline.newApplicants * 12, 16)
                },
                {
                  label: 'Shortlisted',
                  count: data.pipeline.shortlisted,
                  accent: 'bg-violet-500',
                  width: Math.max(data.pipeline.shortlisted * 12, 16)
                },
                {
                  label: 'Interviews',
                  count: data.pipeline.interviews,
                  accent: 'bg-amber-500',
                  width: Math.max(data.pipeline.interviews * 12, 16)
                },
                {
                  label: 'Hired',
                  count: data.pipeline.hired,
                  accent: 'bg-emerald-500',
                  width: Math.max(data.pipeline.hired * 12, 16)
                },
                {
                  label: 'Rejected',
                  count: data.pipeline.rejected,
                  accent: 'bg-slate-400',
                  width: Math.max(data.pipeline.rejected * 12, 16)
                }
              ].map((stage) => (
                <div key={stage.label} className='rounded-3xl border border-slate-100 bg-slate-50/80 p-4'>
                  <div className='mb-3 flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <span className={`h-3 w-3 rounded-full ${stage.accent}`} />
                      <p className='font-medium text-slate-900'>{stage.label}</p>
                    </div>
                    <p className='text-sm text-slate-500'>{stage.count} hồ sơ</p>
                  </div>
                  <div className='h-2.5 rounded-full bg-slate-200'>
                    <div
                      className={`h-full rounded-full ${stage.accent}`}
                      style={{ width: `${Math.min(stage.width, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </EmployerSectionCard>

            <EmployerSectionCard
              title="Today's Schedule"
              description='Interview schedules occurring today.'
              contentClassName='space-y-4'
            >
              {data.todayInterviews.length === 0 ? (
                <EmployerEmptyState
                  title='No interviews scheduled for today'
                  description='When there are interviews scheduled for today, they will appear here.'
                />
              ) : (
                data.todayInterviews.map((item) => (
                  <div key={item.id} className='rounded-3xl border border-slate-100 bg-slate-50/80 p-4'>
                    <p className='text-sm font-semibold text-violet-700'>
                      {item.interviewDate ? new Date(item.interviewDate).toLocaleString('en-US') : 'No time set'}
                    </p>
                    <p className='mt-1 font-medium text-slate-900'>{item.candidateName || 'Candidate'}</p>
                    <p className='mt-1 text-sm text-slate-500'>{item.jobTitle}</p>
                    <div className='mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                      {item.status}
                    </div>
                  </div>
                ))
              )}
            </EmployerSectionCard>
          </section>

          <section className='grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]'>
            <EmployerSectionCard
              title='Active Job Postings'
              description='Your latest open positions.'
              action={
                <Button variant='outline' className='rounded-2xl' asChild>
                  <Link to='/employer/jobs'>View All</Link>
                </Button>
              }
              contentClassName='space-y-4'
            >
              <EmployerJobList jobs={data.jobs.slice(0, 4)} />
            </EmployerSectionCard>

            <EmployerSectionCard
              title='Top Candidates'
              description='Recently submitted applications from backend.'
              action={
                <Button variant='outline' className='rounded-2xl' asChild>
                  <Link to='/employer/candidates'>
                    <MessageSquareMore className='h-4 w-4' />
                    View Candidates
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
