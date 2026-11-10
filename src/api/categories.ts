import axiosInstance from '@/api/axiosInstance'

export type FeaturedCategoryApiResponse = {
  id: string
  title: string
  count: number
  openRoles: string
}

export const getFeaturedCategoriesApi = async (): Promise<FeaturedCategoryApiResponse[]> => {
  try {
    const response = await axiosInstance.get<FeaturedCategoryApiResponse[]>('/categories/featured')
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch featured categories:', error)
    return []
  }
}
