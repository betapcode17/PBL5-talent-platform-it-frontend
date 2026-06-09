import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  LoaderCircle,
  type LucideIcon,
  Sparkles,
  Upload,
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

import { createApplication, getMyApplicationsApi, uploadApplicationCvApi } from '@/api/applications'
import { getCvDetailApi } from '@/api/cv'

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
const SECTION_SCROLL_OFFSET = 170

type AdditionalInfoItem = {
  label: string
  value: string
  icon: LucideIcon
}

type PageSection = {
  id: JobDetailSectionId
  label: string
}

type ApplyCvOption = 'default' | 'upload'

const isDefined = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()      
  const { job, similarJobs, status, errorMessage, isBookmarked, isBookmarkLoading, canManageBookmarks, isAuthenticated, user, toggleBookmark, refetch } =
    useJobDetail(id)
  const [activeSection, setActiveSection] = useState<JobDetailSectionId>('description')
  const [actionNotice, setActionNotice] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedCvOption, setSelectedCvOption] = useState<ApplyCvOption>('default')
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null)
  const [defaultCvUrl, setDefaultCvUrl] = useState<string | null>(null)
  const [isLoadingCvOptions, setIsLoadingCvOptions] = useState(false)
  const [isUploadingApplyCv, setIsUploadingApplyCv] = useState(false)
  const [applyModalNotice, setApplyModalNotice] = useState<string | null>(null)
  const selectedCvUrl = defaultCvUrl
  const setCvUploadError = setApplyModalNotice
  const sectionRefs = useRef<Partial<Record<JobDetailSectionId, HTMLElement | null>>>({})
  const isManualSectionScrollRef = useRef(false)
  const manualSectionScrollTimeoutRef = useRef<number | null>(null)

  const browseJob = useMemo(() => browseJobs.find((item) => item.id === id), [id])
  const requirements = useMemo(() => normalizeTextList(job?.requirements), [job?.requirements])
  const benefits = useMemo(() => normalizeTextList(job?.benefits), [job?.benefits])
  const { paragraphs, bulletPoints } = useMemo(() => splitDescriptionContent(job?.description), [job?.description])
  const techStack = useMemo(() => extractTechStack(job, browseJob), [browseJob, job])
  const salaryLabel = useMemo(() => formatSalary(job, browseJob), [browseJob, job])
  const locationLabel = useMemo(() => getJobLocation(job, browseJob), [browseJob, job])
  const companyInitials = useMemo(
    () => getCompanyInitials(job?.company?.company_name ?? browseJob?.company),
    [browseJob?.company, job?.company?.company_name]
  )
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
    [
      additionalInfo.length,
      benefits.length,
      bulletPoints.length,
      paragraphs.length,
      requirements.length,
      techStack.length
    ]
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActionNotice(null)
    setHasApplied(false)
    setIsApplyModalOpen(false)
    setSelectedCvOption('default')
    setSelectedCvFile(null)
    setDefaultCvUrl(null)
    setIsLoadingCvOptions(false)
    setIsUploadingApplyCv(false)
    setApplyModalNotice(null)
  }, [id])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'SEEKER' || !job?.id) {
      setHasApplied(false)
      return
    }

    let cancelled = false

    getMyApplicationsApi({ page: 1, limit: 100 })
      .then((response) => {
        if (cancelled) return
        setHasApplied(response.applications.some((application) => application.job.id === job.id))
      })
      .catch(() => {
        if (cancelled) return
        setHasApplied(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, job?.id, user?.role])

  useEffect(() => {
    if (availableSections.length === 0) {
      return
    }

    const hasCurrentSection = availableSections.some((section) => section.id === activeSection)

    if (!hasCurrentSection) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(availableSections[0].id)
    }
  }, [activeSection, availableSections])

  useEffect(() => {
    if (status !== 'success' || availableSections.length === 0) {
      return
    }

    let animationFrame = 0

    const updateActiveSection = () => {
      if (isManualSectionScrollRef.current) {
        return
      }

      const anchorY = 220
      const sections = availableSections
        .map((section) => {
          const element = sectionRefs.current[section.id]
          return element ? { id: section.id, rect: element.getBoundingClientRect() } : null
        })
        .filter(isDefined)

      const containingSection = sections.find((section) => section.rect.top <= anchorY && section.rect.bottom > anchorY)

      if (containingSection) {
        setActiveSection(containingSection.id)
        return
      }

      const previousSection = sections
        .filter((section) => section.rect.top <= anchorY)
        .sort((left, right) => right.rect.top - left.rect.top)[0]

      const nextSection = sections
        .filter((section) => section.rect.top > anchorY)
        .sort((left, right) => left.rect.top - right.rect.top)[0]

      setActiveSection(previousSection?.id ?? nextSection?.id ?? availableSections[0].id)
    }

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateActiveSection)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [availableSections, status])

  useEffect(() => {
    return () => {
      if (manualSectionScrollTimeoutRef.current) {
        window.clearTimeout(manualSectionScrollTimeoutRef.current)
      }
    }
  }, [])

  const scrollToSection = (sectionId: JobDetailSectionId) => {
    const target = sectionRefs.current[sectionId]

    if (!target) {
      return
    }

    setActiveSection(sectionId)
    isManualSectionScrollRef.current = true

    if (manualSectionScrollTimeoutRef.current) {
      window.clearTimeout(manualSectionScrollTimeoutRef.current)
    }

    const y = target.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })

    manualSectionScrollTimeoutRef.current = window.setTimeout(() => {
      isManualSectionScrollRef.current = false
    }, 800)
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

    setActionNotice(
      result.message ?? (result.bookmarked ? 'Job saved to your bookmarks.' : 'Job removed from your bookmarks.')
    )
  }

  const openApplyModal = async () => {
    if (!user?.id) {
      return
    }

    setIsLoadingCvOptions(true)
    setApplyModalNotice(null)
    setSelectedCvFile(null)

    try {
      const cvDetail = await getCvDetailApi(user.id)
      const existingCvUrl = cvDetail.cvUrl ?? null

      setDefaultCvUrl(existingCvUrl)
      setSelectedCvOption(existingCvUrl ? 'default' : 'upload')
      setIsApplyModalOpen(true)

      if (!existingCvUrl) {
        setApplyModalNotice('Bạn chưa có CV mặc định. Hãy tải lên một CV để hoàn tất ứng tuyển.')
      }
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null

      setActionNotice(message || 'Không thể tải thông tin CV lúc này. Vui lòng thử lại sau ít phút.')
    } finally {
      setIsLoadingCvOptions(false)
    }
  }

  const closeApplyModal = () => {
    if (isApplying || isUploadingApplyCv) {
      return
    }

    setIsApplyModalOpen(false)
    setSelectedCvFile(null)
    setApplyModalNotice(null)
  }

  const handleSubmitApplicationLegacy = async () => {
    setActionNotice(null)

    if (!job?.id || !selectedCvUrl) {
      setCvUploadError('Ban phai chon CV hoac upload CV moi truoc khi ung tuyen.')
      return
    }

    setIsApplying(true)

    try {
      await createApplication({ jobId: job.id, cvUrl: selectedCvUrl })
      setHasApplied(true)
      setIsApplyModalOpen(false)
      setActionNotice('Application submitted successfully. The employer can now review your CV.')
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      const status =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : null

      if (status === 409) {
        setHasApplied(true)
        setIsApplyModalOpen(false)
        setActionNotice('Bạn đã ứng tuyển vị trí này.')
        return
      }

      setCvUploadError(message || 'We could not submit your application right now. Please try again in a moment.')
    } finally {
      setIsApplying(false)
    }
  }
  void handleSubmitApplicationLegacy

  const handleApply = async () => {
    setActionNotice(null)

    if (!job?.id) {
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

    if (user?.role !== 'SEEKER') {
      setActionNotice('Only seeker accounts can apply directly. Please switch to a seeker profile to apply for this job.')
      return
    }

    if (hasApplied) {
      setActionNotice('Bạn đã ứng tuyển vị trí này.')
      return
    }

    await openApplyModal()
  }

  const submitApplication = async () => {
    if (!job?.id) {
      return
    }

    let cvUrl = defaultCvUrl

    if (selectedCvOption === 'upload') {
      if (!selectedCvFile) {
        setApplyModalNotice('Vui lòng chọn file CV trước khi ứng tuyển.')
        return
      }

      setIsUploadingApplyCv(true)

      try {
        const uploadResult = await uploadApplicationCvApi(selectedCvFile)
        cvUrl = uploadResult.cvUrl
      } catch (error) {
        const message = error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null

        setApplyModalNotice(message || 'Không thể tải CV lên lúc này. Vui lòng thử lại sau.')
        return
      } finally {
        setIsUploadingApplyCv(false)
      }
    }

    if (!cvUrl) {
      setApplyModalNotice('Vui lòng chọn CV mặc định hoặc tải lên một CV khác để ứng tuyển.')
      return
    }

    setIsApplying(true)

    try {
      await createApplication({ jobId: job.id, cvUrl })
      setHasApplied(true)
      setIsApplyModalOpen(false)
      setSelectedCvFile(null)
      setActionNotice('Ứng tuyển thành công. Nhà tuyển dụng đã có thể xem hồ sơ của bạn.')
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null
      const status = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status
        : null

      if (status === 409) {
        setHasApplied(true)
        setIsApplyModalOpen(false)
        setActionNotice('Bạn đã ứng tuyển vị trí này.')
        return
      }

      setApplyModalNotice(message || 'Không thể gửi hồ sơ lúc này. Vui lòng thử lại sau ít phút.')
    } finally {
      setIsApplying(false)
    }
  }

  const handleCopyLink = async () => {
    const currentUrl = window.location.href
    setActionNotice(null)

    try {
      await navigator.clipboard.writeText(currentUrl)
      window.setTimeout(() => setActionNotice('Job link copied to clipboard.'), 0)
    } catch {
      window.setTimeout(() => setActionNotice('We could not copy the link automatically. Please copy the URL from your browser.'), 0)
    }
  }

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    const popup = window.open(shareUrl, '_blank', 'noopener,noreferrer')
    setActionNotice(null)

    if (!popup) {
      window.setTimeout(() => setActionNotice('Your browser blocked the LinkedIn share window. Please allow popups and try again.'), 0)
    }
  }

  const handleShareEmail = () => {
    const subject = `Job opportunity: ${job?.title ?? 'Open role'}`
    const body = `Take a look at this role: ${window.location.href}`
    const link = document.createElement('a')
    link.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
        <Container className='max-w-[1380px] py-6 sm:py-8'>
          <JobDetailSkeleton />
        </Container>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
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
            <main className='space-y-8'>
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
                <div className='sticky top-[78px] z-30 py-2'>
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
                            <li
                              key={item}
                              className='flex items-start gap-3 text-sm leading-7 text-slate-700 sm:text-[15px]'
                            >
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
                isApplying={isApplying || isLoadingCvOptions}
                hasApplied={hasApplied}
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
                  setActionNotice(
                    'A dedicated company profile route is not available yet. You can still use the company website or save this job for later.'
                  )
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
            className={cn(
              'h-12 flex-1 rounded-2xl border-slate-200 text-slate-700',
              isBookmarked ? 'border-violet-200 bg-violet-50 text-violet-700' : ''
            )}
          >
            {isBookmarked ? 'Saved' : 'Save Job'}
          </OutlineButton>
          <PrimaryButton
            onClick={handleApply}
            disabled={isApplying || isLoadingCvOptions || hasApplied}
            className={cn(
              'h-12 flex-[1.3] rounded-2xl disabled:cursor-not-allowed disabled:opacity-70',
              hasApplied && 'bg-emerald-600 shadow-[0_14px_32px_rgba(16,185,129,0.22)] hover:bg-emerald-600'
            )}
          >
            {isApplying || isLoadingCvOptions ? 'Đang chuẩn bị...' : hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
          </PrimaryButton>
        </div>
      </div>

      {isApplyModalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
            <div className='border-b border-slate-200 bg-slate-50 px-6 py-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-semibold text-slate-950'>Chọn CV để ứng tuyển</h2>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    Bạn có thể dùng CV mặc định hiện có hoặc tải lên một CV khác chỉ cho lần ứng tuyển này.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={closeApplyModal}
                  disabled={isApplying || isUploadingApplyCv}
                  className='rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Đóng
                </button>
              </div>
            </div>

            <div className='space-y-4 px-6 py-6'>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-4 rounded-[24px] border p-5 transition',
                  selectedCvOption === 'default'
                    ? 'border-violet-300 bg-violet-50/70'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <input
                  type='radio'
                  name='apply-cv-option'
                  value='default'
                  checked={selectedCvOption === 'default'}
                  onChange={() => setSelectedCvOption('default')}
                  disabled={!defaultCvUrl || isApplying || isUploadingApplyCv}
                  className='mt-1 h-4 w-4 accent-violet-600'
                />
                <div className='flex-1'>
                  <div className='flex items-center gap-2 text-base font-semibold text-slate-900'>
                    <FileText className='h-5 w-5 text-violet-600' />
                    CV mặc định
                  </div>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    {defaultCvUrl
                      ? 'Dùng file CV hiện đang lưu trong hồ sơ seeker của bạn.'
                      : 'Hiện bạn chưa có CV mặc định trong hồ sơ.'}
                  </p>
                  {defaultCvUrl ? (
                    <a
                      href={defaultCvUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800'
                    >
                      Xem CV hiện tại
                    </a>
                  ) : null}
                </div>
              </label>

              <label
                className={cn(
                  'flex cursor-pointer items-start gap-4 rounded-[24px] border p-5 transition',
                  selectedCvOption === 'upload'
                    ? 'border-sky-300 bg-sky-50/70'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <input
                  type='radio'
                  name='apply-cv-option'
                  value='upload'
                  checked={selectedCvOption === 'upload'}
                  onChange={() => setSelectedCvOption('upload')}
                  disabled={isApplying || isUploadingApplyCv}
                  className='mt-1 h-4 w-4 accent-sky-600'
                />
                <div className='flex-1'>
                  <div className='flex items-center gap-2 text-base font-semibold text-slate-900'>
                    <Upload className='h-5 w-5 text-sky-600' />
                    Tải lên CV khác
                  </div>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    File này chỉ dùng cho lần ứng tuyển hiện tại, không ghi đè CV mặc định của bạn.
                  </p>
                  <input
                    type='file'
                    accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    onChange={(event) => {
                      setSelectedCvOption('upload')
                      setSelectedCvFile(event.target.files?.[0] ?? null)
                      setApplyModalNotice(null)
                    }}
                    disabled={isApplying || isUploadingApplyCv}
                    className='mt-4 block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:font-semibold file:text-sky-700 hover:border-sky-300'
                  />
                  {selectedCvFile ? (
                    <p className='mt-3 text-sm font-medium text-slate-700'>{selectedCvFile.name}</p>
                  ) : null}
                </div>
              </label>

              {applyModalNotice ? (
                <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                  {applyModalNotice}
                </div>
              ) : null}
            </div>

            <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end'>
              <OutlineButton
                onClick={closeApplyModal}
                disabled={isApplying || isUploadingApplyCv}
                className='rounded-2xl border-slate-200 text-slate-700'
              >
                Hủy
              </OutlineButton>
              <PrimaryButton
                onClick={submitApplication}
                disabled={isApplying || isUploadingApplyCv}
                className='rounded-2xl'
              >
                {isUploadingApplyCv ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : null}
                {isApplying ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : null}
                {isUploadingApplyCv ? 'Đang tải CV...' : isApplying ? 'Đang ứng tuyển...' : 'Xác nhận ứng tuyển'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default JobDetailPage
