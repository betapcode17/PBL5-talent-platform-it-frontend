import type { ReactNode } from 'react'

type EmployerPageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

const EmployerPageHeader = ({ eyebrow, title, description, actions }: EmployerPageHeaderProps) => {
  return (
    <section className='overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_45%,#0f766e_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-3xl'>
          {eyebrow ? (
            <div className='inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-white/75'>
              {eyebrow}
            </div>
          ) : null}
          <h2 className='mt-4 text-3xl font-semibold tracking-tight sm:text-4xl'>{title}</h2>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base'>{description}</p>
        </div>
        {actions ? <div className='grid gap-3 sm:grid-cols-2'>{actions}</div> : null}
      </div>
    </section>
  )
}

export default EmployerPageHeader
