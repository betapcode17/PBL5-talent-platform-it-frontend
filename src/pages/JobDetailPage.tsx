import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  GraduationCap,
  Layers3,
  type LucideIcon,
  Sparkles,
  Users
} from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import JobActionsCard from '@/components/job-detail/JobActionsCard'
import JobCompanyCard from '@/components/job-detail/JobCompanyCard'
import JobDetailHeader from '@/components/job-detail/JobDetailHeader'
import JobDetailSkeleton from '@/components/job-detail/JobDetailSkeleton'
import JobDetailState from '@/components/job-detail/JobDetailState'
import JobDetailTabs from '@/components/job-detail/JobDetailTabs'
import SimilarJobsList from '@/components/job-detail/SimilarJobsList'
import Navbar from '@/components/layout/Navbar'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import Container from '@/components/ui/Container'
import Tag from '@/components/ui/Tag'
import { browseJobs } from '@/data/browse-jobs/jobs'
import { useJobDetail } from '@/hooks/useJobDetail'
import { cn } from '@/lib/utils'
import type { JobDetailSectionId } from '@/types/job-detail'
import {
  buildFallbackSimilarJobs,
  extractTechStack,
  formatDate,
  formatRelativeDate,
  formatSalary,
  getCompanyInitials,
  getJobLocation,
  normalizeTextList,
  splitDescriptionContent
} from '@/utils/jobDetail'

const benefitIcons = [Sparkles, Layers3, CalendarClock, Users]

const sectionTitleClassName = 'text-[1.55rem] font-semibold tracking-[-0.04em] text-slate-950'

type AdditionalInfoItem = {
  label: string
  value: string
  icon: LucideIcon
}

type PageSection = {
  id: JobDetailSectionId
  label: string
}

