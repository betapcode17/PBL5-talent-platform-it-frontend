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
  role: 'SEEKER' | 'EMPLOYEE' | 'ADMIN'
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

export type SocialLoginBackendResponse = {
  message?: string
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    full_name: string
    role: User['role']
    user_image?: string
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface PasswordResetResponse {
  message: string
}

// Response lỗi từ API
export interface ApiErrorResponse {
  statusCode: number
  message: string
  error?: string
}
