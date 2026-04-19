import { Eye } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewJobModal from './ViewJobModal'

type EmployerJobListProps = {
  jobs: EmployerJobItem[]
}

const EmployerJobList = ({ jobs }: EmployerJobListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<EmployerJobItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs
    const term = searchTerm.toLowerCase()
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.category?.name.toLowerCase().includes(term) ||
        job.workLocation?.toLowerCase().includes(term) ||
        job.salary?.toLowerCase().includes(term)
    )
  }, [jobs, searchTerm])

  const handleViewJob = (job: EmployerJobItem) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  if (jobs.length === 0) {
    return (
      <EmployerEmptyState
        title='No job postings yet'
        description='Create your first position to start receiving candidate applications.'
      />
    )
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <Input
            placeholder='Search by title, category, location...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 rounded-lg'
          />
        </div>

        {filteredJobs.length === 0 ? (
          <EmployerEmptyState title='No jobs found' description='Try adjusting your search terms.' />
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50'>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Job Title</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Category</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Location</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Salary</th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-slate-600'>Applicants</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Status</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Updated</th>
                  <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className='border-b border-slate-100 hover:bg-slate-50/50 transition'>
                    <td className='px-4 py-4'>
                      <p className='font-semibold text-slate-950'>{job.title}</p>
                      <p className='text-xs text-slate-500 mt-1'>{job.jobType?.job_type}</p>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{job.category?.name || '-'}</td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{job.workLocation || '-'}</td>
                    <td className='px-4 py-4'>
                      <span className='text-sm font-medium text-violet-700'>{job.salary || '-'}</span>
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <span className='inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700'>
                        {job.applicantCount}
                      </span>
                    </td>
                    <td className='px-4 py-4'>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.isActive ? 'Open' : 'Paused'}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>
                      {new Date(job.updatedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <Button variant='outline' size='sm' className='rounded-lg' onClick={() => handleViewJob(job)}>
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

      {selectedJob && <ViewJobModal job={selectedJob} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

export default EmployerJobList
