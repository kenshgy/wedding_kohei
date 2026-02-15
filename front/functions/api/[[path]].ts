import { Hono } from 'hono'

type Bindings = {
  PHOTOS_BUCKET: R2Bucket
  ASSETS_BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

// 写真アップロード（FormData → R2）
app.post('/files/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File
  if (!file) {
    return c.json({ error: 'No file provided' }, 400)
  }
  const key = `${crypto.randomUUID()}-${file.name}`
  await c.env.PHOTOS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  })
  return c.json({ key })
})

// 招待状アセットアップロード
app.post('/files/invitation/upload', async (c) => {
  const assetKey = c.req.query('assetKey')
  const VALID_KEYS = ['hero-video', 'carousel-1', 'carousel-2', 'carousel-3']
  if (!assetKey || !VALID_KEYS.includes(assetKey)) {
    return c.json({ error: 'Invalid assetKey' }, 400)
  }
  const body = await c.req.arrayBuffer()
  const contentType = c.req.header('Content-Type') || 'application/octet-stream'
  await c.env.ASSETS_BUCKET.put(`invitation/${assetKey}`, body, {
    httpMetadata: { contentType }
  })
  return c.json({ key: `invitation/${assetKey}` })
})

// 写真一覧
app.get('/photos', async (c) => {
  const cursor = c.req.query('cursor') || undefined
  const list = await c.env.PHOTOS_BUCKET.list({ cursor, limit: 100 })
  const contents = list.objects.map((obj) => ({
    name: obj.key,
    size: obj.size.toString(),
    lastModified: obj.uploaded.toISOString()
  }))
  return c.json({ contents, truncated: list.truncated, cursor: list.cursor })
})

// 写真配信
app.get('/photos/:name', async (c) => {
  const obj = await c.env.PHOTOS_BUCKET.get(c.req.param('name'))
  if (!obj) return c.notFound()
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400'
    }
  })
})

// 招待状アセット配信
app.get('/assets/:key', async (c) => {
  const obj = await c.env.ASSETS_BUCKET.get(`invitation/${c.req.param('key')}`)
  if (!obj) return c.notFound()
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'ok' }))

export const onRequest = app.fetch
