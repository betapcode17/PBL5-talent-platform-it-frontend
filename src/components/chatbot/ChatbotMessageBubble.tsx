import type { ChatMessage } from '@/@types/chatbot'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Briefcase, ChevronRight, FileText, GraduationCap, MapPin, Search, Sparkles, Wallet } from 'lucide-react'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

const BOT_SECTION_LABELS = [
  'Tom tat:',
  'Ky nang:',
  'Muc luong:',
  'Dia diem:',
  'Yeu cau noi bat:',
  'Buoc tiep theo:'
]

const formatAssistantContent = (content: string) => {
  const normalized = String(content || '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return normalized

  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (!BOT_SECTION_LABELS.some((label) => normalized.includes(label))) {
    return normalized
  }

  const firstSectionIndex = lines.findIndex((line) =>
    BOT_SECTION_LABELS.some((label) => line.includes(label))
  )

  const headerLines = firstSectionIndex > 0 ? lines.slice(0, firstSectionIndex) : []
  const sectionLines = firstSectionIndex >= 0 ? lines.slice(firstSectionIndex) : lines

  const formattedSections = sectionLines.map((line) => {
    const cleanLine = line.startsWith('- ') ? line.slice(2).trim() : line
    const matchedLabel = BOT_SECTION_LABELS.find((label) => cleanLine.startsWith(label))
    if (!matchedLabel) return cleanLine

    const value = cleanLine.slice(matchedLabel.length).trim() || 'Chua co thong tin ro rang'
    return `- **${matchedLabel.replace(':', '')}:** ${value}`
  })

  return [...headerLines, '', ...formattedSections].join('\n\n').trim()
}

const sanitizeField = (value?: string | null) => {
  const normalized = String(value || '').trim()
  if (!normalized) return 'Chua co thong tin ro rang'
  return normalized
}

const isCvAnalysisMessage = (message: ChatMessage) =>
  message.messageType === 'cv_analysis' || message.detectedIntent === 'cv_analysis' || !!message.cvAnalysis

const isCvJdMatchMessage = (message: ChatMessage) =>
  message.messageType === 'cv_jd_match' || message.detectedIntent === 'cv_jd_match' || !!message.cvJdMatch

const compactAssistantContent = (content: string, hasJobResults: boolean) => {
  if (!hasJobResults) return content
  return ''
}

const getJobDetailHref = (jobId?: string | number | null, url?: string | null) => {
  const normalizedUrl = String(url || '').trim()
  if (normalizedUrl) {
    if (/^https?:\/\//i.test(normalizedUrl)) return normalizedUrl
    if (normalizedUrl.startsWith('/')) return normalizedUrl
  }

  if (jobId !== undefined && jobId !== null && String(jobId).trim()) {
    return `/jobs/${jobId}`
  }

  return null
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user'
  const rawAssistantContent = !isUser ? formatAssistantContent(message.content) : ''
  const jobResults = !isUser && Array.isArray(message.jobResults) ? message.jobResults : []
  const cvAnalysis = !isUser ? message.cvAnalysis : null
  const cvJdMatch = !isUser ? message.cvJdMatch : null
  const hasCvAnalysis = !isUser && isCvAnalysisMessage(message) && !!cvAnalysis
  const hasCvJdMatch = !isUser && isCvJdMatchMessage(message) && !!cvJdMatch
  const hasJobResults = jobResults.length > 0
  const totalJobsFound = !isUser ? Math.max(Number(message.jobResultsTotal || 0), jobResults.length) : 0
  const jobResultsSummary = !isUser ? String(message.jobResultsSummary || '').trim() : ''
  const assistantContent = !isUser ? compactAssistantContent(rawAssistantContent, hasJobResults || hasCvAnalysis || hasCvJdMatch) : ''
  const visibleJobs = hasJobResults ? jobResults.slice(0, 8) : []
  const hiddenJobsCount = hasJobResults ? Math.max(totalJobsFound - visibleJobs.length, 0) : 0

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[80%] items-end gap-2', isUser && 'flex-row-reverse')}>
        {/* Avatar */}
        {!isUser && (
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm'>
            <svg
              viewBox='0 0 24 24'
              className='h-4 w-4 text-white'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 8V4H8' />
              <rect x='4' y='8' width='16' height='12' rx='3' />
              <circle cx='9' cy='14' r='1' fill='currentColor' />
              <circle cx='15' cy='14' r='1' fill='currentColor' />
            </svg>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'min-w-0 break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'rounded-br-md bg-purple-600 text-white'
              : 'rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-200/10 dark:text-slate-100 dark:ring-slate-300/12'
          )}
        >
          {isUser ? (
            <span className='whitespace-pre-wrap break-words'>{message.content}</span>
          ) : (
            <>
              {assistantContent ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className='mb-2 last:mb-0 break-words'>{children}</p>,
                    strong: ({ children }) => <strong className='font-semibold'>{children}</strong>,
                    ol: ({ children }) => <ol className='mb-2 list-decimal pl-4 space-y-1'>{children}</ol>,
                    ul: ({ children }) => <ul className='mb-2 list-disc pl-4 space-y-1'>{children}</ul>,
                    li: ({ children }) => <li className='break-words'>{children}</li>,
                    h1: ({ children }) => <h1 className='mb-2 text-base font-semibold'>{children}</h1>,
                    h2: ({ children }) => <h2 className='mb-2 text-sm font-semibold'>{children}</h2>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='break-all text-indigo-600 underline hover:text-indigo-800'
                      >
                        {children}
                      </a>
                    )
                  }}
                >
                  {assistantContent}
                </ReactMarkdown>
              ) : null}

              {hasCvAnalysis && cvAnalysis ? (
                <div className='mt-3 space-y-3 border-t border-slate-200 pt-3'>
                  <div className='rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-3'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>{cvAnalysis.filename || 'CV analysis'}</p>
                        <p className='mt-1 text-xs text-slate-600'>
                          Diem chat luong {Number(cvAnalysis.insights?.quality_score || 0).toFixed(1)}/10
                        </p>
                      </div>
                      <div className='inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700'>
                        <Sparkles className='h-3.5 w-3.5' />
                        CV Analysis
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-2 md:grid-cols-2'>
                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <GraduationCap className='h-4 w-4 text-emerald-600' />
                        Diem manh
                      </div>
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {(cvAnalysis.insights?.strengths || []).slice(0, 4).map((item, index) => (
                          <li key={`strength-${index}`} className='rounded-lg bg-slate-50 px-2 py-1.5'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-amber-600' />
                        Can cai thien
                      </div>
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {(cvAnalysis.insights?.weaknesses || []).slice(0, 4).map((item, index) => (
                          <li key={`weakness-${index}`} className='rounded-lg bg-slate-50 px-2 py-1.5'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {Array.isArray(cvAnalysis.matched_jobs) && cvAnalysis.matched_jobs.length > 0 ? (
                    <div className='space-y-2'>
                      <div className='inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Briefcase className='h-4 w-4 text-indigo-600' />
                        Job phu hop
                      </div>
                      {cvAnalysis.matched_jobs.slice(0, 3).map((job, index) => (
                        <div
                          key={`${job.job_id || index}-${job.job_title}`}
                          className='rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'
                        >
                          <div className='flex items-start justify-between gap-3'>
                            <div className='min-w-0'>
                              <p className='line-clamp-2 text-sm font-semibold text-slate-900'>{job.job_title}</p>
                              <p className='mt-1 text-xs text-slate-500'>{job.company_name}</p>
                            </div>
                            <span className='shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700'>
                              {Math.round(Number(job.match_score || 0) * 100)}%
                            </span>
                          </div>
                          <div className='mt-2 flex flex-wrap gap-2 text-xs text-slate-600'>
                            <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1'>
                              <MapPin className='h-3.5 w-3.5' />
                              {sanitizeField(job.work_location)}
                            </span>
                            <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1'>
                              <Wallet className='h-3.5 w-3.5' />
                              {sanitizeField(job.salary)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {Array.isArray(cvAnalysis.learning_suggestions) && cvAnalysis.learning_suggestions.length > 0 ? (
                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-violet-600' />
                        Nen hoc tiep theo
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {cvAnalysis.learning_suggestions.slice(0, 6).map((item, index) => (
                          <span
                            key={`${item.skill}-${index}`}
                            className='rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700'
                          >
                            {item.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {hasCvJdMatch && cvJdMatch ? (
                <div className='mt-3 space-y-3 border-t border-slate-200 pt-3'>
                  <div className='rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-3'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>
                          {cvJdMatch.job_title || 'Danh gia CV voi job description'}
                        </p>
                        <p className='mt-1 text-xs text-slate-600'>{cvJdMatch.summary}</p>
                      </div>
                      <div className='rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700'>
                        {cvJdMatch.overall_score}% - {cvJdMatch.match_level}
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-2 md:grid-cols-2 xl:grid-cols-3'>
                    {[
                      { label: 'Ky nang', value: cvJdMatch.score_details.skills_score },
                      { label: 'Kinh nghiem', value: cvJdMatch.score_details.experience_score },
                      { label: 'Cong nghe', value: cvJdMatch.score_details.technology_score },
                      { label: 'Hoc van', value: cvJdMatch.score_details.education_score },
                      { label: 'Trach nhiem', value: cvJdMatch.score_details.responsibility_score }
                    ].map((item) => (
                      <div key={item.label} className='rounded-2xl border border-slate-200 bg-white p-3'>
                        <p className='text-xs font-medium text-slate-500'>{item.label}</p>
                        <p className='mt-1 text-lg font-semibold text-slate-900'>{item.value}/100</p>
                      </div>
                    ))}
                  </div>

                  <div className='grid gap-2 md:grid-cols-2'>
                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-emerald-600' />
                        Diem hop
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {(cvJdMatch.matched_keywords || []).slice(0, 10).map((item, index) => (
                          <span key={`${item}-${index}`} className='rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-amber-600' />
                        Can bo sung
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {(cvJdMatch.missing_keywords || []).slice(0, 10).map((item, index) => (
                          <span key={`${item}-${index}`} className='rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700'>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-2 md:grid-cols-2'>
                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <GraduationCap className='h-4 w-4 text-emerald-600' />
                        Diem manh
                      </div>
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {(cvJdMatch.strengths || []).slice(0, 4).map((item, index) => (
                          <li key={`cv-jd-strength-${index}`} className='rounded-lg bg-slate-50 px-2 py-1.5'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-rose-600' />
                        Diem yeu
                      </div>
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {(cvJdMatch.weaknesses || []).slice(0, 4).map((item, index) => (
                          <li key={`cv-jd-weakness-${index}`} className='rounded-lg bg-slate-50 px-2 py-1.5'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {Array.isArray(cvJdMatch.recommendations) && cvJdMatch.recommendations.length > 0 ? (
                    <div className='rounded-2xl border border-slate-200 bg-white p-3'>
                      <div className='mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                        <Sparkles className='h-4 w-4 text-violet-600' />
                        Can cai thien
                      </div>
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {cvJdMatch.recommendations.slice(0, 5).map((item, index) => (
                          <li key={`cv-jd-rec-${index}`} className='rounded-lg bg-slate-50 px-2 py-1.5'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {hasJobResults && (
                <div className='mt-3 space-y-2 border-t border-slate-200 pt-3'>
                  <div className='flex items-center gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-3 py-2.5 text-sm font-medium text-indigo-700'>
                    <Search className='h-4 w-4' />
                    <span>
                      {jobResultsSummary || `Toi tim duoc ${totalJobsFound} cong viec phu hop.`}
                    </span>
                  </div>

                  {visibleJobs.map((job, index) => (
                    <div
                      key={`${job.id || index}-${job.title || 'job'}`}
                      className='rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
                          <span className='text-xs font-semibold'>{index + 1}</span>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='line-clamp-2 text-sm font-semibold text-slate-900'>
                            {sanitizeField(job.title)}
                          </p>
                          <p className='mt-1 text-xs font-medium text-slate-500'>{sanitizeField(job.company)}</p>
                          <div className='mt-2 flex flex-wrap gap-2 text-xs text-slate-600'>
                            <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1'>
                              <MapPin className='h-3.5 w-3.5' />
                              {sanitizeField(job.location)}
                            </span>
                            <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1'>
                              <Wallet className='h-3.5 w-3.5' />
                              {sanitizeField(job.salary)}
                            </span>
                            {job.jobType ? (
                              <span className='inline-flex items-center rounded-full bg-slate-100 px-2 py-1'>
                                {job.jobType}
                              </span>
                            ) : null}
                            {typeof job.score === 'number' ? (
                              <span className='inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-emerald-700'>
                                Do phu hop {(job.score * 100).toFixed(0)}%
                              </span>
                            ) : null}
                          </div>

                          {getJobDetailHref(job.id, job.url) ? (
                            <div className='mt-3'>
                              {String(getJobDetailHref(job.id, job.url)).startsWith('http') ? (
                                <a
                                  href={String(getJobDetailHref(job.id, job.url))}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800'
                                >
                                  Xem chi tiet
                                  <ChevronRight className='h-3.5 w-3.5' />
                                </a>
                              ) : (
                                <Link
                                  to={String(getJobDetailHref(job.id, job.url))}
                                  className='inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800'
                                >
                                  Xem chi tiet
                                  <ChevronRight className='h-3.5 w-3.5' />
                                </Link>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}

                  {hiddenJobsCount > 0 ? (
                    <p className='text-xs text-slate-500'>Con {hiddenJobsCount} cong viec khac trong ket qua truy xuat.</p>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* Attachments Display */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={cn('mt-3 space-y-2 border-t', isUser ? 'border-purple-500 pt-3' : 'border-slate-300 pt-3')}>
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-2',
                    isUser ? 'bg-purple-500' : 'bg-white dark:bg-slate-200/10'
                  )}
                >
                  <FileText className='h-4 w-4 flex-shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-medium'>{attachment.name}</p>
                    <p className='text-xs opacity-75'>{formatFileSize(attachment.size)}</p>
                  </div>
                  {attachment.url && (
                    <a
                      href={attachment.url}
                      download
                      className={cn(
                        'flex-shrink-0 rounded px-2 py-1 text-xs font-semibold',
                        isUser
                          ? 'bg-white text-purple-600 hover:bg-purple-100'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      )}
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessageBubble
