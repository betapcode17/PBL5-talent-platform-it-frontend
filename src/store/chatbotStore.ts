// chatStore.ts
// useChat.ts
import { create } from 'zustand'

import type { ChatMessage, Conversation } from '@/@types/chatbot'

import {
  sendMessageApi,
  getConversationsApi,
  getMessagesApi,
  deleteConversationApi,
  createConversationApi,
  renameConversationApi,
  analyzeCvApi
} from '@/api/chatbot'
import type { ChatMode, CVFileAnalysisResponse } from '@/@types/chatbot'

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | number | null
  pendingConversationId: string | number | null
  messages: ChatMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isSending: boolean
  deletingConversationId: string | null
  isWidgetOpen: boolean
  isFullScreen: boolean
  chatMode: ChatMode
  error: string | null
  setWidgetOpen: (open: boolean) => void
  toggleWidget: () => void
  setFullScreen: (full: boolean) => void
  setChatMode: (mode: ChatMode) => void
  setActiveConversation: (id: string | number | null) => Promise<void>
  getConversations: () => Promise<void>
  getMessages: (conversationId: string | number) => Promise<void>
  sendMessage: (message: string, conversationId?: string | number) => Promise<void>
  createConversation: () => Promise<void>
  deleteConversation: (id: string | number) => Promise<void>
  renameConversation: (id: string, newTitle: string) => Promise<void>
  clearError: () => void
  analyzeCv: (file: File) => Promise<void>
}

const normalizeConversations = (conversations: Conversation[]) =>
  [...conversations].sort(
    (a, b) => new Date(b.updateAt || b.createdAt).getTime() - new Date(a.updateAt || a.createdAt).getTime()
  )

const upsertConversation = (conversations: Conversation[], nextConversation: Conversation) => {
  const filtered = conversations.filter((conversation) => String(conversation.id) !== String(nextConversation.id))
  return normalizeConversations([nextConversation, ...filtered])
}

const buildConversationPreview = (
  conversations: Conversation[],
  conversationId: string | number,
  userMessage: string,
  assistantMessage?: string
): Conversation[] => {
  const now = new Date()
  const existing = conversations.find((conversation) => String(conversation.id) === String(conversationId))
  const previewText = assistantMessage?.trim() || userMessage.trim()
  const title = existing?.title?.trim() || userMessage.trim().slice(0, 50) || 'Cuoc tro chuyen moi'

  return upsertConversation(conversations, {
    id: conversationId,
    title,
    lastMessage: previewText,
    createdAt: existing?.createdAt || now,
    updateAt: now
  })
}

const formatCvAnalysisMessage = (result: CVFileAnalysisResponse) => {
  const strengths = result.insights.strengths?.length ? result.insights.strengths : ['Chua co du lieu du de ket luan']
  const weaknesses = result.insights.weaknesses?.length
    ? result.insights.weaknesses
    : ['Chua co du lieu du de ket luan']

  const matchedJobs = result.matched_jobs.length
    ? result.matched_jobs
        .map((job, index) => {
          const matchedSkills = job.matched_skills.length ? job.matched_skills.join(', ') : 'Chua khop ro'
          const missingSkills = job.missing_skills.length ? job.missing_skills.join(', ') : 'Khong dang ke'

          return `${index + 1}. **${job.job_title}** - ${job.company_name} (${Math.round(job.match_score * 100)}%)\n   - Khop: ${matchedSkills}\n   - Can hoc them: ${missingSkills}`
        })
        .join('\n')
    : 'Chua tim thay job phu hop ro rang.'

  const learningSuggestions = result.learning_suggestions.length
    ? result.learning_suggestions
        .map((item, index) => {
          const examples = item.example_jobs.length ? `Vi du: ${item.example_jobs.join(', ')}` : 'Chua co vi du cu the'
          return `${index + 1}. **${item.skill}** (${item.priority})\n   - ${item.reason}\n   - ${examples}`
        })
        .join('\n')
    : 'CV hien chua co gap hoc tap ro rang tu job data.'

  const summary = result.market_summary as Record<string, unknown>
  const topSkills = Array.isArray(summary.most_requested_skills)
    ? (summary.most_requested_skills as Array<{ skill?: string; count?: number }>)
        .map((item) => `- ${item.skill || 'unknown'}: ${item.count || 0}`)
        .join('\n')
    : '- Chua co du lieu'

  return [
    `## Phan tich CV: ${result.filename}`,
    `**Diem chat luong:** ${result.insights.quality_score.toFixed(1)}/10`,
    `**Tong quan phu hop thi truong:** ${String(result.insights.market_fit?.experience_level || 'Unknown')}`,
    '',
    '### Diem manh',
    ...strengths.map((item) => `- ${item}`),
    '',
    '### Diem yeu / can cai thien',
    ...weaknesses.map((item) => `- ${item}`),
    '',
    '### Job phu hop',
    matchedJobs,
    '',
    '### Nen hoc gi tiep theo',
    learningSuggestions,
    '',
    '### Ky nang duoc thi truong nhac den nhieu',
    topSkills
  ]
    .filter(Boolean)
    .join('\n')
}

