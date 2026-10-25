import type { ChatMessage, ChatbotJobResult } from '@/@types/chatbot'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Briefcase,
  ChevronRight,
  FileText,
  GraduationCap,
  MapPin,
  Sparkles,
  Wallet,
  Bookmark,
  CheckCircle2,
  Bot,
  Building2,
  Wrench,
  ExternalLink
} from 'lucide-react'
import { useChatbotStore } from '@/store/chatbotStore'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

const SUB_AGENT_CONFIG: Record<string, { labelKey: string; color: string; icon: typeof Bot }> = {
  JobSearchAgent: {
    labelKey: 'chatbot.agentJobSearch',
    color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: Briefcase
  },
  CvCareerAgent: {
    labelKey: 'chatbot.agentCvCareer',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: GraduationCap
  },
  SystemActionAgent: {
    labelKey: 'chatbot.agentSystemAction',
    color: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: CheckCircle2
  },
  SystemQaAgent: {
    labelKey: 'chatbot.agentSystemQa',
    color: 'bg-violet-50 text-violet-700 border-violet-200/60',
    icon: Bot
  },
  MasterOrchestrator: {
    labelKey: 'chatbot.agentOrchestrator',
    color: 'bg-purple-50 text-purple-700 border-purple-200/60',
    icon: Bot
  }
}

const isCvAnalysisMessage = (message: ChatMessage) =>
  message.messageType === 'cv_analysis' || message.detectedIntent === 'cv_analysis' || !!message.cvAnalysis

