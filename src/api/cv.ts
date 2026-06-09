import axiosInstance from '@/api/axiosInstance'

export type MyCvResponse = {
  id: number
  userId: number
  cvUrl?: string | null
}

export type UploadCvFileResponse = {
  cvUrl: string
}

export const getMyCvApi = async (userId: number) => {
  const response = await axiosInstance.get<MyCvResponse>(`/cv/${userId}`)
  return response.data
}

export const uploadCvFileApi = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.put<UploadCvFileResponse>('/cv/file', formData)
  return response.data
}