export const useChatbotStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  pendingConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  deletingConversationId: null,
  isWidgetOpen: false,
  isFullScreen: false,
  chatMode: 'jobs',
  error: null,

  setWidgetOpen: (open) => set({ isWidgetOpen: open }),
  toggleWidget: () => set((s) => ({ isWidgetOpen: !s.isWidgetOpen })),
  setFullScreen: (full) => set({ isFullScreen: full }),
  setChatMode: (mode) => set({ chatMode: mode }),

  setActiveConversation: async (id) => {
    const { activeConversationId, pendingConversationId } = get()

    if (id === null) {
      set({ activeConversationId: null, pendingConversationId: null, messages: [], error: null })
      return
    }

    if (id === activeConversationId || id === pendingConversationId) {
      return
    }

    set({ pendingConversationId: id, isLoadingMessages: true, error: null })

    try {
      const messages = await getMessagesApi(id)
      set({ activeConversationId: id, pendingConversationId: null, messages })
    } catch {
      set({ error: 'Failed to load messages', pendingConversationId: null })
    } finally {
      set({ isLoadingMessages: false })
    }
  },

  getConversations: async () => {
    set({ isLoadingConversations: true, error: null })
    try {
      const conversations = await getConversationsApi()
      set({
        conversations: normalizeConversations(Array.isArray(conversations) ? conversations : [conversations])
      })
    } catch {
      set({ error: 'Failed to load chat history' })
    } finally {
      set({ isLoadingConversations: false })
    }
  },

  getMessages: async (conversationId) => {
    set({ isLoadingMessages: true, error: null })
    try {
      const messages = await getMessagesApi(conversationId)
      set({ messages, activeConversationId: conversationId, pendingConversationId: null })
    } catch {
      set({ error: 'Failed to load messages' })
    } finally {
      set({ isLoadingMessages: false })
    }
  },

  sendMessage: async (message: string, conversationId?: string | number) => {
    const { activeConversationId, messages, conversations } = get()
    const targetConvId = conversationId ?? activeConversationId

    const tempId = -Date.now()
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: message,
      createdAt: new Date(),
      conversationId: (targetConvId ?? '') as string | number
    }

    set({ messages: [...messages, tempUserMsg], isSending: true, error: null })

    try {
      const res = await sendMessageApi({
        conversationId: targetConvId ?? undefined,
        message
      })

      const resolvedConversationId = res.conversationId
      const assistantContent = typeof res.message?.content === 'string' ? res.message.content : ''

      set({ activeConversationId: resolvedConversationId })
      set((s) => ({
        conversations: buildConversationPreview(
          s.conversations.length ? s.conversations : conversations,
          resolvedConversationId,
          message,
          assistantContent
        ),
        messages: [
          ...s.messages.filter((m) => m.id !== tempId),
          { ...tempUserMsg, conversationId: resolvedConversationId },
          res.message
        ]
      }))
      void get().getConversations()
    } catch {
      set({ error: 'Failed to send message. Please try again.' })
    } finally {
      set({ isSending: false })
    }
  },

  createConversation: async () => {
    try {
      const conversation = await createConversationApi()
      set((s) => ({
        activeConversationId: conversation.id,
        pendingConversationId: null,
        messages: [],
        conversations: upsertConversation(s.conversations, conversation)
      }))
    } catch {
      set({ error: 'Failed to create new conversation' })
    }
  },

  deleteConversation: async (id) => {
    set({ deletingConversationId: String(id), error: null })
    try {
      await deleteConversationApi(id)
      set((s) => ({
        conversations: s.conversations.filter((c) => c.id !== id),
        deletingConversationId: null,
        ...(s.activeConversationId === id || s.pendingConversationId === id
          ? { activeConversationId: null, pendingConversationId: null, messages: [] }
          : {})
      }))
    } catch (err) {
      set({
        deletingConversationId: null,
        error: `Khong the xoa doan chat: ${err instanceof Error ? err.message : 'Unknown error'}`
      })
    }
  },

  renameConversation: async (id, newTitle) => {
    try {
      const result = await renameConversationApi(id, newTitle)
      set((s) => ({
        conversations: s.conversations.map((c) =>
          String(c.id) === String(id) ? { ...c, title: result.newTitle, updateAt: result.updatedAt } : c
        )
      }))
    } catch {
      set({ error: 'Failed to rename conversation' })
    }
  },

  analyzeCv: async (file) => {
    const { messages } = get()
    const tempId = `cv-upload-${Date.now()}`
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: `Da tai len CV: ${file.name}`,
      attachments: [
        {
          name: file.name,
          size: file.size,
          type: file.type
        }
      ],
      conversationId: '',
      createdAt: new Date()
    }

    set({ messages: [...messages, tempUserMsg], isSending: true, error: null })

    try {
      const result = await analyzeCvApi(file)
      const assistantMessage: ChatMessage = {
        id: `cv-analysis-${result.cv_id}-${Date.now()}`,
        role: 'assistant',
        content: formatCvAnalysisMessage(result),
        conversationId: '',
        createdAt: new Date()
      }

      set((state) => ({
        messages: state.messages.filter((message) => message.id !== tempId).concat(assistantMessage)
      }))
    } catch {
      set({ error: 'Failed to analyze CV. Please try again.' })
    } finally {
      set({ isSending: false })
    }
  },

  clearError: () => set({ error: null })
}))
