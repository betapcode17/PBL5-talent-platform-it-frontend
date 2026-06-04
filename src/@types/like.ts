export interface CompanySeekerLike {
  likeId: string
  seekerId: number
  date: string
}

export interface CreateCompanySeekerLikeRequest {
  seekerId: number
}

export interface CreateCompanySeekerLikeResponse {
  likeId: string
}

export interface CompanyLikesResponse {
  likes: CompanySeekerLike[]
  total: number
  count: number
}

export interface UnlikeResponse {
  message: string
}
