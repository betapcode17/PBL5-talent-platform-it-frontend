import type { Category } from '@/types'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = category.icon

  return (
    <article className='group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)]'>
      <div className='mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-colors duration-300 group-hover:bg-violet-100'>
        <Icon className='h-5 w-5' />
      </div>
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold tracking-[-0.03em] text-slate-950'>{category.title}</h3>
        <p className='text-sm text-slate-500'>{category.openRoles}</p>
      </div>
    </article>
  )
}

export default CategoryCard
