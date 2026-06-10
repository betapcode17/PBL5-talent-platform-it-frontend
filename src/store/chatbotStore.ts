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
  analyzeCvApi,
  matchCvWithJdApi
} from '@/api/chatbot'
import type { ChatMode, CVFileAnalysisResponse, CVJDMatchResponse } from '@/@types/chatbot'

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | number | null
  activeConversationIdsByMode: Record<ChatMode, string | number | null>
  pendingConversationId: string | number | null
  messages: ChatMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isSending: boolean
  streamStatus: string | null
  deletingConversationId: string | null
  isWidgetOpen: boolean
  isToggleDismissed: boolean
  isFullScreen: boolean
  chatMode: ChatMode
  error: string | null
  setWidgetOpen: (open: boolean) => void
  setToggleDismissed: (dismissed: boolean) => void
  toggleWidget: () => void
  setFullScreen: (full: boolean) => void
  setChatMode: (mode: ChatMode) => Promise<void>
  setActiveConversation: (id: string | number | null) => Promise<void>
  getConversations: () => Promise<void>
  getMessages: (conversationId: string | number) => Promise<void>
  sendMessage: (message: string, conversationId?: string | number) => Promise<void>
  createConversation: () => Promise<void>
  deleteConversation: (id: string | number) => Promise<void>
  renameConversation: (id: string, newTitle: string) => Promise<void>
  clearError: () => void
  analyzeCv: (file: File, jdText?: string) => Promise<void>
  analyzeCvAgainstJd: (jdText: string) => Promise<void>
}

const normalizeConversations = (conversations: Conversation[]) =>
  [...conversations].sort(
    (a, b) => new Date(b.updateAt || b.createdAt).getTime() - new Date(a.updateAt || a.createdAt).getTime()
  )

const upsertConversation = (conversations: Conversation[], nextConversation: Conversation) => {
  const filtered = conversations.filter((conversation) => String(conversation.id) !== String(nextConversation.id))
  return normalizeConversations([nextConversation, ...filtered])
}

const getConversationMode = (conversation?: Conversation | null): ChatMode =>
  conversation?.conversationType === 'cv_analysis' ? 'cv' : 'jobs'

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

const formatCvJdMatchMessage = (result: CVJDMatchResponse) =>
  [
    `## Danh gia do phu hop CV voi JD: ${result.job_title}`,
    `**Tong diem phu hop:** ${result.overall_score}/100 (${result.match_level})`,
    `**Tom tat:** ${result.summary}`,
    '',
    '### Diem hop',
    ...(result.matched_keywords.length ? result.matched_keywords.map((item) => `- ${item}`) : ['- Chua co thong tin ro rang']),
    '',
    '### Diem thieu',
    ...(result.missing_keywords.length ? result.missing_keywords.map((item) => `- ${item}`) : ['- Chua co thong tin ro rang']),
    '',
    '### Diem manh',
    ...(result.strengths.length ? result.strengths.map((item) => `- ${item}`) : ['- Chua co thong tin ro rang']),
    '',
    '### Diem yeu',
    ...(result.weaknesses.length ? result.weaknesses.map((item) => `- ${item}`) : ['- Chua co thong tin ro rang']),
    '',
    '### Can cai thien',
    ...(result.recommendations.length ? result.recommendations.map((item) => `- ${item}`) : ['- Chua co thong tin ro rang'])
  ].join('\n')

const getLatestCvIdFromMessages = (messages: ChatMessage[]) => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.cvAnalysis?.cv_id) {
      return message.cvAnalysis.cv_id
    }
  }
  return null
}

