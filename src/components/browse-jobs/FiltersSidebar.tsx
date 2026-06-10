import { memo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CheckboxFilterItem from '@/components/browse-jobs/CheckboxFilterItem'
import FilterSelectGroup from '@/components/browse-jobs/FilterSelectGroup'
import FilterSection from '@/components/browse-jobs/FilterSection'
import SalaryRangeSlider from '@/components/browse-jobs/SalaryRangeSlider'
import WorkTypeChips from '@/components/browse-jobs/WorkTypeChips'
import { postedWithinOptions, workTypeOptions, experienceLevelOptions } from '@/data/browse-jobs/filters'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons'
import type { FilterOption } from '@/types/browse-jobs'
import { translateBrowseValue } from '@/utils/browseJobsI18n'

type FiltersSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const shouldUseSelect = (options: FilterOption[], forceSelect = false) => forceSelect || options.length > 5

const FilterSidebarContent = memo(() => {
  const { t } = useTranslation()
  const selectedLanguages = useBrowseJobsStore((state) => state.selectedLanguages)
  const selectedExperience = useBrowseJobsStore((state) => state.selectedExperience)
  const selectedWorkTypes = useBrowseJobsStore((state) => state.selectedWorkTypes)
  const selectedJobTypes = useBrowseJobsStore((state) => state.selectedJobTypes)
  const selectedPostedWithin = useBrowseJobsStore((state) => state.selectedPostedWithin)
  const programmingLanguageOptions = useBrowseJobsStore((state) => state.availableProgrammingLanguageOptions)
  const jobTypeOptions = useBrowseJobsStore((state) => state.availableJobTypeOptions)
  const salaryMin = useBrowseJobsStore((state) => state.salaryMin)
  const salaryMax = useBrowseJobsStore((state) => state.salaryMax)
  const toggleLanguage = useBrowseJobsStore((state) => state.toggleLanguage)
  const toggleExperience = useBrowseJobsStore((state) => state.toggleExperience)
  const toggleWorkType = useBrowseJobsStore((state) => state.toggleWorkType)
  const toggleJobType = useBrowseJobsStore((state) => state.toggleJobType)
  const togglePostedWithin = useBrowseJobsStore((state) => state.togglePostedWithin)
  const setSalaryMin = useBrowseJobsStore((state) => state.setSalaryMin)
  const setSalaryMax = useBrowseJobsStore((state) => state.setSalaryMax)
  const translatedExperienceOptions = experienceLevelOptions.map((option) => ({
    ...option,
    label: translateBrowseValue(t, option.value)
  }))
  const translatedWorkTypeOptions = workTypeOptions.map((option) => ({
    ...option,
    label: translateBrowseValue(t, option.value)
  }))
  const translatedJobTypeOptions = jobTypeOptions.map((option) => ({
    ...option,
    label: translateBrowseValue(t, option.value)
  }))
  const translatedPostedWithinOptions = postedWithinOptions.map((option) => ({
    ...option,
    label:
      option.value === '24h'
        ? t('browseJobs.values.hoursAgo', { count: 24 })
        : option.value === '3d'
          ? t('browseJobs.values.daysAgo', { count: 3 })
          : t('browseJobs.values.daysAgo', { count: 7 })
  }))

  return (
    <div className='space-y-7'>
      {shouldUseSelect(programmingLanguageOptions, true) ? (
        <FilterSelectGroup
          title={t('browseJobs.filters.programmingLanguages')}
          options={programmingLanguageOptions}
          selected={selectedLanguages}
          placeholder={t('browseJobs.filters.chooseLanguage')}
          emptyText={t('browseJobs.filters.noMatches')}
          searchable
          onToggle={toggleLanguage}
        />
      ) : null}

      <FilterSection title={t('browseJobs.filters.experienceLevel')}>
        <div className='space-y-2.5'>
          {translatedExperienceOptions.map((option) => (
            <CheckboxFilterItem
              key={option.value}
              label={option.label}
              checked={selectedExperience.includes(option.value)}
              onToggle={() => toggleExperience(option.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('browseJobs.filters.workType')}>
        <WorkTypeChips options={translatedWorkTypeOptions} selected={selectedWorkTypes} onToggle={toggleWorkType} />
      </FilterSection>

      {shouldUseSelect(jobTypeOptions) ? (
        <FilterSelectGroup
          title={t('browseJobs.filters.jobType')}
          options={translatedJobTypeOptions}
          selected={selectedJobTypes}
          placeholder={t('browseJobs.filters.chooseJobType')}
          onToggle={toggleJobType}
        />
      ) : (
        <FilterSection title={t('browseJobs.filters.jobType')}>
          <div className='space-y-2.5'>
            {translatedJobTypeOptions.map((option) => (
              <CheckboxFilterItem
                key={option.value}
                label={option.label}
                count={option.count}
                checked={selectedJobTypes.includes(option.value)}
                onToggle={() => toggleJobType(option.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {shouldUseSelect(postedWithinOptions) ? (
        <FilterSelectGroup
          title={t('browseJobs.filters.postedWithin')}
          options={translatedPostedWithinOptions}
          selected={selectedPostedWithin}
          placeholder={t('browseJobs.filters.chooseTime')}
          onToggle={togglePostedWithin}
        />
      ) : (
        <FilterSection title={t('browseJobs.filters.postedWithin')}>
          <div className='space-y-2.5'>
            {translatedPostedWithinOptions.map((option) => (
              <CheckboxFilterItem
                key={option.value}
                label={option.label}
                checked={selectedPostedWithin.includes(option.value)}
                onToggle={() => togglePostedWithin(option.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title={t('browseJobs.filters.salaryRange')}>
        <SalaryRangeSlider
          minValue={salaryMin}
          maxValue={salaryMax}
          onMinChange={setSalaryMin}
          onMaxChange={setSalaryMax}
        />
      </FilterSection>
    </div>
  )
})

const FiltersSidebar = ({ isOpen, onClose }: FiltersSidebarProps) => {
  const { t } = useTranslation()
  const resetFilters = useBrowseJobsStore((state) => state.resetFilters)

  return (
    <>
      <aside className='hidden xl:block xl:self-start'>
        <div className='sticky top-24 w-[296px]'>
          <div className='rounded-[30px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm'>
            <FilterSidebarContent />
          </div>
        </div>
      </aside>

      {isOpen ? (
        <>
          <button
            type='button'
            aria-label={t('browseJobs.filters.close')}
            className='fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] xl:hidden'
            onClick={onClose}
          />

          <aside className='fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.18)] transition-transform duration-300 xl:hidden'>
            <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
              <div className='flex items-center gap-2'>
                <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700'>
                  <SlidersHorizontal className='h-4 w-4' />
                </span>
                <div>
                  <h2 className='text-base font-semibold text-slate-950'>{t('browseJobs.filters.title')}</h2>
                  <p className='text-sm text-slate-500'>{t('browseJobs.filters.description')}</p>
                </div>
              </div>
              <button
                type='button'
                onClick={onClose}
                className='flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-700'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto px-5 py-5'>
              <div className='rounded-[28px] border border-slate-200 bg-slate-50/70 p-4'>
                <FilterSidebarContent />
              </div>
            </div>

            <div className='border-t border-slate-200 bg-white px-5 py-4'>
              <div className='flex gap-3'>
                <OutlineButton className='h-11 flex-1 rounded-xl text-sm' onClick={resetFilters}>
                  {t('browseJobs.filters.reset')}
                </OutlineButton>
                <PrimaryButton className='h-11 flex-1 rounded-xl text-sm' onClick={onClose}>
                  {t('browseJobs.filters.apply')}
                </PrimaryButton>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  )
}

export default memo(FiltersSidebar)
