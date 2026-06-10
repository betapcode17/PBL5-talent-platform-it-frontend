import {
  AlertCircle,
  Bot,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock3,
  FileSearch,
  Gauge,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  UserRound
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { EmployerJobApplicationItem, EmployerJobApplicationsResponse } from '@/@types/employer'
import { getEmployerJobApplicationsApi } from '@/api/employer'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import { useEmployerWorkspace } from '@/components/employer/EmployerWorkspaceContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEmployerJobs } from '@/hooks/useEmployerData'
import { cn } from '@/lib/utils'

type AiScreeningMode = 'fast' | 'deep'
type SortMode = 'newest' | 'aiScore' | 'name'
type AiFilter = 'all' | 'screened' | 'pending' | 'STRONG_MATCH' | 'MATCH' | 'NEEDS_REVIEW' | 'LOW_MATCH'
type ScoreBreakdownEntry = [string, NonNullable<EmployerJobApplicationItem['scoreBreakdown']>[string]]

const statusOptions = ['APPLIED', 'PENDING', 'PASSED', 'ACCEPTED']
const aiRecommendations = ['STRONG_MATCH', 'MATCH', 'NEEDS_REVIEW', 'LOW_MATCH']
const ineligibleScreeningStatuses = new Set(['REJECTED', 'FAILED'])
const riskFlagLabels: Record<string, string> = {
  missing_information: 'Chưa đủ thông tin',
  underqualified: 'Thiếu yêu cầu bắt buộc',
  possibly_overqualified: 'Có thể vượt quá yêu cầu',
  insufficient_information: 'Thiếu dữ liệu hồ sơ',
  llm_judge_failed: 'LLM Judge lỗi, dùng Rule Score',
  llm_judge_skipped_fast_mode: 'Fast Mode: chưa chạy LLM Judge',
  llm_judge_skipped_not_top_n: 'Không nằm trong Top N Deep Judge'
}

const translateAiInsight = (value: string) => {
  const translated = value
    .replace(/\bDap ung tot tieu chi\b/gi, 'Đáp ứng tốt tiêu chí')
    .replace(/\bDap ung tot\b/gi, 'Đáp ứng tốt')
    .replace(/\bCan bo sung\/kiem tra\b/gi, 'Cần bổ sung/kiểm tra')
    .replace(/\bCan bo sung thong tin ve\b/gi, 'Cần bổ sung thông tin về')
    .replace(/\bCan cai thien\b/gi, 'Cần cải thiện')
    .replace(/\bCan xem xet them tieu chi\b/gi, 'Cần xem xét thêm tiêu chí')
    .replace(/\btong kinh nghiem\b/gi, 'tổng kinh nghiệm')
    .replace(/\bkinh nghiem ky nang chinh\b/gi, 'kinh nghiệm kỹ năng chính')
    .replace(/\bAPI \/ ky nang cot loi\b/gi, 'API / kỹ năng cốt lõi')
    .replace(/\bky nang bat buoc\b/gi, 'kỹ năng bắt buộc')
    .replace(/\bky nang uu tien\b/gi, 'kỹ năng ưu tiên')
    .replace(/\blinh vuc nghiep vu\b/gi, 'lĩnh vực nghiệp vụ')
    .replace(/\bngoai ngu \/ hoc van \/ chung chi\b/gi, 'ngoại ngữ / học vấn / chứng chỉ')
    .replace(/\bdu an \/ cuoc thi \/ portfolio\b/gi, 'dự án / cuộc thi / portfolio')
    .replace(/\bnam yeu cau\b/gi, 'năm yêu cầu')
    .replace(/\btrong CV\b/gi, 'trong CV')
    .replace(/\bEnglish reading skills?\b/gi, 'kỹ năng đọc hiểu tiếng Anh')
    .replace(/\bEnglish communication skills?\b/gi, 'kỹ năng giao tiếp tiếng Anh')
    .replace(/\btechnical documentation\b/gi, 'tài liệu kỹ thuật')
    .replace(/\btechnical docs?\b/gi, 'tài liệu kỹ thuật')
    .replace(/\bwork experience\b/gi, 'kinh nghiệm làm việc')
    .replace(/\brequired skills?\b/gi, 'kỹ năng bắt buộc')
    .replace(/\bpreferred skills?\b/gi, 'kỹ năng ưu tiên')
    .replace(/\beducation\b/gi, 'học vấn')
    .replace(/\bcertificates?\b/gi, 'chứng chỉ')
    .replace(/\bdomain\b/gi, 'lĩnh vực nghiệp vụ')
    .replace(
      /kinh nghiệm làm việc trong lĩnh vực nghiệp vụ không được đề cập/gi,
      'Chưa có thông tin về kinh nghiệm lĩnh vực nghiệp vụ'
    )

  return translated.replace(/\bEnglish\b/gi, 'tiếng Anh')
}

const normalizeText = (value?: string | null) => value?.toLowerCase().trim() ?? ''
const normalizeStatus = (value?: string | null) => value?.toUpperCase().trim() ?? ''

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string | string[] } } }).response
    const message = response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }

  return error instanceof Error ? error.message : fallback
}

const getRecommendationLabel = (recommendation?: string | null) => {
  switch (recommendation) {
    case 'STRONG_MATCH':
      return 'Rất phù hợp'
    case 'MATCH':
      return 'Phù hợp'
    case 'NEEDS_REVIEW':
      return 'Cần xem xét'
    case 'LOW_MATCH':
      return 'Ít phù hợp'
    default:
      return 'Chưa lọc'
  }
}

const getRecommendationClassName = (recommendation?: string | null) => {
  switch (recommendation) {
    case 'STRONG_MATCH':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-400/12 dark:text-emerald-100 dark:ring-emerald-300/18'
    case 'MATCH':
      return 'bg-blue-50 text-blue-700 ring-blue-100 dark:bg-sky-400/12 dark:text-sky-100 dark:ring-sky-300/18'
    case 'NEEDS_REVIEW':
      return 'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-400/12 dark:text-amber-100 dark:ring-amber-300/18'
    case 'LOW_MATCH':
      return 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-400/12 dark:text-rose-100 dark:ring-rose-300/18'
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-200/10 dark:text-slate-200 dark:ring-slate-300/12'
  }
}

