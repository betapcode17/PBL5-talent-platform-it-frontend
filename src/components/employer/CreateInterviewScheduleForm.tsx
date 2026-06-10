import { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createEmployerInterviewApi, getEmployerCandidatesApi } from '@/api/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { EmployerCandidateItem } from '@/@types/employer'

type FormData = {
  applicationId: string
  interviewDate: string
  startTime: string
  endTime: string
  interviewType: 'Online' | 'Offline' | 'Phone'
  location: string
  meetingLink: string
  notes: string
}

type CreateInterviewScheduleFormProps = {
  onClose?: () => void
}

const getDuration = (date: string, startTime: string, endTime: string) => {
  const start = new Date(`${date}T${startTime}`)
  const end = new Date(`${date}T${endTime}`)
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)

  return Number.isFinite(diffMinutes) && diffMinutes > 0 ? diffMinutes : 60
}

const isInterviewEligibleCandidate = (candidate: EmployerCandidateItem) => {
  const normalizedStatus = candidate.status?.toUpperCase()
  const normalizedStage = candidate.stage?.toUpperCase()

  return (
    normalizedStatus === 'PASSED' ||
    normalizedStatus === 'ACCEPTED' ||
    normalizedStage === 'PASSED' ||
    normalizedStage === 'ACCEPTED' ||
    normalizedStage === 'APPLICATION_ACCEPTED'
  )
}