const isCvJdMatchMessage = (message: ChatMessage) =>
  message.messageType === 'cv_jd_match' || message.detectedIntent === 'cv_jd_match' || !!message.cvJdMatch

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const { t } = useTranslation()
  const isUser = message.role === 'user'
  const { sendMessage, isSending } = useChatbotStore()

  const sanitizeField = (value?: string | null) => {
    const normalized = String(value || '').trim()
    if (!normalized) return t('chatbot.noInfo')
    return normalized
  }

  const jobResults: ChatbotJobResult[] = !isUser && Array.isArray(message.jobResults) ? message.jobResults : []
  const cvAnalysis = !isUser ? message.cvAnalysis : null
  const cvJdMatch = !isUser ? message.cvJdMatch : null
  const hasCvAnalysis = !isUser && isCvAnalysisMessage(message) && !!cvAnalysis
  const hasCvJdMatch = !isUser && isCvJdMatchMessage(message) && !!cvJdMatch
  const hasJobResults = jobResults.length > 0
  const totalJobsFound = !isUser ? Math.max(Number(message.jobResultsTotal || 0), jobResults.length) : 0

  const subAgentInfo =
    message.subAgent && SUB_AGENT_CONFIG[message.subAgent]
      ? {
          label: t(SUB_AGENT_CONFIG[message.subAgent].labelKey),
          color: SUB_AGENT_CONFIG[message.subAgent].color,
          icon: SUB_AGENT_CONFIG[message.subAgent].icon
        }
      : {
          label: t('chatbot.agentOrchestrator'),
          color: 'bg-violet-50 text-violet-700 border-violet-200/60',
          icon: Bot
        }

  const SubAgentIcon = subAgentInfo.icon

  const handleQuickApply = (job: ChatbotJobResult) => {
    if (isSending) return
    const title = job.title || 'Job'
    const id = job.id ? t('chatbot.jobCode', { id: job.id }) : ''
    sendMessage(t('chatbot.quickApplyPrompt', { title, id }))
  }

  const handleQuickSave = (job: ChatbotJobResult) => {
    if (isSending) return
    const title = job.title || 'Job'
    const id = job.id ? t('chatbot.jobCode', { id: job.id }) : ''
    sendMessage(t('chatbot.quickSavePrompt', { title, id }))
  }

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[88%] items-start gap-2.5 sm:max-w-[82%]', isUser && 'flex-row-reverse')}>
        {/* Avatar */}
        {!isUser ? (
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm ring-2 ring-violet-100'>
            <Bot className='h-4 w-4' />
          </div>
        ) : null}

        {/* Message Container */}
        <div className='min-w-0 flex-1 space-y-2'>
          {/* Sub-Agent header indicator for bot */}
          {!isUser && (
            <div className='flex flex-wrap items-center gap-1.5 px-0.5 text-[11px]'>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium transition-all',
                  subAgentInfo.color
                )}
              >
                <SubAgentIcon className='h-3 w-3' />
                {subAgentInfo.label}
              </span>

              {message.toolCalls && message.toolCalls.length > 0 ? (
                <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-600'>
                  <Wrench className='h-2.5 w-2.5 text-slate-400' />
                  {t('chatbot.systemToolExecuted')}
                </span>
              ) : null}
            </div>
          )}

          {/* Main Bubble */}
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all',
              isUser
                ? 'rounded-tr-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/10'
                : 'rounded-tl-sm border border-slate-200/90 bg-white text-slate-800'
            )}
          >
            {isUser ? (
              <p className='whitespace-pre-wrap break-words font-normal'>{message.content}</p>
            ) : (
              <div className='space-y-3'>
                {/* Assistant Text Markdown */}
                {message.content ? (
                  <div className='prose prose-sm max-w-none text-slate-800 leading-relaxed break-words'>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className='mb-2.5 last:mb-0 leading-relaxed'>{children}</p>,
                        strong: ({ children }) => <strong className='font-semibold text-slate-900'>{children}</strong>,
                        ol: ({ children }) => <ol className='mb-2.5 list-decimal pl-5 space-y-1'>{children}</ol>,
                        ul: ({ children }) => <ul className='mb-2.5 list-disc pl-5 space-y-1'>{children}</ul>,
                        li: ({ children }) => <li className='leading-relaxed'>{children}</li>,
                        h1: ({ children }) => (
                          <h1 className='mb-2 mt-3 text-base font-bold text-slate-900 first:mt-0'>{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className='mb-2 mt-3 text-sm font-bold text-slate-900 first:mt-0'>{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className='mb-1.5 mt-2.5 text-sm font-semibold text-violet-900 first:mt-0'>{children}</h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className='my-2 border-l-2 border-violet-400 bg-violet-50/50 pl-3 py-1 italic text-slate-700 rounded-r'>
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className='rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-violet-700'>
                            {children}
                          </code>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-0.5 text-violet-600 underline font-medium hover:text-violet-800'
                          >
                            {children}
                            <ExternalLink className='h-3 w-3 inline' />
                          </a>
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>

                    {/* Streaming blinking cursor */}
                    {message.isStreaming && (
                      <span className='inline-block h-3.5 w-1.5 ml-1 translate-y-0.5 bg-violet-600 animate-pulse rounded' />
                    )}
                  </div>
                ) : message.isStreaming ? (
                  <div className='flex items-center gap-2 py-1 text-xs text-slate-500'>
                    <span className='h-2 w-2 rounded-full bg-violet-500 animate-ping' />
                    <span>{t('chatbot.aiGenerating')}</span>
                  </div>
                ) : null}

                {/* CV Analysis Structured Card */}
                {hasCvAnalysis && cvAnalysis && (
                  <div className='mt-3 space-y-3 border-t border-slate-100 pt-3'>
                    <div className='rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white p-3.5 shadow-xs'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='text-sm font-bold text-slate-900 flex items-center gap-1.5'>
                            <FileText className='h-4 w-4 text-emerald-600' />
                            {cvAnalysis.filename || t('chatbot.cvReport')}
                          </p>
                          <p className='mt-1 text-xs text-slate-600'>
                            {t('chatbot.cvScore')}{' '}
                            <span className='font-bold text-emerald-700 text-sm'>
                              {Number(cvAnalysis.insights?.quality_score || 0).toFixed(1)}/10
                            </span>
                          </p>
                        </div>
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800'>
                          <Sparkles className='h-3 w-3' />
                          {t('chatbot.cvReport')}
                        </span>
                      </div>
                    </div>

                    <div className='grid gap-2.5 sm:grid-cols-2'>
                      <div className='rounded-xl border border-slate-200/80 bg-slate-50/50 p-3'>
                        <div className='mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800'>
                          <GraduationCap className='h-3.5 w-3.5 text-emerald-600' />
                          {t('chatbot.strengths')}
                        </div>
                        <ul className='space-y-1.5 text-xs text-slate-600'>
                          {(cvAnalysis.insights?.strengths || []).slice(0, 4).map((item, index) => (
                            <li key={`str-${index}`} className='flex items-start gap-1.5'>
                              <span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500' />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className='rounded-xl border border-slate-200/80 bg-slate-50/50 p-3'>
                        <div className='mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-800'>
                          <Sparkles className='h-3.5 w-3.5 text-amber-600' />
                          {t('chatbot.weaknesses')}
                        </div>
                        <ul className='space-y-1.5 text-xs text-slate-600'>
                          {(cvAnalysis.insights?.weaknesses || []).slice(0, 4).map((item, index) => (
                            <li key={`weak-${index}`} className='flex items-start gap-1.5'>
                              <span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500' />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {Array.isArray(cvAnalysis.learning_suggestions) && cvAnalysis.learning_suggestions.length > 0 && (
                      <div className='rounded-xl border border-violet-100 bg-violet-50/40 p-3'>
                        <p className='mb-2 text-xs font-bold text-violet-900 flex items-center gap-1'>
                          <Sparkles className='h-3.5 w-3.5 text-violet-600' />
                          {t('chatbot.recommendedSkills')}
                        </p>
                        <div className='flex flex-wrap gap-1.5'>
                          {cvAnalysis.learning_suggestions.slice(0, 6).map((item, index) => (
                            <span
                              key={`${item.skill}-${index}`}
                              className='rounded-md border border-violet-200/70 bg-white px-2 py-0.5 text-xs font-medium text-violet-700'
                            >
                              {item.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CV JD Match Structured Card */}
                {hasCvJdMatch && cvJdMatch && (
                  <div className='mt-3 space-y-3 border-t border-slate-100 pt-3'>
                    <div className='rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-3.5 shadow-xs'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='text-sm font-bold text-slate-900'>
                            {cvJdMatch.job_title || t('chatbot.jdMatchTitle')}
                          </p>
                          <p className='mt-1 text-xs text-slate-600 line-clamp-2'>{cvJdMatch.summary}</p>
                        </div>
                        <span className='shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800'>
                          {cvJdMatch.overall_score}% • {cvJdMatch.match_level}
                        </span>
                      </div>
                    </div>

                    <div className='grid gap-2 sm:grid-cols-2'>
                      <div className='rounded-xl border border-slate-200 bg-white p-3'>
                        <p className='mb-2 text-xs font-bold text-emerald-700'>{t('chatbot.matchedSkills')}</p>
                        <div className='flex flex-wrap gap-1'>
                          {(cvJdMatch.matched_keywords || []).slice(0, 6).map((kw, idx) => (
                            <span
                              key={idx}
                              className='rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700'
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className='rounded-xl border border-slate-200 bg-white p-3'>
                        <p className='mb-2 text-xs font-bold text-rose-700'>{t('chatbot.missingSkills')}</p>
                        <div className='flex flex-wrap gap-1'>
                          {(cvJdMatch.missing_keywords || []).slice(0, 6).map((kw, idx) => (
                            <span
                              key={idx}
                              className='rounded bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-700'
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Results Interactive Cards */}
                {hasJobResults && (
                  <div className='mt-3 space-y-2.5 border-t border-slate-100 pt-3'>
                    <div className='flex items-center justify-between text-xs font-semibold text-slate-600 px-0.5'>
                      <span className='flex items-center gap-1.5'>
                        <Briefcase className='h-3.5 w-3.5 text-violet-600' />
                        {message.jobResultsSummary || t('chatbot.foundJobsCount', { count: totalJobsFound })}
                      </span>
                      <span className='text-slate-400 font-normal'>{t('chatbot.showingJobsCount', { count: jobResults.length })}</span>
                    </div>

                    <div className='grid gap-2.5'>
                      {jobResults.map((job, index) => {
                        const detailHref = getJobDetailHref(job.id, job.url)
                        const isExternal = detailHref?.startsWith('http')

                        return (
                          <div
                            key={`${job.id || index}-${job.title || 'job'}`}
                            className='group rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all hover:border-violet-300 hover:shadow-md'
                          >
                            <div className='flex items-start gap-3'>
                              <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-700 ring-1 ring-violet-200/60'>
                                <Building2 className='h-4 w-4' />
                              </div>

                              <div className='min-w-0 flex-1'>
                                <div className='flex items-start justify-between gap-2'>
                                  <h4 className='font-semibold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-1 text-sm'>
                                    {sanitizeField(job.title)}
                                  </h4>
                                </div>

                                <p className='text-xs font-medium text-slate-500 mt-0.5'>{sanitizeField(job.company)}</p>

                                <div className='mt-2 flex flex-wrap items-center gap-2 text-xs'>
                                  <span className='inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 border border-emerald-200/60'>
                                    <Wallet className='h-3 w-3' />
                                    {sanitizeField(job.salary)}
                                  </span>

                                  <span className='inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600'>
                                    <MapPin className='h-3 w-3 text-slate-400' />
                                    {sanitizeField(job.location)}
                                  </span>

                                  {job.jobType ? (
                                    <span className='rounded-md bg-slate-100 px-2 py-0.5 text-slate-600'>
                                      {job.jobType}
                                    </span>
                                  ) : null}
                                </div>

                                {Array.isArray(job.skills) && job.skills.length > 0 ? (
                                  <div className='mt-2 flex flex-wrap gap-1'>
                                    {job.skills.slice(0, 4).map((skill, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className='rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-700'
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}

                                {/* Action Buttons */}
                                <div className='mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100'>
                                  {detailHref ? (
                                    isExternal ? (
                                      <a
                                        href={detailHref}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700'
                                      >
                                        {t('chatbot.viewDetails')}
                                        <ChevronRight className='h-3 w-3' />
                                      </a>
                                    ) : (
                                      <Link
                                        to={detailHref}
                                        className='inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700'
                                      >
                                        {t('chatbot.viewDetails')}
                                        <ChevronRight className='h-3 w-3' />
                                      </Link>
                                    )
                                  ) : null}

                                  <button
                                    type='button'
                                    onClick={() => handleQuickApply(job)}
                                    disabled={isSending}
                                    className='inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-50'
                                    title={t('chatbot.applyViaAi')}
                                  >
                                    <CheckCircle2 className='h-3 w-3' />
                                    {t('chatbot.applyViaAi')}
                                  </button>

                                  <button
                                    type='button'
                                    onClick={() => handleQuickSave(job)}
                                    disabled={isSending}
                                    className='inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50'
                                    title={t('chatbot.saveJob')}
                                  >
                                    <Bookmark className='h-3 w-3' />
                                    {t('chatbot.saveJob')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attachments Display */}
            {message.attachments && message.attachments.length > 0 && (
              <div
                className={cn(
                  'mt-3 space-y-1.5 border-t pt-2.5',
                  isUser ? 'border-white/20' : 'border-slate-200'
                )}
              >
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium',
                      isUser ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-700'
                    )}
                  >
                    <FileText className='h-4 w-4 shrink-0 text-violet-400' />
                    <div className='min-w-0 flex-1 truncate'>
                      <p className='truncate font-semibold'>{attachment.name}</p>
                      <p className='text-[11px] opacity-75'>{formatFileSize(attachment.size)}</p>
                    </div>
                    {attachment.url && (
                      <a
                        href={attachment.url}
                        download
                        className={cn(
                          'shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                          isUser
                            ? 'bg-white text-violet-700 hover:bg-white/90'
                            : 'bg-violet-600 text-white hover:bg-violet-700'
                        )}
                      >
                        {t('chatbot.download')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessageBubble
