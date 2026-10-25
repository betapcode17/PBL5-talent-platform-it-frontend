import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/types'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { t } = useTranslation()
  const Icon = category.icon

  return (
    <Link
      to={`/jobs?q=${encodeURIComponent(category.title)}`}
      className='group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-[0_20px_45px_-10px_rgba(124,58,237,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
    >
      <div className='pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-100/40 blur-xl transition-all duration-300 group-hover:scale-150 group-hover:bg-violet-200/50' />

      <div>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-50 to-violet-100/80 text-violet-700 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-violet-600 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_8px_20px_-3px_rgba(124,58,237,0.35)]'>
            <Icon className='h-6 w-6' />
          </div>
          <span className='rounded-full border border-violet-100 bg-violet-50/80 px-2.5 py-1 text-xs font-semibold text-violet-700'>
            {t('home.categories.hot')}
          </span>
        </div>

        <div className='space-y-1.5'>
          <h3 className='text-xl font-bold tracking-tight text-slate-950 transition-colors group-hover:text-violet-700'>
            {category.title}
          </h3>
          <p className='text-sm font-medium text-slate-500'>{category.openRoles}</p>
        </div>
      </div>

      <div className='mt-8 flex items-center gap-1.5 text-xs font-bold text-violet-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-violet-700'>
        <span>{t('home.categories.exploreJobs')}</span>
        <ArrowRight className='h-3.5 w-3.5' />
      </div>
    </Link>
  )
}

export default CategoryCard
