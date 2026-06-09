import axiosInstance from './axiosInstance'

export type RegisterEmployerRequest = {
  full_name: string
  email: string
  phone: string
  role: string
  joined_date?: string
  company_name: string
  company_address: string
  company_website_url?: string
}

export type RegisterEmployerResponse = {
  message: string
  request_id: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export const registerEmployerApi = async (data: RegisterEmployerRequest): Promise<RegisterEmployerResponse> => {
  const response = await axiosInstance.post<RegisterEmployerResponse>('/auth/employee-company-register', data)
  return response.data
}
