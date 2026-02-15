import http from '../http-common'

const ASSET_KEYS = ['hero-video', 'carousel-1', 'carousel-2', 'carousel-3'] as const
export type InvitationAssetKey = (typeof ASSET_KEYS)[number]

export function getAssetUrl(key: InvitationAssetKey): string {
  return `/api/assets/${key}?t=${Date.now()}`
}

export async function uploadInvitationAsset(key: InvitationAssetKey, file: File): Promise<void> {
  await http.post(`/api/files/invitation/upload?assetKey=${key}`, file, {
    headers: { 'Content-Type': file.type }
  })
}

export interface InvitationAssets {
  heroVideo: string | null
  carousel: (string | null)[]
}

export async function loadInvitationAssets(): Promise<InvitationAssets> {
  const heroVideo = getAssetUrl('hero-video')
  const carousel = [
    getAssetUrl('carousel-1'),
    getAssetUrl('carousel-2'),
    getAssetUrl('carousel-3')
  ]

  const results: InvitationAssets = { heroVideo: null, carousel: [null, null, null] }

  // Check hero video
  try {
    await http.head(heroVideo)
    results.heroVideo = heroVideo
  } catch {
    // asset doesn't exist, keep null for fallback
  }

  // Check carousel images
  for (let i = 0; i < carousel.length; i++) {
    try {
      await http.head(carousel[i])
      results.carousel[i] = carousel[i]
    } catch {
      // keep null for fallback
    }
  }

  return results
}
