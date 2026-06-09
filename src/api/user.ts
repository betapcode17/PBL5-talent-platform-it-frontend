import axiosInstance from './axiosInstance'
import type { User } from '@/@types/user'

export type UpdateMePayload = {
  email?: string
  full_name?: string
  gender?: string
  phone?: string
}

export const updateMeApi = async (payload: UpdateMePayload): Promise<User> => {
  const response = await axiosInstance.put<User>('/users/me', payload)

  return response.data
}
