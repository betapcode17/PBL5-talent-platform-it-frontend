import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/@types/auth'
import axiosInstance from './axiosInstance'
import type { User } from '@/@types/user'

type GoogleLoginBackendResponse = {
  message?: string
  accessToken?: string
  refreshToken?: string
  access_token?: string
  refresh_token?: string
  user: Partial<User> & {
    id: number
    email: string
    full_name: string
    role: User['role']
  }
}

const normalizeGoogleLoginResponse = (data: GoogleLoginBackendResponse): LoginResponse => {
  const accessToken = data.access_token || data.accessToken

  if (!accessToken) {
    throw new Error('Google login response is missing access token')
  }

  return {
    access_token: accessToken,
    refresh_token: data.refresh_token || data.refreshToken,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.full_name,
      role: data.user.role,
      user_image: data.user.user_image,
      registration_date: data.user.registration_date || new Date().toISOString()
    }
  }
}

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

// register
export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('auth/register', data)
  return response.data
}

// google login api - send credential (idToken) from Google One Tap
export const googleLoginApi = async (credential: string): Promise<LoginResponse> => {
  console.log('[authApi] googleLoginApi called with credential')
  const response = await axiosInstance.post<GoogleLoginBackendResponse>('/auth/google', { credential })
  console.log('[authApi] googleLoginApi response:', response.data)
  return normalizeGoogleLoginResponse(response.data)
}

// google callback api - exchange authorization code for app tokens
export const googleCallbackApi = async (code: string): Promise<LoginResponse> => {
  console.log('[authApi] googleCallbackApi called with code')
  try {
    const response = await axiosInstance.post<GoogleLoginBackendResponse>('/auth/google/callback', { code })
    console.log('[authApi] googleCallbackApi response:', response.data)
    return normalizeGoogleLoginResponse(response.data)
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status

    if (status === 404) {
      console.warn('[authApi] /auth/google/callback not found, fallback to /auth/google')
      const fallbackResponse = await axiosInstance.post<GoogleLoginBackendResponse>('/auth/google', { code })
      console.log('[authApi] googleCallbackApi fallback response:', fallbackResponse.data)
      return normalizeGoogleLoginResponse(fallbackResponse.data)
    }

    throw error
  }
}
