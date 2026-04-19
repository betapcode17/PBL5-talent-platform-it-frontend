import axiosInstance from '@/api/axiosInstance'
import type { BookmarksResponse } from '@/types/job-detail'

export const getBookmarks = async (jobId?: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<BookmarksResponse>('/bookmarks', {
    params: jobId ? { jobId } : undefined,
    signal
  })

  return response.data
}

export const createBookmark = async (jobId: number) => {
  const response = await axiosInstance.post<{ bookmarkId: number }>('/bookmarks', { jobId })

  return response.data
}

export const deleteBookmark = async (bookmarkId: number) => {
  const response = await axiosInstance.delete<{ message: string }>(`/bookmarks/${bookmarkId}`)

  return response.data
}
