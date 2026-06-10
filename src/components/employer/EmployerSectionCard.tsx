import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type EmployerSectionCardProps = {
  title: ReactNode
  description?: string
  action?: ReactNode
  children: ReactNode
  contentClassName?: string
}

const EmployerSectionCard = ({
  title,
  description,
  action,
  children,
  contentClassName
}: EmployerSectionCardProps) => {
  return (
    <Card className='min-w-0 overflow-hidden rounded-[28px] border border-white/85 bg-white/92 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur transition-colors duration-300 dark:border-white/8 dark:bg-[#121423]/88 dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)]'>
      <CardHeader className='flex min-w-0 flex-col items-start justify-between gap-4 border-b border-slate-100/90 px-5 pb-5 pt-5 sm:px-6 md:flex-row md:items-start dark:border-white/8'>
        <div className='min-w-0 max-w-full'>
          <CardTitle className='break-words text-xl text-slate-950 dark:text-white'>{title}</CardTitle>
          {description ? <CardDescription className='mt-2 break-words text-sm leading-6 dark:text-slate-400'>{description}</CardDescription> : null}
        </div>
        {action ? <div className='w-full shrink-0 md:w-auto'>{action}</div> : null}
      </CardHeader>
      <CardContent className={`min-w-0 px-5 py-5 sm:px-6 sm:py-6 ${contentClassName ?? ''}`.trim()}>{children}</CardContent>
    </Card>
  )
}

export default EmployerSectionCard
