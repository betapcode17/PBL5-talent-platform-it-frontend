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
  role: 'SEEKER' | 'EMPLOYER' | 'ADMIN'
}

export interface LoginResponse {
  access_token: string
  refresh_token?: string
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
