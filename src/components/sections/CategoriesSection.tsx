import CategoryCard from '@/components/ui/CategoryCard'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { categories } from '@/data/categories'
import { useTranslation } from 'react-i18next'

const CategoriesSection = () => {
  const { t } = useTranslation()

  return (
    <section className='bg-slate-50/60 py-16 sm:py-20'>
      <Container className='space-y-10'>
        <SectionHeading
          eyebrow={t('home.categories.eyebrow')}
          title={t('home.categories.title')}
          subtitle={t('home.categories.subtitle')}
          actionLabel={t('home.categories.actionLabel')}
          actionHref='/categories'
          accent
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CategoriesSection
