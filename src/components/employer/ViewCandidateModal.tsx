import { ExternalLink, FileBadge2, Mail, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { acceptEmployerApplicationApi, rejectEmployerApplicationApi } from '@/api/employer'
import type { EmployerCandidateItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import CandidateLikeButton from '@/components/likes/CandidateLikeButton'

type ViewCandidateModalProps = {
  candidate: EmployerCandidateItem
  isOpen: boolean
  onClose: () => void
}

const ViewCandidateModal = ({ candidate, isOpen, onClose }: ViewCandidateModalProps) => {
  const { i18n, t } = useTranslation()
  const [status, setStatus] = useState(candidate.status)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (value?: string | null) => {
    if (!value) return '-'

    return t(`employer.candidates.status.${value}`, { defaultValue: value })
  }

  useEffect(() => {
    setStatus(candidate.status)
    setActionMessage(null)
  }, [candidate.applicationId, candidate.status])

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

  const handleAccept = async () => {
    setIsUpdating(true)
    setActionMessage(null)

    try {
      await acceptEmployerApplicationApi(candidate.applicationId)
      setStatus('ACCEPTED')
      setActionMessage(t('employer.candidates.modal.acceptedMessage'))
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setActionMessage(message || t('employer.candidates.modal.acceptError'))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async () => {
    setIsUpdating(true)
    setActionMessage(null)

    try {
      await rejectEmployerApplicationApi(candidate.applicationId, t('employer.candidates.modal.rejectReason'))
      setStatus('REJECTED')
      setActionMessage(t('employer.candidates.modal.rejectedMessage'))
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setActionMessage(message || t('employer.candidates.modal.rejectError'))
    } finally {
      setIsUpdating(false)
    }
  }

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/55 p-3 pt-6 backdrop-blur-sm sm:p-6 lg:items-center lg:pt-6'>
      <button type='button' aria-label={t('employer.candidates.modal.closeDetails')} className='absolute inset-0 cursor-default' onClick={onClose} />
      <div className='relative mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5'>
        <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6'>
          <div className='flex min-w-0 items-start gap-4'>
            {candidate.seeker.avatar ? (
              <img
                src={candidate.seeker.avatar}
                alt={candidate.seeker.fullName}
                className='h-14 w-14 rounded-full border-2 border-slate-200 object-cover sm:h-16 sm:w-16'
              />
            ) : (
              <div className='flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-violet-100 text-lg font-bold text-violet-700 sm:h-16 sm:w-16'>
                {candidate.seeker.fullName?.charAt(0) || '?'}
              </div>
            )}
            <div className='min-w-0'>
              <h2 className='text-xl font-bold text-slate-950 sm:text-2xl'>{candidate.seeker.fullName}</h2>
              <p className='mt-1 text-sm text-slate-600'>{t('employer.candidates.modal.appliedFor', { job: candidate.job.title })}</p>
            </div>
          </div>
          <button onClick={onClose} className='self-end rounded-lg p-2 transition hover:bg-slate-200 sm:self-start'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='space-y-6'>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]'>
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.candidates.modal.contactInformation')}</h3>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3 rounded-lg bg-slate-50 p-3'>
                    <Mail className='h-5 w-5 text-blue-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>{t('employer.candidates.table.email')}</p>
                      <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.email || '-'}</p>
                    </div>
                  </div>
                  {candidate.seeker.phone && (
                    <div className='flex items-center gap-3 rounded-lg bg-slate-50 p-3'>
                      <Phone className='h-5 w-5 text-green-600' />
                      <div>
                        <p className='text-xs font-medium text-slate-600'>{t('employer.candidates.modal.phone')}</p>
                        <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>CV & hồ sơ</h3>
                <div className='space-y-3'>
                  {candidate.seeker.cvUrl ? (
                    <a
                      href={candidate.seeker.cvUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='flex aspect-square w-full max-w-[180px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                    >
                      <div className='text-center'>
                        <FileBadge2 className='mx-auto h-12 w-12' />
                        <p className='mt-3 text-sm font-semibold'>Xem file CV</p>
                      </div>
                    </a>
                  ) : (
                    <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500'>
                      Ứng viên chưa có CV mặc định.
                    </div>
                  )}

                  <Link
                    to={`/employer/candidates/${candidate.seeker.id}/profile`}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900'
                  >
                    <ExternalLink className='h-4 w-4' />
                    Xem trang CV cá nhân
                  </Link>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>{t('employer.candidates.modal.applicationStatus')}</h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <div className='rounded-lg bg-slate-50 p-4'>
                  <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.candidates.table.stage')}</p>
                  <span className='inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700'>
                    {getStatusLabel(candidate.stage || status)}
                  </span>
                </div>
                <div className='rounded-lg bg-slate-50 p-4'>
                  <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.candidates.table.appliedDate')}</p>
                  <p className='text-sm font-semibold text-slate-950'>
                    {new Date(candidate.appliedAt).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className='rounded-lg bg-slate-50 p-4'>
                  <p className='mb-1 text-xs font-medium text-slate-600'>{t('employer.candidates.modal.jobPosition')}</p>
                  <p className='truncate text-sm font-semibold text-slate-950'>{candidate.job.title}</p>
                </div>
              </div>
            </div>

            {candidate.seeker.skills && candidate.seeker.skills.length > 0 && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.candidates.table.skills')}</h3>
                <div className='flex flex-wrap gap-2'>
                  {candidate.seeker.skills.map((skill) => (
                    <span
                      key={skill}
                      className='inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6'>
          {actionMessage ? <p className='mr-auto rounded-lg bg-white px-3 py-2 text-sm text-slate-700'>{actionMessage}</p> : null}
          <Button variant='outline' onClick={onClose} className='w-full rounded-lg sm:w-auto'>
            {t('employer.candidates.modal.close')}
          </Button>
          <CandidateLikeButton seekerId={candidate.seeker.id} />
          <Button
            type='button'
            variant='outline'
            disabled={isUpdating || status === 'REJECTED'}
            onClick={handleReject}
            className='w-full rounded-lg sm:w-auto'
          >
            {t('employer.candidates.modal.reject')}
          </Button>
          <Button
            type='button'
            disabled={isUpdating || status === 'ACCEPTED'}
            onClick={handleAccept}
            className='w-full rounded-lg sm:w-auto'
          >
            {isUpdating ? t('employer.candidates.modal.updating') : t('employer.candidates.modal.accept')}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ViewCandidateModal
