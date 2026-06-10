import CategoryCard from '@/components/ui/CategoryCard'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { categories } from '@/data/categories'
import { useTranslation } from 'react-i18next'

const CategoriesSection = () => {
  const { t } = useTranslation()

  return (
    <section className='bg-white py-[72px] sm:py-[88px]'>
      <Container className='space-y-10'>
        <SectionHeading
          title={t('home.categories.title')}
          subtitle={t('home.categories.subtitle')}
          actionLabel={t('home.categories.viewAll')}
          actionHref='/jobs'
        />

        <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CategoriesSection
