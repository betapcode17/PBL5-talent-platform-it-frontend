import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SeekerCompanyCollectionView } from '@/components/company/SeekerCompanyCollectionView'
import { useAppliedCompanies } from '@/hooks/useSeekerCompanies'

const PAGE_SIZE = 6
const ALL_STATUSES = 'ALL'

const AppliedCompaniesPage = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState(ALL_STATUSES)
  const { data, isLoading, error } = useAppliedCompanies()

  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set((data ?? []).flatMap((item) => item.appliedJobs?.map((job) => job.status) ?? []))]

    return [
      {
        value: ALL_STATUSES,
        label: t('seekerCompanies.common.allStatuses')
      },
      ...uniqueStatuses.map((itemStatus) => ({
        value: itemStatus,
        label: t(`seekerCompanies.statuses.${itemStatus}`, { defaultValue: itemStatus })
      }))
    ]
  }, [data, t])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    const itemsWithStatus = (data ?? [])
      .map((item) => {
        if (status === ALL_STATUSES) {
          return item
        }

        const filteredJobs = (item.appliedJobs ?? []).filter((job) => job.status === status)

        if (filteredJobs.length === 0) {
          return null
        }

        const latestJob = filteredJobs[0]

        return {
          ...item,
          primaryDate: latestJob.appliedDate,
          secondaryValue: String(filteredJobs.length),
          badge: latestJob.status,
          jobsCount: filteredJobs.length,
          sortDate: latestJob.appliedDate,
          appliedJobs: filteredJobs
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((firstItem, secondItem) => new Date(secondItem.sortDate).getTime() - new Date(firstItem.sortDate).getTime())

    if (!keyword) {
      return itemsWithStatus
    }

    return itemsWithStatus.filter((item) =>
      [
        item.company.company_name,
        item.company.city,
        item.company.company_industry,
        ...(item.appliedJobs?.map((job) => job.title) ?? [])
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(keyword))
    )
  }, [data, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <SeekerCompanyCollectionView
      eyebrow={t('seekerCompanies.applied.eyebrow')}
      title={t('seekerCompanies.applied.title')}
      description={t('seekerCompanies.applied.description')}
      searchPlaceholder={t('seekerCompanies.applied.searchPlaceholder')}
      totalLabel={t('seekerCompanies.applied.totalLabel')}
      totalItems={filteredItems.length}
      emptyTitle={t('seekerCompanies.applied.emptyTitle')}
      emptyDescription={t('seekerCompanies.applied.emptyDescription')}
      metaLabels={{
        primary: t('seekerCompanies.applied.meta.latestApplied'),
        secondary: t('seekerCompanies.applied.meta.positionsApplied'),
        jobsCount: t('seekerCompanies.applied.meta.relatedRoles')
      }}
      items={paginatedItems}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : error ? t('seekerCompanies.applied.loadError') : null}
      searchValue={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      statusFilter={{
        label: t('seekerCompanies.common.statusFilter'),
        value: status,
        options: statusOptions,
        onChange: (value) => {
          setStatus(value)
          setPage(1)
        }
      }}
      jobDetails={{
        title: t('seekerCompanies.applied.jobs.title'),
        empty: t('seekerCompanies.applied.jobs.empty')
      }}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
    />
  )
}

export default AppliedCompaniesPage
