import { X, Mail, Phone, Briefcase, Award } from 'lucide-react'
import type { EmployerCandidateItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'

type ViewCandidateModalProps = {
  candidate: EmployerCandidateItem
  isOpen: boolean
  onClose: () => void
}

const ViewCandidateModal = ({ candidate, isOpen, onClose }: ViewCandidateModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50'>
          <div className='flex items-start gap-4'>
            {candidate.seeker.avatar ? (
              <img
                src={candidate.seeker.avatar}
                alt={candidate.seeker.fullName}
                className='h-16 w-16 rounded-full object-cover border-2 border-slate-200'
              />
            ) : (
              <div className='h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center text-lg font-bold text-violet-700 border-2 border-slate-200'>
                {candidate.seeker.fullName?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h2 className='text-2xl font-bold text-slate-950'>{candidate.seeker.fullName}</h2>
              <p className='text-sm text-slate-600 mt-1'>Applied for: {candidate.job.title}</p>
            </div>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-200 rounded-lg transition'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Contact Information */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>Contact Information</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                  <Mail className='h-5 w-5 text-blue-600' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Email</p>
                    <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.email || '-'}</p>
                  </div>
                </div>
                {candidate.seeker.phone && (
                  <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                    <Phone className='h-5 w-5 text-green-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>Phone</p>
                      <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>Application Status</h3>
              <div className='grid grid-cols-3 gap-4'>
                <div className='p-4 bg-slate-50 rounded-lg'>
                  <p className='text-xs font-medium text-slate-600 mb-1'>Stage</p>
                  <span className='inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700'>
                    {candidate.stage || candidate.status}
                  </span>
                </div>
                <div className='p-4 bg-slate-50 rounded-lg'>
                  <p className='text-xs font-medium text-slate-600 mb-1'>Applied Date</p>
                  <p className='text-sm font-semibold text-slate-950'>
                    {new Date(candidate.appliedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className='p-4 bg-slate-50 rounded-lg'>
                  <p className='text-xs font-medium text-slate-600 mb-1'>Job Position</p>
                  <p className='text-sm font-semibold text-slate-950 truncate'>{candidate.job.title}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {candidate.seeker.skills && candidate.seeker.skills.length > 0 && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Skills</h3>
                <div className='flex flex-wrap gap-2'>
                  {candidate.seeker.skills.map((skill) => (
                    <span
                      key={skill}
                      className='inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>Additional Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                {candidate.seeker.experience && (
                  <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                    <Award className='h-5 w-5 text-amber-600 flex-shrink-0 mt-1' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>Experience</p>
                      <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.experience}</p>
                    </div>
                  </div>
                )}
                {candidate.seeker.location && (
                  <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                    <Briefcase className='h-5 w-5 text-purple-600 flex-shrink-0 mt-1' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>Location</p>
                      <p className='text-sm font-semibold text-slate-950'>{candidate.seeker.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50'>
          <Button variant='outline' onClick={onClose} className='rounded-lg'>
            Close
          </Button>
          <Button className='rounded-lg'>View Full Profile</Button>
        </div>
      </div>
    </div>
  )
}

export default ViewCandidateModal