const isDefined = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { job, similarJobs, status, errorMessage, isBookmarked, isBookmarkLoading, canManageBookmarks, isAuthenticated, toggleBookmark, refetch } =
    useJobDetail(id)
  const [activeSection, setActiveSection] = useState<JobDetailSectionId>('description')
  const [actionNotice, setActionNotice] = useState<string | null>(null)
  const sectionRefs = useRef<Partial<Record<JobDetailSectionId, HTMLElement | null>>>({})

  const browseJob = useMemo(() => browseJobs.find((item) => item.id === id), [id])
  const requirements = useMemo(() => normalizeTextList(job?.requirements), [job?.requirements])
  const benefits = useMemo(() => normalizeTextList(job?.benefits), [job?.benefits])
  const { paragraphs, bulletPoints } = useMemo(() => splitDescriptionContent(job?.description), [job?.description])
  const techStack = useMemo(() => extractTechStack(job, browseJob), [browseJob, job])
  const salaryLabel = useMemo(() => formatSalary(job, browseJob), [browseJob, job])
  const locationLabel = useMemo(() => getJobLocation(job, browseJob), [browseJob, job])
  const companyInitials = useMemo(() => getCompanyInitials(job?.company?.company_name ?? browseJob?.company), [browseJob?.company, job?.company?.company_name])
  const companyLocation = useMemo(
    () => [job?.company?.city, job?.company?.country].filter(Boolean).join(', ') || browseJob?.location || null,
    [browseJob?.location, job?.company?.city, job?.company?.country]
  )

  const additionalInfo = useMemo<AdditionalInfoItem[]>(
    () =>
      [
        job?.workTime
          ? {
              label: 'Work schedule',
              value: job.workTime,
              icon: Clock3
            }
          : null,
        job?.education
          ? {
              label: 'Education',
              value: job.education,
              icon: GraduationCap
            }
          : null,
        typeof job?.numberOfHires === 'number' && job.numberOfHires > 0
          ? {
              label: 'Hiring spots',
              value: `${job.numberOfHires} open positions`,
              icon: Users
            }
          : null,
        job?.deadline
          ? {
              label: 'Application deadline',
              value: formatDate(job.deadline) ?? job.deadline,
              icon: CalendarClock
            }
          : null
      ].filter(isDefined),
    [job?.deadline, job?.education, job?.numberOfHires, job?.workTime]
  )

  const availableSections = useMemo<PageSection[]>(
    () =>
      [
        paragraphs.length > 0 || bulletPoints.length > 0
          ? {
              id: 'description' as const,
              label: 'Description'
            }
          : null,
        requirements.length > 0
          ? {
              id: 'requirements' as const,
              label: 'Requirements'
            }
          : null,
        techStack.length > 0
          ? {
              id: 'tech-stack' as const,
              label: 'Tech Stack'
            }
          : null,
        benefits.length > 0
          ? {
              id: 'benefits' as const,
              label: 'Benefits'
            }
          : null,
        additionalInfo.length > 0
          ? {
              id: 'additional-info' as const,
              label: 'Additional Info'
            }
          : null
      ].filter(isDefined),
    [additionalInfo.length, benefits.length, bulletPoints.length, paragraphs.length, requirements.length, techStack.length]
  )

  const sectionIdSet = useMemo(() => new Set(availableSections.map((section) => section.id)), [availableSections])

  const relatedJobs = useMemo(() => {
    if (similarJobs.length > 0) {
      return similarJobs
    }

    return buildFallbackSimilarJobs(id ?? '', browseJobs)
  }, [id, similarJobs])

  const companyOverview = useMemo(() => {
    if (job?.company?.company_industry || job?.company?.company_type) {
      const details = [job.company.company_industry, job.company.company_type].filter(Boolean).join(' with ')

      return `${job.company.company_name} is hiring for this role as part of its ${details} growth. Review the job details to understand how your background can contribute to the team.`
    }

    return 'This employer has not added a short company overview yet. You can still explore the role details, save the job, and follow up through the company profile.'
  }, [job?.company?.company_industry, job?.company?.company_name, job?.company?.company_type])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    })
    setActionNotice(null)
  }, [id])

  useEffect(() => {
    if (availableSections.length === 0) {
      return
    }

    const hasCurrentSection = availableSections.some((section) => section.id === activeSection)

    if (!hasCurrentSection) {
      setActiveSection(availableSections[0].id)
    }
  }, [activeSection, availableSections])

  useEffect(() => {
    if (status !== 'success' || availableSections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0]

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id as JobDetailSectionId)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6]
      }
    )

    availableSections.forEach((section) => {
      const element = sectionRefs.current[section.id]

      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [availableSections, status])

  const scrollToSection = (sectionId: JobDetailSectionId) => {
    const target = sectionRefs.current[sectionId]

    if (!target) {
      return
    }

    const y = target.getBoundingClientRect().top + window.scrollY - 110

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }

  const handleBookmark = async () => {
    setActionNotice(null)

    if (!job) {
      return
    }

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname
        }
      })
      return
    }

    if (!canManageBookmarks) {
      setActionNotice('Save Job is available for seeker accounts. Please switch to a seeker profile to use bookmarks.')
      return
    }

    const result = await toggleBookmark()

    if (!result.ok) {
      setActionNotice(result.message ?? 'We could not update your saved jobs right now.')
      return
    }

    setActionNotice(result.message ?? (result.bookmarked ? 'Job saved to your bookmarks.' : 'Job removed from your bookmarks.'))
  }

  const handleApply = () => {
    setActionNotice(null)

    if (job?.company?.company_website_url) {
      window.open(job.company.company_website_url, '_blank', 'noopener,noreferrer')
      return
    }

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname
        }
      })
      return
    }

    setActionNotice('Direct application flow is being finalized. For now, you can save this job and review the company profile for the next step.')
  }

  const handleCopyLink = async () => {
    const currentUrl = window.location.href

    try {
      await navigator.clipboard.writeText(currentUrl)
      setActionNotice('Job link copied to clipboard.')
    } catch {
      setActionNotice('We could not copy the link automatically. Please copy the URL from your browser.')
    }
  }

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  const handleShareEmail = () => {
    const subject = `Job opportunity: ${job?.title ?? 'Open role'}`
    const body = `Take a look at this role: ${window.location.href}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
        <Navbar />
        <Container className='max-w-[1380px] py-6 sm:py-8'>
          <JobDetailSkeleton />
        </Container>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
        <Navbar />
        <Container className='max-w-[1380px] py-10 sm:py-14'>
          <JobDetailState
            tone='error'
            title='We could not load this job'
            description={errorMessage ?? 'Something went wrong while loading the job detail page.'}
            onRetry={refetch}
          />
        </Container>
      </div>
    )
  }

  if (!job || status === 'not-found') {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
        <Navbar />
        <Container className='max-w-[1380px] py-10 sm:py-14'>
          <JobDetailState
            title='This job is no longer available'
            description='The role may have been removed, expired, or the link may be incorrect. You can return to the jobs page to continue exploring open positions.'
          />
        </Container>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)] pb-28 lg:pb-10'>
      <Navbar />

      <Container className='max-w-[1380px] py-5 sm:py-6'>
        <div className='space-y-6'>
          <nav aria-label='Breadcrumb' className='overflow-x-auto'>
            <ol className='flex min-w-max items-center gap-2 text-sm text-slate-500'>
              <li>
                <Link to='/' className='transition hover:text-violet-700'>
                  Home
                </Link>
              </li>
              <ChevronRight className='h-4 w-4 text-slate-300' />
              <li>
                <Link to='/jobs' className='transition hover:text-violet-700'>
                  Jobs
                </Link>
              </li>
              <ChevronRight className='h-4 w-4 text-slate-300' />
              <li className='max-w-[60vw] truncate font-medium text-slate-700'>{job.title}</li>
            </ol>
          </nav>

          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
            <main className='space-y-6'>
              <div className='flex items-center'>
                <Link
                  to='/jobs'
                  className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:border-violet-200 hover:text-violet-700'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to jobs
                </Link>
              </div>

              <JobDetailHeader
                title={job.title}
                companyName={job.company?.company_name ?? browseJob?.company ?? 'Hiring Company'}
                companyImage={job.company?.company_image}
                companyInitials={companyInitials}
                location={locationLabel}
                salary={salaryLabel}
                employmentType={job.jobType?.job_type ?? browseJob?.employmentType ?? null}
                workType={job.workType ?? browseJob?.workType ?? null}
                experienceLevel={job.level ?? job.experience ?? browseJob?.experience ?? null}
                category={job.category?.name ?? null}
                isActive={job.isActive}
                postedLabel={formatRelativeDate(job.createdDate) ?? browseJob?.postedAt ?? null}
                updatedLabel={formatDate(job.updatedDate)}
                applicantsCount={null}
              />

              {availableSections.length > 0 ? (
                <div className='sticky top-[78px] z-30 py-1'>
                  <JobDetailTabs sections={availableSections} activeSection={activeSection} onNavigate={scrollToSection} />
                </div>
              ) : null}

              {sectionIdSet.has('description') ? (
                <section
                  id='description'
                  ref={(node) => {
                    sectionRefs.current.description = node
                  }}
                  className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'
                >
                  <div className='space-y-8'>
                    <div>
                      <h2 className={sectionTitleClassName}>Job Description</h2>
                      <div className='mt-5 space-y-4 text-[15px] leading-8 text-slate-600 sm:text-base'>
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    {bulletPoints.length > 0 ? (
                      <div className='rounded-[24px] border border-violet-100 bg-violet-50/70 p-5'>
                        <h3 className='text-lg font-semibold text-slate-900'>Responsibilities</h3>
                        <ul className='mt-4 space-y-3'>
                          {bulletPoints.map((item) => (
                            <li key={item} className='flex items-start gap-3 text-sm leading-7 text-slate-700 sm:text-[15px]'>
                              <CircleCheckBig className='mt-1 h-5 w-5 shrink-0 text-violet-600' />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {sectionIdSet.has('requirements') ? (
                <section
                  id='requirements'
                  ref={(node) => {
                    sectionRefs.current.requirements = node
                  }}
                  className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'
                >
                  <h2 className={sectionTitleClassName}>Requirements</h2>
                  <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                    {requirements.map((requirement) => (
                      <article
                        key={requirement}
                        className='rounded-[22px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]'
                      >
                        <div className='flex items-start gap-3'>
                          <span className='mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700'>
                            <CircleCheckBig className='h-4 w-4' />
                          </span>
                          <p className='text-sm leading-7 text-slate-700 sm:text-[15px]'>{requirement}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {sectionIdSet.has('tech-stack') ? (
                <section
                  id='tech-stack'
                  ref={(node) => {
                    sectionRefs.current['tech-stack'] = node
                  }}
                  className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'
                >
                  <h2 className={sectionTitleClassName}>Tech Stack</h2>
                  <div className='mt-5 flex flex-wrap gap-3'>
                    {techStack.map((item) => (
                      <Tag
                        key={item}
                        label={item}
                        className='rounded-2xl border-violet-100 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:border-violet-200 hover:bg-violet-100'
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {sectionIdSet.has('benefits') ? (
                <section
                  id='benefits'
                  ref={(node) => {
                    sectionRefs.current.benefits = node
                  }}
                  className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'
                >
                  <h2 className={sectionTitleClassName}>Benefits</h2>
                  <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                    {benefits.map((benefit, index) => {
                      const Icon = benefitIcons[index % benefitIcons.length]

                      return (
                        <article
                          key={benefit}
                          className='rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]'
                        >
                          <div className='flex items-start gap-4'>
                            <span className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700'>
                              <Icon className='h-5 w-5' />
                            </span>
                            <div>
                              <h3 className='text-base font-semibold text-slate-900'>{benefit}</h3>
                              <p className='mt-1 text-sm leading-7 text-slate-600'>
                                Benefit details can be clarified during the interview process or on the company profile.
                              </p>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ) : null}

              {sectionIdSet.has('additional-info') ? (
                <section
                  id='additional-info'
                  ref={(node) => {
                    sectionRefs.current['additional-info'] = node
                  }}
                  className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'
                >
                  <h2 className={sectionTitleClassName}>Additional Information</h2>
                  <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                    {additionalInfo.map((item) => {
                      const Icon = item.icon

                      return (
                        <div key={item.label} className='rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4'>
                          <div className='flex items-start gap-3'>
                            <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]'>
                              <Icon className='h-5 w-5' />
                            </span>
                            <div>
                              <dt className='text-sm font-semibold text-slate-900'>{item.label}</dt>
                              <dd className='mt-1 text-sm leading-7 text-slate-600'>{item.value}</dd>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              ) : null}
            </main>

            <aside className='space-y-5 lg:sticky lg:top-24 lg:self-start'>
              <JobActionsCard
                isBookmarked={isBookmarked}
                isBookmarkLoading={isBookmarkLoading}
                onApply={handleApply}
                onToggleBookmark={handleBookmark}
                onCopyLink={handleCopyLink}
                onShareLinkedIn={handleShareLinkedIn}
                onShareEmail={handleShareEmail}
                notice={actionNotice}
              />

              <JobCompanyCard
                companyName={job.company?.company_name ?? browseJob?.company ?? 'Hiring Company'}
                companyImage={job.company?.company_image}
                companyInitials={companyInitials}
                companyType={job.company?.company_type ?? null}
                companyIndustry={job.company?.company_industry ?? null}
                companyLocation={companyLocation}
                companyOverview={companyOverview}
                companyWebsiteUrl={job.company?.company_website_url}
                onFallbackViewCompany={() =>
                  setActionNotice('A dedicated company profile route is not available yet. You can still use the company website or save this job for later.')
                }
              />

              <SimilarJobsList jobs={relatedJobs} />
            </aside>
          </div>
        </div>
      </Container>

      <div className='fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-14px_32px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden'>
        <div className='mx-auto flex max-w-[1380px] items-center gap-3'>
          <OutlineButton
            onClick={handleBookmark}
            disabled={isBookmarkLoading}
            className={cn('h-12 flex-1 rounded-2xl border-slate-200 text-slate-700', isBookmarked ? 'border-violet-200 bg-violet-50 text-violet-700' : '')}
          >
            {isBookmarked ? 'Saved' : 'Save Job'}
          </OutlineButton>
          <PrimaryButton onClick={handleApply} className='h-12 flex-[1.3] rounded-2xl'>
            Apply Now
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
