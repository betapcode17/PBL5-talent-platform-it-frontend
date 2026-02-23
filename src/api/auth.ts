import type { LoginRequest, LoginResponse } from '@/@types/auth'
import axiosInstance from './axiosInstance'
import type { User } from '@/@types/user'

//login
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', data)
  return response.data
}

//get me
export const getMeApi = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me')
  return response.data
}

// logout
export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post('auth/logout')
}
