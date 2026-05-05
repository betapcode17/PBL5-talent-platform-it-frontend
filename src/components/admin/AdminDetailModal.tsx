import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminDetailModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  className?: string
}

export const AdminDetailModal = ({ open, title, children, onClose, className }: AdminDetailModalProps) => {
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
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <button
        type='button'
        aria-label='Đóng chi tiết'
        className='absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='admin-detail-modal-title'
        className={cn(
          'relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#111425] shadow-[0_32px_100px_rgba(2,6,23,0.55)]',
          className
        )}
      >
        <div className='flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.16em] text-violet-300'>Chi tiết</p>
            <h3 id='admin-detail-modal-title' className='mt-1 text-xl font-bold text-white'>
              {title}
            </h3>
          </div>

          <Button
            variant='ghost'
            size='icon-sm'
            className='shrink-0 text-slate-300 hover:bg-white/10'
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>

        <div className='max-h-[80vh] overflow-y-auto px-5 py-5 sm:px-6'>{children}</div>
      </div>
    </div>,
    document.body
  )
}
