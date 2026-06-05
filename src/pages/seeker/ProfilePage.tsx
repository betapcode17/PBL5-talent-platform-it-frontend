import type { ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  Camera,
  Copy,
  ExternalLink,
  FileBadge2,
  FileText,
  FileUp,
  GraduationCap,
  Languages,
  Mail,
  Pencil,
  Phone,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  X,
  UserRound
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  createCvCertificateApi,
  createCvEducationApi,
  createCvExperienceApi,
  createCvPersonalityApi,
  createCvProjectApi,
  createCvSkillsApi,
  deleteCvCertificateApi,
  deleteCvEducationApi,
  deleteCvExperienceApi,
  deleteCvPersonalityApi,
  deleteCvProjectApi,
  deleteCvSkillApi,
  getCvDetailApi,
  updateCvCertificateApi,
  updateCvEducationApi,
  updateCvExperienceApi,
  updateCvPersonalityApi,
  updateCvProjectApi,
  updateCvSkillApi,
  uploadCvFileApi,
  type CvCertificate,
  type CvEducation,
  type CvExperience,
  type CvPersonality,
  type CvProject,
  type CvSkill
} from '@/api/cv'
import { SeekerActionToast } from '@/components/seeker/SeekerActionToast'
import { SeekerStatusBadge } from '@/components/seeker/SeekerStatusBadge'
import { useSeekerApplicationsTracker, useSeekerInterviewsTracker } from '@/hooks/useSeekerCareer'
import { buildGoogleCalendarUrl, downloadInterviewCalendarFile } from '@/lib/interviewCalendar'
import { useAuthStore } from '@/store/authStore'

type ProfileTab = 'profile' | 'cv'
type Accent = 'amber' | 'sky' | 'emerald'
type CvSectionName = 'education' | 'experience' | 'skill' | 'personality' | 'certificate' | 'project'

const emptyEducationForm = {
  school: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  description: ''
}

const emptyExperienceForm = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: ''
}

const emptyPersonalityForm = {
  type: '',
  description: ''
}

const emptyCertificateForm = {
  title: '',
  issuer: '',
  issuedDate: '',
  fileUrl: ''
}

const emptyProjectForm = {
  name: '',
  description: '',
  link: '',
  role: '',
  startDate: '',
  endDate: ''
}

