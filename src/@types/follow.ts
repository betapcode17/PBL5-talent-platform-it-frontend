// ==============================
// FOLLOW RESPONSE
// ==============================
export interface FollowResponse {
  follow_id?: number
  seeker_id: number
  company_id: number
  is_active: boolean
  followed_date?: string
}

// ==============================
// CHECK FOLLOW RESPONSE
// ==============================
export type CheckFollowResponse = boolean

// ==============================
// FOLLOW COUNT RESPONSE
// ==============================
export type FollowCountResponse = number

// ==============================
// FOLLOW STATUS REQUEST
// ==============================
export interface FollowCompanyRequest {
  company_id: number
}

export interface FollowedCompanyItem {
  follow_id: number
  seeker_id: number
  company_id: number
  followed_date: string
  is_active: boolean
  Company: {
    company_id: number
    company_name: string
    profile_description?: string | null
    company_type?: string | null
    company_industry?: string | null
    establishment_date?: string | null
    company_size?: string | null
    country?: string | null
    city?: string | null
    working_days?: string | null
    working_time?: string | null
    overtime_policy?: string | null
    company_website_url?: string | null
    company_email?: string | null
    company_image?: string | null
    cover_image?: string | null
    key_skills?: string | null
    why_love_working_here?: string | null
    is_active: boolean
    created_date: string
  }
}
