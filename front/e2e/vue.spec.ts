import { test, expect } from '@playwright/test'

test.describe('Invitation page (root)', () => {
  test('displays the letter envelope on initial visit', async ({ page }) => {
    await page.goto('/')
    // LetterCard の封筒SVGが表示される
    await expect(page.locator('.letter-svg')).toBeVisible()
  })

  test('opens letter and shows invitation contents when envelope is clicked', async ({ page }) => {
    await page.goto('/')
    // 封筒をクリック
    await page.locator('.letter-img').click()
    // 招待状の内容が表示される（トランジション待ち）
    await expect(page.getByText('Wedding Invitation')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('Kensuke & Miki')).toBeVisible()
  })

  test('shows message card after opening letter', async ({ page }) => {
    await page.goto('/')
    await page.locator('.letter-img').click()
    await expect(page.getByText('謹啓')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('敬具')).toBeVisible()
  })

  test('shows countdown section after opening letter', async ({ page }) => {
    await page.goto('/')
    await page.locator('.letter-img').click()
    await expect(page.getByText('Countdown')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('Days')).toBeVisible()
    await expect(page.getByText('Hours')).toBeVisible()
    await expect(page.getByText('Minutes')).toBeVisible()
    await expect(page.getByText('Seconds')).toBeVisible()
  })

  test('shows schedule section after opening letter', async ({ page }) => {
    await page.goto('/')
    await page.locator('.letter-img').click()
    await expect(page.getByText('Schedule')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('2023年11月26日(日)')).toBeVisible()
  })

  test('shows form card with Google Forms button after opening letter', async ({ page }) => {
    await page.goto('/')
    await page.locator('.letter-img').click()
    await expect(page.getByText('招待状に回答する')).toBeVisible({ timeout: 3000 })
  })

  test('shows footer after opening letter', async ({ page }) => {
    await page.goto('/')
    await page.locator('.letter-img').click()
    await expect(page.getByText('2023 Ken & Miki')).toBeVisible({ timeout: 3000 })
  })
})

test.describe('Invitation page (/invitation)', () => {
  test('shows full schedule (ceremony + reception)', async ({ page }) => {
    // sessionStorageに設定してletterをスキップ
    await page.goto('/invitation')
    await page.evaluate(() => sessionStorage.setItem('isLetterOpen', 'true'))
    await page.goto('/invitation')

    await expect(page.getByText('Schedule')).toBeVisible({ timeout: 3000 })
    // 挙式スケジュール
    await expect(page.getByText('挙式')).toBeVisible()
    // 披露宴スケジュール
    await expect(page.getByText('披露宴')).toBeVisible()
    await expect(page.getByText('お開き')).toBeVisible()
  })
})

test.describe('Invitation page (/invite)', () => {
  test('shows reception-only schedule', async ({ page }) => {
    await page.goto('/invite')
    await page.evaluate(() => sessionStorage.setItem('isLetterOpen', 'true'))
    await page.goto('/invite')

    await expect(page.getByText('Schedule')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('来賓　ご来館')).toBeVisible()
    await expect(page.getByText('披露宴')).toBeVisible()
  })
})

test.describe('Upload page', () => {
  test('shows upload instructions', async ({ page }) => {
    await page.goto('/upload')
    await expect(page.getByText('写真を共有するアプリを2人で作成しました')).toBeVisible()
    await expect(page.getByText('動画は非対応です')).toBeVisible()
  })

  test('shows file input', async ({ page }) => {
    await page.goto('/upload')
    await expect(page.locator('input[type="file"]')).toBeAttached()
  })

  test('upload button is hidden until file is selected', async ({ page }) => {
    await page.goto('/upload')
    // ファイル未選択時はアップロードボタンが非表示
    await expect(page.getByText('選択した写真をアップロードする')).not.toBeVisible()
  })
})

test.describe('Album page', () => {
  test('shows Back button and layout toggle buttons', async ({ page }) => {
    await page.goto('/album')
    await expect(page.getByText('Back')).toBeVisible()
    await expect(page.getByText('横に3つ表示する')).toBeVisible()
    await expect(page.getByText('横に2つ表示する')).toBeVisible()
  })
})

test.describe('Page title', () => {
  test('all pages have correct title', async ({ page }) => {
    for (const path of ['/', '/invitation', '/invite', '/upload', '/album']) {
      await page.goto(path)
      await expect(page).toHaveTitle('Ken&Miki Wedding')
    }
  })
})
