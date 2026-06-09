import { Bell, BriefcaseBusiness, Building2, CheckCheck, Clock3, MessageSquareMore, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NotificationItem as NotificationItemType } from '@/@types/notification'

type NotificationItemProps = {
  item: NotificationItemType
  onClick: (item: NotificationItemType) => void
  onDelete: (item: NotificationItemType) => void
}

const iconMap = {
  APPLICATION_SUBMITTED: BriefcaseBusiness,
  APPLICATION_ACCEPTED: CheckCheck,
  APPLICATION_REJECTED: Clock3,
  JOB_BOOKMARKED: BriefcaseBusiness,
  EMPLOYER_REGISTRATION_SUBMITTED: Building2,
  EMPLOYER_REGISTRATION_APPROVED: Building2,
  USER_REGISTERED: UserPlus,
  COMPANY_REPLIED: MessageSquareMore
} as const

const formatRelativeTime = (value: string) => {
  const now = Date.now()
  const createdAt = new Date(value).getTime()
  const diffMinutes = Math.max(1, Math.floor((now - createdAt) / 60000))

  if (diffMinutes < 60) return `${diffMinutes} phút trước`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

export const NotificationItem = ({ item, onClick, onDelete }: NotificationItemProps) => {
  const Icon = iconMap[item.type as keyof typeof iconMap] || BellFallback

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-2xl border px-3 py-3 transition hover:border-violet-200 hover:bg-violet-50/40',
        item.isRead ? 'border-slate-200/70 bg-white' : 'border-violet-200 bg-violet-50/60'
      )}
    >
      <button type='button' onClick={() => onClick(item)} className='flex min-w-0 flex-1 items-start gap-3 text-left'>
        <span className='mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600'>
          <Icon className='size-5' />
        </span>

        <span className='min-w-0 flex-1'>
          <span className='flex items-start justify-between gap-3'>
            <span className='truncate text-sm font-semibold text-slate-900'>{item.title}</span>
            <span className='shrink-0 text-[11px] font-medium text-slate-400'>{formatRelativeTime(item.createdAt)}</span>
          </span>
          <span className='mt-1 block text-xs leading-5 text-slate-500'>{item.message}</span>
        </span>
      </button>

      <Button
        type='button'
        variant='ghost'
        size='icon-xs'
        className='mt-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-rose-500'
        onClick={() => onDelete(item)}
      >
        <Trash2 className='size-3.5' />
      </Button>
    </div>
  )
}

const BellFallback = ({ className }: { className?: string }) => <Bell className={className} />
