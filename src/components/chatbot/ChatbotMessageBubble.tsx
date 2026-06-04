import type { ChatMessage } from '@/@types/chatbot'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { ChevronRight, FileText, MapPin, Search, Wallet } from 'lucide-react'

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

const stripSearchSummaryHeading = (content: string) => {
  const normalized = String(content || '').trim()
  if (!normalized) return normalized

  const lines = normalized.split('\n')
  if (!lines.length) return normalized

  const [firstLine, ...rest] = lines
  if (/^Tim thay\s+\d+\s+cong viec phu hop\./i.test(firstLine.trim())) {
    return rest.join('\n').trim()
  }

  return normalized
}

const compactAssistantContent = (content: string, hasJobResults: boolean) => {
  if (!hasJobResults) return content

  const normalized = stripSearchSummaryHeading(content)
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const compactLines = lines.filter(
    (line) =>
      line.startsWith('- **Tom tat:**') ||
      line.startsWith('- **Buoc tiep theo:**') ||
      (!line.startsWith('- **Ky nang:**') &&
        !line.startsWith('- **Muc luong:**') &&
        !line.startsWith('- **Dia diem:**') &&
        !line.startsWith('- **Yeu cau noi bat:**') &&
        !line.startsWith('- **Buoc tiep theo:**') &&
        !line.startsWith('- **Tom tat:**'))
  )

  return compactLines.join('\n\n').trim()
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
  const hasJobResults = jobResults.length > 0
  const totalJobsFound = !isUser ? Math.max(Number(message.jobResultsTotal || 0), jobResults.length) : 0
  const assistantContent = !isUser ? compactAssistantContent(rawAssistantContent, hasJobResults) : ''
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
        <div className={cn('min-w-0 break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed', isUser ? 'rounded-br-md bg-purple-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700')}>
          {isUser ? (
            <span className='whitespace-pre-wrap break-words'>{message.content}</span>
          ) : (
            <>
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

              {hasJobResults && (
                <div className='mt-3 space-y-2 border-t border-slate-200 pt-3'>
                  <div className='flex items-center gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-3 py-2.5 text-sm font-medium text-indigo-700'>
                    <Search className='h-4 w-4' />
                    <span>
                      Tim thay <strong>{totalJobsFound}</strong> cong viec phu hop
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
                    isUser ? 'bg-purple-500' : 'bg-white'
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
                        isUser ? 'bg-white text-purple-600 hover:bg-purple-100' : 'bg-purple-600 text-white hover:bg-purple-700'
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
