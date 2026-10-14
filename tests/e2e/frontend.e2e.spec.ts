import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

const TEST_EMAIL = 'e2e-test@ornek.com'

test.describe('Ana sayfa', () => {
  test('başlık çubuğu en üstte şeffaf, aşağı kaydırınca dolu', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header').first()

    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await page.mouse.wheel(0, 1200)
    await expect(header).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  })

  test('bölümler menü sırasıyla gelir ve en fazla 3 makale gösterilir', async ({ page }) => {
    await page.goto('/')

    const sectionIds = await page.locator('main section[id]').evaluateAll((sections) =>
      sections.map((section) => section.id),
    )
    expect(sectionIds).toEqual(['danisma-merkezimiz', 'ben-kimim', 'makaleler', 'iletisim'])

    const cards = page.locator('#makaleler article')
    expect(await cards.count()).toBeLessThanOrEqual(3)
  })

  test('makale kartına tıklayınca makale sayfası açılır', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('#makaleler article').first()
    test.skip((await firstCard.count()) === 0, 'Yayınlanmış makale yok')

    const title = await firstCard.locator('h3').innerText()
    await firstCard.locator('h3 a').click()

    await expect(page).toHaveURL(/\/makaleler\/.+/)
    await expect(page.locator('h1')).toHaveText(title)
  })
})

test.describe('WhatsApp butonu', () => {
  const button = 'a[href^="https://wa.me/"]'

  for (const path of ['/', '/danisma-merkezimiz', '/ben-kimim', '/iletisim']) {
    test(`${path} sayfasında görünür`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator(button)).toHaveCount(1)
    })
  }

  test('makale listesinde ve makale sayfasında gizlidir', async ({ page }) => {
    await page.goto('/makaleler')
    await expect(page.locator(button)).toHaveCount(0)

    const firstArticle = page.locator('main article h3 a').first()
    if ((await firstArticle.count()) > 0) {
      await firstArticle.click()
      await expect(page).toHaveURL(/\/makaleler\/.+/)
      await expect(page.locator(button)).toHaveCount(0)
    }
  })
})

test.describe('İletişim formu', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({ collection: 'contact-messages', where: { email: { equals: TEST_EMAIL } } })
  })

  test('eksik alanlarda Türkçe hata mesajları gösterir', async ({ page }) => {
    await page.goto('/iletisim')
    await page.getByRole('button', { name: 'Mesajı Gönder' }).click()

    await expect(page.getByText('Lütfen adınızı ve soyadınızı yazın.')).toBeVisible()
    await expect(page.getByText('Lütfen geçerli bir e-posta adresi yazın.')).toBeVisible()
    await expect(page.getByText('Devam etmek için aydınlatma metnini onaylamanız gerekiyor.')).toBeVisible()
  })

  test('geçerli form gönderilir ve mesaj kaydedilir', async ({ page }) => {
    await page.goto('/iletisim')
    await page.getByLabel('Ad Soyad').fill('E2E Test')
    await page.getByLabel('E-posta').fill(TEST_EMAIL)
    await page.getByLabel('Mesajınız').fill('Bu mesaj otomatik test tarafından gönderildi.')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Mesajı Gönder' }).click()

    await expect(page.getByText('Mesajınız iletildi')).toBeVisible()

    const payload = await getPayload({ config })
    const saved = await payload.find({
      collection: 'contact-messages',
      where: { email: { equals: TEST_EMAIL } },
    })
    expect(saved.totalDocs).toBeGreaterThan(0)
  })
})

test('olmayan bir sayfa Türkçe 404 gösterir', async ({ page }) => {
  const response = await page.goto('/boyle-bir-sayfa-yok')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Aradığınız sayfa bulunamadı' })).toBeVisible()
})
