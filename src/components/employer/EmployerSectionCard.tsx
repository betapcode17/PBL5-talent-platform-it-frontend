import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type EmployerSectionCardProps = {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
  contentClassName?: string
}

const EmployerSectionCard = ({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  titleClassName,
  contentClassName
}: EmployerSectionCardProps) => {
  return (
    <Card
      className={cn(
        'min-w-0 overflow-hidden rounded-[24px] border border-white/85 bg-white/90 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur transition-colors duration-500 dark:border-slate-200/14 dark:bg-[linear-gradient(180deg,rgba(42,48,60,0.94)_0%,rgba(25,30,40,0.98)_100%)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]',
        className
      )}
    >
      <CardHeader
        className={cn(
          'flex min-w-0 flex-col items-start justify-between gap-4 border-b border-slate-100/90 px-5 pb-5 pt-5 sm:px-6 md:flex-row md:items-start dark:border-slate-200/12',
          headerClassName
        )}
      >
        <div className='min-w-0 max-w-full'>
          <CardTitle className={cn('break-words text-xl text-slate-950 dark:text-white', titleClassName)}>
            {title}
          </CardTitle>
          {description ? (
            <p className='mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-300'>{description}</p>
          ) : null}
        </div>
        {action ? <div className='w-full shrink-0 md:w-auto'>{action}</div> : null}
      </CardHeader>
      <CardContent className={cn('min-w-0 px-5 py-5 sm:px-6 sm:py-6', contentClassName)}>{children}</CardContent>
    </Card>
  )
}

export default EmployerSectionCard
