import { useEffect, useState } from 'react'
import CategoryCard from '@/components/ui/CategoryCard'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { categories as defaultCategories } from '@/data/categories'
import { getFeaturedCategoriesApi } from '@/api/categories'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/types'

const CategoriesSection = () => {
  const { t } = useTranslation()
  const [categoryList, setCategoryList] = useState<Category[]>(defaultCategories)

  useEffect(() => {
    let isMounted = true
    getFeaturedCategoriesApi().then((featured) => {
      if (isMounted && featured.length > 0) {
        setCategoryList(
          defaultCategories.map((cat) => {
            const match = featured.find((f) => f.id === cat.id)
            if (match) {
              return {
                ...cat,
                openRoles: match.openRoles
              }
            }
            return cat
          })
        )
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

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
          {categoryList.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CategoriesSection
