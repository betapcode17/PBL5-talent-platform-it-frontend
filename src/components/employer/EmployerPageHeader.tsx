import type { ReactNode } from 'react'

type EmployerPageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

const EmployerPageHeader = ({ title, description, actions }: EmployerPageHeaderProps) => {
  return (
    <section className='relative min-w-0 overflow-hidden rounded-[20px] border border-white/85 bg-[linear-gradient(135deg,#1e293b_0%,#334155_42%,#0f766e_100%)] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] transition-colors duration-500 sm:p-8 xl:p-10 dark:border-slate-200/16 dark:bg-[linear-gradient(135deg,#242b38_0%,#354057_44%,#1e6f75_100%)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)]'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent' />
      <div className='flex min-w-0 flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between'>
        <div className='min-w-0 max-w-5xl'>

          <h2 className='mt-4 max-w-5xl break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl xl:leading-[1.08]'>
            {title}
          </h2>
          <p className='mt-4 max-w-3xl break-words text-sm leading-7 text-slate-100 sm:text-base'>{description}</p>
        </div>

        {actions ? (
          <div className='flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap 2xl:w-auto 2xl:max-w-[38rem] 2xl:justify-end'>
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default EmployerPageHeader
