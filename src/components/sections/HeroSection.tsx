import { ChevronDown, MapPin, Search } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Buttons'
import Container from '@/components/ui/Container'
import Tag from '@/components/ui/Tag'
import { popularTags } from '@/data/jobs'

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.12),_transparent_30%),linear-gradient(180deg,#f7f4ff_0%,#f4f1fa_100%)] py-[72px] sm:py-24 lg:py-28'>
      <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent' />
      <div className='absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl' />
      <Container className='relative'>
        <div className='mx-auto max-w-5xl text-center'>
          <div className='space-y-6'>
            <h1 className='text-[2.75rem] font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[4.4rem]'>
              <span className='block'>Connecting Vietnam&apos;s Top Tech Talent</span>
              <span className='mt-2 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent'>
                with Global Opportunities
              </span>
            </h1>
            <p className='mx-auto max-w-2xl text-base leading-8 text-slate-500 sm:text-lg'>
              Find your next developer role in Ho Chi Minh City, Hanoi, or Da Nang, 1,500+ fresh tech openings today.
            </p>
          </div>

          <form className='mx-auto mt-12 max-w-4xl rounded-[28px] border border-white/80 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur'>
            <div className='grid gap-2 md:grid-cols-[1.35fr_0.95fr_auto]'>
              <label className='flex h-16 items-center gap-3 rounded-[22px] px-4 md:border-r md:border-slate-200/80'>
                <Search className='h-5 w-5 text-violet-600' />
                <input
                  type='text'
                  placeholder='Job title, skills...'
                  className='w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
                />
              </label>

              <button
                type='button'
                className='flex h-16 items-center justify-between gap-3 rounded-[22px] px-4 text-left md:border-r md:border-slate-200/80'
              >
                <span className='flex items-center gap-3'>
                  <MapPin className='h-5 w-5 text-violet-600' />
                  <span className='text-sm text-slate-700'>All Locations</span>
                </span>
                <ChevronDown className='h-4 w-4 text-slate-400' />
              </button>

              <PrimaryButton className='h-16 rounded-[22px] px-7 text-sm'>Search Jobs</PrimaryButton>
            </div>
          </form>

          <div className='mt-5 flex flex-wrap items-center justify-center gap-2.5 text-sm text-slate-400'>
            <span className='mr-1 text-xs font-medium text-slate-400'>Popular</span>
            {popularTags.map((tag) => (
              <Tag key={tag.label} label={tag.label} className='bg-white/90' />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
