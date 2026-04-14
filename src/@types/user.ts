// Thông tin user trả về từ API
export interface User {
  id: number
  email: string
  full_name: string
  role: 'SEEKER' | 'EMPLOYEE' | 'ADMIN'
  user_image?: string
  phone?: string
  registration_date: string
  gender?: string
}
