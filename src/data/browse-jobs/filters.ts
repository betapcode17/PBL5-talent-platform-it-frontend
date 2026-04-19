import type { FilterOption } from '@/types/browse-jobs'

export const programmingLanguageOptions: FilterOption[] = [
  { label: 'JavaScript', value: 'JavaScript', count: '1.2k' },
  { label: 'Python', value: 'Python', count: '840' },
  { label: 'Go Lang', value: 'Go Lang', count: '320' },
  { label: 'Java', value: 'Java', count: '510' }
]

export const experienceLevelOptions: FilterOption[] = [
  { label: 'Junior', value: 'Junior' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Lead / Architect', value: 'Lead / Architect' }
]

export const workTypeOptions: FilterOption[] = [
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'On-site', value: 'On-site' }
]

export const jobTypeOptions: FilterOption[] = [
  { label: 'Full-time', value: 'Full-time', count: '920' },
  { label: 'Contract', value: 'Contract', count: '186' },
  { label: 'Part-time', value: 'Part-time', count: '142' }
]

export const postedWithinOptions: FilterOption[] = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last 7 days', value: '7d' }
]
