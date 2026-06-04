import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'

type SeekerActionToastProps = {
  title: string
  message: string
  closeLabel: string
  onClose: () => void
}

export const SeekerActionToast = ({ title, message, closeLabel, onClose }: SeekerActionToastProps) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [message, onClose])

  return (
    <div className='fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-sm shadow-[0_20px_50px_rgba(15,23,42,0.14)]'>
      <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
        <CheckCircle2 className='h-4 w-4' />
      </div>
      <div className='min-w-0'>
        <p className='font-semibold text-slate-900'>{title}</p>
        <p className='mt-1 leading-6 text-slate-600'>{message}</p>
      </div>
      <button
        type='button'
        onClick={onClose}
        className='ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 transition hover:text-slate-700'
      >
        {closeLabel}
      </button>
    </div>
  )
}
