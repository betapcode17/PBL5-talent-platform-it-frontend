import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  href: string
}

export type HeroTag = {
  label: string
}

export type Category = {
  id: string
  title: string
  openRoles: string
  icon: LucideIcon
}

export type JobBadgeTone = 'new' | 'featured'

export type Job = {
  id: string
  title: string
  company: string
  location: string
  badge: string
  badgeTone: JobBadgeTone
  salary: string
  skills: string[]
  logoText: string
  logoTone: string
}

export type Employer = {
  id: string
  name: string
  shortName: string
}

export type FooterLink = {
  label: string
  href: string
}

export type FooterLinkGroup = {
  title: string
  links: FooterLink[]
}

export type BrowseJob = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  postedAt: string
  skills: string[]
  extraSkillsCount?: number
  logoText: string
  logoTone: string
  language: string
  experience: string
  employmentType: 'Full-time' | 'Contract' | 'Part-time'
  workType: 'Remote' | 'Hybrid' | 'On-site'
  isBookmarked?: boolean
}

export type TopCompany = {
  id: string
  name: string
  jobsCount: number
  logoText: string
  logoTone: string
}

export type FilterOption = {
  label: string
  value: string
  count?: string
}
