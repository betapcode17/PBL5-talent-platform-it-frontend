import { ArrowRight, BriefcaseBusiness, Search, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import Container from '@/components/ui/Container'
import { categories } from '@/data/categories'

const CategoriesPage = () => {
  const totalRoles = categories.reduce((sum, category) => {
    const number = Number(String(category.openRoles).replace(/\D/g, ''))
    return sum + (Number.isNaN(number) ? 0 : number)
  }, 0)

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f8f5ff_0%,#ffffff_42%,#f8fafc_100%)] text-slate-950'>
      <Container className='py-12 sm:py-16'>
        <section className='relative overflow-hidden rounded-[36px] border border-violet-100 bg-white/90 p-6 shadow-[0_28px_90px_rgba(124,58,237,0.12)] backdrop-blur sm:p-10'>
          <div className='absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl' />
          <div className='absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-fuchsia-100/70 blur-3xl' />

          <div className='relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center'>
            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-700'>
                <Sparkles className='h-3.5 w-3.5' />
                Categories
              </span>

              <h1 className='mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl'>
                Browse jobs by skill category
              </h1>

              <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600'>
                Start from a domain, then narrow results by language, experience, salary, and work style.
              </p>

              <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                <Link
                  to='/jobs'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(124,58,237,0.28)] transition hover:bg-violet-800'
                >
                  Explore all jobs
                  <ArrowRight className='h-4 w-4' />
                </Link>

                <Link
                  to='/jobs?sort=latest'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-700'
                >
                  Latest openings
                </Link>
              </div>
            </div>

            <div className='relative rounded-[30px] border border-slate-200 bg-slate-50/80 p-5'>
              <div className='grid gap-3'>
                <div className='rounded-3xl bg-white p-5 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700'>
                      <BriefcaseBusiness className='h-5 w-5' />
                    </span>
                    <div>
                      <p className='text-2xl font-black text-slate-950'>{totalRoles}+</p>
                      <p className='text-sm font-semibold text-slate-500'>Open roles</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-3xl bg-white p-5 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700'>
                      <TrendingUp className='h-5 w-5' />
                    </span>
                    <div>
                      <p className='text-2xl font-black text-slate-950'>{categories.length}</p>
                      <p className='text-sm font-semibold text-slate-500'>Skill categories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-10 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center'>
          <div className='flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3'>
            <Search className='h-5 w-5 text-violet-600' />
            <span className='text-sm font-semibold text-slate-500'>
              Choose a category below to discover matching jobs faster
            </span>
          </div>

          <Link
            to='/jobs'
            className='rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-700'
          >
            View all
          </Link>
        </section>

        <section className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {categories.map((category, index) => {
            const Icon = category.icon

            return (
              <Link
                key={category.id}
                to={`/jobs?category=${encodeURIComponent(category.title)}`}
                className='group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_58px_rgba(124,58,237,0.13)]'
              >
                <div className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-100 opacity-0 blur-2xl transition group-hover:opacity-100' />

                <div className='relative'>
                  <div className='flex items-start justify-between gap-4'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100'>
                      <Icon className='h-5 w-5' />
                    </span>

                    <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500'>
                      #{index + 1}
                    </span>
                  </div>

                  <h2 className='mt-5 text-lg font-black text-slate-950'>{category.title}</h2>

                  <p className='mt-2 text-sm font-semibold text-slate-500'>{category.openRoles}</p>

                  <div className='mt-5 h-2 overflow-hidden rounded-full bg-slate-100'>
                    <div className='h-full w-2/3 rounded-full bg-violet-500 transition group-hover:w-full' />
                  </div>

                  <span className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700'>
                    View jobs
                    <ArrowRight className='h-4 w-4 transition group-hover:translate-x-1' />
                  </span>
                </div>
              </Link>
            )
          })}
        </section>
      </Container>
    </div>
  )
}

export default CategoriesPage
