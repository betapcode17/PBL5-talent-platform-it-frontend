import { memo, useCallback, useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ActiveFiltersBar from '@/components/browse-jobs/ActiveFiltersBar'
import CareerTipsCard from '@/components/browse-jobs/CareerTipsCard'
import EmptyState from '@/components/browse-jobs/EmptyState'
import FiltersSidebar from '@/components/browse-jobs/FiltersSidebar'
import JobAlertsCard from '@/components/browse-jobs/JobAlertsCard'
import JobCard from '@/components/browse-jobs/JobCard'
import JobsListHeader from '@/components/browse-jobs/JobsListHeader'
import JobsSearchBar from '@/components/browse-jobs/JobsSearchBar'
import Pagination from '@/components/browse-jobs/Pagination'
import SkeletonJobCard from '@/components/browse-jobs/SkeletonJobCard'
import TopCompaniesCard from '@/components/browse-jobs/TopCompaniesCard'
import Container from '@/components/ui/Container'
import { useBrowseJobs } from '@/hooks/useBrowseJobs'
import { topCompanies } from '@/data/browse-jobs/companies'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import { formatLocalizedError } from '@/utils/errorI18n'

const BrowseJobsSearch = memo(() => {
  const searchQuery = useBrowseJobsStore((state) => state.searchQuery)
  const selectedLocation = useBrowseJobsStore((state) => state.selectedLocation)
  const locationOptions = useBrowseJobsStore((state) => state.availableLocationOptions)
  const setSearchQuery = useBrowseJobsStore((state) => state.setSearchQuery)
  const setSelectedLocation = useBrowseJobsStore((state) => state.setSelectedLocation)

  return (
    <JobsSearchBar
      searchQuery={searchQuery}
      selectedLocation={selectedLocation}
      locationOptions={locationOptions}
      onSearchChange={setSearchQuery}
      onLocationChange={setSelectedLocation}
      compact
      className='w-full max-w-3xl bg-white/90'
    />
  )
})

const BrowseJobsResults = memo(() => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('vi') ? 'vi' : 'en'
  const { jobs, pagination, activeFilters, isLoading, isFetching, error } = useBrowseJobs()
  const removeFilter = useBrowseJobsStore((state) => state.removeFilter)
  const resetFilters = useBrowseJobsStore((state) => state.resetFilters)
  const setCurrentPage = useBrowseJobsStore((state) => state.setCurrentPage)

  const handleRemoveFilter = useCallback(
    (filter: string) => {
      removeFilter(filter)
    },
    [removeFilter]
  )

  return (
    <section className='space-y-5'>
      <JobsListHeader
        totalJobs={pagination.totalItems}
        from={pagination.from}
        to={pagination.to}
        isFetching={isFetching}
      />

      <ActiveFiltersBar
        filters={activeFilters}
        resultCount={pagination.totalItems}
        from={pagination.from}
        to={pagination.to}
        onRemove={handleRemoveFilter}
        onClearAll={resetFilters}
      />

      <div className='space-y-4' aria-busy={isFetching}>
        {isLoading ? Array.from({ length: 3 }).map((_, index) => <SkeletonJobCard key={`loading-${index}`} />) : null}

        {!isLoading && jobs.length > 0 ? jobs.map((job) => <JobCard key={job.id} job={job} />) : null}

        {!isLoading && error && jobs.length === 0 ? (
          <div className='rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center text-rose-700 shadow-sm'>
            <p className='font-medium'>{formatLocalizedError(error, currentLang)}</p>
          </div>
        ) : null}

        {!isLoading && !error && jobs.length === 0 ? <EmptyState onReset={resetFilters} /> : null}

        {!isLoading && isFetching && jobs.length > 0 ? <SkeletonJobCard /> : null}
      </div>

      {!isLoading && jobs.length > 0 ? (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      ) : null}
    </section>
  )
})

const BrowseJobsPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const setSearchQuery = useBrowseJobsStore((state) => state.setSearchQuery)
  const setSelectedLocation = useBrowseJobsStore((state) => state.setSelectedLocation)
  const setActiveTab = useBrowseJobsStore((state) => state.setActiveTab)
  const setSortBy = useBrowseJobsStore((state) => state.setSortBy)

  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('category') || searchParams.get('keyword')
    if (q !== null && q !== undefined) {
      setSearchQuery(q)
    }
    const loc = searchParams.get('location')
    if (loc !== null && loc !== undefined) {
      setSelectedLocation(loc)
    }
    const tab = searchParams.get('tab')
    if (tab === 'latest' || tab === 'savedJobs' || tab === 'bestMatch') {
      setActiveTab(tab)
    }
    const sort = searchParams.get('sort')
    if (sort === 'latest' || sort === 'newest') {
      setSortBy('newest')
    } else if (sort === 'salaryHigh') {
      setSortBy('salaryHigh')
    } else if (sort === 'salaryLow') {
      setSortBy('salaryLow')
    }
  }, [searchParams, setActiveTab, setSearchQuery, setSelectedLocation, setSortBy])

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.10),_transparent_26%),linear-gradient(180deg,#f7f4ff_0%,#fafafc_100%)]'>
      <Container className='max-w-[1380px] py-5 sm:py-6'>
        <div className='mb-5 flex justify-center'>
          <BrowseJobsSearch />
        </div>

        <div className='mb-5 flex xl:hidden'>
          <button
            type='button'
            onClick={() => setIsFilterOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:border-violet-200 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200'
          >
            <SlidersHorizontal className='h-4 w-4' />
            {t('browseJobs.filters.open')}
          </button>
        </div>

        <div className='grid gap-5 xl:grid-cols-[296px_minmax(0,1.45fr)_280px] 2xl:grid-cols-[304px_minmax(0,1.5fr)_292px]'>
          <FiltersSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          <BrowseJobsResults />

          <aside className='space-y-4 xl:sticky xl:top-24 xl:self-start'>
            <JobAlertsCard />
            <TopCompaniesCard companies={topCompanies} />
            <CareerTipsCard />
          </aside>
        </div>
      </Container>
    </div>
  )
}

export default BrowseJobsPage
