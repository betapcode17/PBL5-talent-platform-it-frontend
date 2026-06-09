import type { ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  Camera,
  Copy,
  ExternalLink,
  FileBadge2,
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
  type CvCertificatePayload,
  type CvEducation,
  type CvExperience,
  type CvPersonality,
  type CvPersonalityPayload,
  type CvProject,
  type CvSkill
} from '@/api/cv'
import { SeekerActionToast } from '@/components/seeker/SeekerActionToast'
import { SeekerStatusBadge } from '@/components/seeker/SeekerStatusBadge'
import { useSeekerApplicationsTracker, useSeekerInterviewsTracker } from '@/hooks/useSeekerCareer'
import { buildGoogleCalendarUrl, downloadInterviewCalendarFile } from '@/lib/interviewCalendar'
import { useAuthStore } from '@/store/authStore'

type CvSectionName = 'education' | 'experience' | 'skill' | 'certificate' | 'project' | 'personality'
type CertificateCategory = 'english' | 'other'
type EnglishCertificateType = 'TOEIC' | 'IELTS' | 'VSTEP'
type SkillDraft = {
  id?: string
  name: string
  category: string
  experienceMonths: number
  isStrong: boolean
}

const skillCategoryLabels: Record<string, string> = {
  programming_language: 'Ngôn ngữ lập trình',
  framework: 'Framework / Frameworks',
  os: 'Hệ điều hành / Operating Systems',
  database: 'Cơ sở dữ liệu / Databases',
  version_control: 'Hệ thống quản lý phiên bản',
  development_tool: 'Công cụ quản lý phát triển',
  platform: 'Nền tảng'
}
void skillCategoryLabels

const skillCategoryOptions = [
  { value: 'programming_language', label: 'Ngôn ngữ lập trình / Programming Languages' },
  { value: 'framework', label: 'Framework / Frameworks' },
  { value: 'os', label: 'Hệ điều hành / Operating Systems' },
  { value: 'database', label: 'Cơ sở dữ liệu / Databases' },
  { value: 'version_control', label: 'Hệ thống quản lý phiên bản / Version Control' },
  { value: 'development_tool', label: 'Công cụ quản lý phát triển / Development Tools' },
  { value: 'platform', label: 'Nền tảng / Platforms' }
]

const skillNameOptionsByCategory: Record<string, string[]> = {
  programming_language: [
    'Assembly',
    'Bash',
    'C',
    'C#',
    'C++',
    'Clojure',
    'Dart',
    'Elixir',
    'Erlang',
    'F#',
    'Fortran',
    'Go',
    'Groovy',
    'Haskell',
    'Java',
    'JavaScript',
    'Julia',
    'Kotlin',
    'Lua',
    'MATLAB',
    'Objective-C',
    'Perl',
    'PHP',
    'PowerShell',
    'Prolog',
    'Python',
    'R',
    'Ruby',
    'Rust',
    'Scala',
    'Solidity',
    'SQL',
    'Swift',
    'TypeScript',
    'Visual Basic',
    'Zig'
  ],
  framework: [
    'Angular',
    'ASP.NET Core',
    'Bootstrap',
    'CakePHP',
    'CodeIgniter',
    'Django',
    'Echo',
    'Ember.js',
    'Express.js',
    'FastAPI',
    'Flask',
    'Flutter',
    'Gatsby',
    'Gin',
    'Hibernate',
    'Ionic',
    'Keras',
    'Laravel',
    'Meteor',
    'NestJS',
    'Next.js',
    'Nuxt.js',
    'Phoenix',
    'Play Framework',
    'PyTorch',
    'React',
    'React Native',
    'Ruby on Rails',
    'Spring Boot',
    'Svelte',
    'Symfony',
    'Tailwind CSS',
    'TensorFlow',
    'Vue.js',
    'Xamarin',
    'Zend Framework'
  ],
  os: ['Alpine Linux', 'Android', 'CentOS', 'Debian', 'iOS', 'Linux Mint', 'macOS', 'Red Hat Enterprise Linux', 'Ubuntu', 'Windows'],
  database: ['Cassandra', 'ClickHouse', 'CouchDB', 'DynamoDB', 'Elasticsearch', 'Firebase', 'MariaDB', 'MongoDB', 'MySQL', 'Neo4j', 'Oracle', 'PostgreSQL', 'Redis', 'SQLite', 'SQL Server'],
  version_control: [
    'Apache Subversion (SVN)',
    'AWS CodeCommit',
    'Bazaar',
    'Bitbucket',
    'Concurrent Versions System (CVS)',
    'Git',
    'GitHub',
    'GitLab',
    'Mercurial',
    'Perforce (Helix Core)'
  ],
  development_tool: ['Asana', 'Azure DevOps', 'Bitbucket', 'ClickUp', 'Confluence', 'Docker', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'Jira', 'Kubernetes', 'Linear', 'Slack', 'Trello'],
  platform: []
}

const emptySkillDraft: SkillDraft = {
  name: '',
  category: 'programming_language',
  experienceMonths: 0,
  isStrong: false
}

const createEmptySkillDraft = (category: string): SkillDraft => ({
  ...emptySkillDraft,
  category
})

const ensureCategoryDrafts = (drafts: SkillDraft[]) => {
  const normalizedDrafts = drafts.length > 0 ? drafts : []

  return skillCategoryOptions.reduce<SkillDraft[]>((items, category) => {
    const hasCategoryDraft = items.some((draft) => draft.category === category.value)

    return hasCategoryDraft ? items : [...items, createEmptySkillDraft(category.value)]
  }, normalizedDrafts)
}

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

