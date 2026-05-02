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
  company_id?: number
}

export type RegisterEmployerResponse = {
  message: string
  user_id: number
  employee_id: number
  company_id: number
  company_name: string
}

export const registerEmployerApi = async (data: RegisterEmployerRequest): Promise<RegisterEmployerResponse> => {
  const response = await axiosInstance.post<RegisterEmployerResponse>('/employees', data)
  return response.data
}
