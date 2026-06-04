import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SeekerCompanyCollectionView } from '@/components/company/SeekerCompanyCollectionView'
import { useSavedCompanies } from '@/hooks/useSeekerCompanies'

const PAGE_SIZE = 6

const SavedCompaniesPage = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useSavedCompanies()

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return data ?? []
    }

    return (data ?? []).filter((item) =>
      [item.company.company_name, item.company.city, item.company.company_industry]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(keyword))
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <SeekerCompanyCollectionView
      eyebrow={t('seekerCompanies.saved.eyebrow')}
      title={t('seekerCompanies.saved.title')}
      description={t('seekerCompanies.saved.description')}
      searchPlaceholder={t('seekerCompanies.saved.searchPlaceholder')}
      totalLabel={t('seekerCompanies.saved.totalLabel')}
      totalItems={filteredItems.length}
      emptyTitle={t('seekerCompanies.saved.emptyTitle')}
      emptyDescription={t('seekerCompanies.saved.emptyDescription')}
      metaLabels={{
        primary: t('seekerCompanies.saved.meta.savedDate'),
        secondary: t('seekerCompanies.saved.meta.companyStatus'),
        jobsCount: t('seekerCompanies.saved.meta.relatedRoles')
      }}
      items={paginatedItems}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : error ? t('seekerCompanies.saved.loadError') : null}
      searchValue={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      secondaryValueType='status'
      page={currentPage}
      totalPages={totalPages}
      onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
    />
  )
}

export default SavedCompaniesPage
