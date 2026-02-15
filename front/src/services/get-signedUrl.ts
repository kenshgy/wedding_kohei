import http from '../http-common'

class FileUploadService {
  async upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const result = await http.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return result.data
  }
}

export default new FileUploadService()
