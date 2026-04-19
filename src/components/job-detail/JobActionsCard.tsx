import { Bookmark, LoaderCircle, Mail, Share2, Linkedin, Link2 } from 'lucide-react'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import { cn } from '@/lib/utils'

type JobActionsCardProps = {
  isBookmarked: boolean
  isBookmarkLoading: boolean
  onApply: () => void
  onToggleBookmark: () => void
  onCopyLink: () => void
  onShareLinkedIn: () => void
  onShareEmail: () => void
  notice?: string | null
}

const shareButtons = [
  {
    label: 'Share on LinkedIn',
    icon: Linkedin,
    action: 'linkedin'
  },
  {
    label: 'Copy job link',
    icon: Link2,
    action: 'copy'
  },
  {
    label: 'Share by email',
    icon: Mail,
    action: 'email'
  }
] as const

const JobActionsCard = ({
  isBookmarked,
  isBookmarkLoading,
  onApply,
  onToggleBookmark,
  onCopyLink,
  onShareLinkedIn,
  onShareEmail,
  notice
}: JobActionsCardProps) => {
  const handleShare = (action: (typeof shareButtons)[number]['action']) => {
    if (action === 'linkedin') {
      onShareLinkedIn()
      return
    }

    if (action === 'copy') {
      onCopyLink()
      return
    }

    onShareEmail()
  }

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='space-y-4'>
        <PrimaryButton onClick={onApply} className='h-14 w-full rounded-2xl text-base'>
          Apply Now
        </PrimaryButton>

        <OutlineButton onClick={onToggleBookmark} disabled={isBookmarkLoading} className='h-[52px] w-full rounded-2xl border-slate-200 text-slate-700'>
          {isBookmarkLoading ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : <Bookmark className={cn('mr-2 h-4 w-4', isBookmarked ? 'fill-violet-600 text-violet-600' : '')} />}
          {isBookmarked ? 'Bookmarked' : 'Save Job'}
        </OutlineButton>
      </div>

      <div className='mt-5 border-t border-slate-200 pt-5'>
        <div className='mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>
          <Share2 className='h-4 w-4' />
          Share this role
        </div>

        <div className='flex items-center gap-3'>
          {shareButtons.map((button) => {
            const Icon = button.icon

            return (
              <button
                key={button.action}
                type='button'
                aria-label={button.label}
                onClick={() => handleShare(button.action)}
                className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300'
              >
                <Icon className='h-4 w-4' />
              </button>
            )
          })}
        </div>

        {notice ? <p className='mt-4 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700'>{notice}</p> : null}
      </div>
    </section>
  )
}

export default JobActionsCard
