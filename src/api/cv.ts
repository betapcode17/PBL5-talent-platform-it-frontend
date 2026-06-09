import axiosInstance from '@/api/axiosInstance'

export type MyCvResponse = {
  id: number
  userId: number
  cvUrl?: string | null
}

export type UploadCvFileResponse = {
  cvUrl: string
}

export type CvEducation = {
  id: string
  school: string
  degree: string
  major?: string | null
  startDate: string
  endDate?: string | null
  description?: string | null
}

export type CvExperience = {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string | null
  description?: string | null
}

export type CvSkill = {
  id: string
  name: string
  category?: string | null
  experienceMonths?: number | null
  isStrong?: boolean
}

export type CvPersonality = {
  id: string
  type: string
  description?: string | null
}

export type CvCertificate = {
  id: string
  title: string
  issuer: string
  issuedDate?: string | null
  fileUrl?: string | null
}

export type CvProject = {
  id: string
  name: string
  description?: string | null
  link?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
}

export type CvDetail = {
  id: number
  userId: number
  cvUrl?: string | null
  seeker: {
    id: number
    fullName?: string | null
    email: string
    githubUrl?: string | null
    linkedinUrl?: string | null
    portfolioUrl?: string | null
  }
  educations: CvEducation[]
  experiences: CvExperience[]
  skills: CvSkill[]
  personalities: CvPersonality[]
  certificates: CvCertificate[]
  projects: CvProject[]
}

export type CvEducationPayload = {
  school: string | null
  degree: string | null
  major?: string | null
  startDate: string | null
  endDate?: string | null
  description?: string | null
}

export type CvExperiencePayload = {
  company: string | null
  position: string | null
  startDate: string | null
  endDate?: string | null
  description?: string | null
}

export type CvSkillPayload = {
  name: string
  category?: string | null
  experienceMonths?: number | null
  isStrong?: boolean
}

export type CvPersonalityPayload = {
  type: string | null
  description?: string | null
}

export type CvCertificatePayload = {
  title: string | null
  issuer: string | null
  issuedDate?: string | null
  fileUrl?: string | null
}

export type CvProjectPayload = {
  name: string | null
  description?: string | null
  link?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
}

export const getMyCvApi = async (userId: number) => {
  const response = await axiosInstance.get<MyCvResponse>(`/cv/${userId}`)
  return response.data
}

export const getCvDetailApi = async (userId: number) => {
  const response = await axiosInstance.get<CvDetail>(`/cv/${userId}`)
  return response.data
}

export const uploadCvFileApi = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.put<UploadCvFileResponse>('/cv/file', formData)
  return response.data
}

export type SeekerProfilePayload = {
  githubUrl?: string | null
  linkedinUrl?: string | null
  portfolioUrl?: string | null
}

export const updateSeekerProfileApi = async (data: SeekerProfilePayload) =>
  (await axiosInstance.put('/cv/seeker-profile', data)).data

export const createCvEducationApi = async (data: CvEducationPayload) =>
  (await axiosInstance.post('/cv/education', data)).data

export const updateCvEducationApi = async (id: string, data: Partial<CvEducationPayload>) =>
  (await axiosInstance.put(`/cv/education/${id}`, data)).data

export const deleteCvEducationApi = async (id: string) => (await axiosInstance.delete(`/cv/education/${id}`)).data

export const createCvExperienceApi = async (data: CvExperiencePayload) =>
  (await axiosInstance.post('/cv/experience', data)).data

export const updateCvExperienceApi = async (id: string, data: Partial<CvExperiencePayload>) =>
  (await axiosInstance.put(`/cv/experience/${id}`, data)).data

export const deleteCvExperienceApi = async (id: string) => (await axiosInstance.delete(`/cv/experience/${id}`)).data

export const createCvSkillsApi = async (skills: CvSkillPayload[]) =>
  (await axiosInstance.post('/cv/skills', { skills })).data

export const updateCvSkillApi = async (id: string, data: CvSkillPayload) =>
  (await axiosInstance.put(`/cv/skills/${id}`, data)).data

export const deleteCvSkillApi = async (id: string) => (await axiosInstance.delete(`/cv/skills/${id}`)).data

export const createCvPersonalityApi = async (data: CvPersonalityPayload) =>
  (await axiosInstance.post('/cv/personality', data)).data

export const updateCvPersonalityApi = async (id: string, data: Partial<CvPersonalityPayload>) =>
  (await axiosInstance.put(`/cv/personality/${id}`, data)).data

export const deleteCvPersonalityApi = async (id: string) => (await axiosInstance.delete(`/cv/personality/${id}`)).data

export const createCvCertificateApi = async (data: CvCertificatePayload) =>
  (await axiosInstance.post('/cv/certificates', data)).data

export const updateCvCertificateApi = async (id: string, data: Partial<CvCertificatePayload>) =>
  (await axiosInstance.put(`/cv/certificates/${id}`, data)).data

export const deleteCvCertificateApi = async (id: string) => (await axiosInstance.delete(`/cv/certificates/${id}`)).data

export const createCvProjectApi = async (data: CvProjectPayload) =>
  (await axiosInstance.post('/cv/projects', data)).data

export const updateCvProjectApi = async (id: string, data: Partial<CvProjectPayload>) =>
  (await axiosInstance.put(`/cv/projects/${id}`, data)).data

export const deleteCvProjectApi = async (id: string) => (await axiosInstance.delete(`/cv/projects/${id}`)).data
