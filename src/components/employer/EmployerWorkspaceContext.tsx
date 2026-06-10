import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import type {
  AiScreeningRunResponse,
  EmployerCandidateItem,
  EmployerInterviewItem,
  EmployerJobItem,
  RunAiScreeningInput
} from '@/@types/employer'
import {
  getEmployerActiveAiScreeningRunApi,
  getEmployerAiScreeningRunApi,
  runEmployerAiScreeningApi
} from '@/api/employer'
import { pollAiScreeningRun, resumeActiveAiScreeningRun } from './ai-screening-polling'

type CreateJobInput = {
  title: string
  category: string
  jobType: string
  workLocation: string
  salary: string
  level: string
}

type ScheduleInterviewInput = {
  candidateName: string
  candidateEmail: string
  interviewerName: string
  jobTitle: string
  interviewDate: string
  interviewType: string
  location: string
}

type EmployerWorkspaceContextValue = {
  mockJobs: EmployerJobItem[]
  mockCandidates: EmployerCandidateItem[]
  mockInterviews: EmployerInterviewItem[]
  aiScreeningTask: AiScreeningTask
  createMockJob: (input: CreateJobInput) => void
  scheduleMockInterview: (input: ScheduleInterviewInput) => void
  runAiScreeningTask: (jobId: number, input: RunAiScreeningInput) => Promise<AiScreeningRunResponse>
  resumeAiScreeningTask: (jobId?: number) => Promise<AiScreeningRunResponse | null>
  cancelAiScreeningPolling: () => void
}

const EmployerWorkspaceContext = createContext<EmployerWorkspaceContextValue | null>(null)

type AiScreeningTask = {
  status: 'idle' | 'running' | 'success' | 'error'
  jobId: number | null
  applicationId: number | null
  result: AiScreeningRunResponse | null
  error: string | null
  startedAt: string | null
  completedAt: string | null
}

const initialAiScreeningTask: AiScreeningTask = {
  status: 'idle',
  jobId: null,
  applicationId: null,
  result: null,
  error: null,
  startedAt: null,
  completedAt: null
}

const getAiScreeningErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string | string[] } } }).response
    const message = response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }

  return error instanceof Error ? error.message : 'Không chạy được AI Screening.'
}

const now = new Date()

const initialMockJobs: EmployerJobItem[] = [
  {
    id: 9001,
    title: 'Senior Product Designer',
    salary: '35 - 45 million',
    workLocation: 'Da Nang',
    level: 'Senior',
    experience: '3+ years',
    isActive: true,
    createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedDate: now.toISOString(),
    applicantCount: 14,
    category: { category_id: 1, name: 'Design' },
    jobType: { job_type_id: 1, job_type: 'Full-time' }
  },
  {
    id: 9002,
    title: 'QA Automation Engineer',
    salary: '28 - 38 million',
    workLocation: 'Hybrid - Ho Chi Minh',
    level: 'Middle',
    experience: '2+ years',
    isActive: true,
    createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedDate: now.toISOString(),
    applicantCount: 9,
    category: { category_id: 2, name: 'Quality Assurance' },
    jobType: { job_type_id: 1, job_type: 'Full-time' }
  },
  {
    id: 9003,
    title: 'Backend Engineer (Node.js)',
    salary: '32 - 42 million',
    workLocation: 'Remote',
    level: 'Senior',
    experience: '4+ years',
    isActive: true,
    createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedDate: now.toISOString(),
    applicantCount: 22,
    category: { category_id: 3, name: 'Engineering' },
    jobType: { job_type_id: 1, job_type: 'Full-time' }
  },
  {
    id: 9004,
    title: 'Frontend Developer (React)',
    salary: '24 - 32 million',
    workLocation: 'Da Nang / Remote',
    level: 'Middle',
    experience: '2+ years',
    isActive: true,
    createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedDate: now.toISOString(),
    applicantCount: 31,
    category: { category_id: 3, name: 'Engineering' },
    jobType: { job_type_id: 1, job_type: 'Full-time' }
  },
  {
    id: 9005,
    title: 'DevOps Engineer',
    salary: '30 - 40 million',
    workLocation: 'Ho Chi Minh',
    level: 'Senior',
    experience: '3+ years',
    isActive: false,
    createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    applicantCount: 5,
    category: { category_id: 4, name: 'Infrastructure' },
    jobType: { job_type_id: 1, job_type: 'Full-time' }
  }
]