const getRecommendationTheme = (recommendation?: string | null) => {
  switch (recommendation) {
    case 'STRONG_MATCH':
      return {
        card: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-300/18 dark:bg-emerald-400/8',
        badge:
          'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-400/12 dark:text-emerald-100 dark:ring-emerald-300/18',
        score: 'text-emerald-700 dark:text-emerald-100',
        meter: 'text-emerald-500',
        soft: 'bg-emerald-100/70 dark:bg-emerald-300/12'
      }
    case 'MATCH':
      return {
        card: 'border-sky-200 bg-sky-50/70 dark:border-sky-300/18 dark:bg-sky-400/8',
        badge: 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-400/12 dark:text-sky-100 dark:ring-sky-300/18',
        score: 'text-sky-700 dark:text-sky-100',
        meter: 'text-sky-500',
        soft: 'bg-sky-100/70 dark:bg-sky-300/12'
      }
    case 'NEEDS_REVIEW':
      return {
        card: 'border-amber-200 bg-amber-50/75 dark:border-amber-300/18 dark:bg-amber-400/8',
        badge:
          'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-400/12 dark:text-amber-100 dark:ring-amber-300/18',
        score: 'text-amber-700 dark:text-amber-100',
        meter: 'text-amber-500',
        soft: 'bg-amber-100/75 dark:bg-amber-300/12'
      }
    case 'LOW_MATCH':
      return {
        card: 'border-rose-200 bg-rose-50/75 dark:border-rose-300/18 dark:bg-rose-400/8',
        badge: 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-400/12 dark:text-rose-100 dark:ring-rose-300/18',
        score: 'text-rose-700 dark:text-rose-100',
        meter: 'text-rose-500',
        soft: 'bg-rose-100/75 dark:bg-rose-300/12'
      }
    default:
      return {
        card: 'border-slate-200 bg-slate-50 dark:border-slate-300/14 dark:bg-slate-200/7',
        badge:
          'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-200/10 dark:text-slate-200 dark:ring-slate-300/12',
        score: 'text-slate-700 dark:text-slate-100',
        meter: 'text-slate-500',
        soft: 'bg-slate-100 dark:bg-slate-300/10'
      }
  }
}

const getRiskFlagClassName = (flag: string) =>
  flag === 'underqualified' || flag === 'llm_judge_failed'
    ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-100 dark:ring-rose-300/20'
    : 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-300/20'

const clampPercent = (value?: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

const applicationStageLabels: Record<string, string> = {
  APPLIED: 'Đã ứng tuyển',
  APPLICATION_SUBMITTED: 'Đã nộp hồ sơ',
  APPLICATION_ACCEPTED: 'Đã duyệt hồ sơ',
  APPLICATION_REJECTED: 'Đã từ chối hồ sơ',
  INTERVIEW_SCHEDULED: 'Đã lên lịch phỏng vấn',
  INTERVIEW_RESCHEDULED: 'Đã đổi lịch phỏng vấn',
  INTERVIEW_CANCELLED: 'Đã hủy phỏng vấn',
  INTERVIEW_COMPLETED: 'Đã hoàn thành phỏng vấn'
}

const getApplicationStageLabel = (stage: string) =>
  applicationStageLabels[stage] ??
  stage
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const applicationStatusLabels: Record<string, string> = {
  PENDING: 'Đang chờ xử lý',
  PASSED: 'Đã vượt qua',
  FAILED: 'Không đạt',
  HIRED: 'Đã tuyển',
  REJECTED: 'Đã từ chối',
  APPLIED: 'Đã ứng tuyển',
  REVIEWING: 'Đang xem xét',
  SHORTLISTED: 'Đã vào danh sách ngắn',
  INTERVIEWING: 'Đang phỏng vấn',
  OFFERED: 'Đã gửi đề nghị'
}

const getApplicationStatusLabel = (status: string) =>
  applicationStatusLabels[status.toUpperCase()] ?? getApplicationStageLabel(status)

const screeningRunStatusLabels: Record<string, string> = {
  PENDING: 'Đang chờ',
  RUNNING: 'Đang xử lý',
  COMPLETED: 'Hoàn tất',
  FAILED: 'Thất bại',
  CANCELLED: 'Đã hủy'
}

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatRemainingTime = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined) return 'Đang tính...'
  if (seconds < 60) return `${seconds} giây`

  const minutes = Math.ceil(seconds / 60)
  return `${minutes} phút`
}

