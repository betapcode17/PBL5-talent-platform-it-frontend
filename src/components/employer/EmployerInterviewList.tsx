import { Eye, Search, ArrowUpDown } from 'lucide-react'
import { useState, useMemo } from 'react'

import type { EmployerInterviewItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewInterviewModal from './ViewInterviewModal'

type EmployerInterviewListProps = {
  interviews: EmployerInterviewItem[]
}

const EmployerInterviewList = ({ interviews }: EmployerInterviewListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedInterview, setSelectedInterview] = useState<EmployerInterviewItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredAndSorted = useMemo(() => {
    let filtered = interviews
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.candidate.fullName?.toLowerCase().includes(term) ||
          i.job.title.toLowerCase().includes(term) ||
          i.location?.toLowerCase().includes(term)
      )
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter((i) => i.status === statusFilter)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.interviewDate ? new Date(a.interviewDate).getTime() : 0
        const dateB = b.interviewDate ? new Date(b.interviewDate).getTime() : 0
        return dateA - dateB
      }
      return 0
    })
    return sorted
  }, [interviews, searchTerm, sortBy, statusFilter])

  const handleViewInterview = (interview: EmployerInterviewItem) => {
    setSelectedInterview(interview)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInterview(null)
  }

  if (interviews.length === 0) {
    return (
      <EmployerEmptyState
        title='No interview schedules yet'
        description='When you create an interview schedule, it will appear here.'
      />
    )
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              placeholder='Search by candidate, job, location...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 rounded-lg'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium'
          >
            <option>All Status</option>
            <option>SCHEDULED</option>
            <option>COMPLETED</option>
          </select>
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'status' : 'date')}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 transition'
          >
            <ArrowUpDown className='h-4 w-4' />
            {sortBy === 'date' ? 'Sort: Date' : 'Sort: Status'}
          </button>
        </div>

        {filteredAndSorted.length === 0 ? (
          <EmployerEmptyState title='No interviews found' description='Try adjusting your search or filters.' />
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50'>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Candidate</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Job Title</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Date & Time</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Interview Type</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Location</th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-slate-600'>Status</th>
                  <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((interview) => (
                  <tr key={interview.id} className='border-b border-slate-100 hover:bg-slate-50/50 transition'>
                    <td className='px-4 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700'>
                          {interview.candidate.fullName?.charAt(0) || '?'}
                        </div>
                        <p className='font-semibold text-slate-950'>{interview.candidate.fullName || 'Unknown'}</p>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{interview.job.title}</td>
                    <td className='px-4 py-4 text-sm text-slate-700'>
                      {interview.interviewDate ? (
                        <div>
                          <p>
                            {new Date(interview.interviewDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          {interview.startTime && <p className='text-xs text-slate-500'>{interview.startTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className='px-4 py-4'>
                      <span className='inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                        {interview.interviewType || 'Not specified'}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{interview.location || '-'}</td>
                    <td className='px-4 py-4 text-center'>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          interview.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : interview.status === 'SCHEDULED'
                              ? 'bg-violet-50 text-violet-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {interview.status}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-lg'
                        onClick={() => handleViewInterview(interview)}
                      >
                        <Eye className='h-4 w-4' />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInterview && (
        <ViewInterviewModal interview={selectedInterview} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default EmployerInterviewList
