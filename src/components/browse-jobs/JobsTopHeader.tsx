import { Bell, BriefcaseBusiness, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import JobsSearchBar from '@/components/browse-jobs/JobsSearchBar'

type JobsTopHeaderProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
}

const JobsTopHeader = ({ searchQuery, onSearchChange }: JobsTopHeaderProps) => {
  return (
    <header className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl'>
      <Container className='py-4'>
        <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6'>
          <div className='flex items-center justify-between gap-4 xl:min-w-[220px]'>
            <Logo />
            <div className='flex items-center gap-3 xl:hidden'>
              <button
                type='button'
                className='flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                aria-label='Notifications'
              >
                <Bell className='h-5 w-5' />
              </button>
              <div className='flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-gradient-to-br from-orange-100 to-violet-100 text-sm font-semibold text-slate-700'>
                L
              </div>
            </div>
          </div>

          <div className='flex flex-1 items-center gap-4'>
            <JobsSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

            <div className='hidden items-center gap-3 xl:flex'>
              <button
                type='button'
                className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-700'
              >
                <BriefcaseBusiness className='h-4 w-4' />
                Saved
                <ChevronDown className='h-4 w-4 text-slate-400' />
              </button>
              <button
                type='button'
                className='relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                aria-label='Notifications'
              >
                <Bell className='h-5 w-5' />
                <span className='absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white' />
              </button>

              <Link
                to='/seeker'
                className='flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-gradient-to-br from-orange-100 to-violet-100 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(124,58,237,0.08)]'
              >
                L
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default JobsTopHeader
