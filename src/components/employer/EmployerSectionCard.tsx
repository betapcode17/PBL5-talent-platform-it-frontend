import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type EmployerSectionCardProps = {
  title: string
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
    <Card className='border-white/80 bg-white/82 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur'>
      <CardHeader className='flex flex-row items-start justify-between gap-4'>
        <div>
          <CardTitle className='text-xl text-slate-950'>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}

export default EmployerSectionCard
