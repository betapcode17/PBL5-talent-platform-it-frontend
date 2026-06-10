import { Calendar, Clock, MapPin, Video, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { EmployerInterviewItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'

type ViewInterviewModalProps = {
  interview: EmployerInterviewItem
  isOpen: boolean
  onClose: () => void
}

const ViewInterviewModal = ({ interview, isOpen, onClose }: ViewInterviewModalProps) => {
  const { i18n, t } = useTranslation()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

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

  if (!isOpen) return null

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/55 p-3 pt-6 backdrop-blur-sm sm:p-6 lg:items-center lg:pt-6'>
      <button type='button' aria-label={t('employer.actions.close')} className='absolute inset-0 cursor-default' onClick={onClose} />
      <div className='relative mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5'>
        <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6'>
          <div className='min-w-0'>
            <h2 className='text-xl font-bold text-slate-950 sm:text-2xl'>{interview.candidate.fullName}</h2>
            <p className='mt-1 text-sm text-slate-600'>{interview.job.title}</p>
          </div>
          <button onClick={onClose} className='self-end rounded-lg p-2 transition hover:bg-slate-200 sm:self-start'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.interviews.table.status')}</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    interview.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : interview.status === 'SCHEDULED'
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {getStatusLabel(interview.status)}
                </span>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.interviews.table.interviewType')}</p>
                <span className='inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                  {interview.interviewType || t('employer.interviews.table.notSpecified')}
                </span>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.interviews.table.interviewer')}</p>
                <p className='break-words text-sm font-semibold text-slate-950'>{interview.interviewer?.fullName || '-'}</p>
              </div>
              <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.interviews.table.round', { round: '' }).trim()}</p>
                <p className='text-sm font-semibold text-slate-950'>{t('employer.interviews.table.round', { round: interview.round })}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-slate-950'>{t('employer.interviews.modal.schedule')}</h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4'>
                  <Calendar className='mt-1 h-5 w-5 flex-shrink-0 text-blue-600' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>{t('employer.interviews.table.date')}</p>
                    <p className='text-sm font-semibold text-slate-950'>
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
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4'>
                    <Clock className='mt-1 h-5 w-5 flex-shrink-0 text-orange-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>{t('employer.interviews.table.time')}</p>
                      <p className='text-sm font-semibold text-slate-950'>
                        {interview.startTime}
                        {interview.endTime ? ` - ${interview.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {interview.interviewType === 'Online' && interview.location ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.interviews.modal.meetingDetails')}</h3>
                <div className='flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <Video className='mt-1 h-5 w-5 flex-shrink-0 text-blue-600' />
                  <div className='flex-1'>
                    <p className='mb-1 text-xs font-medium text-blue-700'>{t('employer.interviews.modal.meetingLink')}</p>
                    <p className='break-all text-sm font-semibold text-blue-700'>{interview.location}</p>
                  </div>
                </div>
              </div>
            ) : interview.location ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.interviews.modal.interviewLocation')}</h3>
                <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4'>
                  <MapPin className='mt-1 h-5 w-5 flex-shrink-0 text-red-600' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>{t('employer.interviews.table.location')}</p>
                    <p className='text-sm font-semibold text-slate-950'>{interview.location}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>{t('employer.interviews.modal.candidateInformation')}</h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                  <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.candidates.table.email')}</p>
                  <p className='break-all text-sm font-semibold text-slate-950'>{interview.candidate.email || '-'}</p>
                </div>
                <div className='min-w-0 rounded-lg bg-slate-50 p-4'>
                  <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.candidates.modal.phone')}</p>
                  <p className='break-words text-sm font-semibold text-slate-950'>{interview.candidate.phone || '-'}</p>
                </div>
              </div>
            </div>

            {interview.note && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.interviews.modal.notes')}</h3>
                <p className='rounded-lg bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700'>
                  {interview.note}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6'>
          <Button variant='outline' onClick={onClose} className='w-full rounded-lg sm:w-auto'>
            {t('employer.actions.close')}
          </Button>
          <Button className='w-full rounded-lg sm:w-auto'>{t('employer.interviews.modal.reschedule')}</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ViewInterviewModal
