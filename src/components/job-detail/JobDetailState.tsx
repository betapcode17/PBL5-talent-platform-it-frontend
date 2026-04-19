import { AlertCircle, BriefcaseBusiness, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/Buttons'

type JobDetailStateProps = {
  title: string
  description: string
  tone?: 'empty' | 'error'
  onRetry?: () => void
}

const JobDetailState = ({ title, description, tone = 'empty', onRetry }: JobDetailStateProps) => {
  const Icon = tone === 'error' ? AlertCircle : BriefcaseBusiness

  return (
    <div className='mx-auto max-w-2xl rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600'>
        <Icon className='h-7 w-7' />
      </div>

      <h1 className='mt-6 text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-950'>{title}</h1>
      <p className='mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base'>{description}</p>

      <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
        {onRetry ? (
          <PrimaryButton onClick={onRetry} className='rounded-2xl px-6'>
            <RefreshCcw className='mr-2 h-4 w-4' />
            Try Again
          </PrimaryButton>
        ) : null}
        <Link
          to='/jobs'
          className='inline-flex items-center justify-center rounded-2xl border border-violet-300 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2'
        >
          Back to Jobs
        </Link>
      </div>
    </div>
  )
}

export default JobDetailState
