import Container from '@/components/ui/Container'
import { employers } from '@/data/employers'

const EmployersSection = () => {
  return (
    <section className='bg-white py-[72px]'>
      <Container>
        <div className='space-y-10 text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-slate-400'>Top Tech Employers In Vietnam</p>
          <div className='flex flex-wrap items-center justify-center gap-6 lg:gap-10'>
            {employers.map((employer) => (
              <div
                key={employer.id}
                className='flex h-14 min-w-20 items-center justify-center rounded-sm bg-gradient-to-br from-slate-500 to-slate-300 px-4 text-xs font-medium tracking-[0.04em] text-white/90 grayscale transition duration-300 hover:-translate-y-0.5 hover:grayscale-0'
                aria-label={employer.name}
              >
                {employer.shortName}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default EmployersSection
