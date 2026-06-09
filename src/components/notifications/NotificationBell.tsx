import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useNotificationStore } from '@/store/notificationStore'
import { NotificationDropdown } from './NotificationDropdown'
import type { NotificationItem } from '@/@types/notification'

type NotificationBellProps = {
  className?: string
  buttonClassName?: string
}

export const NotificationBell = ({ className, buttonClassName }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const items = useNotificationStore((state) => state.items)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const isLoading = useNotificationStore((state) => state.isLoading)
  const error = useNotificationStore((state) => state.error)
  const activeTab = useNotificationStore((state) => state.activeTab)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const removeNotification = useNotificationStore((state) => state.removeNotification)
  const setActiveTab = useNotificationStore((state) => state.setActiveTab)

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id)
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type='button'
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          'relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:text-slate-950',
          buttonClassName
        )}
        aria-label='Thông báo'
      >
        <Bell className='size-5' />
        {unreadCount > 0 ? (
          <span className='absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <NotificationDropdown
          items={items}
          unreadCount={unreadCount}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onItemClick={handleItemClick}
          onMarkAllRead={markAllAsRead}
          onDeleteItem={(item) => removeNotification(item.id)}
        />
      ) : null}
    </div>
  )
}
