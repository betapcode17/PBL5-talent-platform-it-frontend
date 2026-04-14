import type { ChatMessage } from '@/@types/chat'

const CACHE_PREFIX = 'chat_messages_'
const MAX_MESSAGES_PER_CHAT = 10

/**
 * Get cached messages for a specific chat from localStorage
 */
export const getCachedMessages = (chatId: number): ChatMessage[] => {
  try {
    const key = `${CACHE_PREFIX}${chatId}`
    const cached = localStorage.getItem(key)
    if (!cached) return []

    const messages = JSON.parse(cached) as ChatMessage[]
    return Array.isArray(messages) ? messages : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

/**
 * Save messages to localStorage, keeping only the latest MAX_MESSAGES_PER_CHAT
 */
export const saveMsgagesToCache = (chatId: number, messages: ChatMessage[]): void => {
  try {
    const key = `${CACHE_PREFIX}${chatId}`

    // Sort by sent_at descending and keep only latest MAX_MESSAGES_PER_CHAT
    const sortedMessages = [...messages]
      .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
      .slice(0, MAX_MESSAGES_PER_CHAT)

    localStorage.setItem(key, JSON.stringify(sortedMessages))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * Add a new message to the cache, maintaining the max limit
 */
export const addToCache = (chatId: number, message: ChatMessage): void => {
  try {
    const existing = getCachedMessages(chatId)

    // Check if message already exists
    const isDuplicate = existing.some((m) => m.message_id === message.message_id)
    if (isDuplicate) return

    // Add new message and keep only latest MAX_MESSAGES_PER_CHAT
    const updated = [message, ...existing].slice(0, MAX_MESSAGES_PER_CHAT)

    saveMsgagesToCache(chatId, updated)
  } catch (error) {
    console.error('Error adding to cache:', error)
  }
}

/**
 * Clear cache for a specific chat
 */
export const clearChatCache = (chatId: number): void => {
  try {
    const key = `${CACHE_PREFIX}${chatId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

/**
 * Clear all message caches
 */
export const clearAllCache = (): void => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing all cache:', error)
  }
}
