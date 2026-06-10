import type { ReactNode } from 'react'

type EmployerPageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

const EmployerPageHeader = ({ eyebrow, title, description, actions }: EmployerPageHeaderProps) => {
  return (
    <section className='min-w-0 overflow-hidden rounded-[32px] border border-white/85 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_44%,#155e75_100%)] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:p-8 xl:p-10 dark:border-white/8 dark:shadow-[0_30px_90px_rgba(0,0,0,0.32)]'>
      <div className='flex min-w-0 flex-col gap-6 xl:flex-row xl:items-end xl:justify-between'>
        <div className='min-w-0 max-w-4xl'>
          {eyebrow ? (
            <div className='inline-flex rounded-full border border-white/12 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/75'>
              {eyebrow}
            </div>
          ) : null}
          <h2 className='mt-4 max-w-4xl break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl xl:leading-[1.08]'>
            {title}
          </h2>
          <p className='mt-4 max-w-3xl break-words text-sm leading-7 text-white/80 sm:text-base'>{description}</p>
        </div>

        {actions ? (
          <div className='grid w-full min-w-0 gap-3 sm:grid-cols-2 xl:w-auto xl:min-w-[22rem]'>{actions}</div>
        ) : null}
      </div>
    </section>
  )
}

export default EmployerPageHeader
