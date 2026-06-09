import { aiApiBaseUrl, aiAxiosInstance } from './axiosInstance'

import type {
  ChatMessage,
  Conversation,
  SendMessageRequest,
  CVFileAnalysisResponse,
  CVJDMatchResponse,
  SendMessageResponse,
  ChatbotJobResult,
  ChatStreamHandlers
} from '@/@types/chatbot'

const isActiveFlag = (value: unknown) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) return true
  if (['true', '1', 'yes', 'active'].includes(normalized)) return true
  if (['false', '0', 'no', 'inactive', 'banned', 'disabled', 'blocked'].includes(normalized)) return false
  return true
}

const isDisplayableJobResult = (job: ChatbotJobResult | null | undefined) => {
  if (!job) return false
  const jobActive = isActiveFlag(job.isActive ?? job.is_active ?? job.status)
  const companyActive = isActiveFlag(job.companyIsActive ?? job.company_is_active ?? job.companyStatus)
  return jobActive && companyActive
}

const normalizeJobResults = (jobs: ChatbotJobResult[] | undefined | null): ChatbotJobResult[] => {
  if (!Array.isArray(jobs)) return []

  return jobs
    .filter(isDisplayableJobResult)
    .map((job) => ({
      ...job,
      skills: Array.isArray(job.skills) ? job.skills.filter(Boolean) : []
    }))
}

const buildJobResultsFromSources = (message: Pick<ChatMessage, 'sources' | 'detectedIntent'>): ChatbotJobResult[] => {
  if (!Array.isArray(message.sources) || !message.sources.length) return []
  if (message.detectedIntent && !String(message.detectedIntent).includes('job')) return []

  return message.sources
    .filter(
      (source) =>
        source &&
        (!source.entityType || source.entityType === 'job') &&
        isActiveFlag(source.isActive ?? source.is_active) &&
        isActiveFlag(source.companyIsActive ?? source.company_is_active)
    )
    .map((source) => ({
      id: source.sourceId ?? null,
      title: source.title ?? null,
      company: source.company ?? null,
      location: null,
      salary: null,
      skills: [],
      jobType: null,
      url: source.url ?? null
    }))
}

const inferJobResultsTotalFromContent = (content: string, fallbackCount: number) => {
  const normalized = String(content || '').trim()
  const match = normalized.match(/Tim thay\s+(\d+)\s+cong viec phu hop/i)
  if (match) {
    const parsed = Number(match[1])
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }

  return fallbackCount
}

const buildFallbackAssistantContent = (jobs: ChatbotJobResult[]) => {
  if (!jobs.length) {
    return 'Chua tim thay cong viec phu hop. Hay thu mo rong tu khoa hoac bo sung them yeu cau.'
  }

  const [topJob] = jobs
  const title = topJob?.title?.trim() || 'Cong viec phu hop'
  const company = topJob?.company?.trim() || 'Chua ro cong ty'
  const location = topJob?.location?.trim() || 'Chua co thong tin ro rang'
  const salary = topJob?.salary?.trim() || 'Chua co thong tin ro rang'
  const jobType = topJob?.jobType?.trim() || 'Chua co thong tin ro rang'

  return [
    `Tim thay ${jobs.length} cong viec phu hop. **${title} | ${company}**`,
    '',
    `- Tom tat: Vi tri phu hop nhat hien tai la ${title} tai ${company}.`,
    `- Muc luong: ${salary}`,
    `- Dia diem: ${location}`,
    `- Hinh thuc lam viec: ${jobType}`,
    '- Buoc tiep theo: Hay mo chi tiet cong viec de xem them yeu cau va mo ta cong viec.'
  ].join('\n')
}

const normalizeConversationMessage = (message: ChatMessage): ChatMessage => {
  const directJobResults = normalizeJobResults(message.jobResults)
  const sourceJobResults = buildJobResultsFromSources(message)
  const jobResults = directJobResults.length ? directJobResults : sourceJobResults
  const normalizedSummary =
    typeof message.jobResultsSummary === 'string' && message.jobResultsSummary.trim()
      ? message.jobResultsSummary.trim()
      : inferJobResultsTotalFromContent(String(message?.content || ''), jobResults.length) > 0
        ? `Toi tim duoc ${inferJobResultsTotalFromContent(String(message?.content || ''), jobResults.length)} cong viec phu hop.`
        : null
  const normalizedContent =
    typeof message?.content === 'string' && message.content.trim()
      ? message.content
      : buildFallbackAssistantContent(jobResults)

  return {
    ...message,
    content: normalizedContent,
    createdAt: message?.createdAt || new Date().toISOString(),
    sources: Array.isArray(message?.sources) ? message.sources : [],
    jobResults,
    jobResultsSummary: normalizedSummary,
    jobResultsTotal:
      typeof message.jobResultsTotal === 'number'
        ? message.jobResultsTotal
        : inferJobResultsTotalFromContent(normalizedContent, jobResults.length)
  }
}

