import { memo } from 'react'
import { cn } from '@/lib/utils'

type FilterSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}

const FilterSection = ({ title, children, className }: FilterSectionProps) => {
  return (
    <section className={cn('space-y-3.5', className)}>
      <h3 className='text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500'>{title}</h3>
      {children}
    </section>
  )
}

export default memo(FilterSection)