const ResumeFilterPage = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'
  const { data: jobsData, isLoading: isJobsLoading, error: jobsError } = useEmployerJobs(1, 100)
  const { aiScreeningTask, resumeAiScreeningTask, runAiScreeningTask } = useEmployerWorkspace()
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [applicationsData, setApplicationsData] = useState<EmployerJobApplicationsResponse | null>(null)
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('__ALL__')
  const [aiFilter, setAiFilter] = useState<AiFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [aiLimit, setAiLimit] = useState(5)
  const [forceAi, setForceAi] = useState(false)
  const [aiScreeningMode, setAiScreeningMode] = useState<AiScreeningMode>('fast')
  const [judgeTopN, setJudgeTopN] = useState(10)
  const [expandedApplicationId, setExpandedApplicationId] = useState<number | null>(null)
  const syncedScreeningCompletionRef = useRef<string | null>(null)

  const jobs = useMemo(() => jobsData?.jobs ?? [], [jobsData])
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId])
  const applications = useMemo(() => applicationsData?.applications ?? [], [applicationsData])
  const isAnyScreeningRunning = aiScreeningTask.status === 'running'
  const isScreening = isAnyScreeningRunning && aiScreeningTask.jobId === selectedJobId
  const screeningResult = aiScreeningTask.jobId === selectedJobId ? aiScreeningTask.result : null
  const screeningError = aiScreeningTask.jobId === selectedJobId ? aiScreeningTask.error : null
  const deepScreeningCandidate = useMemo(
    () =>
      aiScreeningTask.applicationId
        ? applications.find((application) => application.id === aiScreeningTask.applicationId) ?? null
        : null,
    [aiScreeningTask.applicationId, applications]
  )
  const eligibleApplications = useMemo(
    () => applications.filter((application) => !ineligibleScreeningStatuses.has(normalizeStatus(application.status))),
    [applications]
  )
  const screenedCount = eligibleApplications.filter((application) => application.aiScreenedAt).length
  const pendingAiCount = Math.max(eligibleApplications.length - screenedCount, 0)
  const loadApplications = useCallback(async (jobId: number) => {
    setIsApplicationsLoading(true)
    setApplicationsError(null)

    try {
      const data = await getEmployerJobApplicationsApi(jobId, 1, 100)
      setApplicationsData(data)
    } catch (error) {
      setApplicationsData(null)
      setApplicationsError(getErrorMessage(error, 'Không tải được danh sách hồ sơ.'))
    } finally {
      setIsApplicationsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedJobId || jobs.length === 0) return

    const screeningJob = jobs.find((job) => job.id === aiScreeningTask.jobId)
    const jobWithApplicants = jobs.find((job) => job.applicantCount > 0)
    setSelectedJobId(screeningJob?.id ?? jobWithApplicants?.id ?? jobs[0].id)
  }, [aiScreeningTask.jobId, jobs, selectedJobId])

  useEffect(() => {
    if (!selectedJobId || aiScreeningTask.status === 'running') return

    void resumeAiScreeningTask(selectedJobId).catch(() => {
      // Active run recovery errors are exposed by the persistent workspace task.
    })
  }, [aiScreeningTask.status, resumeAiScreeningTask, selectedJobId])

  useEffect(() => {
    if (!selectedJobId) return

    setApplicationsData(null)
    setExpandedApplicationId(null)
    void loadApplications(selectedJobId)
  }, [loadApplications, selectedJobId])

  useEffect(() => {
    if (eligibleApplications.length === 0) return

    setAiLimit((current) => Math.min(current, eligibleApplications.length))
  }, [eligibleApplications.length])

  useEffect(() => {
    if (
      !selectedJobId ||
      aiScreeningTask.status !== 'success' ||
      aiScreeningTask.jobId !== selectedJobId ||
      !aiScreeningTask.completedAt ||
      syncedScreeningCompletionRef.current === aiScreeningTask.completedAt
    ) {
      return
    }

    syncedScreeningCompletionRef.current = aiScreeningTask.completedAt
    setSortMode('aiScore')
    setAiFilter('all')
    if (aiScreeningTask.applicationId) {
      setExpandedApplicationId(aiScreeningTask.applicationId)
    }
    void loadApplications(selectedJobId)
  }, [
    aiScreeningTask.applicationId,
    aiScreeningTask.completedAt,
    aiScreeningTask.jobId,
    aiScreeningTask.status,
    loadApplications,
    selectedJobId
  ])

  const filteredApplications = useMemo(() => {
    const term = normalizeText(searchTerm)

    const filtered = eligibleApplications.filter((application) => {
      const matchesSearch =
        !term ||
        normalizeText(application.candidate.fullName).includes(term) ||
        normalizeText(application.candidate.email).includes(term) ||
        normalizeText(application.currentStage).includes(term) ||
        normalizeText(application.aiSummary).includes(term)

      const matchesStatus = statusFilter === '__ALL__' || normalizeStatus(application.status) === statusFilter

      const matchesAi =
        aiFilter === 'all' ||
        (aiFilter === 'screened' && Boolean(application.aiScreenedAt)) ||
        (aiFilter === 'pending' && !application.aiScreenedAt) ||
        application.aiRecommendation === aiFilter

      return matchesSearch && matchesStatus && matchesAi
    })

    return [...filtered].sort((a, b) => {
      if (sortMode === 'aiScore') {
        return (b.finalScore ?? b.aiScore ?? -1) - (a.finalScore ?? a.aiScore ?? -1)
      }

      if (sortMode === 'name') {
        return normalizeText(a.candidate.fullName).localeCompare(normalizeText(b.candidate.fullName), 'vi')
      }

      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    })
  }, [aiFilter, eligibleApplications, searchTerm, sortMode, statusFilter])

  const handleRunAiScreening = async () => {
    if (!selectedJobId || isAnyScreeningRunning) return

    try {
      await runAiScreeningTask(selectedJobId, {
        limit: aiLimit,
        force: forceAi,
        mode: aiScreeningMode,
        judgeTopN: aiScreeningMode === 'deep' ? judgeTopN : undefined
      })
    } catch {
      // The persistent employer workspace task owns and exposes the error state.
    }
  }

  const handleRunCandidateDeepScreening = useCallback(
    async (applicationId: number) => {
      if (!selectedJobId || isAnyScreeningRunning) return

      setExpandedApplicationId(applicationId)
      try {
        await runAiScreeningTask(selectedJobId, {
          applicationId,
          limit: 1,
          force: true,
          mode: 'deep',
          judgeTopN: 1
        })
      } catch {
        // The persistent employer workspace task owns and exposes the error state.
      }
    },
    [isAnyScreeningRunning, runAiScreeningTask, selectedJobId]
  )

  const handleOpenCandidate = useCallback(
    (applicationId: number) => {
      navigate(`/employer/candidates?applicationId=${applicationId}`)
    },
    [navigate]
  )

  return (
    <div className='min-w-0 space-y-6'>
      <section className='relative overflow-hidden rounded-[24px] border border-white/85 bg-[linear-gradient(135deg,#172033_0%,#334155_48%,#0f766e_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-slate-200/16 dark:shadow-[0_30px_90px_rgba(0,0,0,0.34)]'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between'>
          <div className='min-w-0'>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15'>
              <FileSearch className='h-4 w-4' />
              Lọc hồ sơ
            </div>
            <h1 className='mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl'>
              Lọc nhanh ứng viên theo tin tuyển dụng
            </h1>
          </div>

          <div className='grid min-w-0 grid-cols-3 gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/14 backdrop-blur sm:min-w-[26rem]'>
            <div>
              <p className='text-xs text-slate-200'>Tổng hồ sơ</p>
              <p className='mt-1 text-2xl font-bold'>{eligibleApplications.length}</p>
            </div>
            <div>
              <p className='text-xs text-slate-200'>Đã lọc AI</p>
              <p className='mt-1 text-2xl font-bold'>{screenedCount}</p>
            </div>
            <div>
              <p className='text-xs text-slate-200'>Chưa lọc</p>
              <p className='mt-1 text-2xl font-bold'>{pendingAiCount}</p>
            </div>
          </div>
        </div>
      </section>

      <EmployerSectionCard
        title='Chọn tin tuyển dụng'
        contentClassName='px-4 py-3 sm:px-5 sm:py-4'
      >
        {isJobsLoading ? (
          <EmployerEmptyState title='Đang tải việc làm' description='Hệ thống đang lấy danh sách tin tuyển dụng.' />
        ) : null}

        {jobsError ? <EmployerEmptyState title='Không tải được việc làm' description={jobsError} /> : null}

        {!isJobsLoading && !jobsError ? (
          <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'>
            <label className='min-w-0'>
              <span className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200'>
                Tin tuyển dụng
              </span>
              <select
                value={selectedJobId ?? ''}
                onChange={(event) => setSelectedJobId(Number(event.target.value))}
                className='h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 dark:border-slate-300/14 dark:bg-slate-950/30 dark:text-white dark:focus:ring-violet-400/14'
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.applicantCount} hồ sơ)
                  </option>
                ))}
              </select>
            </label>

            <Button
              variant='outline'
              className='h-10 rounded-xl'
              disabled={!selectedJobId || isApplicationsLoading}
              onClick={() => selectedJobId && loadApplications(selectedJobId)}
            >
              <RefreshCw className={cn('h-4 w-4', isApplicationsLoading ? 'animate-spin' : '')} />
              Làm mới
            </Button>
          </div>
        ) : null}
      </EmployerSectionCard>

      <EmployerSectionCard
        title={
          <span className='flex flex-wrap items-center gap-3'>
            <span>{selectedJob?.title ?? 'Danh sách hồ sơ'}</span>
            <span className='inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-violet-50 px-3 text-sm font-bold text-violet-700 ring-1 ring-violet-100 dark:bg-violet-400/12 dark:text-violet-100 dark:ring-violet-300/18'>
              {eligibleApplications.length}
            </span>
          </span>
        }
        contentClassName='space-y-5'
      >
        <div className='grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_11rem_11rem_11rem]'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Tìm theo tên, email, giai đoạn hoặc tóm tắt AI...'
              className='h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-11 shadow-none focus-visible:bg-white dark:border-slate-300/14 dark:bg-slate-950/20 dark:focus-visible:bg-slate-950/35'
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className='h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none dark:border-slate-300/14 dark:bg-slate-950/30 dark:text-white'
          >
            <option value='__ALL__'>Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getApplicationStatusLabel(status)}
              </option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className='h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none dark:border-slate-300/14 dark:bg-slate-950/30 dark:text-white'
          >
            <option value='newest'>Mới nhất</option>
            <option value='aiScore'>Điểm AI cao nhất</option>
            <option value='name'>Tên ứng viên</option>
          </select>

          <select
            value={aiFilter}
            onChange={(event) => setAiFilter(event.target.value as AiFilter)}
            className='h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none dark:border-slate-300/14 dark:bg-slate-950/30 dark:text-white'
          >
            <option value='all'>Tất cả AI</option>
            <option value='screened'>Đã lọc AI</option>
            <option value='pending'>Chưa lọc AI</option>
            {aiRecommendations.map((recommendation) => (
              <option key={recommendation} value={recommendation}>
                {getRecommendationLabel(recommendation)}
              </option>
            ))}
          </select>
        </div>

        <div className='overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/55 to-indigo-50/70 shadow-[0_18px_45px_rgba(79,70,229,0.08)] dark:border-violet-300/16 dark:from-slate-950/35 dark:via-violet-400/7 dark:to-indigo-400/10'>
          <div className='border-b border-violet-100/80 px-4 py-4 sm:px-5 dark:border-violet-300/14'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='flex min-w-0 items-start gap-3'>
                <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)]'>
                  <Bot className='h-5 w-5' />
                </span>
                <div className='min-w-0'>
                  <p className='text-sm font-bold text-slate-950 dark:text-white'>Thiết lập lọc hồ sơ bằng AI</p>
                  <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300'>
                    Chọn mức độ phân tích phù hợp trước khi bắt đầu.
                  </p>
                </div>
              </div>
              <span className='rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-bold text-violet-700 dark:border-violet-300/18 dark:bg-slate-950/25 dark:text-violet-100'>
                {eligibleApplications.length} hồ sơ khả dụng
              </span>
            </div>

            <div className='mt-4 grid gap-3 md:grid-cols-2'>
              <button
                type='button'
                aria-pressed={aiScreeningMode === 'fast'}
                onClick={() => setAiScreeningMode('fast')}
                className={cn(
                  'group flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35',
                  aiScreeningMode === 'fast'
                    ? 'border-violet-300 bg-white text-slate-950 shadow-[0_12px_30px_rgba(79,70,229,0.12)] dark:border-violet-300/35 dark:bg-violet-300/12 dark:text-white'
                    : 'border-slate-200/80 bg-white/45 text-slate-700 hover:border-violet-200 hover:bg-white/80 dark:border-slate-300/12 dark:bg-slate-950/15 dark:text-slate-200 dark:hover:border-violet-300/25 dark:hover:bg-slate-200/8'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                    aiScreeningMode === 'fast'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600 dark:bg-slate-200/10 dark:text-slate-300'
                  )}
                >
                  <Sparkles className='h-5 w-5' />
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-bold'>Chế độ nhanh</span>
                    <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-100'>
                      Nhanh
                    </span>
                  </span>
                  <span className='mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-300'>
                    Chấm điểm toàn bộ hồ sơ bằng bộ tiêu chí.
                  </span>
                </span>
              </button>

              <button
                type='button'
                aria-pressed={aiScreeningMode === 'deep'}
                onClick={() => setAiScreeningMode('deep')}
                className={cn(
                  'group flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35',
                  aiScreeningMode === 'deep'
                    ? 'border-violet-300 bg-white text-slate-950 shadow-[0_12px_30px_rgba(79,70,229,0.12)] dark:border-violet-300/35 dark:bg-violet-300/12 dark:text-white'
                    : 'border-slate-200/80 bg-white/45 text-slate-700 hover:border-violet-200 hover:bg-white/80 dark:border-slate-300/12 dark:bg-slate-950/15 dark:text-slate-200 dark:hover:border-violet-300/25 dark:hover:bg-slate-200/8'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                    aiScreeningMode === 'deep'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600 dark:bg-slate-200/10 dark:text-slate-300'
                  )}
                >
                  <FileSearch className='h-5 w-5' />
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-bold'>Chế độ chuyên sâu</span>
                    <span className='rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:bg-violet-400/12 dark:text-violet-100'>
                      Chi tiết
                    </span>
                  </span>
                  <span className='mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-300'>
                    Phân tích kỹ nhóm hồ sơ tiềm năng nhất.
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className='grid gap-3 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end'>
            <label className='min-w-0'>
              <span className='mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200'>
                Số hồ sơ chạy AI
              </span>
              <Input
                type='number'
                min={1}
                max={eligibleApplications.length}
                value={aiLimit}
                onChange={(event) =>
                  setAiLimit(Math.max(1, Math.min(eligibleApplications.length, Number(event.target.value) || 1)))
                }
                disabled={eligibleApplications.length === 0}
                className='h-11 rounded-xl border-violet-200 bg-white/90 shadow-none dark:border-violet-300/18 dark:bg-slate-950/30'
              />
            </label>

            <label className={cn('min-w-0 transition-opacity', aiScreeningMode === 'fast' && 'opacity-55')}>
              <span className='mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200'>
                Hồ sơ đánh giá chuyên sâu
              </span>
              <Input
                type='number'
                min={1}
                max={50}
                value={judgeTopN}
                disabled={aiScreeningMode === 'fast'}
                onChange={(event) => setJudgeTopN(Math.max(1, Math.min(50, Number(event.target.value) || 1)))}
                className='h-11 rounded-xl border-violet-200 bg-white/90 shadow-none dark:border-violet-300/18 dark:bg-slate-950/30'
              />
            </label>

            <label className='flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-violet-200 bg-white/90 px-3.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-white dark:border-violet-300/18 dark:bg-slate-950/30 dark:text-white dark:hover:bg-slate-950/45'>
              <input
                type='checkbox'
                checked={forceAi}
                onChange={(event) => setForceAi(event.target.checked)}
                className='h-4 w-4 accent-violet-600'
              />
              Chấm lại hồ sơ
            </label>

            <Button
              className='h-11 rounded-xl bg-violet-600 px-5 font-bold shadow-[0_12px_28px_rgba(124,58,237,0.24)] hover:bg-violet-700'
              disabled={!selectedJobId || isAnyScreeningRunning || eligibleApplications.length === 0}
              onClick={handleRunAiScreening}
            >
              {isScreening ? <Loader2 className='h-4 w-4 animate-spin' /> : <Sparkles className='h-4 w-4' />}
              {isScreening ? 'Đang lọc...' : isAnyScreeningRunning ? 'AI đang chạy' : 'Chạy AI'}
            </Button>
          </div>
        </div>

        {isAnyScreeningRunning ? (
          <div className='space-y-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4 text-sm text-violet-800 dark:border-violet-300/18 dark:bg-violet-400/10 dark:text-violet-100'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <span className='flex items-center gap-2 font-semibold'>
                <Loader2 className='h-5 w-5 animate-spin' />
                {deepScreeningCandidate
                  ? `Đang phân tích sâu: ${deepScreeningCandidate.candidate.fullName}`
                  : `AI Screening cho tin #${aiScreeningTask.jobId}`}
              </span>
              <span className='rounded-full bg-white/80 px-3 py-1 text-xs font-bold dark:bg-slate-950/30'>
                {screeningResult ? screeningRunStatusLabels[screeningResult.status] : 'Đang tạo tác vụ'}
              </span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-300/15'>
              <div
                className='h-full rounded-full bg-violet-600 transition-[width] duration-500'
                style={{ width: `${screeningResult?.progressPercent ?? 0}%` }}
              />
            </div>
            <div className='flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold'>
              <span>Tiến độ: {screeningResult?.progressPercent ?? 0}%</span>
              <span>
                Đã xử lý: {screeningResult?.processedCount ?? 0}/{screeningResult?.totalCount ?? 0}
              </span>
              <span>Thành công: {screeningResult?.successCount ?? 0}</span>
              <span>Lỗi: {screeningResult?.failedCount ?? 0}</span>
              <span className='inline-flex items-center gap-1.5'>
                <Gauge className='h-3.5 w-3.5' />
                Tốc độ: {screeningResult?.processingRatePerMinute ?? 0} hồ sơ/phút
              </span>
              <span className='inline-flex items-center gap-1.5'>
                <Clock3 className='h-3.5 w-3.5' />
                Còn lại: {formatRemainingTime(screeningResult?.estimatedRemainingSeconds)}
              </span>
            </div>
          </div>
        ) : null}

        {screeningResult && aiScreeningTask.status === 'success' ? (
          <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-300/18 dark:bg-emerald-400/10 dark:text-emerald-100'>
            <CheckCircle2 className='h-5 w-5' />
            <span className='font-semibold'>
              AI Screening hoàn tất. Đã xử lý {screeningResult.processedCount}/{screeningResult.totalCount} hồ sơ, thành
              công {screeningResult.successCount}, lỗi {screeningResult.failedCount}.
            </span>
          </div>
        ) : null}

        {screeningError ? (
          <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-300/18 dark:bg-rose-400/10 dark:text-rose-100'>
            <AlertCircle className='h-5 w-5' />
            <span className='font-semibold'>
              AI Screening thất bại: {screeningError}
              {screeningResult
                ? ` Đã xử lý ${screeningResult.processedCount}/${screeningResult.totalCount}, thành công ${screeningResult.successCount}, lỗi ${screeningResult.failedCount}.`
                : ''}
            </span>
          </div>
        ) : null}

        {isApplicationsLoading ? (
          <EmployerEmptyState title='Đang tải hồ sơ' description='Hệ thống đang lấy danh sách hồ sơ theo job.' />
        ) : null}

        {applicationsError ? <EmployerEmptyState title='Không tải được hồ sơ' description={applicationsError} /> : null}

        {!isApplicationsLoading && !applicationsError && filteredApplications.length === 0 ? (
          <EmployerEmptyState title='Không có hồ sơ phù hợp' description='Hãy chọn job khác hoặc điều chỉnh bộ lọc.' />
        ) : null}

        {!isApplicationsLoading && !applicationsError && filteredApplications.length > 0 ? (
          <div className='max-w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-300/14'>
            <table className='w-full min-w-[64rem] table-fixed'>
              <colgroup>
                <col className='w-[23%]' />
                <col className='w-[15%]' />
                <col className='w-[11%]' />
                <col className='w-[9%]' />
                <col className='w-[12%]' />
                <col className='w-[30%]' />
              </colgroup>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50 dark:border-slate-300/14 dark:bg-slate-200/8'>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Ứng viên
                  </th>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Trạng thái
                  </th>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Ngày nộp
                  </th>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Điểm AI
                  </th>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Gợi ý
                  </th>
                  <th className='px-3 py-3 text-left text-sm font-semibold text-slate-600 xl:px-4 dark:text-slate-300'>
                    Tóm tắt AI
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-300/10'>
                {filteredApplications.map((application) => (
                  <ApplicationRow
                    key={application.id}
                    application={application}
                    locale={locale}
                    isExpanded={expandedApplicationId === application.id}
                    isDeepAnalyzing={
                      isAnyScreeningRunning &&
                      aiScreeningTask.jobId === selectedJobId &&
                      aiScreeningTask.applicationId === application.id
                    }
                    isAnyScreeningRunning={isAnyScreeningRunning}
                    onOpenCandidate={() => handleOpenCandidate(application.id)}
                    onRunDeepAnalysis={() => void handleRunCandidateDeepScreening(application.id)}
                    onToggle={() =>
                      setExpandedApplicationId((current) => (current === application.id ? null : application.id))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </EmployerSectionCard>
    </div>
  )
}

type ApplicationRowProps = {
  application: EmployerJobApplicationItem
  locale: string
  isExpanded: boolean
  isDeepAnalyzing: boolean
  isAnyScreeningRunning: boolean
  onOpenCandidate: () => void
  onRunDeepAnalysis: () => void
  onToggle: () => void
}

const ApplicationRow = ({
  application,
  locale,
  isExpanded,
  isDeepAnalyzing,
  isAnyScreeningRunning,
  onOpenCandidate,
  onRunDeepAnalysis,
  onToggle
}: ApplicationRowProps) => {
  const aiScore = application.finalScore ?? application.aiScore ?? null
  const displayName = application.candidate.fullName || 'Chưa rõ tên'
  const hasAiEvaluation = Boolean(application.aiScreenedAt || application.aiSummary || application.aiRecommendation)
  const scoreBreakdown = Object.entries(application.scoreBreakdown ?? {}) as ScoreBreakdownEntry[]
  const riskFlags = [...new Set([...(application.flags ?? []), ...(application.riskFlags ?? [])])]

  return (
    <>
      <tr className='transition hover:bg-slate-50/70 dark:hover:bg-slate-200/7'>
        <td className='px-3 py-4 xl:px-4'>
          <button
            type='button'
            className='flex w-full min-w-0 items-center gap-3 rounded-xl text-left outline-none transition hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:hover:text-violet-200'
            aria-label={`Xem hồ sơ ứng viên ${displayName}`}
            onClick={onOpenCandidate}
          >
            {application.candidate.userImage ? (
              <img
                src={application.candidate.userImage}
                alt={displayName}
                className='h-10 w-10 rounded-full border border-slate-200 object-cover'
              />
            ) : (
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-400/14 dark:text-violet-100'>
                <UserRound className='h-5 w-5' />
              </div>
            )}
            <div className='min-w-0'>
              <p className='truncate font-semibold text-slate-950 dark:text-white'>{displayName}</p>
              <p className='mt-1 truncate text-xs text-slate-500 dark:text-slate-400'>
                {application.candidate.email || '-'}
              </p>
            </div>
          </button>
        </td>
        <td className='px-3 py-4 xl:px-4'>
          <div className='flex flex-col gap-1'>
            <span className='w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-200/10 dark:text-slate-200'>
              {getApplicationStatusLabel(application.status)}
            </span>
            {application.currentStage ? (
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                {getApplicationStageLabel(application.currentStage)}
              </span>
            ) : null}
          </div>
        </td>
        <td className='whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-700 xl:px-4 dark:text-slate-300'>
          {formatDate(application.appliedDate, locale)}
        </td>
        <td className='px-3 py-4 xl:px-4'>
          {aiScore === null ? (
            <span className='text-sm font-medium text-slate-400'>-</span>
          ) : (
            <span className='inline-flex h-9 min-w-12 items-center justify-center rounded-full bg-slate-950 px-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950'>
              {aiScore}
            </span>
          )}
        </td>
        <td className='px-3 py-4 xl:px-4'>
          <span
            className={cn(
              'inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1',
              getRecommendationClassName(application.aiRecommendation)
            )}
          >
            {getRecommendationLabel(application.aiRecommendation)}
          </span>
        </td>
        <td className='px-3 py-4 xl:px-4'>
          <p className='line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-300'>
            {application.aiSummary || 'Chưa có tóm tắt AI.'}
          </p>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            {application.aiScreenedAt ? (
              <p className='text-xs text-slate-400'>AI: {formatDate(application.aiScreenedAt, locale)}</p>
            ) : null}
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 rounded-lg px-2 text-xs'
              disabled={!hasAiEvaluation}
              onClick={onToggle}
            >
              {isExpanded ? <ChevronUp className='h-3.5 w-3.5' /> : <ChevronDown className='h-3.5 w-3.5' />}
              {isExpanded ? 'Thu gọn' : 'Xem đánh giá AI'}
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 rounded-lg border-violet-200 px-2 text-xs font-semibold text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:border-violet-300/20 dark:text-violet-200 dark:hover:bg-violet-400/10'
              disabled={isAnyScreeningRunning}
              onClick={onRunDeepAnalysis}
            >
              {isDeepAnalyzing ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <Sparkles className='h-3.5 w-3.5' />
              )}
              {isDeepAnalyzing ? 'Đang phân tích...' : 'Phân tích sâu'}
            </Button>
            {application.screeningMode ? (
              <span
                className={cn(
                  'inline-flex h-8 items-center rounded-lg px-2.5 text-[11px] font-bold',
                  application.screeningMode === 'deep'
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-300/10 dark:text-slate-300'
                )}
              >
                {application.screeningMode === 'deep'
                  ? application.llmJudgeStatus === 'success'
                    ? 'DEEP · LLM thành công'
                    : 'DEEP · LLM lỗi'
                  : 'FAST · Chưa gọi LLM'}
              </span>
            ) : null}
          </div>
        </td>
      </tr>

      {isExpanded ? (
        <tr className='bg-violet-50/35 dark:bg-violet-400/8'>
          <td colSpan={6} className='px-4 py-4'>
            <AiScreeningOverviewCard
              application={application}
              aiScore={aiScore}
              riskFlags={riskFlags}
              scoreBreakdown={scoreBreakdown}
            />
          </td>
        </tr>
      ) : null}
    </>
  )
}

type AiScreeningOverviewCardProps = {
  application: EmployerJobApplicationItem
  aiScore: number | null
  riskFlags: string[]
  scoreBreakdown: ScoreBreakdownEntry[]
}

type AiRadarAxis = {
  key: string
  label: string
  shortLabel: string
  value: number
}

const AiScreeningOverviewCard = ({ application, aiScore, riskFlags, scoreBreakdown }: AiScreeningOverviewCardProps) => {
  const theme = getRecommendationTheme(application.aiRecommendation)
  const domainIsRequired = scoreBreakdown.some(
    ([key, detail]) => key === 'domain' && typeof detail.scorePercent === 'number'
  )
  const visibleConcerns = domainIsRequired
    ? application.aiConcerns
    : application.aiConcerns?.filter((item) => !/\bdomain\b|lĩnh vực nghiệp vụ/iu.test(item))
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:bg-slate-950/24',
        theme.card
      )}
    >
      <div className='flex flex-col gap-4 border-b border-white/80 bg-white/70 p-5 backdrop-blur dark:border-slate-300/10 dark:bg-slate-950/28 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-3'>
            <p className='text-lg font-black tracking-tight text-slate-950 dark:text-white'>Tổng quan AI</p>
            <AiScoreBadge recommendation={application.aiRecommendation} />
          </div>
          <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
            Mô hình: {application.aiModel || '-'} · Chỉ là gợi ý, không tự đổi trạng thái hồ sơ.
          </p>
        </div>

        <div className='shrink-0 rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 dark:bg-slate-950/35 dark:ring-slate-300/12 lg:text-right'>
          <p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-300'>Tỷ số phù hợp</p>
          <p className={cn('mt-1 text-4xl font-black leading-none', theme.score)}>{aiScore ?? '-'}</p>
        </div>
      </div>

      <div className='space-y-5 p-5'>
        <section className='rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-300/12 dark:bg-slate-950/28'>
          <p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-300'>Tóm tắt AI</p>
          <p className='mt-2 max-h-28 overflow-hidden text-sm leading-7 text-slate-700 dark:text-slate-200'>
            {application.aiSummary || 'Chưa có tóm tắt AI.'}
          </p>
        </section>

        <div className='grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]'>
          <AiRadarChart scoreBreakdown={scoreBreakdown} />

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
            <AiInsightList
              title='Điểm nổi bật'
              items={application.aiStrengths}
              fallback='Chưa có điểm nổi bật rõ ràng.'
              tone='strength'
            />
            <AiInsightList
              title='Cải thiện'
              items={visibleConcerns}
              fallback='Chưa có điểm cần xem xét.'
              tone='concern'
            />
          </div>
        </div>

        <AiRiskFlags riskFlags={riskFlags} />
      </div>
    </div>
  )
}

const AiScoreBadge = ({ recommendation }: { recommendation?: string | null }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1',
      getRecommendationTheme(recommendation).badge
    )}
  >
    {getRecommendationLabel(recommendation)}
  </span>
)

const AiRadarChart = ({ scoreBreakdown }: { scoreBreakdown: ScoreBreakdownEntry[] }) => {
  const axes = buildRadarAxes(scoreBreakdown)
  const hasBreakdown = scoreBreakdown.length > 0
  const gridLevels = [1, 0.75, 0.5, 0.25]
  const axisPoints = buildRadarPoints(axes.map((axis) => ({ ...axis, value: 100 })))
  const valuePoints = buildRadarPoints(axes)

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-300/12 dark:bg-slate-950/24'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-sm font-black text-slate-950 dark:text-white'>Radar năng lực</p>
          <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>
            Tổng hợp 5 nhóm tiêu chí chính từ điểm AI Screening.
          </p>
          <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>
            Lĩnh vực nghiệp vụ chỉ được đánh giá khi tin tuyển dụng yêu cầu kinh nghiệm trong một ngành cụ thể.
          </p>
        </div>
      </div>

      {hasBreakdown ? (
        <div className='mt-4 overflow-hidden rounded-2xl bg-emerald-50/50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-400/8 dark:ring-emerald-300/14'>
          <svg viewBox='0 0 320 284' className='mx-auto aspect-[320/284] w-full max-w-[360px]' role='img'>
            <title>Biểu đồ radar năng lực ứng viên</title>
            {gridLevels.map((level) => (
              <polygon
                key={level}
                points={buildRadarPoints(axes.map((axis) => ({ ...axis, value: level * 100 })))}
                fill='none'
                stroke='rgb(16 185 129)'
                strokeOpacity='0.16'
                strokeWidth='1'
              />
            ))}
            {axisPoints.split(' ').map((point, index) => (
              <line
                key={axes[index].key}
                x1='160'
                y1='142'
                x2={point.split(',')[0]}
                y2={point.split(',')[1]}
                stroke='rgb(15 23 42)'
                strokeOpacity='0.1'
                strokeWidth='1'
              />
            ))}
            <polygon
              points={valuePoints}
              fill='rgb(52 211 153)'
              fillOpacity='0.34'
              stroke='rgb(5 150 105)'
              strokeWidth='2.5'
            />
            {axes.map((axis, index) => {
              const point = getRadarPoint(index, axes.length, (axis.value / 100) * 78)
              const labelPoint = getRadarPoint(index, axes.length, 116)
              const anchor = labelPoint.x < 135 ? 'end' : labelPoint.x > 185 ? 'start' : 'middle'
              const valueClass =
                axis.value >= 70
                  ? 'fill-emerald-700 dark:fill-emerald-100'
                  : axis.value >= 40
                    ? 'fill-amber-700 dark:fill-amber-100'
                    : 'fill-rose-700 dark:fill-rose-100'

              return (
                <g key={axis.key}>
                  <circle cx={point.x} cy={point.y} r='3.5' fill='rgb(4 120 87)' />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor={anchor}
                    dominantBaseline='middle'
                    className='fill-slate-600 text-[10px] font-bold dark:fill-slate-200'
                  >
                    <tspan x={labelPoint.x} dy='-0.45em'>
                      {axis.shortLabel}
                    </tspan>
                    <tspan x={labelPoint.x} dy='1.2em' className={valueClass}>
                      {axis.value}%
                    </tspan>
                  </text>
                </g>
              )
            })}
          </svg>

          <div className='mt-4 grid gap-2 sm:grid-cols-2'>
            {axes.map((axis) => (
              <div
                key={axis.key}
                className='flex min-w-0 items-center justify-between gap-3 rounded-xl bg-white/85 px-3 py-2.5 text-xs ring-1 ring-emerald-100 dark:bg-slate-950/24 dark:ring-emerald-300/12'
              >
                <span className='min-w-0 break-words font-semibold leading-5 text-slate-600 dark:text-slate-200'>
                  {axis.label}
                </span>
                <span className='shrink-0 font-black text-emerald-700 dark:text-emerald-100'>{axis.value}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='mt-4 grid min-h-64 place-items-center rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-200/7 dark:text-slate-300 dark:ring-slate-300/12'>
          Chưa có dữ liệu breakdown để hiển thị radar.
        </div>
      )}
    </section>
  )
}

const getBreakdownPercent = (breakdown: Partial<Record<string, ScoreBreakdownEntry[1]>>, key: string) =>
  clampPercent(breakdown[key]?.scorePercent)

const averagePercent = (values: number[]) => {
  if (values.length === 0) return 0
  return clampPercent(values.reduce((sum, value) => sum + value, 0) / values.length)
}

const buildRadarAxes = (scoreBreakdown: ScoreBreakdownEntry[]): AiRadarAxis[] => {
  const breakdown = Object.fromEntries(scoreBreakdown) as Partial<Record<string, ScoreBreakdownEntry[1]>>
  const skillValues = ['mainTechnicalSkillYears', 'requiredSkills', 'preferredSkills'].map((key) =>
    getBreakdownPercent(breakdown, key)
  )

  return [
    {
      key: 'experience',
      label: 'Kinh nghiệm',
      shortLabel: 'Kinh nghiệm',
      value: getBreakdownPercent(breakdown, 'totalExperience')
    },
    { key: 'skills', label: 'Kỹ năng', shortLabel: 'Kỹ năng', value: averagePercent(skillValues) },
    {
      key: 'domain',
      label: 'Lĩnh vực nghiệp vụ',
      shortLabel: 'Lĩnh vực',
      value: getBreakdownPercent(breakdown, 'domain')
    },
    { key: 'projects', label: 'Dự án', shortLabel: 'Dự án', value: getBreakdownPercent(breakdown, 'projectContest') },
    {
      key: 'englishEducation',
      label: 'Ngoại ngữ/Học vấn',
      shortLabel: 'Ngoại ngữ',
      value: getBreakdownPercent(breakdown, 'englishEducationCertificate')
    }
  ]
}

const getRadarPoint = (index: number, total: number, radius: number) => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total
  return {
    x: 160 + Math.cos(angle) * radius,
    y: 142 + Math.sin(angle) * radius
  }
}

const buildRadarPoints = (axes: AiRadarAxis[]) =>
  axes
    .map((axis, index) => {
      const point = getRadarPoint(index, axes.length, (clampPercent(axis.value) / 100) * 78)
      return `${point.x},${point.y}`
    })
    .join(' ')

const AiInsightList = ({
  title,
  items,
  fallback,
  tone
}: {
  title: string
  items?: string[]
  fallback: string
  tone: 'strength' | 'concern'
}) => {
  const list = items?.length ? items : [fallback]
  const toneClass =
    tone === 'strength'
      ? 'border-emerald-100 bg-emerald-50 text-emerald-950 dark:border-emerald-300/16 dark:bg-emerald-400/8 dark:text-emerald-50'
      : 'border-amber-100 bg-amber-50 text-amber-950 dark:border-amber-300/16 dark:bg-amber-400/8 dark:text-amber-50'
  const iconClass =
    tone === 'strength' ? 'text-emerald-600 dark:text-emerald-200' : 'text-amber-600 dark:text-amber-200'
  const Icon = tone === 'strength' ? CheckCircle2 : AlertCircle

  return (
    <section className={cn('rounded-2xl border p-4', toneClass)}>
      <p className='text-xs font-black uppercase tracking-wide'>{title}</p>
      <ul className='mt-3 space-y-2 text-sm leading-6'>
        {list.map((item) => (
          <li key={item} className='flex gap-2'>
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconClass)} />
            <span className='min-w-0 break-words'>{translateAiInsight(item)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const AiRiskFlags = ({ riskFlags }: { riskFlags: string[] }) => {
  if (!riskFlags.length) return null

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-300/12 dark:bg-slate-950/24'>
      <p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-300'>Cảnh báo rủi ro</p>
      <div className='mt-3 flex flex-wrap gap-2'>
        {riskFlags.map((flag) => (
          <span
            key={flag}
            className={cn('max-w-full rounded-full px-3 py-1 text-xs font-semibold ring-1', getRiskFlagClassName(flag))}
          >
            {riskFlagLabels[flag] ?? flag}
          </span>
        ))}
      </div>
    </section>
  )
}

export default ResumeFilterPage
