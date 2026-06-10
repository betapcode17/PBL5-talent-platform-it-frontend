import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Container from '@/components/ui/Container'
import { categories } from '@/data/categories'

const CategoriesPage = () => {
  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f8f5ff_0%,#ffffff_42%,#f8fafc_100%)] text-slate-950'>
      <Container className='py-12 sm:py-16'>
        <section className='max-w-3xl'>
          <p className='text-xs font-bold uppercase tracking-[0.28em] text-violet-600'>Categories</p>
          <h1 className='mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>Browse by skill category</h1>
          <p className='mt-4 max-w-2xl text-base leading-7 text-slate-600'>
            Start from a domain, then narrow results by language, experience, salary, and work style.
          </p>
        </section>

        <section className='mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                to={`/jobs?category=${encodeURIComponent(category.title)}`}
                className='group rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_58px_rgba(124,58,237,0.13)]'
              >
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700'>
                  <Icon className='h-5 w-5' />
                </span>
                <h2 className='mt-5 text-lg font-bold text-slate-950'>{category.title}</h2>
                <p className='mt-2 text-sm font-medium text-slate-500'>{category.openRoles}</p>
                <span className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700'>
                  View jobs
                  <ArrowRight className='h-4 w-4 transition group-hover:translate-x-1' />
                </span>
              </Link>
            )
          })}
        </section>
      </Container>
    </div>
  )
}

export default CategoriesPage
