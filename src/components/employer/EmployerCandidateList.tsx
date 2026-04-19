import { Eye, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

import type { EmployerCandidateItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmployerEmptyState from './EmployerEmptyState'
import ViewCandidateModal from './ViewCandidateModal'

type EmployerCandidateListProps = {
  candidates: EmployerCandidateItem[]
}

const EmployerCandidateList = ({ candidates }: EmployerCandidateListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [jobFilter, setJobFilter] = useState<string>('All')
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidateItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredCandidates = useMemo(() => {
    let filtered = candidates
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.seeker.fullName?.toLowerCase().includes(term) ||
          c.seeker.email?.toLowerCase().includes(term) ||
          c.job.title.toLowerCase().includes(term) ||
          c.seeker.skills.some((s) => s.toLowerCase().includes(term))
      )
    }
    if (stageFilter !== 'All') {
      filtered = filtered.filter((c) => c.stage === stageFilter)
    }
    if (jobFilter !== 'All') {
      filtered = filtered.filter((c) => c.job.title === jobFilter)
    }
    return filtered
  }, [candidates, searchTerm, stageFilter, jobFilter])

  const handleViewCandidate = (candidate: EmployerCandidateItem) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
  }

  if (candidates.length === 0) {
    return (
      <EmployerEmptyState
        title='No candidates yet'
        description='When candidates apply to your job posts, they will appear here.'
      />
    )
  }

  const stages = Array.from(new Set(candidates.map((c) => c.stage).filter(Boolean))) as string[]
  const jobs = Array.from(new Set(candidates.map((c) => c.job.title))) as string[]

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              placeholder='Search by name, email, skills...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 rounded-lg'
            />
          </div>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className='px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium whitespace-nowrap'
          >
            <option>All Jobs</option>
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className='px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium'
          >
            <option>All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {filteredCandidates.length === 0 ? (
          <EmployerEmptyState title='No candidates found' description='Try adjusting your search or filters.' />
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50'>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Candidate Name</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Job Title</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Email</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Stage</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Skills</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-slate-600'>Applied Date</th>
                  <th className='px-4 py-3 text-right text-sm font-semibold text-slate-600'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.applicationId}
                    className='border-b border-slate-100 hover:bg-slate-50/50 transition'
                  >
                    <td className='px-4 py-4'>
                      <div className='flex items-center gap-3'>
                        {candidate.seeker.avatar ? (
                          <img
                            src={candidate.seeker.avatar}
                            alt={candidate.seeker.fullName}
                            className='h-10 w-10 rounded-full object-cover border border-slate-200'
                          />
                        ) : (
                          <div className='h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700'>
                            {candidate.seeker.fullName?.charAt(0) || '?'}
                          </div>
                        )}
                        <p className='font-semibold text-slate-950'>{candidate.seeker.fullName || 'Unknown'}</p>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{candidate.job.title}</td>
                    <td className='px-4 py-4 text-sm text-slate-700'>{candidate.seeker.email || '-'}</td>
                    <td className='px-4 py-4'>
                      <span className='inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700'>
                        {candidate.stage || candidate.status}
                      </span>
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex flex-wrap gap-1'>
                        {candidate.seeker.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className='inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.seeker.skills.length > 2 && (
                          <span className='inline-block text-xs font-medium text-slate-500'>
                            +{candidate.seeker.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm text-slate-700'>
                      {new Date(candidate.appliedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='rounded-lg'
                        onClick={() => handleViewCandidate(candidate)}
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

      {selectedCandidate && (
        <ViewCandidateModal candidate={selectedCandidate} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default EmployerCandidateList
