import { useEffect, useState } from 'react'
import { checkFollowStatusApi, followCompanyApi, getFollowCountApi, unfollowCompanyApi } from '@/api/follow'
import { useAuthStore } from '@/store/authStore'

export const useFollow = (company_id: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isFollowed, setIsFollowed] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFollowerCount = async () => {
    try {
      const count = await getFollowCountApi(company_id)
      setFollowerCount(count)
    } catch (err) {
      console.error('Error loading follow count:', err)
    }
  }

  // Check if user already follows the company
  useEffect(() => {
    const loadFollowData = async () => {
      try {
        const countPromise = getFollowCountApi(company_id)

        if (!isAuthenticated) {
          const count = await countPromise
          setIsFollowed(false)
          setFollowerCount(count)
          setError(null)
          return
        }

        const [status, count] = await Promise.all([checkFollowStatusApi(company_id), countPromise])
        setIsFollowed(Boolean(status))
        setFollowerCount(count)
        setError(null)
      } catch (err) {
        console.error('Error loading follow data:', err)
        setError('Failed to load follow data')
      }
    }

    loadFollowData()
  }, [company_id, isAuthenticated])

  // Handle follow/unfollow
  const toggleFollow = async () => {
    if (isLoading || !isAuthenticated) {
      if (!isAuthenticated) {
        setError('Vui lòng đăng nhập để theo dõi công ty')
      }
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = isFollowed ? await unfollowCompanyApi(company_id) : await followCompanyApi(company_id)

      if (result) {
        const nextFollowedState = !isFollowed
        setIsFollowed(nextFollowedState)
        setFollowerCount((prev) => Math.max(0, prev + (nextFollowedState ? 1 : -1)))
        void loadFollowerCount()
      } else {
        setError('Failed to update follow status')
      }
    } catch (err) {
      console.error('Error toggling follow:', err)
      setError('Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFollowed,
    followerCount,
    isLoading,
    error,
    refreshFollowerCount: loadFollowerCount,
    toggleFollow
  }
}