export const useChatbotStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  activeConversationIdsByMode: { jobs: null, cv: null },
  pendingConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  streamStatus: null,
  deletingConversationId: null,
  isWidgetOpen: false,
  isToggleDismissed: false,
  isFullScreen: false,
  chatMode: 'jobs',
  error: null,

  setWidgetOpen: (open) => set({ isWidgetOpen: open }),
  setToggleDismissed: (dismissed) => set({ isToggleDismissed: dismissed }),
  toggleWidget: () => set((s) => ({ isWidgetOpen: !s.isWidgetOpen })),
  setFullScreen: (full) => set({ isFullScreen: full }),
  setChatMode: async (mode) => {
    const { activeConversationId, activeConversationIdsByMode, conversations } = get()
    if (activeConversationId) {
      set({ chatMode: mode, error: null })
      return
    }
    const nextConversationId = activeConversationIdsByMode[mode]
    const targetConversation = conversations.find((item) => String(item.id) === String(nextConversationId))

    set({ chatMode: mode, error: null })

    if (nextConversationId && targetConversation && getConversationMode(targetConversation) === mode) {
      await get().setActiveConversation(nextConversationId)
      return
    }

    set({ activeConversationId: null, pendingConversationId: null, messages: [] })
  },

  setActiveConversation: async (id) => {
    const { activeConversationId, pendingConversationId, conversations, activeConversationIdsByMode } = get()

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
      const selectedConversation = conversations.find((conversation) => String(conversation.id) === String(id))
      const mode = getConversationMode(selectedConversation)
      set({
        activeConversationId: id,
        pendingConversationId: null,
        messages,
        activeConversationIdsByMode: {
          ...activeConversationIdsByMode,
          [mode]: id
        }
      })
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
      const normalized = normalizeConversations(Array.isArray(conversations) ? conversations : [conversations])
      const latestConversation = normalized[0]
      set({
        conversations: normalized,
        activeConversationIdsByMode: {
          jobs: latestConversation?.id ?? get().activeConversationIdsByMode.jobs,
          cv: latestConversation?.id ?? get().activeConversationIdsByMode.cv
        }
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
    const { messages, conversations, activeConversationId, activeConversationIdsByMode, chatMode } = get()
    const conversationType = chatMode === 'cv' ? 'cv_analysis' : 'job_chat'
    const targetConvId = conversationId ?? activeConversationId ?? activeConversationIdsByMode[chatMode]

    const tempId = -Date.now()
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: message,
      createdAt: new Date(),
      conversationId: (targetConvId ?? '') as string | number,
      conversationType,
      messageType: chatMode === 'cv' ? 'cv_followup_query' : 'job_query'
    }
    set({ messages: [...messages, tempUserMsg], isSending: true, streamStatus: null, error: null })

    try {
      const res = await sendMessageApi({
        conversationId: targetConvId ?? undefined,
        message
      })

      const resolvedConversationId = res.conversationId
      const assistantContent = typeof res.message?.content === 'string' ? res.message.content : ''

      set((s) => ({
        activeConversationId: resolvedConversationId,
        activeConversationIdsByMode: {
          ...s.activeConversationIdsByMode,
          jobs: resolvedConversationId,
          cv: resolvedConversationId
        }
      }))
      set((s) => ({
        conversations: buildConversationPreview(
          s.conversations.length ? s.conversations : conversations,
          resolvedConversationId,
          message,
          assistantContent
        ).map((conversation) =>
          String(conversation.id) === String(resolvedConversationId)
            ? { ...conversation, conversationType: 'job_chat' }
            : conversation
        ),
        messages: [
          ...s.messages.filter((m) => m.id !== tempId),
          { ...tempUserMsg, conversationId: resolvedConversationId },
          {
            ...res.message,
            conversationType: res.message.conversationType ?? 'job_chat',
            messageType:
              res.message.messageType ?? (chatMode === 'cv' ? 'cv_followup_answer' : 'job_answer')
          }
        ]
      }))
      void get().getConversations()
    } catch {
      set({ error: 'Failed to send message. Please try again.' })
    } finally {
      set({ isSending: false, streamStatus: null })
    }
  },

  createConversation: async () => {
    try {
      const { chatMode } = get()
      const conversationType = chatMode === 'cv' ? 'cv_analysis' : 'job_chat'
      const conversation = await createConversationApi(conversationType)
      set((s) => ({
        activeConversationId: conversation.id,
        pendingConversationId: null,
        activeConversationIdsByMode: {
          jobs: conversation.id,
          cv: conversation.id
        },
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
        activeConversationIdsByMode: {
          jobs: String(s.activeConversationIdsByMode.jobs) === String(id) ? null : s.activeConversationIdsByMode.jobs,
          cv: String(s.activeConversationIdsByMode.cv) === String(id) ? null : s.activeConversationIdsByMode.cv
        },
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

  analyzeCv: async (file, jdText) => {
    const { conversations, activeConversationId, activeConversationIdsByMode } = get()
    let targetConversationId = activeConversationId ?? activeConversationIdsByMode.cv

    try {
      if (!targetConversationId) {
        const conversation = await createConversationApi('job_chat')
        targetConversationId = conversation.id
        set((s) => ({
          conversations: upsertConversation(s.conversations, conversation),
          activeConversationId: conversation.id,
          chatMode: 'cv',
          activeConversationIdsByMode: {
            jobs: conversation.id,
            cv: conversation.id
          },
          messages: []
        }))
      }

      const tempId = `cv-upload-${Date.now()}`
      const normalizedJd = jdText?.trim() || ''
      const tempUserMsg: ChatMessage = {
        id: tempId,
        role: 'user',
        content: normalizedJd
          ? `Da tai len CV: ${file.name} va yeu cau danh gia do phu hop voi mo ta cong viec`
          : `Da tai len CV: ${file.name}`,
        attachments: [
          {
            name: file.name,
            size: file.size,
            type: file.type
          }
        ],
        conversationId: targetConversationId,
        conversationType: 'job_chat',
        messageType: 'cv_upload',
        createdAt: new Date()
      }

      set((state) => ({ messages: [...state.messages, tempUserMsg], isSending: true, error: null }))

      if (normalizedJd) {
        const result = await matchCvWithJdApi({
          file,
          jdText: normalizedJd,
          conversationId: targetConversationId
        })
        const resolvedConversationId = result.conversation_id ?? targetConversationId
        const assistantMessage: ChatMessage = {
          id: result.conversation_message_id || `cv-jd-match-${Date.now()}`,
          role: 'assistant',
          content: formatCvJdMatchMessage(result),
          conversationId: resolvedConversationId,
          conversationType: 'job_chat',
          messageType: 'cv_jd_match',
          detectedIntent: 'cv_jd_match',
          cvJdMatch: result,
          createdAt: new Date()
        }

        set((state) => ({
          activeConversationId: resolvedConversationId,
          chatMode: 'cv',
          activeConversationIdsByMode: {
            jobs: resolvedConversationId,
            cv: resolvedConversationId
          },
          conversations: buildConversationPreview(
            state.conversations.length ? state.conversations : conversations,
            resolvedConversationId,
            `Danh gia CV voi JD: ${file.name}`,
            `${result.job_title} - ${result.overall_score}%`
          ).map((conversation) =>
            String(conversation.id) === String(resolvedConversationId)
              ? {
                  ...conversation,
                  conversationType: 'job_chat',
                  title:
                    conversation.title && conversation.title !== 'Cuoc tro chuyen moi'
                      ? conversation.title
                      : `CV match JD - ${file.name.slice(0, 32)}`
                }
              : conversation
          ),
          messages: state.messages.filter((message) => message.id !== tempId).concat(assistantMessage)
        }))
      } else {
        const result = await analyzeCvApi(file, 5, targetConversationId)
        const resolvedConversationId = result.conversation_id ?? targetConversationId
        const assistantMessage: ChatMessage = {
          id: result.conversation_message_id || `cv-analysis-${result.cv_id}-${Date.now()}`,
          role: 'assistant',
          content: formatCvAnalysisMessage(result),
          conversationId: resolvedConversationId,
          conversationType: 'job_chat',
          messageType: 'cv_analysis',
          detectedIntent: 'cv_analysis',
          cvAnalysis: result,
          createdAt: new Date()
        }

        set((state) => ({
          activeConversationId: resolvedConversationId,
          chatMode: 'cv',
          activeConversationIdsByMode: {
            jobs: resolvedConversationId,
            cv: resolvedConversationId
          },
          conversations: buildConversationPreview(
            state.conversations.length ? state.conversations : conversations,
            resolvedConversationId,
            `Phan tich CV: ${file.name}`,
            `Da phan tich CV ${file.name}`
          ).map((conversation) =>
            String(conversation.id) === String(resolvedConversationId)
              ? {
                  ...conversation,
                  conversationType: 'job_chat',
                  title:
                    conversation.title && conversation.title !== 'Cuoc tro chuyen moi'
                      ? conversation.title
                      : `Phan tich CV - ${file.name.slice(0, 32)}`
                }
              : conversation
          ),
          messages: state.messages.filter((message) => message.id !== tempId).concat(assistantMessage)
        }))
      }
      void get().getConversations()
    } catch {
      set({ error: 'Failed to analyze CV. Please try again.' })
    } finally {
      set({ isSending: false })
    }
  },

  analyzeCvAgainstJd: async (jdText) => {
    const { messages, conversations, activeConversationId, activeConversationIdsByMode } = get()
    const targetConversationId = activeConversationId ?? activeConversationIdsByMode.cv
    const cvId = getLatestCvIdFromMessages(messages)
    const normalizedJd = jdText.trim()

    if (!normalizedJd) {
      set({ error: 'Job description is required.' })
      return
    }

    if (!cvId) {
      set({ error: 'Hay phan tich CV truoc khi doi chieu voi mo ta cong viec.' })
      return
    }

    const tempId = `cv-jd-${Date.now()}`
    const tempUserMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      content: `Danh gia CV voi mo ta cong viec: ${normalizedJd.slice(0, 240)}`,
      conversationId: (targetConversationId ?? '') as string | number,
      conversationType: 'job_chat',
      messageType: 'cv_jd_match_query',
      createdAt: new Date()
    }

    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isSending: true,
      error: null,
      chatMode: 'cv'
    }))

    try {
      const result = await matchCvWithJdApi({
        cvId,
        jdText: normalizedJd,
        conversationId: targetConversationId ?? undefined
      })
      const resolvedConversationId = result.conversation_id ?? targetConversationId ?? ''
      const assistantMessage: ChatMessage = {
        id: result.conversation_message_id || `cv-jd-match-${Date.now()}`,
        role: 'assistant',
        content: formatCvJdMatchMessage(result),
        conversationId: resolvedConversationId,
        conversationType: 'job_chat',
        messageType: 'cv_jd_match',
        detectedIntent: 'cv_jd_match',
        cvJdMatch: result,
        createdAt: new Date()
      }

      set((state) => ({
        activeConversationId: resolvedConversationId,
        activeConversationIdsByMode: {
          jobs: resolvedConversationId,
          cv: resolvedConversationId
        },
        conversations: buildConversationPreview(
          state.conversations.length ? state.conversations : conversations,
          resolvedConversationId,
          'Danh gia CV voi job description',
          `${result.job_title} - ${result.overall_score}%`
        ).map((conversation) =>
          String(conversation.id) === String(resolvedConversationId)
            ? { ...conversation, conversationType: 'job_chat' }
            : conversation
        ),
        messages: state.messages.filter((message) => message.id !== tempId).concat(assistantMessage)
      }))
      void get().getConversations()
    } catch {
      set({ error: 'Failed to evaluate CV against job description. Please try again.' })
    } finally {
      set({ isSending: false })
    }
  },

  clearError: () => set({ error: null })
}))