const CreateInterviewScheduleForm = ({ onClose }: CreateInterviewScheduleFormProps) => {
  const { t } = useTranslation()
  const [candidates, setCandidates] = useState<EmployerCandidateItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    applicationId: '',
    interviewDate: '',
    startTime: '',
    endTime: '',
    interviewType: 'Online',
    location: '',
    meetingLink: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadCandidates = async () => {
      try {
        const response = await getEmployerCandidatesApi(1, 100)
        if (!isMounted) return
        setCandidates(response.candidates)
      } catch {
        if (isMounted) {
          setLoadError(t('employer.interviews.create.loadError'))
        }
      }
    }

    void loadCandidates()

    return () => {
      isMounted = false
    }
  }, [t])

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => String(candidate.applicationId) === formData.applicationId) ?? null,
    [candidates, formData.applicationId]
  )
  const eligibleCandidates = useMemo(
    () => candidates.filter(isInterviewEligibleCandidate),
    [candidates]
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.applicationId) newErrors.applicationId = t('employer.interviews.create.validation.candidate')
    if (!formData.interviewDate) newErrors.interviewDate = t('employer.interviews.create.validation.date')
    if (!formData.startTime) newErrors.startTime = t('employer.interviews.create.validation.startTime')
    if (!formData.endTime) newErrors.endTime = t('employer.interviews.create.validation.endTime')
    if (formData.interviewType === 'Online' && !formData.meetingLink) {
      newErrors.meetingLink = t('employer.interviews.create.validation.meetingLink')
    }
    if (formData.interviewType === 'Offline' && !formData.location) {
      newErrors.location = t('employer.interviews.create.validation.location')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setLoadError(null)

    try {
      await createEmployerInterviewApi({
        applicationId: Number(formData.applicationId),
        type: formData.interviewType === 'Online' ? 'video' : formData.interviewType === 'Phone' ? 'phone' : 'onsite',
        schedule: new Date(`${formData.interviewDate}T${formData.startTime}`).toISOString(),
        link: formData.interviewType === 'Online' ? formData.meetingLink : formData.location || undefined,
        duration: getDuration(formData.interviewDate, formData.startTime, formData.endTime)
      })

      onClose?.()
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setLoadError(message || t('employer.interviews.create.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='min-w-0 space-y-6'>
      {loadError ? <p className='break-words rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200'>{loadError}</p> : null}

      <div className='min-w-0 space-y-4'>
        <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>{t('employer.interviews.create.selectCandidateTitle')}</h3>
        <div className='grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='min-w-0'>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.candidate')}</label>
            <select
              name='applicationId'
              value={formData.applicationId}
              onChange={handleChange}
              className='w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/8 dark:bg-white/5 dark:text-slate-100'
            >
              <option value=''>{t('employer.interviews.create.chooseCandidate')}</option>
              {eligibleCandidates.map((candidate) => (
                <option key={candidate.applicationId} value={candidate.applicationId}>
                  {candidate.seeker.fullName || candidate.seeker.email || t('employer.interviews.table.candidate')} - {candidate.job.title}
                </option>
              ))}
            </select>
            {errors.applicationId && <p className='mt-1 text-xs text-red-500'>{errors.applicationId}</p>}
            {!loadError && eligibleCandidates.length === 0 ? (
              <p className='mt-1 text-xs text-slate-500'>
                {t('employer.interviews.create.noEligibleCandidates', {
                  defaultValue: 'Chỉ những ứng viên đã được duyệt mới có thể tạo lịch phỏng vấn.'
                })}
              </p>
            ) : null}
          </div>
          <div className='min-w-0'>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.jobPosition')}</label>
            <Input value={selectedCandidate?.job.title ?? ''} readOnly className='rounded-lg bg-slate-50 dark:bg-white/5' />
          </div>
        </div>
      </div>

      <div className='space-y-4 border-b border-slate-200 pb-4 dark:border-white/8'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>{t('employer.interviews.create.scheduleTitle')}</h3>
        </div>
        <div className='grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.interviewDate')}</label>
            <Input
              type='date'
              name='interviewDate'
              value={formData.interviewDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className='rounded-lg'
            />
            {errors.interviewDate && <p className='mt-1 text-xs text-red-500'>{errors.interviewDate}</p>}
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.startTime')}</label>
            <Input
              type='time'
              name='startTime'
              value={formData.startTime}
              onChange={handleChange}
              className='rounded-lg'
            />
            {errors.startTime && <p className='mt-1 text-xs text-red-500'>{errors.startTime}</p>}
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.endTime')}</label>
            <Input type='time' name='endTime' value={formData.endTime} onChange={handleChange} className='rounded-lg' />
            {errors.endTime && <p className='mt-1 text-xs text-red-500'>{errors.endTime}</p>}
          </div>
        </div>
      </div>

      <div className='space-y-4 border-b border-slate-200 pb-4 dark:border-white/8'>
        <div className='flex items-center gap-2'>
          <Users className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>{t('employer.interviews.create.methodTitle')}</h3>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          {(['Online', 'Offline', 'Phone'] as const).map((type) => (
            <label key={type} className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='interviewType'
                value={type}
                checked={formData.interviewType === type}
                onChange={handleChange}
                className='h-4 w-4 cursor-pointer'
              />
              <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>{t(`employer.interviews.create.types.${type}`)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='space-y-4 border-b border-slate-200 pb-4 dark:border-white/8'>
        <div className='flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>{t('employer.interviews.create.locationTitle')}</h3>
        </div>

        {formData.interviewType === 'Online' ? (
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.meetingLink')}</label>
            <Input
              type='url'
              name='meetingLink'
              placeholder={t('employer.interviews.create.meetingLinkPlaceholder')}
              value={formData.meetingLink}
              onChange={handleChange}
              className='rounded-lg'
            />
            {errors.meetingLink && <p className='mt-1 text-xs text-red-500'>{errors.meetingLink}</p>}
          </div>
        ) : (
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>{t('employer.interviews.create.locationDetails')}</label>
            <Input
              type='text'
              name='location'
              placeholder={t('employer.interviews.create.locationPlaceholder')}
              value={formData.location}
              onChange={handleChange}
              className='rounded-lg'
            />
            {errors.location && <p className='mt-1 text-xs text-red-500'>{errors.location}</p>}
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Clock className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>{t('employer.interviews.create.notesTitle')}</h3>
        </div>
        <textarea
          name='notes'
          value={formData.notes}
          onChange={handleChange}
          placeholder={t('employer.interviews.create.notesPlaceholder')}
          rows={4}
          className='w-full min-w-0 resize-none rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/8 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500'
        />
      </div>

      <div className='flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end dark:border-white/8'>
        <Button type='button' variant='outline' onClick={onClose} className='w-full rounded-lg sm:w-auto'>
          {t('employer.actions.cancel')}
        </Button>
        <Button type='submit' disabled={isSubmitting} className='w-full rounded-lg sm:w-auto'>
          {isSubmitting ? t('employer.actions.creating') : t('employer.interviews.create.submit')}
        </Button>
      </div>
    </form>
  )
}

export default CreateInterviewScheduleForm
