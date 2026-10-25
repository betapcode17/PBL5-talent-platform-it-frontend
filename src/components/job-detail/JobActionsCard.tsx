import { Bookmark, CheckCircle2, LoaderCircle, Mail, Share2, Linkedin, Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import { cn } from '@/lib/utils'

type JobActionsCardProps = {
  isBookmarked: boolean
  isBookmarkLoading: boolean
  isApplying: boolean
  hasApplied: boolean
  onApply: () => void
  onToggleBookmark: () => void
  onCopyLink: () => void
  onShareLinkedIn: () => void
  onShareEmail: () => void
  notice?: string | null
  applicationStatus?: string | null
  isCanceling?: boolean
  onCancelApplication?: () => void
}

const shareButtons = [
  {
    labelKey: 'jobDetail.shareLinkedIn',
    icon: Linkedin,
    action: 'linkedin'
  },
  {
    labelKey: 'jobDetail.copyLink',
    icon: Link2,
    action: 'copy'
  },
  {
    labelKey: 'jobDetail.shareEmail',
    icon: Mail,
    action: 'email'
  }
] as const

const JobActionsCard = ({
  isBookmarked,
  isBookmarkLoading,
  isApplying,
  hasApplied,
  onApply,
  onToggleBookmark,
  onCopyLink,
  onShareLinkedIn,
  onShareEmail,
  notice,
  applicationStatus,
  isCanceling,
  onCancelApplication
}: JobActionsCardProps) => {
  const { t } = useTranslation()

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
        <PrimaryButton
          onClick={onApply}
          disabled={isApplying || hasApplied}
          className={cn(
            'h-14 w-full rounded-2xl text-base disabled:cursor-not-allowed disabled:opacity-70',
            hasApplied && 'bg-none bg-emerald-600 shadow-[0_14px_32px_rgba(16,185,129,0.22)] hover:bg-emerald-600'
          )}
        >
          {isApplying ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : null}
          {!isApplying && hasApplied ? <CheckCircle2 className='mr-2 h-4 w-4' /> : null}
          {isApplying ? t('jobDetail.applying') : hasApplied ? t('jobDetail.applied') : t('jobDetail.applyNow')}
        </PrimaryButton>

        {hasApplied && applicationStatus === 'PENDING' && (
          <OutlineButton
            onClick={onCancelApplication}
            disabled={isCanceling}
            className='h-[52px] w-full rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700'
          >
            {isCanceling ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : null}
            {t('jobDetail.cancelApplication')}
          </OutlineButton>
        )}

        <OutlineButton onClick={onToggleBookmark} disabled={isBookmarkLoading} className='h-[52px] w-full rounded-2xl border-slate-200 text-slate-700'>
          {isBookmarkLoading ? <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> : <Bookmark className={cn('mr-2 h-4 w-4', isBookmarked ? 'fill-violet-600 text-violet-600' : '')} />}
          {isBookmarked ? t('jobDetail.bookmarked') : t('jobDetail.saveJob')}
        </OutlineButton>
      </div>

      <div className='mt-5 border-t border-slate-200 pt-5'>
        <div className='mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>
          <Share2 className='h-4 w-4' />
          {t('jobDetail.shareThisRole')}
        </div>

        <div className='grid grid-cols-3 gap-3'>
          {shareButtons.map((button) => {
            const Icon = button.icon

            return (
              <button
                key={button.action}
                type='button'
                aria-label={t(button.labelKey)}
                onClick={() => handleShare(button.action)}
                className='inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300'
              >
                <Icon className='h-4 w-4' />
              </button>
            )
          })}
        </div>

        <div className='mt-4 min-h-[4.25rem]'>
          {notice ? <p className='rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700'>{notice}</p> : null}
        </div>
      </div>
    </section>
  )
}

export default JobActionsCard
