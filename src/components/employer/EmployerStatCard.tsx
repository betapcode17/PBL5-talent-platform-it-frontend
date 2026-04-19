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
    <Card className='overflow-hidden border-white/80 bg-white/82 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur'>
      <CardContent className='flex items-start justify-between p-6'>
        <div>
          <p className='text-sm text-slate-500'>{title}</p>
          <p className='mt-3 text-3xl font-semibold tracking-tight text-slate-950'>{value}</p>
          <p className='mt-2 text-sm font-medium text-emerald-600'>{subtitle}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg`}>
          <Icon className='h-5 w-5' />
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployerStatCard
