type EmployerEmptyStateProps = {
  title: string
  description: string
}

const EmployerEmptyState = ({ title, description }: EmployerEmptyStateProps) => {
  return (
    <div className='rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center'>
      <p className='text-lg font-semibold text-slate-900'>{title}</p>
      <p className='mt-2 text-sm leading-6 text-slate-500'>{description}</p>
    </div>
  )
}

export default EmployerEmptyState
