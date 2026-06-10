import type { TFunction } from 'i18next'

const browseValueKeys: Record<string, string> = {
  Junior: 'browseJobs.values.junior',
  Senior: 'browseJobs.values.senior',
  'Lead / Architect': 'browseJobs.values.leadArchitect',
  Remote: 'browseJobs.values.remote',
  Hybrid: 'browseJobs.values.hybrid',
  'On-site': 'browseJobs.values.onSite',
  Fulltime: 'browseJobs.values.fullTime',
  'Full-time': 'browseJobs.values.fullTime',
  Contract: 'browseJobs.values.contract',
  'Part-time': 'browseJobs.values.partTime',
  'All levels': 'browseJobs.values.allLevels',
  'Location flexible': 'browseJobs.values.locationFlexible',
  'Salary negotiable': 'browseJobs.values.salaryNegotiable',
  'Recently posted': 'browseJobs.values.recentlyPosted',
  'Just now': 'browseJobs.values.justNow',
  Today: 'browseJobs.values.today',
  Yesterday: 'browseJobs.values.yesterday'
}

export const translateBrowseValue = (t: TFunction, value?: string | null) => {
  if (!value) return ''

  const directKey = browseValueKeys[value]
  if (directKey) return t(directKey)

  const hoursAgo = value.match(/^(\d+)\s+hours?\s+ago$/i)
  if (hoursAgo) {
    return t('browseJobs.values.hoursAgo', { count: Number(hoursAgo[1]) })
  }

  const daysAgo = value.match(/^(\d+)\s+days?\s+ago$/i)
  if (daysAgo) {
    return t('browseJobs.values.daysAgo', { count: Number(daysAgo[1]) })
  }

  return value
}

export const translateBrowseFilters = (t: TFunction, filters: string[]) =>
  filters.map((filter) => ({
    value: filter,
    label: translateBrowseValue(t, filter)
  }))
