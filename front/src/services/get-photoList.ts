import http from '../http-common'

class GetPhotoListApi {
  async get(cursor?: string) {
    const params = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    const result = await http.get(`/api/photos${params}`)
    return result.data.contents
  }
}

export default new GetPhotoListApi()
