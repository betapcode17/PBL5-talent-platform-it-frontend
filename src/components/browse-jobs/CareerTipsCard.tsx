import { memo } from 'react'
import { ArrowRight, FileText, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const tips = [
  { label: 'CV tips', icon: FileText },
  { label: 'Interview prep', icon: ShieldCheck },
  { label: 'Salary guide', icon: Lightbulb }
]

const CareerTipsCard = () => {
  return (
    <section className='rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
      <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Career Tips</p>

      <div className='mt-4 space-y-2.5'>
        {tips.map((tip) => {
          const Icon = tip.icon
          return (
            <button
              key={tip.label}
              type='button'
              className='flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-left transition hover:border-violet-200 hover:bg-violet-50'
            >
              <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-[0_8px_20px_rgba(15,23,42,0.05)]'>
                <Icon className='h-4 w-4' />
              </span>
              <span className='text-sm font-semibold text-slate-800'>{tip.label}</span>
            </button>
          )
        })}
      </div>

      <Link
        to='/career-advice'
        className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900'
      >
        Explore resources
        <ArrowRight className='h-4 w-4' />
      </Link>
    </section>
  )
}

export default memo(CareerTipsCard)
