import type { User } from './user'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullname: string
  email: string
  password: string
  confirmPassword: string
  role: 'candidate' | 'employer' | 'admin'
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: User
}

export interface RegisterResponse {
  message: string
  user: User
}

// Response lỗi từ API
export interface ApiErrorResponse {
  statusCode: number
  message: string
  error?: string
}
