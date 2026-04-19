import CategoriesSection from '@/components/sections/CategoriesSection'
import EmployersSection from '@/components/sections/EmployersSection'
import FeaturedJobsSection from '@/components/sections/FeaturedJobsSection'
import HeroSection from '@/components/sections/HeroSection'
import NewsletterSection from '@/components/sections/NewsletterSection'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-white text-slate-950'>
      <HeroSection />
      <CategoriesSection />
      <FeaturedJobsSection />
      <EmployersSection />
      <NewsletterSection />
    </div>
  )
}

export default HomePage
