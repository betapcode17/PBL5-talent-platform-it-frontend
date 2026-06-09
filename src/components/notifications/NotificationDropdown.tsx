import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck } from 'lucide-react'
import type { NotificationItem as NotificationItemType } from '@/@types/notification'
import { Button } from '@/components/ui/button'
import { NotificationItem } from './NotificationItem'

type NotificationDropdownProps = {
  items: NotificationItemType[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  activeTab: 'all' | 'unread'
  onChangeTab: (tab: 'all' | 'unread') => void | Promise<void>
  onItemClick: (item: NotificationItemType) => Promise<void> | void
  onMarkAllRead: () => Promise<void> | void
  onDeleteItem: (item: NotificationItemType) => Promise<void> | void
}

const resolveNotificationHref = (item: NotificationItemType) => {
  switch (item.role) {
    case 'ADMIN':
      if (item.type === 'EMPLOYER_REGISTRATION_SUBMITTED') return '/admin/employer-requests'
      if (item.type === 'JOB_CREATED' || item.type === 'JOB_REVIEW_REQUIRED') return '/admin/jobs'
      return '/admin/dashboard'
    case 'EMPLOYEE':
      if (item.type === 'APPLICATION_SUBMITTED') return '/employer/candidates'
      return '/employer/jobs'
    case 'SEEKER':
      if (item.type.startsWith('INTERVIEW_')) return '/seeker/interviews'
      return '/seeker/applications'
    default:
      return '/'
  }
}

export const NotificationDropdown = ({
  items,
  unreadCount,
  isLoading,
  error,
  activeTab,
  onChangeTab,
  onItemClick,
  onMarkAllRead,
  onDeleteItem
}: NotificationDropdownProps) => {
  const navigate = useNavigate()

  const emptyText = useMemo(() => {
    if (isLoading) return 'Đang tải thông báo...'
    if (error) return error
    return activeTab === 'unread' ? 'Không có thông báo chưa đọc.' : 'Chưa có thông báo nào.'
  }, [activeTab, error, isLoading])

  return (
    <div className='absolute right-0 z-50 mt-3 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.16)]'>
      <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-violet-50 px-5 py-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold text-slate-950'>Thông báo</p>
            <p className='mt-1 text-xs text-slate-500'>Cập nhật realtime theo đúng tài khoản hiện tại.</p>
          </div>

          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600'>{unreadCount}</span>
            <Button type='button' variant='ghost' size='sm' className='h-8 rounded-full px-3 text-xs' onClick={onMarkAllRead}>
              <CheckCheck className='size-3.5' />
              Đọc tất cả
            </Button>
          </div>
        </div>

        <div className='mt-3 inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium text-slate-600'>
          <button
            type='button'
            onClick={() => void onChangeTab('all')}
            className={
              activeTab === 'all'
                ? 'rounded-lg bg-slate-900 px-3 py-1.5 text-white'
                : 'rounded-lg px-3 py-1.5 transition hover:bg-slate-100'
            }
          >
            Tất cả
          </button>
          <button
            type='button'
            onClick={() => void onChangeTab('unread')}
            className={
              activeTab === 'unread'
                ? 'rounded-lg bg-slate-900 px-3 py-1.5 text-white'
                : 'rounded-lg px-3 py-1.5 transition hover:bg-slate-100'
            }
          >
            Chưa đọc
          </button>
        </div>
      </div>

      <div className='max-h-[24rem] space-y-2 overflow-y-auto p-3'>
        {items.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500'>
            {emptyText}
          </div>
        ) : (
          items.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
              onClick={async (nextItem) => {
                await onItemClick(nextItem)
                navigate(resolveNotificationHref(nextItem))
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
