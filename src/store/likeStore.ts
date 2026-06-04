import { create } from 'zustand'

import type { CompanySeekerLike } from '@/@types/like'
import { createCompanySeekerLikeApi, deleteCompanySeekerLikeApi, getCompanyLikesApi } from '@/api/likes'

type LikeState = {
  companyId: number | null
  likesBySeekerId: Record<number, CompanySeekerLike>
  total: number
  isLoading: boolean
  updatingSeekerIds: number[]
  error: string | null
  loadCompanyLikes: (companyId: number) => Promise<void>
  toggleCandidateLike: (seekerId: number) => Promise<void>
  isCandidateLiked: (seekerId: number) => boolean
}

const toLikeMap = (likes: CompanySeekerLike[]) =>
  likes.reduce<Record<number, CompanySeekerLike>>((accumulator, like) => {
    accumulator[like.seekerId] = like
    return accumulator
  }, {})

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'response' in error) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback
  }

  return error instanceof Error ? error.message : fallback
}

export const useLikeStore = create<LikeState>((set, get) => ({
  companyId: null,
  likesBySeekerId: {},
  total: 0,
  isLoading: false,
  updatingSeekerIds: [],
  error: null,

  loadCompanyLikes: async (companyId) => {
    set({ companyId, isLoading: true, error: null })

    try {
      const data = await getCompanyLikesApi(companyId)
      set({
        likesBySeekerId: toLikeMap(data.likes),
        total: data.total,
        isLoading: false,
        error: null
      })
    } catch (error) {
      set({
        likesBySeekerId: {},
        total: 0,
        isLoading: false,
        error: getErrorMessage(error, 'Unable to load liked candidates')
      })
    }
  },

  toggleCandidateLike: async (seekerId) => {
    const { likesBySeekerId, updatingSeekerIds } = get()

    if (updatingSeekerIds.includes(seekerId)) return

    const existingLike = likesBySeekerId[seekerId]
    set({
      updatingSeekerIds: [...updatingSeekerIds, seekerId],
      error: null
    })

    try {
      if (existingLike) {
        await deleteCompanySeekerLikeApi(existingLike.likeId)
        set((state) => {
          const nextLikes = { ...state.likesBySeekerId }
          delete nextLikes[seekerId]

          return {
            likesBySeekerId: nextLikes,
            total: Math.max(0, state.total - 1)
          }
        })
      } else {
        const created = await createCompanySeekerLikeApi({ seekerId })
        set((state) => ({
          likesBySeekerId: {
            ...state.likesBySeekerId,
            [seekerId]: {
              likeId: created.likeId,
              seekerId,
              date: new Date().toISOString()
            }
          },
          total: state.total + 1
        }))
      }
    } catch (error) {
      set({ error: getErrorMessage(error, 'Unable to update candidate like') })
    } finally {
      set((state) => ({
        updatingSeekerIds: state.updatingSeekerIds.filter((id) => id !== seekerId)
      }))
    }
  },

  isCandidateLiked: (seekerId) => Boolean(get().likesBySeekerId[seekerId])
}))
