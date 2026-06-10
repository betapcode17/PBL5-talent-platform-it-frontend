import Container from '@/components/ui/Container'
import JobCard from '@/components/ui/JobCard'
import { OutlineButton } from '@/components/ui/Buttons'
import SectionHeading from '@/components/ui/SectionHeading'
import { featuredJobs } from '@/data/jobs'

const FeaturedJobsSection = () => {
  return (
    <section className='bg-[#f7f4fb] py-[72px] sm:py-24'>
      <Container className='space-y-10'>
        <SectionHeading title='Featured Jobs' accent />

        <div className='grid gap-5 lg:grid-cols-3'>
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className='flex justify-center pt-2'>
          <OutlineButton className='min-w-[240px] rounded-2xl px-8 py-3.5'>Browse More 1,200+ Jobs</OutlineButton>
        </div>
      </Container>
    </section>
  )
}

export default FeaturedJobsSection
