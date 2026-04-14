import axiosInstance from './axiosInstance'
import type { CheckFollowResponse, FollowCountResponse, FollowResponse } from '@/@types/follow'

// Check if user follows a company
export const checkFollowStatusApi = async (company_id: number): Promise<CheckFollowResponse> => {
  try {
    const response = await axiosInstance.get('/follows/check', {
      params: {
        company_id
      }
    })
    return response.data
  } catch (error) {
    console.error('Error checking follow status:', error)
    return false
  }
}

// Get follower count of a company
export const getFollowCountApi = async (company_id: number): Promise<FollowCountResponse> => {
  try {
    const response = await axiosInstance.get('/follows/count', {
      params: {
        company_id
      }
    })

    const data = response.data

    if (typeof data === 'number') return data
    if (typeof data?.count === 'number') return data.count
    if (typeof data?.follow_count === 'number') return data.follow_count
    if (typeof data?.followers === 'number') return data.followers
    if (typeof data?.total === 'number') return data.total

    return 0
  } catch (error) {
    console.error('Error getting follow count:', error)
    return 0
  }
}

// Follow a company
export const followCompanyApi = async (company_id: number): Promise<FollowResponse | null> => {
  try {
    const response = await axiosInstance.post(
      '/follows',
      {},
      {
        params: {
          company_id
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error following company:', error)
    return null
  }
}

// Unfollow a company
export const unfollowCompanyApi = async (company_id: number): Promise<FollowResponse | null> => {
  try {
    const response = await axiosInstance.delete('/follows', {
      params: {
        company_id
      }
    })
    return response.data
  } catch (error) {
    console.error('Error unfollowing company:', error)
    return null
  }
}