const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [editing, setEditing] = useState<{ section: CvSectionName; id: string } | null>(null)
  const [educationForm, setEducationForm] = useState(emptyEducationForm)
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm)
  const [skillForm, setSkillForm] = useState('')
  const [personalityForm, setPersonalityForm] = useState(emptyPersonalityForm)
  const [certificateForm, setCertificateForm] = useState(emptyCertificateForm)
  const [projectForm, setProjectForm] = useState(emptyProjectForm)
  const queryClient = useQueryClient()
  const { data: applications, isLoading: isLoadingApplications } = useSeekerApplicationsTracker()
  const { data: interviews, isLoading: isLoadingInterviews } = useSeekerInterviewsTracker()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'
  const fallbackText = t('seekerProfile.common.notUpdated')
  const cvQueryKey = ['seeker', 'cv', user?.id]
  const { data: cvDetail, isLoading: isLoadingCv } = useQuery({
    queryKey: cvQueryKey,
    queryFn: () => getCvDetailApi(user!.id),
    enabled: Boolean(user?.id)
  })

  const refreshCv = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: cvQueryKey })
    setToastMessage(message)
  }

  const uploadCvMutation = useMutation({
    mutationFn: uploadCvFileApi,
    onSuccess: () => {
      setCvFile(null)
      void refreshCv('Đã tải CV lên thành công.')
    }
  })

  const educationMutation = useMutation({
    mutationFn: async () =>
      editing?.section === 'education'
        ? updateCvEducationApi(editing.id, normalizeOptionalFields(educationForm))
        : createCvEducationApi(normalizeOptionalFields(educationForm)),
    onSuccess: () => {
      setEditing(null)
      setEducationForm(emptyEducationForm)
      void refreshCv('Đã lưu học vấn.')
    }
  })

  const experienceMutation = useMutation({
    mutationFn: async () =>
      editing?.section === 'experience'
        ? updateCvExperienceApi(editing.id, normalizeOptionalFields(experienceForm))
        : createCvExperienceApi(normalizeOptionalFields(experienceForm)),
    onSuccess: () => {
      setEditing(null)
      setExperienceForm(emptyExperienceForm)
      void refreshCv('Đã lưu kinh nghiệm.')
    }
  })

  const skillMutation = useMutation({
    mutationFn: async () => {
      if (editing?.section === 'skill') {
        return updateCvSkillApi(editing.id, { name: skillForm.trim() })
      }

      return createCvSkillsApi(
        skillForm
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      )
    },
    onSuccess: () => {
      setEditing(null)
      setSkillForm('')
      void refreshCv('Đã lưu kỹ năng.')
    }
  })

  const personalityMutation = useMutation({
    mutationFn: async () =>
      editing?.section === 'personality'
        ? updateCvPersonalityApi(editing.id, normalizeOptionalFields(personalityForm))
        : createCvPersonalityApi(normalizeOptionalFields(personalityForm)),
    onSuccess: () => {
      setEditing(null)
      setPersonalityForm(emptyPersonalityForm)
      void refreshCv('Đã lưu tính cách.')
    }
  })

  const certificateMutation = useMutation({
    mutationFn: async () =>
      editing?.section === 'certificate'
        ? updateCvCertificateApi(editing.id, normalizeOptionalFields(certificateForm))
        : createCvCertificateApi(normalizeOptionalFields(certificateForm)),
    onSuccess: () => {
      setEditing(null)
      setCertificateForm(emptyCertificateForm)
      void refreshCv('Đã lưu chứng chỉ.')
    }
  })

  const projectMutation = useMutation({
    mutationFn: async () =>
      editing?.section === 'project'
        ? updateCvProjectApi(editing.id, normalizeOptionalFields(projectForm))
        : createCvProjectApi(normalizeOptionalFields(projectForm)),
    onSuccess: () => {
      setEditing(null)
      setProjectForm(emptyProjectForm)
      void refreshCv('Đã lưu dự án.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ section, id }: { section: CvSectionName; id: string }) => {
      if (section === 'education') return deleteCvEducationApi(id)
      if (section === 'experience') return deleteCvExperienceApi(id)
      if (section === 'skill') return deleteCvSkillApi(id)
      if (section === 'personality') return deleteCvPersonalityApi(id)
      if (section === 'certificate') return deleteCvCertificateApi(id)

      return deleteCvProjectApi(id)
    },
    onSuccess: () => void refreshCv('Đã xóa mục CV.')
  })

  const profileSections = useMemo(
    () => [
      { id: 'basic-info', label: t('seekerProfile.sections.basicInfo') },
      { id: 'education', label: t('seekerProfile.sections.education') },
      { id: 'certifications', label: t('seekerProfile.sections.certifications') },
      { id: 'awards', label: t('seekerProfile.sections.awards') },
      { id: 'skills', label: t('seekerProfile.sections.skills') },
      { id: 'projects', label: t('seekerProfile.sections.projects') },
      { id: 'experience', label: t('seekerProfile.sections.experience') },
      { id: 'about', label: t('seekerProfile.sections.about') }
    ],
    [t]
  )

  const cvSections = useMemo(
    () => [
      { id: 'cv-overview', label: t('seekerProfile.sections.cvOverview') },
      { id: 'cv-education', label: 'Học vấn' },
      { id: 'cv-experience', label: 'Kinh nghiệm' },
      { id: 'cv-skills', label: 'Kỹ năng' },
      { id: 'cv-certificates', label: 'Chứng chỉ' },
      { id: 'cv-projects', label: 'Dự án' }
    ],
    [t]
  )

  const educationItems = useMemo(
    () => [
      { label: t('seekerProfile.education.school.label'), value: t('seekerProfile.education.school.value') },
      { label: t('seekerProfile.education.major.label'), value: t('seekerProfile.education.major.value') },
      { label: t('seekerProfile.education.year.label'), value: t('seekerProfile.education.year.value') },
      { label: t('seekerProfile.education.graduation.label'), value: t('seekerProfile.education.graduation.value') },
      { label: t('seekerProfile.education.gpa.label'), value: t('seekerProfile.education.gpa.value') }
    ],
    [t]
  )

  const certifications = useMemo(
    () => [
      { name: t('seekerProfile.certifications.jlpt.name'), date: t('seekerProfile.certifications.jlpt.date'), accent: 'amber' as Accent },
      { name: t('seekerProfile.certifications.toeic.name'), date: t('seekerProfile.certifications.toeic.date'), accent: 'sky' as Accent },
      { name: t('seekerProfile.certifications.aptis.name'), date: t('seekerProfile.certifications.aptis.date'), accent: 'emerald' as Accent }
    ],
    [t]
  )

  const awards = useMemo(
    () => [
      { title: t('seekerProfile.awards.hackathon.title'), date: t('seekerProfile.awards.hackathon.date') },
      { title: t('seekerProfile.awards.semester.title'), date: t('seekerProfile.awards.semester.date') }
    ],
    [t]
  )

  const skillGroups = useMemo(
    () => [
      {
        category: t('seekerProfile.skills.programming.category'),
        skills: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C#']
      },
      {
        category: t('seekerProfile.skills.frameworks.category'),
        skills: ['Spring Boot', 'React', 'ASP.NET MVC']
      },
      {
        category: t('seekerProfile.skills.databases.category'),
        skills: ['MySQL', 'SQL Server', 'PostgreSQL']
      },
      {
        category: t('seekerProfile.skills.tools.category'),
        skills: ['Git', 'Postman', 'Figma', 'Slack']
      }
    ],
    [t]
  )

  const projects = useMemo(
    () => [
      {
        title: t('seekerProfile.projects.recruitment.title'),
        description: t('seekerProfile.projects.recruitment.description'),
        stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
        status: t('seekerProfile.projects.recruitment.status')
      },
      {
        title: t('seekerProfile.projects.equipment.title'),
        description: t('seekerProfile.projects.equipment.description'),
        stack: ['Java', 'Spring', 'MySQL'],
        status: t('seekerProfile.projects.equipment.status')
      }
    ],
    [t]
  )

  const experienceItems = useMemo(
    () => [
      {
        company: t('seekerProfile.experience.sun.company'),
        role: t('seekerProfile.experience.sun.role'),
        period: t('seekerProfile.experience.sun.period'),
        summary: t('seekerProfile.experience.sun.summary')
      }
    ],
    [t]
  )

  const cvCards: Array<{
    title: string
    format: string
    language: string
    updatedAt: string
    status: string
    isPrimary: boolean
  }> = []
  const checklistItems: string[] = []

  const strengths = useMemo(
    () => [
      t('seekerProfile.about.strengths.first'),
      t('seekerProfile.about.strengths.second'),
      t('seekerProfile.about.strengths.third')
    ],
    [t]
  )

  const heroBadges = useMemo(() => {
    const badges = [t('seekerProfile.hero.badges.openToInternship'), t('seekerProfile.hero.badges.activelyBuildingCv')]

    if (user?.gender) {
      badges.push(user.gender)
    }

    return badges
  }, [t, user?.gender])

  const sectionNav = activeTab === 'profile' ? profileSections : cvSections
  const seekerSnapshot = useMemo(() => {
    const applicationItems = applications ?? []
    const interviewItems = interviews?.interviews ?? []
    const nextInterview =
      interviewItems.find((item) => item.status === 'SCHEDULED' && new Date(item.schedule).getTime() >= Date.now()) ??
      interviewItems.find((item) => item.status === 'SCHEDULED') ??
      null

    return {
      totalApplications: applicationItems.length,
      pendingApplications: applicationItems.filter((item) => item.status === 'PENDING').length,
      acceptedApplications: applicationItems.filter((item) => item.status === 'ACCEPTED').length,
      totalInterviews: interviewItems.length,
      nextInterview
    }
  }, [applications, interviews?.interviews])

  const handleCopyMeetingLink = async (meetingLink: string) => {
    await navigator.clipboard.writeText(meetingLink)
    setToastMessage(t('seekerTracking.common.meetingLinkCopied'))
  }

  const handleUploadCv = () => {
    if (!cvFile) {
      setToastMessage('Vui lòng chọn file PDF/DOC/DOCX trước khi tải lên.')
      return
    }

    uploadCvMutation.mutate(cvFile)
  }

  const startEditEducation = (item: CvEducation) => {
    setEditing({ section: 'education', id: item.id })
    setEducationForm({
      school: item.school,
      degree: item.degree,
      major: item.major ?? '',
      startDate: formatInputDate(item.startDate),
      endDate: formatInputDate(item.endDate),
      description: item.description ?? ''
    })
  }

  const startEditExperience = (item: CvExperience) => {
    setEditing({ section: 'experience', id: item.id })
    setExperienceForm({
      company: item.company,
      position: item.position,
      startDate: formatInputDate(item.startDate),
      endDate: formatInputDate(item.endDate),
      description: item.description ?? ''
    })
  }

  const startEditSkill = (item: CvSkill) => {
    setEditing({ section: 'skill', id: item.id })
    setSkillForm(item.name)
  }

  const startEditPersonality = (item: CvPersonality) => {
    setEditing({ section: 'personality', id: item.id })
    setPersonalityForm({
      type: item.type,
      description: item.description ?? ''
    })
  }

  const startEditCertificate = (item: CvCertificate) => {
    setEditing({ section: 'certificate', id: item.id })
    setCertificateForm({
      title: item.title,
      issuer: item.issuer,
      issuedDate: formatInputDate(item.issuedDate),
      fileUrl: item.fileUrl ?? ''
    })
  }

  const startEditProject = (item: CvProject) => {
    setEditing({ section: 'project', id: item.id })
    setProjectForm({
      name: item.name,
      description: item.description ?? '',
      link: item.link ?? '',
      role: item.role ?? '',
      startDate: formatInputDate(item.startDate),
      endDate: formatInputDate(item.endDate)
    })
  }

  const clearEdit = () => {
    setEditing(null)
    setEducationForm(emptyEducationForm)
    setExperienceForm(emptyExperienceForm)
    setSkillForm('')
    setPersonalityForm(emptyPersonalityForm)
    setCertificateForm(emptyCertificateForm)
    setProjectForm(emptyProjectForm)
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      <section className='rounded-[34px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-start'>
            <div className='relative shrink-0'>
              <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border border-sky-100 bg-gradient-to-br from-sky-500 to-blue-700 text-3xl font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.24)] sm:h-32 sm:w-32'>
                {user?.user_image ? (
                  <img src={user.user_image} alt={user.full_name} className='h-full w-full object-cover' />
                ) : (
                  <span>{(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                type='button'
                className='absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-[0_12px_24px_rgba(14,165,233,0.28)]'
              >
                <Camera className='h-4 w-4' />
              </button>
            </div>

            <div className='min-w-0 flex-1 space-y-5'>
              <div className='space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  {heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className='rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700'
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div>
                  <h1 className='text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]'>
                    {user?.full_name || t('seekerProfile.hero.defaultTitle')}
                  </h1>
                  <p className='mt-2 text-sm text-slate-500 sm:text-base'>{t('seekerProfile.hero.description')}</p>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                <HeroMetric icon={<UserRound className='h-4 w-4' />} label={t('seekerProfile.hero.metrics.accountCode')} value={`SEEKER-${user?.id ?? '0001'}`} />
                <HeroMetric icon={<Mail className='h-4 w-4' />} label={t('seekerProfile.hero.metrics.email')} value={user?.email || fallbackText} />
                <HeroMetric icon={<Phone className='h-4 w-4' />} label={t('seekerProfile.hero.metrics.phone')} value={user?.phone || fallbackText} />
                <HeroMetric icon={<CalendarDays className='h-4 w-4' />} label={t('seekerProfile.hero.metrics.joined')} value={formatDate(user?.registration_date, locale, fallbackText)} />
              </div>
            </div>
          </div>

          <div className='w-full max-w-sm rounded-[28px] border border-slate-200 bg-slate-50/80 p-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>{t('seekerProfile.quickActions.title')}</p>
            <div className='mt-4 grid gap-3'>
              <ActionTile title={t('seekerProfile.quickActions.editProfile.title')} description={t('seekerProfile.quickActions.editProfile.description')} icon={<Pencil className='h-4 w-4' />} />
              <ActionTile title={t('seekerProfile.quickActions.uploadCv.title')} description={t('seekerProfile.quickActions.uploadCv.description')} icon={<FileText className='h-4 w-4' />} />
              <ActionTile title={t('seekerProfile.quickActions.reviewProfile.title')} description={t('seekerProfile.quickActions.reviewProfile.description')} icon={<Sparkles className='h-4 w-4' />} />
            </div>
          </div>
        </div>

        <div className='mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]'>
          <div className='rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,rgba(239,246,255,1),rgba(248,250,252,1))] p-5'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-700'>{t('seekerProfile.snapshot.eyebrow')}</p>
                <h2 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>{t('seekerProfile.snapshot.title')}</h2>
                <p className='mt-2 max-w-2xl text-sm leading-7 text-slate-600'>{t('seekerProfile.snapshot.description')}</p>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Link
                  to='/seeker/applications'
                  className='inline-flex h-11 items-center gap-2 rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.22)] transition hover:bg-sky-700'
                >
                  <BriefcaseBusiness className='h-4 w-4' />
                  {t('seekerProfile.snapshot.viewApplications')}
                </Link>
                <Link
                  to='/seeker/interviews'
                  className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                >
                  <CalendarDays className='h-4 w-4' />
                  {t('seekerProfile.snapshot.viewInterviews')}
                </Link>
              </div>
            </div>

            <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
              <HeroMetric icon={<BriefcaseBusiness className='h-4 w-4' />} label={t('seekerProfile.snapshot.metrics.applications')} value={isLoadingApplications ? '...' : String(seekerSnapshot.totalApplications)} />
              <HeroMetric icon={<Sparkles className='h-4 w-4' />} label={t('seekerProfile.snapshot.metrics.pending')} value={isLoadingApplications ? '...' : String(seekerSnapshot.pendingApplications)} />
              <HeroMetric icon={<Star className='h-4 w-4' />} label={t('seekerProfile.snapshot.metrics.accepted')} value={isLoadingApplications ? '...' : String(seekerSnapshot.acceptedApplications)} />
              <HeroMetric icon={<CalendarDays className='h-4 w-4' />} label={t('seekerProfile.snapshot.metrics.interviews')} value={isLoadingInterviews ? '...' : String(seekerSnapshot.totalInterviews)} />
            </div>
          </div>

          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600'>
                <BellRing className='h-5 w-5' />
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{t('seekerProfile.reminder.eyebrow')}</p>
                <h3 className='text-lg font-semibold text-slate-950'>{t('seekerProfile.reminder.title')}</h3>
              </div>
            </div>

            {seekerSnapshot.nextInterview ? (
              <div className='mt-4 space-y-4'>
                <div className='rounded-[24px] border border-amber-200 bg-amber-50/80 p-4'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <SeekerStatusBadge
                      kind='interview'
                      value={seekerSnapshot.nextInterview.status}
                      label={t(`seekerTracking.interviewStatus.${seekerSnapshot.nextInterview.status}`, {
                        defaultValue: seekerSnapshot.nextInterview.status
                      })}
                    />
                    <span className='rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                      {t(`seekerTracking.interviewType.${seekerSnapshot.nextInterview.type}`, {
                        defaultValue: seekerSnapshot.nextInterview.type
                      })}
                    </span>
                  </div>
                  <p className='mt-3 text-base font-semibold text-slate-950'>{seekerSnapshot.nextInterview.job.title}</p>
                  <p className='mt-1 text-sm text-slate-600'>{seekerSnapshot.nextInterview.company.name}</p>
                  <p className='mt-3 text-sm leading-6 text-slate-600'>
                    {t('seekerProfile.reminder.scheduledWith', {
                      date: formatDateTime(seekerSnapshot.nextInterview.schedule, locale, fallbackText),
                      interviewer: seekerSnapshot.nextInterview.interviewer.fullName || t('seekerTracking.common.notSpecified')
                    })}
                  </p>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <ActionLink
                    to='/seeker/interviews'
                    title={t('seekerProfile.reminder.viewAllTitle')}
                    description={t('seekerProfile.reminder.viewAllDescription')}
                    icon={<CalendarDays className='h-4 w-4' />}
                  />
                  <button
                    type='button'
                    onClick={() => {
                      if (seekerSnapshot.nextInterview) {
                        const fileName = downloadInterviewCalendarFile(seekerSnapshot.nextInterview)
                        setToastMessage(t('seekerTracking.common.calendarExported', { fileName }))
                      }
                    }}
                    className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50'
                  >
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>
                      <CalendarPlus className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900'>{t('seekerProfile.reminder.exportTitle')}</p>
                      <p className='mt-1 text-sm leading-6 text-slate-500'>{t('seekerProfile.reminder.exportDescription')}</p>
                    </div>
                  </button>
                </div>

                <div className='flex flex-wrap gap-3'>
                  <a
                    href={buildGoogleCalendarUrl(seekerSnapshot.nextInterview)}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                  >
                    <CalendarClock className='h-4 w-4' />
                    {t('seekerTracking.common.openGoogleCalendar')}
                  </a>
                  {seekerSnapshot.nextInterview.link ? (
                    <>
                      <button
                        type='button'
                        onClick={() => void handleCopyMeetingLink(seekerSnapshot.nextInterview!.link!)}
                        className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                      >
                        <Copy className='h-4 w-4' />
                        {t('seekerTracking.common.copyMeetingLink')}
                      </button>
                      <a
                        href={seekerSnapshot.nextInterview.link}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                      >
                        <ExternalLink className='h-4 w-4' />
                        {t('seekerTracking.common.openInterviewLink')}
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className='mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-4 text-sm leading-6 text-slate-500'>
                {t('seekerProfile.reminder.empty')}
              </div>
            )}
          </div>
        </div>

        <div className='mt-8 border-b border-slate-200'>
          <div className='flex flex-wrap gap-2'>
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
              {t('seekerProfile.tabs.profile')}
            </TabButton>
            <TabButton active={activeTab === 'cv'} onClick={() => setActiveTab('cv')}>
              {t('seekerProfile.tabs.cv')}
            </TabButton>
          </div>
        </div>
      </section>

      <div className='mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]'>
        <div className='space-y-6'>
          {activeTab === 'profile' ? (
            <>
              <SectionCard id='basic-info' title={t('seekerProfile.sections.basicInfo')} icon={<UserRound className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
                  <dl className='space-y-3'>
                    <ProfileRow label={t('seekerProfile.basicInfo.fullName')} value={user?.full_name || fallbackText} />
                    <ProfileRow label={t('seekerProfile.basicInfo.email')} value={user?.email || fallbackText} />
                    <ProfileRow label={t('seekerProfile.basicInfo.phone')} value={user?.phone || fallbackText} />
                    <ProfileRow label={t('seekerProfile.basicInfo.gender')} value={user?.gender || fallbackText} />
                    <ProfileRow label={t('seekerProfile.basicInfo.country')} value={t('seekerProfile.basicInfo.countryValue')} />
                  </dl>

                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>{t('seekerProfile.basicInfo.personalLinks')}</h3>
                    <div className='mt-4 space-y-3'>
                      <LinkItem label={t('seekerProfile.links.github')} value='https://github.com/BachTran111' />
                      <LinkItem label={t('seekerProfile.links.linkedin')} value='https://linkedin.com/in/tranxuanbach' />
                      <LinkItem label={t('seekerProfile.links.portfolio')} value='https://portfolio.example.dev' />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id='education' title={t('seekerProfile.sections.education')} icon={<GraduationCap className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 md:grid-cols-2'>
                  {educationItems.map((item) => (
                    <InfoCard key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='certifications' title={t('seekerProfile.sections.certifications')} icon={<FileBadge2 className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                  {certifications.map((item) => (
                    <BadgeCard key={item.name} title={item.name} meta={t('seekerProfile.certifications.achievedOn', { date: item.date })} accent={item.accent} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='awards' title={t('seekerProfile.sections.awards')} icon={<Award className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='space-y-3'>
                  {awards.map((item) => (
                    <TimelineRow key={item.title} title={item.title} meta={item.date} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='skills' title={t('seekerProfile.sections.skills')} icon={<Languages className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='overflow-hidden rounded-[24px] border border-slate-200'>
                  {skillGroups.map((group, index) => (
                    <div
                      key={group.category}
                      className={`grid gap-4 border-slate-200 px-5 py-4 md:grid-cols-[220px_minmax(0,1fr)] ${
                        index !== skillGroups.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className='text-sm font-semibold text-slate-900'>{group.category}</div>
                      <div className='flex flex-wrap gap-2'>
                        {group.skills.map((skill) => (
                          <span key={skill} className='rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='projects' title={t('seekerProfile.sections.projects')} icon={<Star className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 lg:grid-cols-2'>
                  {projects.map((project) => (
                    <article key={project.title} className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{project.title}</h3>
                          <p className='mt-1 text-sm text-slate-500'>{project.status}</p>
                        </div>
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500'>{t('seekerProfile.projects.badge')}</span>
                      </div>
                      <p className='mt-4 text-sm leading-7 text-slate-600'>{project.description}</p>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {project.stack.map((item) => (
                          <span key={item} className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600'>
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='experience' title={t('seekerProfile.sections.experience')} icon={<BriefcaseBusiness className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='space-y-4'>
                  {experienceItems.map((item) => (
                    <article key={item.company} className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{item.role}</h3>
                          <p className='mt-1 text-sm font-medium text-sky-700'>{item.company}</p>
                        </div>
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500'>{item.period}</span>
                      </div>
                      <p className='mt-4 text-sm leading-7 text-slate-600'>{item.summary}</p>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='about' title={t('seekerProfile.sections.about')} icon={<Sparkles className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 lg:grid-cols-2'>
                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>{t('seekerProfile.about.introductionTitle')}</h3>
                    <p className='mt-4 text-sm leading-7 text-slate-600'>{t('seekerProfile.about.introductionDescription')}</p>
                  </div>
                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>{t('seekerProfile.about.strengthsTitle')}</h3>
                    <ul className='mt-4 space-y-3 text-sm leading-7 text-slate-600'>
                      {strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>
            </>
          ) : (
            <>
              <SectionCard id='cv-overview' title={t('seekerProfile.sections.cvOverview')} icon={<FileText className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]'>
                  <div className='rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(239,246,255,1),rgba(250,245,255,1))] p-6'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-600'>CV Backend</p>
                    <h3 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>Quản lý CV ứng viên</h3>
                    <p className='mt-3 text-sm leading-7 text-slate-600'>
                      Dữ liệu đang lấy trực tiếp từ backend CV theo schema Prisma: file CV, học vấn, kinh nghiệm, kỹ năng,
                      tính cách, chứng chỉ và dự án.
                    </p>
                    <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
                      <input
                        type='file'
                        accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
                        className='min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700'
                      />
                      <button
                        type='button'
                        onClick={handleUploadCv}
                        disabled={uploadCvMutation.isPending}
                        className='inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] disabled:cursor-not-allowed disabled:opacity-60'
                      >
                        <FileUp className='h-4 w-4' />
                        {uploadCvMutation.isPending ? 'Đang tải...' : 'Tải CV'}
                      </button>
                    </div>
                    {cvDetail?.cvUrl ? (
                      <a href={cvDetail.cvUrl} target='_blank' rel='noreferrer' className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700'>
                        Xem file CV hiện tại
                        <ExternalLink className='h-4 w-4' />
                      </a>
                    ) : null}
                  </div>

                  <div className='grid gap-3'>
                    <MetricMini label='Học vấn' value={isLoadingCv ? '...' : String(cvDetail?.educations.length ?? 0)} />
                    <MetricMini label='Kinh nghiệm' value={isLoadingCv ? '...' : String(cvDetail?.experiences.length ?? 0)} />
                    <MetricMini label='Kỹ năng' value={isLoadingCv ? '...' : String(cvDetail?.skills.length ?? 0)} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard id='cv-education' title='Học vấn' icon={<GraduationCap className='h-5 w-5' />} editLabel={editing?.section === 'education' ? 'Đang sửa' : 'CRUD'}>
                <CvFormGrid>
                  <TextField label='Trường' value={educationForm.school} onChange={(value) => setEducationForm((form) => ({ ...form, school: value }))} />
                  <TextField label='Bằng cấp' value={educationForm.degree} onChange={(value) => setEducationForm((form) => ({ ...form, degree: value }))} />
                  <TextField label='Chuyên ngành' value={educationForm.major} onChange={(value) => setEducationForm((form) => ({ ...form, major: value }))} />
                  <TextField type='date' label='Bắt đầu' value={educationForm.startDate} onChange={(value) => setEducationForm((form) => ({ ...form, startDate: value }))} />
                  <TextField type='date' label='Kết thúc' value={educationForm.endDate} onChange={(value) => setEducationForm((form) => ({ ...form, endDate: value }))} />
                  <TextField label='Mô tả' value={educationForm.description} onChange={(value) => setEducationForm((form) => ({ ...form, description: value }))} />
                </CvFormGrid>
                <CvFormActions isEditing={editing?.section === 'education'} isPending={educationMutation.isPending} onCancel={clearEdit} onSave={() => educationMutation.mutate()} />
                <CvList items={cvDetail?.educations ?? []} emptyText='Chưa có học vấn.' renderItem={(item) => <CvListRow key={item.id} title={`${item.degree} - ${item.school}`} meta={`${formatDate(item.startDate, locale, fallbackText)} - ${formatDate(item.endDate ?? undefined, locale, 'Hiện tại')}`} description={item.description} onEdit={() => startEditEducation(item)} onDelete={() => deleteMutation.mutate({ section: 'education', id: item.id })} />} />
              </SectionCard>

              <SectionCard id='cv-experience' title='Kinh nghiệm' icon={<BriefcaseBusiness className='h-5 w-5' />} editLabel={editing?.section === 'experience' ? 'Đang sửa' : 'CRUD'}>
                <CvFormGrid>
                  <TextField label='Công ty' value={experienceForm.company} onChange={(value) => setExperienceForm((form) => ({ ...form, company: value }))} />
                  <TextField label='Vị trí' value={experienceForm.position} onChange={(value) => setExperienceForm((form) => ({ ...form, position: value }))} />
                  <TextField type='date' label='Bắt đầu' value={experienceForm.startDate} onChange={(value) => setExperienceForm((form) => ({ ...form, startDate: value }))} />
                  <TextField type='date' label='Kết thúc' value={experienceForm.endDate} onChange={(value) => setExperienceForm((form) => ({ ...form, endDate: value }))} />
                  <TextField label='Mô tả' value={experienceForm.description} onChange={(value) => setExperienceForm((form) => ({ ...form, description: value }))} />
                </CvFormGrid>
                <CvFormActions isEditing={editing?.section === 'experience'} isPending={experienceMutation.isPending} onCancel={clearEdit} onSave={() => experienceMutation.mutate()} />
                <CvList items={cvDetail?.experiences ?? []} emptyText='Chưa có kinh nghiệm.' renderItem={(item) => <CvListRow key={item.id} title={`${item.position} - ${item.company}`} meta={`${formatDate(item.startDate, locale, fallbackText)} - ${formatDate(item.endDate ?? undefined, locale, 'Hiện tại')}`} description={item.description} onEdit={() => startEditExperience(item)} onDelete={() => deleteMutation.mutate({ section: 'experience', id: item.id })} />} />
              </SectionCard>

              <SectionCard id='cv-skills' title='Kỹ năng và tính cách' icon={<Languages className='h-5 w-5' />} editLabel='CRUD'>
                <div className='grid gap-6 lg:grid-cols-2'>
                  <div>
                    <TextField label='Kỹ năng' value={skillForm} placeholder='React, NestJS, PostgreSQL' onChange={setSkillForm} />
                    <CvFormActions isEditing={editing?.section === 'skill'} isPending={skillMutation.isPending} onCancel={clearEdit} onSave={() => skillMutation.mutate()} />
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {(cvDetail?.skills ?? []).map((skill) => (
                        <span key={skill.id} className='inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700'>
                          {skill.name}
                          <button type='button' onClick={() => startEditSkill(skill)} className='text-sky-900'>
                            <Pencil className='h-3.5 w-3.5' />
                          </button>
                          <button type='button' onClick={() => deleteMutation.mutate({ section: 'skill', id: skill.id })} className='text-rose-600'>
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <CvFormGrid>
                      <TextField label='Loại' value={personalityForm.type} onChange={(value) => setPersonalityForm((form) => ({ ...form, type: value }))} />
                      <TextField label='Mô tả' value={personalityForm.description} onChange={(value) => setPersonalityForm((form) => ({ ...form, description: value }))} />
                    </CvFormGrid>
                    <CvFormActions isEditing={editing?.section === 'personality'} isPending={personalityMutation.isPending} onCancel={clearEdit} onSave={() => personalityMutation.mutate()} />
                    <CvList items={cvDetail?.personalities ?? []} emptyText='Chưa có tính cách.' renderItem={(item) => <CvListRow key={item.id} title={item.type} description={item.description} onEdit={() => startEditPersonality(item)} onDelete={() => deleteMutation.mutate({ section: 'personality', id: item.id })} />} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard id='cv-certificates' title='Chứng chỉ' icon={<FileBadge2 className='h-5 w-5' />} editLabel={editing?.section === 'certificate' ? 'Đang sửa' : 'CRUD'}>
                <CvFormGrid>
                  <TextField label='Tên chứng chỉ' value={certificateForm.title} onChange={(value) => setCertificateForm((form) => ({ ...form, title: value }))} />
                  <TextField label='Đơn vị cấp' value={certificateForm.issuer} onChange={(value) => setCertificateForm((form) => ({ ...form, issuer: value }))} />
                  <TextField type='date' label='Ngày cấp' value={certificateForm.issuedDate} onChange={(value) => setCertificateForm((form) => ({ ...form, issuedDate: value }))} />
                  <TextField label='URL file' value={certificateForm.fileUrl} onChange={(value) => setCertificateForm((form) => ({ ...form, fileUrl: value }))} />
                </CvFormGrid>
                <CvFormActions isEditing={editing?.section === 'certificate'} isPending={certificateMutation.isPending} onCancel={clearEdit} onSave={() => certificateMutation.mutate()} />
                <CvList items={cvDetail?.certificates ?? []} emptyText='Chưa có chứng chỉ.' renderItem={(item) => <CvListRow key={item.id} title={item.title} meta={`${item.issuer}${item.issuedDate ? ` - ${formatDate(item.issuedDate, locale, fallbackText)}` : ''}`} description={item.fileUrl} onEdit={() => startEditCertificate(item)} onDelete={() => deleteMutation.mutate({ section: 'certificate', id: item.id })} />} />
              </SectionCard>

              <SectionCard id='cv-projects' title='Dự án' icon={<Star className='h-5 w-5' />} editLabel={editing?.section === 'project' ? 'Đang sửa' : 'CRUD'}>
                <CvFormGrid>
                  <TextField label='Tên dự án' value={projectForm.name} onChange={(value) => setProjectForm((form) => ({ ...form, name: value }))} />
                  <TextField label='Vai trò' value={projectForm.role} onChange={(value) => setProjectForm((form) => ({ ...form, role: value }))} />
                  <TextField label='Link' value={projectForm.link} onChange={(value) => setProjectForm((form) => ({ ...form, link: value }))} />
                  <TextField type='date' label='Bắt đầu' value={projectForm.startDate} onChange={(value) => setProjectForm((form) => ({ ...form, startDate: value }))} />
                  <TextField type='date' label='Kết thúc' value={projectForm.endDate} onChange={(value) => setProjectForm((form) => ({ ...form, endDate: value }))} />
                  <TextField label='Mô tả' value={projectForm.description} onChange={(value) => setProjectForm((form) => ({ ...form, description: value }))} />
                </CvFormGrid>
                <CvFormActions isEditing={editing?.section === 'project'} isPending={projectMutation.isPending} onCancel={clearEdit} onSave={() => projectMutation.mutate()} />
                <CvList items={cvDetail?.projects ?? []} emptyText='Chưa có dự án.' renderItem={(item) => <CvListRow key={item.id} title={item.name} meta={item.role ?? undefined} description={item.description} onEdit={() => startEditProject(item)} onDelete={() => deleteMutation.mutate({ section: 'project', id: item.id })} />} />
              </SectionCard>

              {false ? (
                <>
              <SectionCard id='cv-library' title={t('seekerProfile.sections.cvLibrary')} icon={<FileBadge2 className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 xl:grid-cols-2'>
                  {cvCards.map((cv) => (
                    <article key={cv.title} className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{cv.title}</h3>
                          <p className='mt-1 text-sm text-slate-500'>{cv.format} • {cv.language}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cv.isPrimary ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {cv.status}
                        </span>
                      </div>
                      <p className='mt-4 text-sm text-slate-500'>{cv.updatedAt}</p>
                      <div className='mt-5 flex flex-wrap gap-3'>
                        <button type='button' className='rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white'>
                          {t('seekerProfile.cvLibrary.actions.view')}
                        </button>
                        <button type='button' className='rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700'>
                          {t('seekerProfile.cvLibrary.actions.rename')}
                        </button>
                        <button type='button' className='rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700'>
                          {t('seekerProfile.cvLibrary.actions.setDefault')}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='cv-checklist' title={t('seekerProfile.sections.cvChecklist')} icon={<Sparkles className='h-5 w-5' />} editLabel={t('seekerProfile.common.edit')}>
                <div className='grid gap-4 md:grid-cols-2'>
                  {checklistItems.map((item) => (
                    <div key={item} className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
                      <span className='mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700'>
                        ✓
                      </span>
                      <p className='text-sm font-medium leading-6 text-slate-700'>{item}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
                </>
              ) : null}
            </>
          )}
        </div>

        <aside className='hidden xl:block'>
          <div className='sticky top-24 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <div className='flex items-center gap-3 border-b border-slate-100 pb-4'>
              <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-lg font-semibold text-white'>
                {user?.user_image ? (
                  <img src={user.user_image} alt={user.full_name} className='h-full w-full object-cover' />
                ) : (
                  <span>{(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-slate-950'>{user?.full_name || t('seekerProfile.sidebar.userFallback')}</p>
                <p className='mt-1 truncate text-xs text-slate-500'>{user?.email}</p>
              </div>
            </div>

            <div className='mt-5 space-y-5'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-600'>
                  {activeTab === 'profile' ? t('seekerProfile.sidebar.profileLabel') : t('seekerProfile.sidebar.cvLabel')}
                </p>
                <nav className='mt-3 space-y-2'>
                  {sectionNav.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className='block rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950'
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {toastMessage ? (
        <SeekerActionToast
          title={t('seekerTracking.common.toastSuccessTitle')}
          message={toastMessage}
          closeLabel={t('seekerTracking.common.closeToast')}
          onClose={() => setToastMessage(null)}
        />
      ) : null}
    </div>
  )
}

const TabButton = ({
  active,
  children,
  onClick
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-t-2xl border-b-2 px-5 py-3 text-sm font-semibold transition ${
      active ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'
    }`}
  >
    {children}
  </button>
)

const HeroMetric = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
    <div className='flex items-start gap-3'>
      <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm'>{icon}</div>
      <div className='min-w-0'>
        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
        <p className='mt-1 truncate text-sm font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  </div>
)

const MetricMini = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-sm font-semibold text-slate-900'>{value}</p>
  </div>
)

const ActionTile = ({ title, description, icon }: { title: string; description: string; icon: ReactNode }) => (
  <button type='button' className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50'>
    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
    <div>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm leading-6 text-slate-500'>{description}</p>
    </div>
  </button>
)

const ActionLink = ({ to, title, description, icon }: { to: string; title: string; description: string; icon: ReactNode }) => (
  <Link to={to} className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50'>
    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
    <div>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm leading-6 text-slate-500'>{description}</p>
    </div>
  </Link>
)

const SectionCard = ({
  id,
  title,
  icon,
  children,
  editLabel
}: {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  editLabel: string
}) => (
  <section id={id} className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-6'>
    <div className='mb-5 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
        <h2 className='text-xl font-semibold text-slate-950'>{title}</h2>
      </div>
      <button type='button' className='inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'>
        <Pencil className='h-4 w-4' />
        {editLabel}
      </button>
    </div>
    {children}
  </section>
)

const CvFormGrid = ({ children }: { children: ReactNode }) => (
  <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>{children}</div>
)

const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) => (
  <label className='block'>
    <span className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className='mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
    />
  </label>
)

const CvFormActions = ({
  isEditing,
  isPending,
  onCancel,
  onSave
}: {
  isEditing: boolean
  isPending: boolean
  onCancel: () => void
  onSave: () => void
}) => (
  <div className='mt-4 flex flex-wrap gap-3'>
    <button
      type='button'
      onClick={onSave}
      disabled={isPending}
      className='inline-flex h-11 items-center gap-2 rounded-2xl bg-sky-500 px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isEditing ? <Save className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
      {isPending ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm mới'}
    </button>
    {isEditing ? (
      <button
        type='button'
        onClick={onCancel}
        className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700'
      >
        <X className='h-4 w-4' />
        Hủy
      </button>
    ) : null}
  </div>
)

const CvList = <T,>({
  items,
  emptyText,
  renderItem
}: {
  items: T[]
  emptyText: string
  renderItem: (item: T) => ReactNode
}) => (
  <div className='mt-5 space-y-3'>
    {items.length > 0 ? (
      items.map(renderItem)
    ) : (
      <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-sm text-slate-500'>{emptyText}</div>
    )}
  </div>
)

const CvListRow = ({
  title,
  meta,
  description,
  onEdit,
  onDelete
}: {
  title: string
  meta?: string
  description?: string | null
  onEdit: () => void
  onDelete: () => void
}) => (
  <article className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
    <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
      <div className='min-w-0'>
        <h3 className='text-sm font-semibold text-slate-950'>{title}</h3>
        {meta ? <p className='mt-1 text-sm text-slate-500'>{meta}</p> : null}
        {description ? <p className='mt-2 text-sm leading-6 text-slate-600'>{description}</p> : null}
      </div>
      <div className='flex shrink-0 gap-2'>
        <button type='button' onClick={onEdit} className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sky-700'>
          <Pencil className='h-4 w-4' />
        </button>
        <button type='button' onClick={onDelete} className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600'>
          <Trash2 className='h-4 w-4' />
        </button>
      </div>
    </div>
  </article>
)

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-col gap-1 rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
    <dt className='text-sm font-semibold text-slate-900'>{label}</dt>
    <dd className='text-sm text-slate-600 sm:text-right'>{value}</dd>
  </div>
)

const LinkItem = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-start justify-between gap-4 rounded-[18px] border border-slate-200 bg-white px-4 py-3'>
    <span className='text-sm font-semibold text-slate-900'>{label}</span>
    <a href={value} target='_blank' rel='noreferrer' className='inline-flex min-w-0 items-center gap-2 text-right text-sm text-sky-600 hover:text-sky-700'>
      <span className='truncate'>{value}</span>
      <ExternalLink className='h-4 w-4 shrink-0' />
    </a>
  </div>
)

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-sm font-semibold text-slate-900'>{value}</p>
  </div>
)

const BadgeCard = ({ title, meta, accent }: { title: string; meta: string; accent: Accent }) => {
  const accentClassName =
    accent === 'amber'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : accent === 'emerald'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-sky-200 bg-sky-50 text-sky-700'

  return (
    <div className={`rounded-[22px] border p-5 ${accentClassName}`}>
      <p className='text-base font-semibold'>{title}</p>
      <p className='mt-2 text-sm'>{meta}</p>
    </div>
  )
}

const TimelineRow = ({ title, meta }: { title: string; meta: string }) => (
  <div className='flex items-start gap-4 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
    <div className='mt-1 h-3 w-3 shrink-0 rounded-full bg-sky-500' />
    <div className='min-w-0 flex-1'>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm text-slate-500'>{meta}</p>
    </div>
  </div>
)

const formatDate = (date: string | undefined, locale: string, fallback: string) => {
  if (!date) return fallback

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString(locale)
}

const formatInputDate = (date?: string | null) => {
  if (!date) return ''

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''

  return parsed.toISOString().slice(0, 10)
}

const normalizeOptionalFields = <T extends Record<string, string>>(data: T) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.trim() === '' ? null : value.trim()])) as {
    [K in keyof T]: string | null
  }

const formatDateTime = (date: string | undefined, locale: string, fallback: string) => {
  if (!date) return fallback

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default ProfilePage
