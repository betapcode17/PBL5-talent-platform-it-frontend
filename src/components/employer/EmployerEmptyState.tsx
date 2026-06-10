type EmployerEmptyStateProps = {
  title: string
  description: string
}

const EmployerEmptyState = ({ title, description }: EmployerEmptyStateProps) => {
  return (
    <div className='rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center dark:border-slate-300/18 dark:bg-slate-200/6'>
      <p className='text-lg font-semibold text-slate-900 dark:text-white'>{title}</p>
      <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>{description}</p>
    </div>
  )
}

export default EmployerEmptyState
