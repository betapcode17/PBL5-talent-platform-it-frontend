import { aiAxiosInstance } from './axiosInstance'

import type {
  ChatMessage,
  Conversation,
  SendMessageRequest,
  CVFileAnalysisResponse,
  SendMessageResponse,
  ChatbotJobResult
} from '@/@types/chatbot'

const normalizeJobResults = (jobs: ChatbotJobResult[] | undefined | null): ChatbotJobResult[] => {
  if (!Array.isArray(jobs)) return []

  return jobs.filter(Boolean).map((job) => ({
    ...job,
    skills: Array.isArray(job.skills) ? job.skills.filter(Boolean) : []
  }))
}

const buildJobResultsFromSources = (message: Pick<ChatMessage, 'sources' | 'detectedIntent'>): ChatbotJobResult[] => {
  if (!Array.isArray(message.sources) || !message.sources.length) return []
  if (message.detectedIntent && !String(message.detectedIntent).includes('job')) return []

  return message.sources
    .filter((source) => source && (!source.entityType || source.entityType === 'job'))
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

export const createConversationApi = async (): Promise<Conversation> => {
  const res = await aiAxiosInstance.post('/chatbot/conversation')
  return res.data
}

export const analyzeCvApi = async (file: File, topK = 5): Promise<CVFileAnalysisResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await aiAxiosInstance.post(`/cv/analyze?top_k=${topK}`, formData)
  return res.data
}