const normalizeSendMessageResponse = (payload: SendMessageResponse): SendMessageResponse => {
  const structuredJobs = normalizeJobResults(payload.structured?.items)
  const dataJobs = normalizeJobResults(payload.data?.jobs)
  const jobResults = structuredJobs.length ? structuredJobs : dataJobs
  const jobResultsTotal =
    payload.structured?.total ?? payload.data?.totalJobsFound ?? payload.data?.total ?? jobResults.length
  const jobResultsSummary =
    payload.structured?.summary ??
    payload.data?.jobSearch?.summary ??
    (jobResultsTotal > 0 ? `Toi tim duoc ${jobResultsTotal} cong viec phu hop.` : null)

  const normalizedMessage: ChatMessage = {
    ...payload.message,
    content:
      typeof payload.message?.content === 'string' && payload.message.content.trim()
        ? payload.message.content
        : buildFallbackAssistantContent(jobResults),
    createdAt: payload.message?.createdAt || new Date().toISOString(),
    sources: Array.isArray(payload.message?.sources) ? payload.message.sources : [],
    detectedIntent: payload.message?.detectedIntent ?? payload.data?.intent ?? null,
    jobResults,
    jobResultsTotal,
    jobResultsSummary,
    retrieval: payload.retrieval ?? null,
    meta: payload.meta ?? null,
    responseMode: payload.responseMode ?? null
  }

  return {
    ...payload,
    message: normalizeConversationMessage(normalizedMessage)
  }
}

export const sendMessageApi = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
  const payload: Record<string, string> = {
    message: data.message
  }

  if (data.conversationId !== undefined && data.conversationId !== null && String(data.conversationId).trim()) {
    payload.conversationId = String(data.conversationId)
  }

  const res = await aiAxiosInstance.post<SendMessageResponse>('/chatbot/message', payload)
  return normalizeSendMessageResponse(res.data)
}

export const streamMessageApi = async (
  data: SendMessageRequest,
  handlers: ChatStreamHandlers = {}
): Promise<SendMessageResponse> => {
  const payload: Record<string, string> = { message: data.message }

  if (data.conversationId !== undefined && data.conversationId !== null && String(data.conversationId).trim()) {
    payload.conversationId = String(data.conversationId)
  }

  const response = await fetch(`${aiApiBaseUrl}/chatbot/message/stream`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok || !response.body) {
    throw new Error(`Streaming request failed: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let finalPayload: SendMessageResponse | null = null

  const processEventBlock = (block: string) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    if (!lines.length) return

    const eventLine = lines.find((line) => line.startsWith('event:'))
    const dataLine = lines.find((line) => line.startsWith('data:'))
    if (!eventLine || !dataLine) return

    const eventName = eventLine.slice('event:'.length).trim()
    const rawData = dataLine.slice('data:'.length).trim()
    const parsed = rawData ? JSON.parse(rawData) : null

    if (eventName === 'conversation' && parsed?.conversationId !== undefined) {
      handlers.onConversation?.(parsed.conversationId)
      return
    }
    if (eventName === 'status') {
      handlers.onStatus?.(parsed || {})
      return
    }
    if (eventName === 'chunk' && typeof parsed?.delta === 'string') {
      handlers.onChunk?.(parsed.delta)
      return
    }
    if (eventName === 'error') {
      throw new Error(parsed?.message || 'Streaming response failed')
    }
    if (eventName === 'final' && parsed) {
      finalPayload = normalizeSendMessageResponse(parsed as SendMessageResponse)
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundaryIndex = buffer.indexOf('\n\n')
    while (boundaryIndex >= 0) {
      const block = buffer.slice(0, boundaryIndex)
      buffer = buffer.slice(boundaryIndex + 2)
      processEventBlock(block)
      boundaryIndex = buffer.indexOf('\n\n')
    }
  }

  if (!finalPayload) {
    throw new Error('Stream finished without final payload')
  }

  return finalPayload
}

export const getConversationsApi = async (): Promise<Conversation[]> => {
  const res = await aiAxiosInstance.get('/chatbot/conversation')
  return res.data
}

export const getMessagesApi = async (conversationId: string | number): Promise<ChatMessage[]> => {
  const res = await aiAxiosInstance.get<ChatMessage[]>(`/chatbot/conversation/${conversationId}/message`)
  return Array.isArray(res.data) ? res.data.map(normalizeConversationMessage) : []
}

export const deleteConversationApi = async (conversationId: string | number): Promise<void> => {
  await aiAxiosInstance.delete(`/chatbot/conversation/${conversationId}`)
}

export const renameConversationApi = async (conversationId: string, newTitle: string) => {
  const res = await aiAxiosInstance.post('/chatbot/conversation/rename', {
    conversationId,
    newTitle
  })
  return res.data
}

export const createConversationApi = async (kind?: 'job_chat' | 'cv_analysis'): Promise<Conversation> => {
  const res = await aiAxiosInstance.post('/chatbot/conversation', null, {
    params: kind ? { kind } : undefined
  })
  return res.data
}

export const analyzeCvApi = async (
  file: File,
  topK = 5,
  conversationId?: string | number
): Promise<CVFileAnalysisResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (conversationId !== undefined && conversationId !== null && String(conversationId).trim()) {
    formData.append('conversation_id', String(conversationId))
  }

  const res = await aiAxiosInstance.post(`/cv/analyze?top_k=${topK}`, formData)
  return res.data
}

export const matchCvWithJdApi = async (params: {
  jdText: string
  file?: File
  cvId?: number
  conversationId?: string | number
}): Promise<CVJDMatchResponse> => {
  const formData = new FormData()
  formData.append('jd_text', params.jdText)

  if (params.file) {
    formData.append('file', params.file)
  }
  if (params.cvId !== undefined && params.cvId !== null) {
    formData.append('cv_id', String(params.cvId))
  }
  if (params.conversationId !== undefined && params.conversationId !== null && String(params.conversationId).trim()) {
    formData.append('conversation_id', String(params.conversationId))
  }

  const res = await aiAxiosInstance.post<CVJDMatchResponse>('/cv/match-jd', formData)
  return res.data
}
