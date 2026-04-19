import { create } from 'zustand'
import type { BrowseJobsFilters } from '@/types/browse-jobs'

type BrowseJobsState = BrowseJobsFilters & {
  setSearchQuery: (value: string) => void
  toggleLanguage: (value: string) => void
  toggleExperience: (value: string) => void
  toggleWorkType: (value: string) => void
  toggleJobType: (value: string) => void
  togglePostedWithin: (value: string) => void
  removeFilter: (value: string) => void
  setSalaryMin: (value: string) => void
  setSalaryMax: (value: string) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void
}

const initialState: BrowseJobsFilters = {
  searchQuery: '',
  selectedLanguages: [],
  selectedExperience: ['Senior'],
  selectedWorkTypes: [],
  selectedJobTypes: [],
  selectedPostedWithin: ['7d'],
  salaryMin: '',
  salaryMax: '',
  currentPage: 1,
  pageSize: 3
}

const toggleSelection = (value: string, current: string[]) =>
  current.includes(value) ? current.filter((item) => item !== value) : [...current, value]

export const useBrowseJobsStore = create<BrowseJobsState>()((set) => ({
  ...initialState,
  setSearchQuery: (value) => set({ searchQuery: value, currentPage: 1 }),
  toggleLanguage: (value) =>
    set((state) => ({
      selectedLanguages: toggleSelection(value, state.selectedLanguages),
      currentPage: 1
    })),
  toggleExperience: (value) =>
    set((state) => ({
      selectedExperience: toggleSelection(value, state.selectedExperience),
      currentPage: 1
    })),
  toggleWorkType: (value) =>
    set((state) => ({
      selectedWorkTypes: toggleSelection(value, state.selectedWorkTypes),
      currentPage: 1
    })),
  toggleJobType: (value) =>
    set((state) => ({
      selectedJobTypes: toggleSelection(value, state.selectedJobTypes),
      currentPage: 1
    })),
  togglePostedWithin: (value) =>
    set((state) => ({
      selectedPostedWithin: toggleSelection(value, state.selectedPostedWithin),
      currentPage: 1
    })),
  removeFilter: (value) =>
    set((state) => ({
      selectedLanguages: state.selectedLanguages.filter((item) => item !== value),
      selectedExperience: state.selectedExperience.filter((item) => item !== value),
      selectedWorkTypes: state.selectedWorkTypes.filter((item) => item !== value),
      selectedJobTypes: state.selectedJobTypes.filter((item) => item !== value),
      currentPage: 1
    })),
  setSalaryMin: (value) => set({ salaryMin: value, currentPage: 1 }),
  setSalaryMax: (value) => set({ salaryMax: value, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set(initialState)
}))
