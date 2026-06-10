import { PrimaryButton } from '@/components/ui/Buttons'
import Container from '@/components/ui/Container'

const NewsletterSection = () => {
  return (
    <section className='bg-[#f7f4fb] py-12 sm:py-16'>
      <Container>
        <div className='relative overflow-hidden rounded-[28px] bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-6 py-10 shadow-[0_24px_80px_rgba(124,58,237,0.28)] sm:px-10 lg:px-12 lg:py-12'>
          <div className='absolute -left-10 top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl' />
          <div className='absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/12 blur-2xl' />
          <div className='absolute bottom-0 right-20 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl' />

          <div className='relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
            <div className='space-y-3 text-white'>
              <h2 className='text-3xl font-semibold tracking-[-0.04em] sm:text-[2.2rem]'>Never miss a job opportunity.</h2>
              <p className='max-w-xl text-sm text-white/82 sm:text-base'>
                Get the latest tech jobs delivered to your inbox every morning.
              </p>
            </div>

            <form className='grid gap-3 md:grid-cols-[1fr_auto]'>
              <input
                type='email'
                placeholder='Enter your email'
                className='h-14 rounded-2xl border border-white/30 bg-white px-5 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400'
              />
              <PrimaryButton className='h-14 rounded-2xl bg-white px-6 text-violet-700 shadow-none hover:bg-violet-50 hover:text-violet-800'>
                Subscribe Now
              </PrimaryButton>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default NewsletterSection
