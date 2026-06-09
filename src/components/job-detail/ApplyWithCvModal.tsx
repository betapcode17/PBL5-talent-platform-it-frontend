import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, FileUp, LoaderCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import { cn } from '@/lib/utils'

type ApplyWithCvModalProps = {
  open: boolean
  currentCvUrl?: string | null
  selectedCvUrl?: string | null
  isLoadingCv: boolean
  isUploadingCv: boolean
  isSubmitting: boolean
  uploadError?: string | null
  onClose: () => void
  onSubmit: () => void
  onFileChange: (file: File) => void
}

const getFileNameFromUrl = (value?: string | null) => {
  if (!value) return null

  try {
    const pathname = new URL(value).pathname
    return decodeURIComponent(pathname.split('/').pop() || 'cv.pdf')
  } catch {
    const segments = value.split('/')
    return decodeURIComponent(segments[segments.length - 1] || 'cv.pdf')
  }
}

const ApplyWithCvModal = ({
  open,
  currentCvUrl,
  selectedCvUrl,
  isLoadingCv,
  isUploadingCv,
  isSubmitting,
  uploadError,
  onClose,
  onSubmit,
  onFileChange
}: ApplyWithCvModalProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose, open])

  const selectedFileName = useMemo(() => getFileNameFromUrl(selectedCvUrl), [selectedCvUrl])
  const currentFileName = useMemo(() => getFileNameFromUrl(currentCvUrl), [currentCvUrl])
  const isReadyToSubmit = Boolean(selectedCvUrl) && !isUploadingCv && !isSubmitting

  if (!open) return null

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm'>
      <button
        type='button'
        className='absolute inset-0 cursor-default'
        onClick={onClose}
        aria-label={t('jobDetail.applyWithCv.closeModal')}
      />

      <div className='relative z-10 w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-7'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-violet-600'>
              {t('jobDetail.applyWithCv.eyebrow')}
            </p>
            <h3 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>
              {t('jobDetail.applyWithCv.title')}
            </h3>
            <p className='mt-2 text-sm leading-7 text-slate-600'>
              {t('jobDetail.applyWithCv.description')}
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:text-violet-700'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]'>
          <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold text-slate-900'>{t('jobDetail.applyWithCv.selectedCv')}</p>
                <p className='mt-1 text-sm text-slate-500'>
                  {selectedFileName ? selectedFileName : t('jobDetail.applyWithCv.noSelectedCv')}
                </p>
              </div>
              {selectedCvUrl ? (
                <a
                  href={selectedCvUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800'
                >
                  {t('jobDetail.applyWithCv.viewCv')}
                  <ExternalLink className='h-4 w-4' />
                </a>
              ) : null}
            </div>

            <div className='mt-4 rounded-[20px] border border-slate-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                {t('jobDetail.applyWithCv.currentDefaultCv')}
              </p>
              {isLoadingCv ? (
                <p className='mt-3 text-sm text-slate-500'>{t('jobDetail.applyWithCv.loadingCv')}</p>
              ) : currentCvUrl ? (
                <>
                  <p className='mt-3 text-sm font-semibold text-slate-900'>{currentFileName}</p>
                  <p className='mt-1 text-sm text-slate-500'>{t('jobDetail.applyWithCv.keepOrReplace')}</p>
                </>
              ) : (
                <p className='mt-3 text-sm text-slate-500'>
                  {t('jobDetail.applyWithCv.noDefaultCv')}
                </p>
              )}
            </div>

            {uploadError ? (
              <p className='mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{uploadError}</p>
            ) : null}
          </div>

          <div className='rounded-[24px] border border-violet-100 bg-violet-50/70 p-5'>
            <p className='text-sm font-semibold text-slate-900'>{t('jobDetail.applyWithCv.createOrUpdate')}</p>
            <p className='mt-2 text-sm leading-7 text-slate-600'>
              {t('jobDetail.applyWithCv.uploadDescription')}
            </p>

            <input
              ref={inputRef}
              type='file'
              accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              className='hidden'
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  onFileChange(file)
                }
                event.currentTarget.value = ''
              }}
            />

            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingCv || isSubmitting}
              className={cn(
                'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-white px-4 py-4 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:bg-violet-50',
                (isUploadingCv || isSubmitting) && 'cursor-not-allowed opacity-70'
              )}
            >
              {isUploadingCv ? <LoaderCircle className='h-4 w-4 animate-spin' /> : <FileUp className='h-4 w-4' />}
              {isUploadingCv ? t('jobDetail.applyWithCv.uploading') : t('jobDetail.applyWithCv.uploadNew')}
            </button>

            <div className='mt-4 rounded-[20px] border border-white/80 bg-white/80 p-4 text-sm text-slate-600'>
              <p className='font-semibold text-slate-900'>{t('jobDetail.applyWithCv.noCvYet')}</p>
              <p className='mt-2 leading-7'>
                {t('jobDetail.applyWithCv.noCvHint')}
              </p>
              <Link to='/seeker/profile' className='mt-3 inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-800'>
                {t('jobDetail.applyWithCv.openSeekerProfile')}
                <ExternalLink className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-6 flex flex-wrap justify-end gap-3'>
          <OutlineButton onClick={onClose} disabled={isUploadingCv || isSubmitting} className='rounded-2xl'>
            {t('jobDetail.applyWithCv.cancel')}
          </OutlineButton>
          <PrimaryButton onClick={onSubmit} disabled={!isReadyToSubmit} className='rounded-2xl'>
            {isSubmitting ? t('jobDetail.applyWithCv.submitting') : t('jobDetail.applyWithCv.confirm')}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ApplyWithCvModal