const emptyCertificateForm = {
  category: 'english' as CertificateCategory,
  englishType: 'TOEIC' as EnglishCertificateType,
  score: '',
  customTitle: '',
  issuedDate: '',
}

const englishCertificateOptions: Array<{ value: EnglishCertificateType; label: string }> = [
  { value: 'TOEIC', label: 'TOEIC' },
  { value: 'IELTS', label: 'IELTS' },
  { value: 'VSTEP', label: 'VSTEP' }
]

const certificateCategoryOptions: Array<{ value: CertificateCategory; label: string }> = [
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'other', label: 'Chứng chỉ khác' }
]

const educationDegreeOptions = [
  { value: 'Trung bình', label: 'Trung bình' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Giỏi', label: 'Giỏi' },
  { value: 'Xuất sắc', label: 'Xuất sắc' }
]

const educationMajorOptions = [
  { value: 'Công nghệ phần mềm', label: 'Công nghệ phần mềm' },
  { value: 'Khoa học máy tính', label: 'Khoa học máy tính' },
  { value: 'Trí tuệ nhân tạo', label: 'Trí tuệ nhân tạo' },
  { value: 'Mạng máy tính & truyền thông dữ liệu', label: 'Mạng máy tính & truyền thông dữ liệu' },
  { value: 'An toàn thông tin', label: 'An toàn thông tin' },
  { value: 'Big Data', label: 'Big Data' },
  { value: 'IoT', label: 'IoT' }
]

const emptyProjectForm = {
  name: '',
  description: '',
  link: '',
  role: '',
  startDate: '',
  endDate: ''
}

const emptyPersonalityForm = {
  type: '',
  description: ''
}

const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const [activeTab] = useState<'profile' | 'cv'>('profile')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [editing, setEditing] = useState<{ section: CvSectionName; id: string } | null>(null)
  const [educationForm, setEducationForm] = useState(emptyEducationForm)
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm)
  const [skillDrafts, setSkillDrafts] = useState<SkillDraft[]>(() => ensureCategoryDrafts([]))
  const [certificateForm, setCertificateForm] = useState(emptyCertificateForm)
  const [projectForm, setProjectForm] = useState(emptyProjectForm)
  const [personalityForm, setPersonalityForm] = useState(emptyPersonalityForm)
  const queryClient = useQueryClient()
  const { data: applications, isLoading: isLoadingApplications } = useSeekerApplicationsTracker()
  const { data: interviews, isLoading: isLoadingInterviews } = useSeekerInterviewsTracker()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'
  const fallbackText = t('seekerProfile.common.notUpdated')
  const cvQueryKey = ['seeker', 'cv', user?.id]
  const { data: cvDetail } = useQuery({
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
    mutationFn: async () => {
      const validationMessage = validateEducationForm(educationForm)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      return editing?.section === 'education'
        ? updateCvEducationApi(editing.id, normalizeOptionalFields(educationForm))
        : createCvEducationApi(normalizeOptionalFields(educationForm))
    },
    onSuccess: () => {
      setEditing(null)
      setEducationForm(emptyEducationForm)
      void refreshCv('Đã lưu học vấn.')
    }
  })

  const experienceMutation = useMutation({
    mutationFn: async () => {
      const validationMessage = validateExperienceForm(experienceForm)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      return editing?.section === 'experience'
        ? updateCvExperienceApi(editing.id, normalizeOptionalFields(experienceForm))
        : createCvExperienceApi(normalizeOptionalFields(experienceForm))
    },
    onSuccess: () => {
      setEditing(null)
      setExperienceForm(emptyExperienceForm)
      void refreshCv('Đã lưu kinh nghiệm.')
    }
  })

  const skillMutation = useMutation({
    mutationFn: async () => {
      const normalizedDrafts = skillDrafts
        .map((skill) => ({
          ...skill,
          name: skill.name.trim(),
          category: skill.category.trim(),
          experienceMonths: Number(skill.experienceMonths) || 0
        }))
        .filter((skill) => skill.name)

      const validationMessage = validateSkillDrafts(normalizedDrafts)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      const existingDrafts = normalizedDrafts.filter((skill) => skill.id)
      const newDrafts = normalizedDrafts.filter((skill) => !skill.id)

      await Promise.all(
        existingDrafts.map((skill) =>
          updateCvSkillApi(skill.id!, {
            name: skill.name,
            category: skill.category,
            experienceMonths: skill.experienceMonths,
            isStrong: skill.isStrong
          })
        )
      )

      if (newDrafts.length > 0) {
        await createCvSkillsApi(
          newDrafts.map((skill) => ({
            name: skill.name,
            category: skill.category,
            experienceMonths: skill.experienceMonths,
            isStrong: skill.isStrong
          }))
        )
      }
    },
    onSuccess: () => {
      setSkillDrafts((drafts) => ensureCategoryDrafts(drafts))
      void refreshCv('Đã lưu kỹ năng.')
    }
  })

  const certificateMutation = useMutation({
    mutationFn: async () => {
      const validationMessage = validateCertificateForm(certificateForm)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      if (certificateForm.category === 'english') {
        const score = Number(certificateForm.score)

        if (certificateForm.englishType === 'IELTS' && score < 1) {
          const message = 'Band IELTS phải lớn hơn hoặc bằng 1.0.'
          setToastMessage(message)
          throw new Error(message)
        }

        if (certificateForm.englishType === 'TOEIC' && score < 10) {
          const message = 'Điểm TOEIC phải lớn hơn hoặc bằng 10.'
          setToastMessage(message)
          throw new Error(message)
        }

        if (certificateForm.englishType === 'VSTEP' && score < 0.5) {
          const message = 'Điểm VSTEP phải lớn hơn hoặc bằng 0.5.'
          setToastMessage(message)
          throw new Error(message)
        }
      }

      const payload = buildCertificatePayload(certificateForm)

      return editing?.section === 'certificate'
        ? updateCvCertificateApi(editing.id, payload)
        : createCvCertificateApi(payload)
    },
    onSuccess: () => {
      setEditing(null)
      setCertificateForm(emptyCertificateForm)
      void refreshCv('Đã lưu chứng chỉ.')
    }
  })

  const projectMutation = useMutation({
    mutationFn: async () => {
      const validationMessage = validateProjectForm(projectForm)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      return editing?.section === 'project'
        ? updateCvProjectApi(editing.id, normalizeOptionalFields(projectForm))
        : createCvProjectApi(normalizeOptionalFields(projectForm))
    },
    onSuccess: () => {
      setEditing(null)
      setProjectForm(emptyProjectForm)
      void refreshCv('Đã lưu dự án.')
    }
  })

  const personalityMutation = useMutation({
    mutationFn: async () => {
      const validationMessage = validatePersonalityForm(personalityForm)

      if (validationMessage) {
        setToastMessage(validationMessage)
        throw new Error(validationMessage)
      }

      const payload = normalizeOptionalFields(personalityForm) as CvPersonalityPayload

      return editing?.section === 'personality'
        ? updateCvPersonalityApi(editing.id, payload)
        : createCvPersonalityApi(payload)
    },
    onSuccess: () => {
      setEditing(null)
      setPersonalityForm(emptyPersonalityForm)
      void refreshCv('Đã lưu CvPersonality.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ section, id }: { section: CvSectionName; id: string }) => {
      if (section === 'education') return deleteCvEducationApi(id)
      if (section === 'experience') return deleteCvExperienceApi(id)
      if (section === 'skill') return deleteCvSkillApi(id)
      if (section === 'certificate') return deleteCvCertificateApi(id)
      if (section === 'personality') return deleteCvPersonalityApi(id)

      return deleteCvProjectApi(id)
    },
    onSuccess: () => void refreshCv('Đã xóa mục CV.')
  })

  const profileSections = useMemo(
    () => [
      { id: 'basic-info', label: t('seekerProfile.sections.basicInfo') },
      { id: 'education', label: t('seekerProfile.sections.education') },
      { id: 'certifications', label: t('seekerProfile.sections.certifications') },
      { id: 'skills', label: t('seekerProfile.sections.skills') },
      { id: 'projects', label: t('seekerProfile.sections.projects') },
      { id: 'experience', label: t('seekerProfile.sections.experience') },
      { id: 'about', label: t('seekerProfile.sections.about') }
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

  const sectionNav = profileSections
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

  const handleExportCvPdf = () => {
    const exportUrl = '/seeker/profile/export'
    const exportWindow = window.open(exportUrl, '_blank', 'noopener,noreferrer')

    if (!exportWindow) {
      window.location.assign(exportUrl)
    }
  }

  const toggleSectionEditor = (sectionId: string) => {
    setExpandedSection((currentSection) => {
      const nextSection = currentSection === sectionId ? null : sectionId

      if (nextSection === 'skills') {
        setSkillDrafts(ensureCategoryDrafts(cvDetail?.skills.map(toSkillDraft) ?? []))
      }

      return nextSection
    })
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

  const startEditCertificate = (item: CvCertificate) => {
    setEditing({ section: 'certificate', id: item.id })
    setCertificateForm(toCertificateForm(item))
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

  const startEditPersonality = (item: CvPersonality) => {
    setEditing({ section: 'personality', id: item.id })
    setPersonalityForm({
      type: item.type,
      description: item.description ?? ''
    })
  }

  const clearEdit = () => {
    setEditing(null)
    setEducationForm(emptyEducationForm)
    setExperienceForm(emptyExperienceForm)
    setSkillDrafts(ensureCategoryDrafts(cvDetail?.skills.map(toSkillDraft) ?? []))
    setCertificateForm(emptyCertificateForm)
    setProjectForm(emptyProjectForm)
    setPersonalityForm(emptyPersonalityForm)
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
              <ActionTile title={t('seekerProfile.quickActions.reviewProfile.title')} description={t('seekerProfile.quickActions.reviewProfile.description')} icon={<Sparkles className='h-4 w-4' />} />
              <button
                type='button'
                onClick={handleExportCvPdf}
                className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50'
              >
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>
                  <FileBadge2 className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>Xuất PDF CV</p>
                  <p className='mt-1 text-sm leading-6 text-slate-500'>Trích xuất toàn bộ thông tin seeker và các mục CV sang bản in để lưu dưới dạng PDF.</p>
                </div>
              </button>
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

      </section>

      <div className='mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]'>
        <div className='space-y-6'>
          {activeTab === 'profile' ? (
            <>
              <SectionCard
                id='basic-info'
                title={t('seekerProfile.sections.basicInfo')}
                icon={<UserRound className='h-5 w-5' />}
                editLabel={expandedSection === 'basic-info' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('basic-info')}
              >
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
                {expandedSection === 'basic-info' ? (
                  <div className='mt-5 rounded-[24px] border border-sky-100 bg-sky-50/50 p-5'>
                    <p className='text-sm font-semibold text-slate-950'>File CV đính kèm</p>
                    <div className='mt-3 flex flex-col gap-3 sm:flex-row'>
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
                        className='inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
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
                ) : null}
              </SectionCard>

              <SectionCard
                id='education'
                title={t('seekerProfile.sections.education')}
                icon={<GraduationCap className='h-5 w-5' />}
                editLabel={expandedSection === 'education' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('education')}
              >
                <CvList items={cvDetail?.educations ?? []} emptyText='Chưa có học vấn.' renderItem={(item) => <CvListRow key={item.id} canEdit={expandedSection === 'education'} title={`${item.degree} - ${item.school}`} meta={`${formatDate(item.startDate, locale, fallbackText)} - ${formatDate(item.endDate ?? undefined, locale, 'Hiện tại')}`} description={item.description} onEdit={() => startEditEducation(item)} onDelete={() => deleteMutation.mutate({ section: 'education', id: item.id })} />} />
                {expandedSection === 'education' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <CvFormGrid>
                      <TextField label='Trường' value={educationForm.school} onChange={(value) => setEducationForm((form) => ({ ...form, school: value }))} />
                      <TextField label='Bằng cấp' value={educationForm.degree} onChange={(value) => setEducationForm((form) => ({ ...form, degree: value }))} />
                      <TextField label='Chuyên ngành' value={educationForm.major} onChange={(value) => setEducationForm((form) => ({ ...form, major: value }))} />
                      <TextField type='date' label='Bắt đầu' value={educationForm.startDate} onChange={(value) => setEducationForm((form) => ({ ...form, startDate: value }))} />
                      <TextField type='date' label='Kết thúc' value={educationForm.endDate} onChange={(value) => setEducationForm((form) => ({ ...form, endDate: value }))} />
                    </CvFormGrid>
                    <div className='mt-4'>
                      <TextAreaField label='Mô tả' value={educationForm.description} onChange={(value) => setEducationForm((form) => ({ ...form, description: value }))} />
                    </div>
                    <CvFormActions isEditing={editing?.section === 'education'} isPending={educationMutation.isPending} onCancel={clearEdit} onSave={() => educationMutation.mutate()} />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                id='certifications'
                title={t('seekerProfile.sections.certifications')}
                icon={<FileBadge2 className='h-5 w-5' />}
                editLabel={expandedSection === 'certifications' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('certifications')}
              >
                <CvList
                  items={cvDetail?.certificates ?? []}
                  emptyText='Chưa có chứng chỉ.'
                  renderItem={(item) => (
                    <CvListRow
                      key={item.id}
                      canEdit={expandedSection === 'certifications'}
                      title={getCertificateDisplayLabel(item)}
                      meta={[
                        isEnglishCertificate(item) ? 'Tiếng Anh' : 'Chứng chỉ khác',
                        item.issuedDate ? formatDate(item.issuedDate, locale, fallbackText) : undefined
                      ]
                        .filter(Boolean)
                        .join(' - ')}
                      onEdit={() => startEditCertificate(item)}
                      onDelete={() => deleteMutation.mutate({ section: 'certificate', id: item.id })}
                    />
                  )}
                />
                {expandedSection === 'certifications' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <div className='space-y-4'>
                      <div className='rounded-[22px] border border-sky-100 bg-white p-4'>
                        <p className='text-sm font-semibold text-slate-950'>Nhập chứng chỉ theo nhóm</p>
                        <p className='mt-1 text-sm text-slate-500'>Mục tiếng Anh dùng dropdown TOEIC, IELTS, VSTEP. Các chứng chỉ khác có thể tự thêm tên như form mẫu.</p>
                      </div>
                      <CvFormGrid>
                        <SelectField
                          label='Nhóm chứng chỉ'
                          value={certificateForm.category}
                          onChange={(value) => setCertificateForm((form) => ({ ...form, category: value as CertificateCategory }))}
                          options={certificateCategoryOptions}
                        />
                        {certificateForm.category === 'english' ? (
                          <>
                            <SelectField
                              label='Chứng chỉ tiếng Anh'
                              value={certificateForm.englishType}
                              onChange={(value) => setCertificateForm((form) => ({ ...form, englishType: value as EnglishCertificateType }))}
                              options={englishCertificateOptions}
                            />
                            <TextField
                              label='Điểm / band'
                              value={certificateForm.score}
                              placeholder='VD: 850 hoặc 6.5'
                              inputMode='decimal'
                              pattern={
                                certificateForm.englishType === 'IELTS'
                                  ? '^([1-8](\\.0|\\.5)?|9(\\.0)?)$'
                                  : certificateForm.englishType === 'TOEIC'
                                    ? '^([1-9]\\d{1,2})$'
                                    : '^(0\\.5|[1-9]\\d*(\\.\\d+)?)$'
                              }
                              onChange={(value) => setCertificateForm((form) => ({ ...form, score: value }))}
                            />
                          </>
                        ) : (
                          <TextField
                            label='Tên chứng chỉ'
                            value={certificateForm.customTitle}
                            placeholder='VD: AWS Cloud Practitioner'
                            onChange={(value) => setCertificateForm((form) => ({ ...form, customTitle: value }))}
                          />
                        )}
                        <TextField type='date' label='Ngày cấp' value={certificateForm.issuedDate} onChange={(value) => setCertificateForm((form) => ({ ...form, issuedDate: value }))} />
                      </CvFormGrid>
                    </div>
                    <CvFormActions isEditing={editing?.section === 'certificate'} isPending={certificateMutation.isPending} onCancel={clearEdit} onSave={() => certificateMutation.mutate()} />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                id='skills'
                title={t('seekerProfile.sections.skills')}
                icon={<Languages className='h-5 w-5' />}
                editLabel={expandedSection === 'skills' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('skills')}
              >
                <SkillSummaryTable skills={cvDetail?.skills ?? []} />
                {expandedSection === 'skills' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-white'>
                    <SkillCategoryDrafts
                      drafts={skillDrafts}
                      onChangeDraft={(index, nextDraft) =>
                        setSkillDrafts((drafts) => drafts.map((item, itemIndex) => (itemIndex === index ? nextDraft : item)))
                      }
                      onDeleteDraft={(index, draft) => {
                        if (draft.id) {
                          deleteMutation.mutate({ section: 'skill', id: draft.id })
                        }

                        setSkillDrafts((drafts) => ensureCategoryDrafts(drafts.filter((_, itemIndex) => itemIndex !== index)))
                      }}
                      onAddDraft={(category) => setSkillDrafts((drafts) => [...drafts, createEmptySkillDraft(category)])}
                    />
                    <div className='flex justify-center border-t border-slate-200 bg-slate-50/90 px-5 py-4'>
                      <button
                        type='button'
                        onClick={clearEdit}
                        className='hidden'
                      >
                        Hủy
                      </button>
                      <button
                        type='button'
                        onClick={() => skillMutation.mutate()}
                        disabled={skillMutation.isPending}
                        className='inline-flex h-11 items-center justify-center rounded-2xl bg-sky-500 px-8 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
                      >
                        {skillMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                id='projects'
                title={t('seekerProfile.sections.projects')}
                icon={<Star className='h-5 w-5' />}
                editLabel={expandedSection === 'projects' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('projects')}
              >
                <CvList items={cvDetail?.projects ?? []} emptyText='Chưa có dự án.' renderItem={(item) => <CvListRow key={item.id} canEdit={expandedSection === 'projects'} title={item.name} meta={item.role ?? undefined} description={item.description} onEdit={() => startEditProject(item)} onDelete={() => deleteMutation.mutate({ section: 'project', id: item.id })} />} />
                {expandedSection === 'projects' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <CvFormGrid>
                      <TextField label='Tên dự án' value={projectForm.name} onChange={(value) => setProjectForm((form) => ({ ...form, name: value }))} />
                      <TextField label='Vai trò' value={projectForm.role} onChange={(value) => setProjectForm((form) => ({ ...form, role: value }))} />
                      <TextField label='Link' value={projectForm.link} onChange={(value) => setProjectForm((form) => ({ ...form, link: value }))} />
                      <TextField type='date' label='Bắt đầu' value={projectForm.startDate} onChange={(value) => setProjectForm((form) => ({ ...form, startDate: value }))} />
                      <TextField type='date' label='Kết thúc' value={projectForm.endDate} onChange={(value) => setProjectForm((form) => ({ ...form, endDate: value }))} />
                    </CvFormGrid>
                    <div className='mt-4'>
                      <TextAreaField label='Mô tả' value={projectForm.description} onChange={(value) => setProjectForm((form) => ({ ...form, description: value }))} />
                    </div>
                    <CvFormActions isEditing={editing?.section === 'project'} isPending={projectMutation.isPending} onCancel={clearEdit} onSave={() => projectMutation.mutate()} />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                id='experience'
                title={t('seekerProfile.sections.experience')}
                icon={<BriefcaseBusiness className='h-5 w-5' />}
                editLabel={expandedSection === 'experience' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('experience')}
              >
                <CvList items={cvDetail?.experiences ?? []} emptyText='Chưa có kinh nghiệm.' renderItem={(item) => <CvListRow key={item.id} canEdit={expandedSection === 'experience'} title={`${item.position} - ${item.company}`} meta={`${formatDate(item.startDate, locale, fallbackText)} - ${formatDate(item.endDate ?? undefined, locale, 'Hiện tại')}`} description={item.description} onEdit={() => startEditExperience(item)} onDelete={() => deleteMutation.mutate({ section: 'experience', id: item.id })} />} />
                {expandedSection === 'experience' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <CvFormGrid>
                      <TextField label='Công ty' value={experienceForm.company} onChange={(value) => setExperienceForm((form) => ({ ...form, company: value }))} />
                      <TextField label='Vị trí' value={experienceForm.position} onChange={(value) => setExperienceForm((form) => ({ ...form, position: value }))} />
                      <TextField type='date' label='Bắt đầu' value={experienceForm.startDate} onChange={(value) => setExperienceForm((form) => ({ ...form, startDate: value }))} />
                      <TextField type='date' label='Kết thúc' value={experienceForm.endDate} onChange={(value) => setExperienceForm((form) => ({ ...form, endDate: value }))} />
                    </CvFormGrid>
                    <div className='mt-4'>
                      <TextAreaField label='Mô tả' value={experienceForm.description} onChange={(value) => setExperienceForm((form) => ({ ...form, description: value }))} />
                    </div>
                    <CvFormActions isEditing={editing?.section === 'experience'} isPending={experienceMutation.isPending} onCancel={clearEdit} onSave={() => experienceMutation.mutate()} />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                id='about'
                title={t('seekerProfile.sections.about')}
                icon={<Sparkles className='h-5 w-5' />}
                editLabel={expandedSection === 'about' ? 'Đóng' : t('seekerProfile.common.edit')}
                onEdit={() => toggleSectionEditor('about')}
              >
                <CvList
                  items={cvDetail?.personalities ?? []}
                  emptyText='Chưa có CvPersonality.'
                  renderItem={(item) => (
                    <CvListRow
                      key={item.id}
                      canEdit={expandedSection === 'about'}
                      title={item.type}
                      description={item.description}
                      onEdit={() => startEditPersonality(item)}
                      onDelete={() => deleteMutation.mutate({ section: 'personality', id: item.id })}
                    />
                  )}
                />
                {expandedSection === 'about' ? (
                  <div className='mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <CvFormGrid>
                      <TextField label='Phân loại' value={personalityForm.type} onChange={(value) => setPersonalityForm((form) => ({ ...form, type: value }))} />
                    </CvFormGrid>
                    <div className='mt-4'>
                      <TextAreaField
                        label='Mô tả'
                        value={personalityForm.description}
                        onChange={(value) => setPersonalityForm((form) => ({ ...form, description: value }))}
                      />
                    </div>
                    <CvFormActions
                      isEditing={editing?.section === 'personality'}
                      isPending={personalityMutation.isPending}
                      onCancel={clearEdit}
                      onSave={() => personalityMutation.mutate()}
                    />
                  </div>
                ) : null}
              </SectionCard>
            </>
          ) : null}
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
  editLabel,
  onEdit
}: {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  editLabel: string
  onEdit?: () => void
}) => (
  <section id={id} className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-6'>
    <div className='mb-5 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
        <h2 className='text-xl font-semibold text-slate-950'>{title}</h2>
      </div>
      <button
        type='button'
        onClick={onEdit}
        className='inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
      >
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
  placeholder,
  min,
  step,
  pattern,
  inputMode
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  min?: number
  step?: number | string
  pattern?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) => {
  const selectOptions =
    label === 'Báº±ng cáº¥p'
      ? [{ value: '', label: 'Chá»n báº±ng cáº¥p' }, ...educationDegreeOptions]
      : label === 'ChuyÃªn ngÃ nh'
        ? [{ value: '', label: 'Chá»n chuyÃªn ngÃ nh' }, ...educationMajorOptions]
        : null

  return (
    <label className='block'>
      <span className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>{label}</span>
      {selectOptions ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
        >
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          min={min}
          step={step}
          pattern={pattern}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className='mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
        />
      )}
    </label>
  )
}

const SelectField = ({
  label,
  value,
  onChange,
  options
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) => (
  <label className='block'>
    <span className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className='mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 6
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) => (
  <label className='block'>
    <span className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>{label}</span>
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className='mt-2 min-h-[180px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
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

const SkillSummaryTable = ({ skills }: { skills: CvSkill[] }) => {
  const groupedSkills = skillCategoryOptions
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => (skill.category ?? 'programming_language') === category.value)
    }))
    .filter((category) => category.skills.length > 0)

  if (groupedSkills.length === 0) {
    return <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-sm text-slate-500'>Chưa có kỹ năng.</div>
  }

  return (
    <div className='overflow-hidden rounded-[22px] border border-indigo-200 bg-white'>
      <div className='flex flex-wrap gap-2 border-b border-indigo-100 bg-white px-5 py-4'>
        <span className='rounded-md bg-sky-50 px-2.5 py-1 text-sm font-semibold text-sky-600'>Kỹ năng thành thạo</span>
        <span className='rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-950'>Kỹ năng có kinh nghiệm</span>
      </div>
      <div className='grid grid-cols-[minmax(140px,0.34fr)_minmax(0,1fr)] border-b border-indigo-200 bg-indigo-50/50 text-sm font-semibold text-indigo-950'>
        <div className='border-r border-indigo-200 px-5 py-4 text-center'>Loại</div>
        <div className='px-5 py-4 text-center'>Kỹ năng</div>
      </div>
      {groupedSkills.map((category) => (
        <div key={category.value} className='grid grid-cols-[minmax(140px,0.34fr)_minmax(0,1fr)] border-b border-indigo-100 last:border-b-0'>
          <div className='border-r border-indigo-100 px-5 py-4 text-sm font-medium text-indigo-950'>{category.label}</div>
          <div className='flex flex-wrap gap-2 px-5 py-4'>
            {category.skills.map((skill) => (
              <span key={skill.id} className='inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-indigo-950'>
                <span className={skill.isStrong ? 'text-sky-600' : undefined}>{skill.name}</span>
                <span className='rounded bg-white px-1.5 py-0.5 text-xs font-medium text-indigo-900'>{skill.experienceMonths ?? 0} tháng</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const SkillCategoryDrafts = ({
  drafts,
  onChangeDraft,
  onDeleteDraft,
  onAddDraft
}: {
  drafts: SkillDraft[]
  onChangeDraft: (index: number, draft: SkillDraft) => void
  onDeleteDraft: (index: number, draft: SkillDraft) => void
  onAddDraft: (category: string) => void
}) => (
  <div className='space-y-6 p-5'>
    {skillCategoryOptions.map((category) => {
      const categoryDrafts = drafts
        .map((draft, index) => ({ draft, index }))
        .filter((item) => item.draft.category === category.value)

      return (
        <div key={category.value} className='space-y-3'>
          {categoryDrafts.map(({ draft, index }) => (
            <SkillDraftEditorRow
              key={`${draft.id ?? category.value}-${index}`}
              draft={draft}
              onChange={(nextDraft) => onChangeDraft(index, nextDraft)}
              onDelete={() => onDeleteDraft(index, draft)}
            />
          ))}
          <button
            type='button'
            onClick={() => onAddDraft(category.value)}
            className='inline-flex items-center gap-2 text-sm font-semibold text-sky-600'
          >
            <Plus className='h-4 w-4' />
            Thêm {category.label}
          </button>
        </div>
      )
    })}
  </div>
)

const SkillDraftRow = ({
  draft,
  onChange,
  onDelete
}: {
  draft: SkillDraft
  onChange: (draft: SkillDraft) => void
  onDelete: () => void
}) => (
  <div className='grid gap-3 lg:grid-cols-[minmax(280px,1fr)_minmax(220px,auto)_minmax(140px,auto)_44px] lg:items-center'>
    <select
      value={draft.name}
      onChange={(event) => onChange({ ...draft, name: event.target.value })}
      className='h-12 rounded-md border border-indigo-200 bg-white px-4 text-sm font-medium text-indigo-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
    >
      <option value=''>Chọn kỹ năng</option>
      <option value={draft.name}>{draft.name || 'Kỹ năng mới'}</option>
      {['Java', 'C++', 'C#', 'Python', 'JavaScript', 'Java(web)', 'Spring', 'ASP.NET MVC', 'Windows', 'MySql', 'Microsoft SQL Server', 'git', 'Slack', 'Google Meet']
        .filter((skillName) => skillName !== draft.name)
        .map((skillName) => (
          <option key={skillName} value={skillName}>
            {skillName}
          </option>
        ))}
    </select>
    <div className='flex items-center gap-3 text-sm font-medium text-indigo-950'>
      <span className='whitespace-nowrap'>Kinh nghiệm</span>
      <input
        type='number'
        min={1}
        max={600}
        value={draft.experienceMonths}
        onChange={(event) => onChange({ ...draft, experienceMonths: Number(event.target.value) })}
        className='h-12 w-20 rounded-md border border-indigo-200 bg-white px-3 text-center text-sm font-semibold text-indigo-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
      />
      <span className='whitespace-nowrap'>tháng</span>
    </div>
    <label className='inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-indigo-950'>
      <input
        type='checkbox'
        checked={draft.isStrong}
        onChange={(event) => onChange({ ...draft, isStrong: event.target.checked })}
        className='h-4 w-4 rounded border-indigo-300 text-sky-500'
      />
      Thành thạo
    </label>
    <button type='button' onClick={onDelete} className='inline-flex h-10 w-10 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50'>
      <Trash2 className='h-5 w-5' />
    </button>
  </div>
)
void SkillDraftRow

const SkillDraftEditorRow = ({
  draft,
  onChange,
  onDelete
}: {
  draft: SkillDraft
  onChange: (draft: SkillDraft) => void
  onDelete: () => void
}) => {
  const skillOptions = skillNameOptionsByCategory[draft.category] ?? []

  return (
    <div className='grid gap-3 lg:grid-cols-[minmax(280px,1fr)_minmax(220px,auto)_minmax(140px,auto)_44px] lg:items-center'>
      {draft.category === 'platform' ? (
        <input
          type='text'
          value={draft.name}
          placeholder='Nhập nền tảng'
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          className='h-12 rounded-md border border-indigo-200 bg-white px-4 text-sm font-medium text-indigo-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
        />
      ) : (
        <select
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          className='h-12 rounded-md border border-indigo-200 bg-white px-4 text-sm font-medium text-indigo-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
        >
          <option value=''>Chọn kỹ năng</option>
          {skillOptions.map((skillName) => (
            <option key={skillName} value={skillName}>
              {skillName}
            </option>
          ))}
        </select>
      )}
      <div className='flex items-center gap-3 text-sm font-medium text-indigo-950'>
        <span className='whitespace-nowrap'>Kinh nghiệm</span>
        <input
          type='number'
          min={1}
          max={600}
          value={draft.experienceMonths}
          onChange={(event) => onChange({ ...draft, experienceMonths: Number(event.target.value) })}
          className='h-12 w-20 rounded-md border border-indigo-200 bg-white px-3 text-center text-sm font-semibold text-indigo-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100'
        />
        <span className='whitespace-nowrap'>tháng</span>
      </div>
      <label className='inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-indigo-950'>
        <input
          type='checkbox'
          checked={draft.isStrong}
          onChange={(event) => onChange({ ...draft, isStrong: event.target.checked })}
          className='h-4 w-4 rounded border-indigo-300 text-sky-500'
        />
        Thành thạo
      </label>
      <button type='button' onClick={onDelete} className='inline-flex h-10 w-10 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50'>
        <Trash2 className='h-5 w-5' />
      </button>
    </div>
  )
}

const CvListRow = ({
  title,
  meta,
  description,
  canEdit = true,
  onEdit,
  onDelete
}: {
  title: string
  meta?: string
  description?: string | null
  canEdit?: boolean
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
      {canEdit ? (
      <div className='flex shrink-0 gap-2'>
        <button type='button' onClick={onEdit} className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sky-700'>
          <Pencil className='h-4 w-4' />
        </button>
        <button type='button' onClick={onDelete} className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600'>
          <Trash2 className='h-4 w-4' />
        </button>
      </div>
      ) : null}
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

const isValidDateRange = (startDate: string, endDate: string) => {
  if (!startDate.trim() || !endDate.trim()) return true

  return new Date(startDate).getTime() < new Date(endDate).getTime()
}

const validateEducationForm = (form: typeof emptyEducationForm) => {
  if (!form.school.trim() || !form.degree.trim() || !form.major.trim() || !form.startDate.trim() || !form.endDate.trim() || !form.description.trim()) {
    return 'Vui lòng nhập đầy đủ thông tin học vấn.'
  }

  if (!isValidDateRange(form.startDate, form.endDate)) {
    return 'Ngày bắt đầu học vấn phải bé hơn ngày kết thúc.'
  }

  return null
}

const validateExperienceForm = (form: typeof emptyExperienceForm) => {
  if (!form.company.trim() || !form.position.trim() || !form.startDate.trim() || !form.endDate.trim() || !form.description.trim()) {
    return 'Vui lòng nhập đầy đủ thông tin kinh nghiệm làm việc.'
  }

  if (!isValidDateRange(form.startDate, form.endDate)) {
    return 'Ngày bắt đầu kinh nghiệm phải bé hơn ngày kết thúc.'
  }

  return null
}

const validateSkillDrafts = (drafts: SkillDraft[]) => {
  if (drafts.length === 0) {
    return 'Vui lòng thêm ít nhất một kỹ năng chuyên môn.'
  }

  for (const draft of drafts) {
    if (!draft.name.trim()) continue

    if ((draft.experienceMonths ?? 0) < 1) {
      return `Kỹ năng "${draft.name}" phải có ít nhất 1 tháng kinh nghiệm.`
    }
  }

  return null
}

const validateProjectForm = (form: typeof emptyProjectForm) => {
  if (!form.name.trim() || !form.role.trim() || !form.startDate.trim() || !form.endDate.trim()) {
    return 'Vui lòng nhập đầy đủ thông tin dự án nổi bật.'
  }

  if (!isValidDateRange(form.startDate, form.endDate)) {
    return 'Ngày bắt đầu dự án phải bé hơn ngày kết thúc.'
  }

  return null
}

const validatePersonalityForm = (form: typeof emptyPersonalityForm) => {
  if (!form.type.trim() || !form.description.trim()) {
    return 'Vui lòng nhập đầy đủ type và description.'
  }

  return null
}

const parseEnglishCertificate = (title: string) => {
  const match = title.trim().match(/^(TOEIC|IELTS|VSTEP)(?:\s*[-:]?\s*(.*))?$/i)

  if (!match) return null

  return {
    type: match[1].toUpperCase() as EnglishCertificateType,
    score: match[2]?.trim() ?? ''
  }
}

const validateCertificateForm = (form: typeof emptyCertificateForm) => {
  if (!form.issuedDate.trim()) {
    return 'Vui lòng chọn ngày cấp chứng chỉ.'
  }

  if (form.category === 'english') {
    const score = form.score.trim()

    if (!score) {
      return 'Vui lòng nhập điểm hoặc band cho chứng chỉ tiếng Anh.'
    }

    if (form.englishType === 'TOEIC') {
      if (!/^(0|[1-9]\d{0,2})$/.test(score)) {
        return 'Điểm TOEIC phải là số nguyên không âm.'
      }

      if (Number(score) > 990) {
        return 'Điểm TOEIC không được vượt quá 990.'
      }
    }

    if (form.englishType === 'IELTS' && !/^(0|0\.5|[1-8](\.0|\.5)?|9(\.0)?)$/.test(score)) {
      return 'Band IELTS phải nằm trong khoảng 0 đến 9 và cách nhau 0.5.'
    }

    if (form.englishType === 'VSTEP') {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(score)) {
        return 'Điểm VSTEP phải là số không âm.'
      }

      if (Number(score) > 10) {
        return 'Điểm VSTEP không được vượt quá 10.'
      }
    }

    return null
  }

  const customTitle = form.customTitle.trim()

  if (!customTitle) {
    return 'Vui lòng nhập tên chứng chỉ.'
  }

  if (!/^(?=.*[\p{L}\p{N}])[ \p{L}\p{N}().,+\-/#&]+$/u.test(customTitle)) {
    return 'Tên chứng chỉ chứa ký tự không hợp lệ.'
  }

  return null
}

const isEnglishCertificate = (certificate: CvCertificate) => Boolean(parseEnglishCertificate(certificate.title))

const getCertificateDisplayLabel = (certificate: CvCertificate) => {
  const parsed = parseEnglishCertificate(certificate.title)

  if (!parsed) return certificate.title

  return [parsed.type, parsed.score].filter(Boolean).join(' ')
}

const toCertificateForm = (certificate: CvCertificate) => {
  const parsed = parseEnglishCertificate(certificate.title)

  if (parsed) {
    return {
      category: 'english' as CertificateCategory,
      englishType: parsed.type,
      score: parsed.score,
      customTitle: '',
      issuedDate: formatInputDate(certificate.issuedDate)
    }
  }

  return {
    category: 'other' as CertificateCategory,
    englishType: 'TOEIC' as EnglishCertificateType,
    score: '',
    customTitle: certificate.title,
    issuedDate: formatInputDate(certificate.issuedDate)
  }
}

const buildCertificatePayload = (form: typeof emptyCertificateForm): CvCertificatePayload => {
  const title =
    form.category === 'english'
      ? [form.englishType.trim(), form.score.trim()].filter(Boolean).join(' ')
      : form.customTitle.trim()

  return {
    title: title || null,
    issuer: form.category === 'english' ? 'English Certificate' : 'Other Certificate',
    issuedDate: form.issuedDate.trim() || null,
    fileUrl: null
  }
}

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

const toSkillDraft = (skill: CvSkill): SkillDraft => ({
  id: skill.id,
  name: skill.name,
  category: skill.category ?? 'programming_language',
  experienceMonths: skill.experienceMonths ?? 0,
  isStrong: skill.isStrong ?? false
})

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
