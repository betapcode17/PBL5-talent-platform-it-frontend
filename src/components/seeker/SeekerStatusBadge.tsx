import { cn } from '@/lib/utils'

type SeekerStatusBadgeProps = {
  kind: 'application' | 'interview'
  value: string
  label: string
  className?: string
}

const toneMap: Record<'application' | 'interview', Record<string, string>> = {
  application: {
    PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
    ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    REJECTED: 'border-rose-200 bg-rose-50 text-rose-700'
  },
  interview: {
    SCHEDULED: 'border-sky-200 bg-sky-50 text-sky-700',
    COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    CANCELLED: 'border-slate-200 bg-slate-100 text-slate-600'
  }
}

export const SeekerStatusBadge = ({ kind, value, label, className }: SeekerStatusBadgeProps) => {
  const toneClassName = toneMap[kind][value] ?? 'border-violet-200 bg-violet-50 text-violet-700'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]',
        toneClassName,
        className
      )}
    >
      {label}
    </span>
  )
}