const initialMockCandidates: EmployerCandidateItem[] = [
  {
    applicationId: 9101,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    stage: 'Shortlisted',
    status: 'PASSED',
    seeker: {
      id: 3001,
      fullName: 'Pham Gia Huy',
      email: 'huy.frontend@example.com',
      phone: '0905001122',
      skills: ['React', 'TypeScript', 'Figma', 'Storybook']
    },
    job: {
      id: 9001,
      title: 'Senior Product Designer'
    },
    nextInterview: {
      id: 9201,
      interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
      interview_type: 'Online',
      status: 'SCHEDULED'
    }
  },
  {
    applicationId: 9102,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    stage: 'New CV',
    status: 'PENDING',
    seeker: {
      id: 3002,
      fullName: 'Ngo Bao Tram',
      email: 'tram.qa@example.com',
      phone: '0911223344',
      skills: ['Cypress', 'Playwright', 'API Testing']
    },
    job: {
      id: 9002,
      title: 'QA Automation Engineer'
    },
    nextInterview: null
  },
  {
    applicationId: 9103,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    stage: 'Interview Scheduled',
    status: 'PASSED',
    seeker: {
      id: 3003,
      fullName: 'Tran Minh Duc',
      email: 'duc.backend@example.com',
      phone: '0912345678',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker']
    },
    job: {
      id: 9003,
      title: 'Backend Engineer (Node.js)'
    },
    nextInterview: {
      id: 9202,
      interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      interview_type: 'Online',
      status: 'SCHEDULED'
    }
  },
  {
    applicationId: 9104,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    stage: 'New CV',
    status: 'PENDING',
    seeker: {
      id: 3004,
      fullName: 'Le Thi Yen',
      email: 'yen.frontend@example.com',
      phone: '0901122334',
      skills: ['React', 'Vue.js', 'JavaScript', 'CSS']
    },
    job: {
      id: 9004,
      title: 'Frontend Developer (React)'
    },
    nextInterview: null
  },
  {
    applicationId: 9105,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    stage: 'Hired',
    status: 'PASSED',
    seeker: {
      id: 3005,
      fullName: 'Doan Khanh Linh',
      email: 'linh.design@example.com',
      phone: '0987654321',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping']
    },
    job: {
      id: 9001,
      title: 'Senior Product Designer'
    },
    nextInterview: null
  },
  {
    applicationId: 9106,
    appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    stage: 'Shortlisted',
    status: 'PENDING',
    seeker: {
      id: 3006,
      fullName: 'Vu Thanh Hoa',
      email: 'hoa.qa@example.com',
      phone: '0923456789',
      skills: ['Selenium', 'TestNG', 'Postman', 'Manual Testing']
    },
    job: {
      id: 9002,
      title: 'QA Automation Engineer'
    },
    nextInterview: {
      id: 9203,
      interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      interview_type: 'Offline',
      status: 'SCHEDULED'
    }
  }
]

const initialMockInterviews: EmployerInterviewItem[] = [
  {
    id: 9201,
    round: 1,
    interviewType: 'Online',
    interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
    startTime: '14:00',
    endTime: '15:00',
    location: 'Google Meet',
    status: 'SCHEDULED',
    note: 'Portfolio review + collaboration',
    candidate: {
      id: 3001,
      fullName: 'Pham Gia Huy',
      email: 'huy.frontend@example.com',
      phone: '0905001122'
    },
    interviewer: {
      id: 1001,
      fullName: 'Nguyen Minh Recruiter',
      role: 'Lead Recruiter'
    },
    job: {
      id: 9001,
      title: 'Senior Product Designer'
    },
    applicationStatus: 'PASSED'
  },
  {
    id: 9202,
    round: 2,
    interviewType: 'Online',
    interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Zoom',
    status: 'SCHEDULED',
    note: 'Technical round - Backend systems',
    candidate: {
      id: 3003,
      fullName: 'Tran Minh Duc',
      email: 'duc.backend@example.com',
      phone: '0912345678'
    },
    interviewer: {
      id: 1002,
      fullName: 'Le Van Tuan',
      role: 'Senior Backend Lead'
    },
    job: {
      id: 9003,
      title: 'Backend Engineer (Node.js)'
    },
    applicationStatus: 'PASSED'
  },
  {
    id: 9203,
    round: 1,
    interviewType: 'Offline',
    interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    startTime: '15:30',
    endTime: '16:30',
    location: 'Office 3F - Meeting Room A',
    status: 'SCHEDULED',
    note: 'Initial screening - QA assessment',
    candidate: {
      id: 3006,
      fullName: 'Vu Thanh Hoa',
      email: 'hoa.qa@example.com',
      phone: '0923456789'
    },
    interviewer: {
      id: 1003,
      fullName: 'Tran Thi Mai',
      role: 'QA Manager'
    },
    job: {
      id: 9002,
      title: 'QA Automation Engineer'
    },
    applicationStatus: 'PENDING'
  },
  {
    id: 9204,
    round: 1,
    interviewType: 'Online',
    interviewDate: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    startTime: '09:00',
    endTime: '10:00',
    location: 'Zoom',
    status: 'COMPLETED',
    note: 'Completed - Great potential',
    candidate: {
      id: 3007,
      fullName: 'Ngo Quoc An',
      email: 'an.backend@example.com',
      phone: '0934567890'
    },
    interviewer: {
      id: 1002,
      fullName: 'Le Van Tuan',
      role: 'Senior Backend Lead'
    },
    job: {
      id: 9003,
      title: 'Backend Engineer (Node.js)'
    },
    applicationStatus: 'PASSED'
  }
]

export const EmployerWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [mockJobs, setMockJobs] = useState<EmployerJobItem[]>(initialMockJobs)
  const [mockCandidates, setMockCandidates] = useState<EmployerCandidateItem[]>(initialMockCandidates)
  const [mockInterviews, setMockInterviews] = useState<EmployerInterviewItem[]>(initialMockInterviews)
  const [aiScreeningTask, setAiScreeningTask] = useState<AiScreeningTask>(initialAiScreeningTask)
  const activeAiScreeningPromiseRef = useRef<Promise<AiScreeningRunResponse | null> | null>(null)
  const activeAiScreeningJobIdRef = useRef<number | null>(null)
  const activeAiScreeningAbortRef = useRef<AbortController | null>(null)

  useEffect(
    () => () => {
      activeAiScreeningAbortRef.current?.abort()
    },
    []
  )

  const cancelAiScreeningPolling = useCallback(() => {
    activeAiScreeningAbortRef.current?.abort()
    activeAiScreeningAbortRef.current = null
    activeAiScreeningPromiseRef.current = null
    activeAiScreeningJobIdRef.current = null
    setAiScreeningTask((current) =>
      current.status === 'running'
        ? {
            ...current,
            status: 'idle',
            error: null
          }
        : current
    )
  }, [])

  const runAiScreeningTask = useCallback(async (jobId: number, input: RunAiScreeningInput) => {
    if (activeAiScreeningPromiseRef.current) {
      if (activeAiScreeningJobIdRef.current === jobId) {
        const activeResult = await activeAiScreeningPromiseRef.current
        if (activeResult) return activeResult
      } else {
        throw new Error('AI Screening đang chạy cho một tin tuyển dụng khác.')
      }
    }

    const controller = new AbortController()
    activeAiScreeningAbortRef.current = controller
    const promise = (async () => {
      const queued = await runEmployerAiScreeningApi(jobId, input)

      return pollAiScreeningRun({
        runId: queued.runId,
        getRun: getEmployerAiScreeningRunApi,
        signal: controller.signal,
        onProgress: (run) => setAiScreeningTask((current) => ({ ...current, result: run }))
      })
    })()
    activeAiScreeningPromiseRef.current = promise
    activeAiScreeningJobIdRef.current = jobId
    setAiScreeningTask({
      status: 'running',
      jobId,
      applicationId: input.applicationId ?? null,
      result: null,
      error: null,
      startedAt: new Date().toISOString(),
      completedAt: null
    })

    try {
      const result = await promise
      setAiScreeningTask((current) => ({
        ...current,
        status: 'success',
        result,
        error: null,
        completedAt: new Date().toISOString()
      }))
      return result
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }
      setAiScreeningTask((current) => ({
        ...current,
        status: 'error',
        error: getAiScreeningErrorMessage(error),
        completedAt: new Date().toISOString()
      }))
      throw error
    } finally {
      activeAiScreeningPromiseRef.current = null
      activeAiScreeningJobIdRef.current = null
      if (activeAiScreeningAbortRef.current === controller) {
        activeAiScreeningAbortRef.current = null
      }
    }
  }, [])

  const resumeAiScreeningTask = useCallback(async (jobId?: number) => {
    if (activeAiScreeningPromiseRef.current) {
      return activeAiScreeningJobIdRef.current === jobId ? activeAiScreeningPromiseRef.current : null
    }

    const controller = new AbortController()
    let foundActiveRun = false
    const promise = resumeActiveAiScreeningRun({
      jobId,
      getActiveRun: getEmployerActiveAiScreeningRunApi,
      getRun: getEmployerAiScreeningRunApi,
      signal: controller.signal,
      onProgress: (run) => {
        foundActiveRun = true
        activeAiScreeningJobIdRef.current = run.jobId ?? jobId ?? null
        setAiScreeningTask((current) => ({
          status: 'running',
          jobId: run.jobId ?? jobId ?? null,
          applicationId: run.applicationId,
          result: run,
          error: null,
          startedAt: run.startedAt ?? current.startedAt ?? new Date().toISOString(),
          completedAt: null
        }))
      }
    })

    activeAiScreeningAbortRef.current = controller
    activeAiScreeningPromiseRef.current = promise
    activeAiScreeningJobIdRef.current = jobId ?? null

    try {
      const result = await promise
      if (!result) return null

      setAiScreeningTask((current) => ({
        ...current,
        status: 'success',
        result,
        error: null,
        completedAt: result.completedAt ?? new Date().toISOString()
      }))
      return result
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }
      if (foundActiveRun) {
        setAiScreeningTask((current) => ({
          ...current,
          status: 'error',
          error: getAiScreeningErrorMessage(error),
          completedAt: new Date().toISOString()
        }))
      }
      throw error
    } finally {
      activeAiScreeningPromiseRef.current = null
      activeAiScreeningJobIdRef.current = null
      if (activeAiScreeningAbortRef.current === controller) {
        activeAiScreeningAbortRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    void resumeAiScreeningTask().catch(() => {
      // Recovery errors for a previously active run are exposed by the workspace task.
    })
  }, [resumeAiScreeningTask])

  const createMockJob = (input: CreateJobInput) => {
    const createdAt = new Date().toISOString()
    const newJob: EmployerJobItem = {
      id: Date.now(),
      title: input.title,
      salary: input.salary,
      workLocation: input.workLocation,
      level: input.level,
      experience: 'Being updated',
      isActive: true,
      createdDate: createdAt,
      updatedDate: createdAt,
      applicantCount: 0,
      category: {
        category_id: Date.now(),
        name: input.category
      },
      jobType: {
        job_type_id: Date.now(),
        job_type: input.jobType
      }
    }

    setMockJobs((current) => [newJob, ...current])
  }

  const scheduleMockInterview = (input: ScheduleInterviewInput) => {
    const interviewId = Date.now()
    const matchedJob = mockJobs.find((job) => job.title === input.jobTitle) ?? null
    const candidateId = interviewId + 10

    const createdInterview: EmployerInterviewItem = {
      id: interviewId,
      round: 1,
      interviewType: input.interviewType,
      interviewDate: new Date(input.interviewDate).toISOString(),
      startTime: null,
      endTime: null,
      location: input.location,
      status: 'SCHEDULED',
      note: 'Interview created from form',
      candidate: {
        id: candidateId,
        fullName: input.candidateName,
        email: input.candidateEmail,
        phone: 'Not provided'
      },
      interviewer: {
        id: 1001,
        fullName: input.interviewerName,
        role: 'Recruiter'
      },
      job: {
        id: matchedJob?.id ?? interviewId,
        title: input.jobTitle
      },
      applicationStatus: 'PASSED'
    }

    const createdCandidate: EmployerCandidateItem = {
      applicationId: interviewId + 1,
      appliedAt: new Date().toISOString(),
      stage: 'Interview Scheduled',
      status: 'PASSED',
      seeker: {
        id: candidateId,
        fullName: input.candidateName,
        email: input.candidateEmail,
        phone: 'Not updated',
        skills: ['Communication', 'Problem Solving']
      },
      job: {
        id: matchedJob?.id ?? interviewId,
        title: input.jobTitle
      },
      nextInterview: {
        id: interviewId,
        interview_date: new Date(input.interviewDate).toISOString(),
        interview_type: input.interviewType,
        status: 'SCHEDULED'
      }
    }

    setMockInterviews((current) => [createdInterview, ...current])
    setMockCandidates((current) => [createdCandidate, ...current])
  }

  const value = useMemo(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    () => ({
      mockJobs,
      mockCandidates,
      mockInterviews,
      aiScreeningTask,
      createMockJob,
      scheduleMockInterview,
      runAiScreeningTask,
      resumeAiScreeningTask,
      cancelAiScreeningPolling
    }),
    [
      aiScreeningTask,
      cancelAiScreeningPolling,
      mockJobs,
      mockCandidates,
      mockInterviews,
      resumeAiScreeningTask,
      runAiScreeningTask
    ]
  )

  return <EmployerWorkspaceContext.Provider value={value}>{children}</EmployerWorkspaceContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployerWorkspace = () => {
  const context = useContext(EmployerWorkspaceContext)

  if (!context) {
    throw new Error('useEmployerWorkspace must be used inside EmployerWorkspaceProvider')
  }

  return context
}
