import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

type EmployerStatCardProps = {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  tone: string
}

const EmployerStatCard = ({ title, value, subtitle, icon: Icon, tone }: EmployerStatCardProps) => {
  return (
    <Card className='min-w-0 overflow-hidden rounded-[28px] border border-white/85 bg-white/92 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur transition-colors duration-300 dark:border-white/8 dark:bg-[#121423]/88 dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)]'>
      <CardContent className='flex items-start justify-between gap-4 p-5 sm:p-6'>
        <div className='min-w-0'>
          <p className='break-words text-sm text-slate-500 dark:text-slate-400'>{title}</p>
          <p className='mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem] dark:text-white'>{value}</p>
          <p className='mt-2 break-words text-sm font-medium text-emerald-600 dark:text-emerald-300'>{subtitle}</p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-[0_18px_35px_rgba(15,23,42,0.16)] sm:h-14 sm:w-14`}
        >
          <Icon className='h-5 w-5' />
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployerStatCard
