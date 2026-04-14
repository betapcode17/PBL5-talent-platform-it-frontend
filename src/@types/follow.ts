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
