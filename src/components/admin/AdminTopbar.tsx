import { Bell, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { Input } from '@/components/ui/input'

type AdminTopbarProps = {
  adminName?: string
  title?: string
  subtitle?: string
}

export function AdminTopbar({ adminName = 'Super Admin', title, subtitle }: AdminTopbarProps) {
  const { t } = useTranslation()

  const heading = title || t('admin.dashboard')
  const description = subtitle || t('admin.welcomeBack', { name: adminName })

  return (
    <header className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white'>{heading}</h2>
        <p className='mt-2 text-sm font-medium text-slate-500 dark:text-slate-400'>{description}</p>
      </div>

      <div className='flex items-center gap-3'>
        <div className='relative hidden w-[320px] sm:block'>
          <Search className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
          <Input
            className='h-11 rounded-lg border-slate-200 bg-white pl-11 text-sm shadow-[0_12px_34px_rgba(15,23,42,0.05)] placeholder:text-slate-400 dark:border-white/8 dark:bg-[#121423]/90 dark:text-white dark:shadow-none'
            placeholder={t('admin.searchPlaceholder')}
          />
        </div>

        <LanguageSwitcher
          compact
          className='rounded-full dark:border-white/8 dark:bg-[#121423]/90 dark:text-slate-200 dark:hover:text-white'
        />

        <button
          type='button'
          className='relative flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:text-slate-950 dark:border-white/8 dark:bg-[#121423]/90 dark:text-slate-300 dark:hover:text-white'
          aria-label={t('admin.notifications')}
        >
          <Bell className='size-5' />
          <span className='absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white'>
            3
          </span>
        </button>

        <div className='relative flex size-11 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-white'>
          SA
          <span className='absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111323]' />
        </div>
      </div>
    </header>
  )
}
