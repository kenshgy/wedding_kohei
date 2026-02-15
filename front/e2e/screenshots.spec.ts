import { test } from '@playwright/test'
import sharp from 'sharp'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

const SCREENSHOT_DIR = 'e2e/screenshots'

interface Screenshot {
  label: string
  buffer: Buffer
}

/** ページをキャプチャしてラベル付き Buffer を返す */
async function capturePage(
  page: import('@playwright/test').Page,
  pagePath: string,
  name: string
): Promise<Screenshot[]> {
  const screenshots: Screenshot[] = []
  await page.goto(pagePath)
  await page.waitForLoadState('networkidle')

  // 封筒の状態
  screenshots.push({
    label: `${name}`,
    buffer: Buffer.from(await page.screenshot({ fullPage: true })),
  })

  // 招待状ページ (.letter-img がある場合) は開封後も撮影
  const letterImg = page.locator('.letter-img')
  if ((await letterImg.count()) > 0) {
    await letterImg.click()
    await page.getByText('Wedding Invitation').waitFor({ state: 'visible', timeout: 3000 })
    await page.waitForTimeout(1000)
    screenshots.push({
      label: `${name} (開封後)`,
      buffer: Buffer.from(await page.screenshot({ fullPage: true })),
    })
  }

  return screenshots
}

/** スクリーンショットを1ページずつPDFに出力 */
async function generatePDF(screenshots: Screenshot[], outputPath: string) {
  const doc = new PDFDocument({ autoFirstPage: false })
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)

  for (const screenshot of screenshots) {
    const metadata = await sharp(screenshot.buffer).metadata()
    const imgWidth = metadata.width!
    const imgHeight = metadata.height!

    // ページヘッダー分の余白
    const headerHeight = 40
    const margin = 20

    // 画像をページ幅に収まるようスケーリングしてページサイズを決定
    const pageWidth = imgWidth + margin * 2
    const pageHeight = imgHeight + headerHeight + margin * 2

    doc.addPage({ size: [pageWidth, pageHeight], margin: 0 })

    // ページラベル
    doc.fontSize(16).fillColor('#333').text(screenshot.label, margin, margin)

    // スクリーンショット画像
    doc.image(screenshot.buffer, margin, headerHeight + margin, { width: imgWidth })
  }

  doc.end()

  // ストリーム完了を待つ
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

const pages = [
  { name: '/ (トップ)', path: '/' },
  { name: '/invitation (挙式+披露宴)', path: '/invitation' },
  { name: '/invite (披露宴のみ)', path: '/invite' },
  { name: '/kohei (kohei)', path: '/kohei' },
  { name: '/upload (写真アップロード)', path: '/upload' },
  { name: '/album (アルバム)', path: '/album' },
]

test.describe('Design screenshots - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('capture all pages', async ({ page }) => {
    const allScreenshots: Screenshot[] = []
    for (const p of pages) {
      const screenshots = await capturePage(page, p.path, p.name)
      allScreenshots.push(...screenshots)
    }
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
    await generatePDF(allScreenshots, path.join(SCREENSHOT_DIR, 'desktop.pdf'))
  })
})

test.describe('Design screenshots - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('capture all pages', async ({ page }) => {
    const allScreenshots: Screenshot[] = []
    for (const p of pages) {
      const screenshots = await capturePage(page, p.path, p.name)
      allScreenshots.push(...screenshots)
    }
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
    await generatePDF(allScreenshots, path.join(SCREENSHOT_DIR, 'mobile.pdf'))
  })
})
