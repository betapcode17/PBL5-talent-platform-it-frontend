export interface FileAttachment {
  id?: string
  name: string
  size: number
  type: string
  url?: string
}

export interface ChatMessage {
  id?: string | number
  conversationId: string | number
  role: 'user' | 'assistant'
  content: string
  attachments?: FileAttachment[]
  createdAt: Date | string
  sources?: ChatbotSource[]
  detectedIntent?: string | null
  jobResults?: ChatbotJobResult[]
  jobResultsTotal?: number | null
  retrieval?: ChatbotRetrievalSummary | null
  meta?: ChatbotResponseMeta | null
  responseMode?: string | null
}

export interface Conversation {
  id: string | number
  title: string
  lastMessage: string
  createdAt: Date
  updateAt: Date
}

export interface SendMessageRequest {
  conversationId?: string | number
  message: string
}

export interface ChatbotSource {
  entityType?: string | null
  sourceId?: string | number | null
  title?: string | null
  company?: string | null
  url?: string | null
}

export interface ChatbotJobResult {
  id?: string | number | null
  title?: string | null
  company?: string | null
  location?: string | null
  salary?: string | null
  skills?: string[]
  requirements?: string | null
  description?: string | null
  jobType?: string | null
  score?: number | null
  url?: string | null
}

export interface ChatbotResponseData {
  intent?: string | null
  jobs?: ChatbotJobResult[]
  total?: number | null
  totalJobsFound?: number | null
}

export interface ChatbotStructuredResponse {
  type?: string | null
  items?: ChatbotJobResult[]
  total?: number | null
}

export interface ChatbotRetrievalSummary {
  profile?: string | null
  topScore?: number | null
  count?: number | null
  fallbackTriggered?: boolean
}

export interface ChatbotResponseMeta {
  latencyMs?: number | null
  retrieval?: {
    latencyMs?: number | null
    rerankLatencyMs?: number | null
    contextPackingLatencyMs?: number | null
  } | null
  generation?: {
    model?: string | null
    latencyMs?: number | null
    promptTokens?: number | null
    completionTokens?: number | null
  } | null
}

export interface SendMessageResponse {
  success?: boolean
  version?: string
  message: ChatMessage
  conversationId: string | number
  data?: ChatbotResponseData | null
  structured?: ChatbotStructuredResponse | null
  retrieval?: ChatbotRetrievalSummary | null
  meta?: ChatbotResponseMeta | null
  rag?: unknown
  responseMode?: string | null
}

export interface CVJobMatchInsight {
  job_id?: number | null
  job_title: string
  company_name: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  why_match?: string | null
  salary?: string | null
  work_location?: string | null
  work_type?: string | null
}

export interface LearningRecommendation {
  skill: string
  reason: string
  related_jobs_count: number
  example_jobs: string[]
  priority: 'high' | 'medium' | 'low' | string
}

export interface CVFileAnalysisResponse {
  cv_id: number
  filename: string
  insights: {
    cv_id: number
    quality_score: number
    completeness: Record<string, unknown>
    market_fit: Record<string, unknown>
    strengths: string[]
    weaknesses: string[]
    last_analyzed?: string | null
  }
  matched_jobs: CVJobMatchInsight[]
  learning_suggestions: LearningRecommendation[]
  market_summary: Record<string, unknown>
}

export type ChatMode = 'jobs' | 'cv'
