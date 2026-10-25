import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, LoaderCircle, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'

type CancelApplicationModalProps = {
  open: boolean
  isCanceling: boolean
  onClose: () => void
  onConfirm: () => void
}

const CancelApplicationModal = ({
  open,
  isCanceling,
  onClose,
  onConfirm
}: CancelApplicationModalProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCanceling) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose, open, isCanceling])

  if (!open) return null

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm'>
      <button
        type='button'
        className='absolute inset-0 cursor-default'
        onClick={() => !isCanceling && onClose()}
        aria-label={t('seekerTracking.applications.actions.closeModal', { defaultValue: 'Đóng' })}
      />

      <div className='relative z-10 w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-7'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-3 text-rose-600'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100'>
              <AlertTriangle className='h-6 w-6' />
            </div>
            <h3 className='text-xl font-semibold tracking-[-0.04em] text-slate-950'>
              {t('seekerTracking.applications.actions.confirmCancelTitle', { defaultValue: 'Hủy ứng tuyển' })}
            </h3>
          </div>

          <button
            type='button'
            onClick={onClose}
            disabled={isCanceling}
            className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-700 disabled:opacity-50'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-5 text-sm leading-7 text-slate-600'>
          {t('seekerTracking.applications.actions.confirmCancelMessage', {
            defaultValue: 'Bạn có chắc chắn muốn hủy ứng tuyển vị trí này không? Thao tác này không thể hoàn tác và nhà tuyển dụng sẽ không còn thấy hồ sơ của bạn cho vị trí này nữa.'
          })}
        </div>

        <div className='mt-8 flex flex-wrap justify-end gap-3'>
          <OutlineButton onClick={onClose} disabled={isCanceling} className='rounded-2xl'>
            {t('seekerTracking.common.closeToast', { defaultValue: 'Đóng' })}
          </OutlineButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isCanceling}
            className='rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 shadow-[0_14px_40px_rgba(225,29,72,0.28)] hover:from-rose-500 hover:to-rose-400 focus-visible:ring-rose-400'
          >
            {isCanceling ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : null}
            {t('seekerTracking.common.cancelApplication', { defaultValue: 'Hủy ứng tuyển' })}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CancelApplicationModal
