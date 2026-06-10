import { Calendar, Clock, MapPin, Video, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { EmployerInterviewItem } from '@/@types/employer'
import { rescheduleEmployerInterviewApi } from '@/api/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ViewInterviewModalProps = {
  interview: EmployerInterviewItem
  isOpen: boolean
  onClose: () => void
  onUpdated?: () => void
}

type RescheduleFormData = {
  interviewDate: string
  startTime: string
  meetingLink: string
}

const toDateInputValue = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const toTimeInputValue = (value?: string | null) => {
  if (!value) return ''

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toTimeString().slice(0, 5)
  }

  const match = value.match(/(\d{1,2}):(\d{2})/)
  if (!match) return ''

  return `${match[1].padStart(2, '0')}:${match[2]}`
}

const ViewInterviewModal = ({ interview, isOpen, onClose, onUpdated }: ViewInterviewModalProps) => {
  const { i18n, t } = useTranslation()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rescheduleError, setRescheduleError] = useState<string | null>(null)
  const initialFormData = useMemo<RescheduleFormData>(
    () => ({
      interviewDate: toDateInputValue(interview.interviewDate),
      startTime: toTimeInputValue(interview.interviewDate || interview.startTime),
      meetingLink: interview.location || ''
    }),
    [interview.interviewDate, interview.location, interview.startTime]
  )
  const [formData, setFormData] = useState<RescheduleFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RescheduleFormData, string>>>({})
  const isOnlineInterview = interview.interviewType === 'Online' || interview.interviewType === 'video'

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '-'

    return t(`employer.statuses.${status}`, { defaultValue: status })
  }

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    setIsRescheduling(false)
    setIsSubmitting(false)
    setRescheduleError(null)
    setFormErrors({})
    setFormData(initialFormData)
  }, [initialFormData, isOpen])

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: undefined }))
  }

  const validateRescheduleForm = () => {
    const errors: Partial<Record<keyof RescheduleFormData, string>> = {}

    if (!formData.interviewDate) {
      errors.interviewDate = t('employer.interviews.reschedule.validation.date')
    }

    if (!formData.startTime) {
      errors.startTime = t('employer.interviews.reschedule.validation.startTime')
    }

    if (isOnlineInterview && !formData.meetingLink.trim()) {
      errors.meetingLink = t('employer.interviews.reschedule.validation.meetingLink')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRescheduleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateRescheduleForm()) return

    setIsSubmitting(true)
    setRescheduleError(null)

    try {
      await rescheduleEmployerInterviewApi(interview.id, {
        newDate: new Date(`${formData.interviewDate}T${formData.startTime}`).toISOString(),
        newLink: formData.meetingLink.trim() || undefined
      })

      onUpdated?.()
      onClose()
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setRescheduleError(message || t('employer.interviews.reschedule.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-950/58 p-3 pt-6 backdrop-blur-sm sm:p-6 lg:items-center lg:pt-6'>
      <button
        type='button'
        aria-label={t('employer.actions.close')}
        className='absolute inset-0 cursor-default'
        onClick={onClose}
      />
      <div className='relative mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 transition-colors duration-500 dark:bg-[#1b202b] dark:ring-slate-300/14'>
        <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
          <div className='min-w-0'>
            <h2 className='text-xl font-bold text-slate-950 sm:text-2xl dark:text-white'>
              {interview.candidate.fullName}
            </h2>
            <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>{interview.job.title}</p>
          </div>
          <button
            onClick={onClose}
            className='self-end rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 sm:self-start dark:text-slate-300 dark:hover:bg-slate-200/12 dark:hover:text-white'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                  {t('employer.interviews.table.status')}
                </p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    interview.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-100'
                      : interview.status === 'SCHEDULED'
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-400/14 dark:text-violet-100'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-200/10 dark:text-slate-200'
                  }`}
                >
                  {getStatusLabel(interview.status)}
                </span>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                  {t('employer.interviews.table.interviewType')}
                </p>
                <span className='inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-400/12 dark:text-sky-100'>
                  {interview.interviewType || t('employer.interviews.table.notSpecified')}
                </span>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                  {t('employer.interviews.table.interviewer')}
                </p>
                <p className='break-words text-sm font-semibold text-slate-950 dark:text-white'>
                  {interview.interviewer?.fullName || '-'}
                </p>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                  {t('employer.interviews.table.round', { round: '' }).trim()}
                </p>
                <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                  {t('employer.interviews.table.round', { round: interview.round })}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                {t('employer.interviews.modal.schedule')}
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <Calendar className='mt-1 h-5 w-5 flex-shrink-0 text-blue-600' />
                  <div>
                    <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                      {t('employer.interviews.table.date')}
                    </p>
                    <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                      {interview.interviewDate
                        ? new Date(interview.interviewDate).toLocaleDateString(locale, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </p>
                  </div>
                </div>

                {interview.startTime || interview.endTime ? (
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                    <Clock className='mt-1 h-5 w-5 flex-shrink-0 text-orange-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                        {t('employer.interviews.table.time')}
                      </p>
                      <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                        {interview.startTime}
                        {interview.endTime ? ` - ${interview.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {isOnlineInterview && interview.location ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  {t('employer.interviews.modal.meetingDetails')}
                </h3>
                <div className='flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-sky-300/18 dark:bg-sky-400/12'>
                  <Video className='mt-1 h-5 w-5 flex-shrink-0 text-blue-600' />
                  <div className='flex-1'>
                    <p className='mb-1 text-xs font-medium text-blue-700'>
                      {t('employer.interviews.modal.meetingLink')}
                    </p>
                    <p className='break-all text-sm font-semibold text-blue-700'>{interview.location}</p>
                  </div>
                </div>
              </div>
            ) : interview.location ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  {t('employer.interviews.modal.interviewLocation')}
                </h3>
                <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <MapPin className='mt-1 h-5 w-5 flex-shrink-0 text-red-600' />
                  <div>
                    <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                      {t('employer.interviews.table.location')}
                    </p>
                    <p className='text-sm font-semibold text-slate-950 dark:text-white'>{interview.location}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                {t('employer.interviews.modal.candidateInformation')}
              </h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.candidates.table.email')}
                  </p>
                  <p className='break-all text-sm font-semibold text-slate-950 dark:text-white'>
                    {interview.candidate.email || '-'}
                  </p>
                </div>
                <div className='min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.candidates.modal.phone')}
                  </p>
                  <p className='break-words text-sm font-semibold text-slate-950 dark:text-white'>
                    {interview.candidate.phone || '-'}
                  </p>
                </div>
              </div>
            </div>

            {interview.note && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  {t('employer.interviews.modal.notes')}
                </h3>
                <p className='rounded-lg bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:bg-slate-200/7 dark:text-slate-200'>
                  {interview.note}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
          {isRescheduling ? (
            <form onSubmit={handleRescheduleSubmit} className='w-full space-y-4'>
              {rescheduleError ? (
                <p className='rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200'>
                  {rescheduleError}
                </p>
              ) : null}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {t('employer.interviews.reschedule.date')}
                  </label>
                  <Input
                    type='date'
                    name='interviewDate'
                    value={formData.interviewDate}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split('T')[0]}
                    className='rounded-lg bg-white dark:bg-slate-200/8'
                  />
                  {formErrors.interviewDate ? (
                    <p className='mt-1 text-xs text-red-500'>{formErrors.interviewDate}</p>
                  ) : null}
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {t('employer.interviews.reschedule.startTime')}
                  </label>
                  <Input
                    type='time'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleFormChange}
                    className='rounded-lg bg-white dark:bg-slate-200/8'
                  />
                  {formErrors.startTime ? <p className='mt-1 text-xs text-red-500'>{formErrors.startTime}</p> : null}
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {isOnlineInterview
                      ? t('employer.interviews.reschedule.meetingLink')
                      : t('employer.interviews.reschedule.location')}
                  </label>
                  <Input
                    type={isOnlineInterview ? 'url' : 'text'}
                    name='meetingLink'
                    value={formData.meetingLink}
                    onChange={handleFormChange}
                    placeholder={
                      isOnlineInterview
                        ? t('employer.interviews.create.meetingLinkPlaceholder')
                        : t('employer.interviews.create.locationPlaceholder')
                    }
                    className='rounded-lg bg-white dark:bg-slate-200/8'
                  />
                  {formErrors.meetingLink ? (
                    <p className='mt-1 text-xs text-red-500'>{formErrors.meetingLink}</p>
                  ) : null}
                </div>
              </div>
              <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsRescheduling(false)}
                  className='w-full rounded-lg sm:w-auto'
                >
                  {t('employer.actions.cancel')}
                </Button>
                <Button type='submit' disabled={isSubmitting} className='w-full rounded-lg sm:w-auto'>
                  {isSubmitting
                    ? t('employer.interviews.reschedule.submitting')
                    : t('employer.interviews.reschedule.submit')}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Button variant='outline' onClick={onClose} className='w-full rounded-lg sm:w-auto'>
                {t('employer.actions.close')}
              </Button>
              <Button className='w-full rounded-lg sm:w-auto' onClick={() => setIsRescheduling(true)}>
                {t('employer.interviews.modal.reschedule')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ViewInterviewModal
