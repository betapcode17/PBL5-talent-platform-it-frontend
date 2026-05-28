import { useEffect } from 'react'

import { useLikeStore } from '@/store/likeStore'

export const useCompanyLikes = (companyId?: number | null) => {
  const loadCompanyLikes = useLikeStore((state) => state.loadCompanyLikes)
  const companyIdInStore = useLikeStore((state) => state.companyId)

  useEffect(() => {
    if (!companyId || companyIdInStore === companyId) return

    void loadCompanyLikes(companyId)
  }, [companyId, companyIdInStore, loadCompanyLikes])

  return {
    likesBySeekerId: useLikeStore((state) => state.likesBySeekerId),
    total: useLikeStore((state) => state.total),
    isLoading: useLikeStore((state) => state.isLoading),
    error: useLikeStore((state) => state.error),
    updatingSeekerIds: useLikeStore((state) => state.updatingSeekerIds),
    toggleCandidateLike: useLikeStore((state) => state.toggleCandidateLike),
    isCandidateLiked: useLikeStore((state) => state.isCandidateLiked)
  }
}
