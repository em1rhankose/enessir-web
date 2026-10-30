import { expect, Page, test } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin paneli', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('Türkçe menüde içerik grupları görünür', async () => {
    await page.goto('/admin')
    const nav = page.locator('nav')
    for (const label of ['Yazılarım', 'İletişim Mesajları', 'Ana Sayfa', 'Site Ayarları']) {
      await expect(nav.getByText(label, { exact: true }).first()).toBeVisible()
    }
  })

  test('makale listesi açılır', async () => {
    await page.goto('/admin/collections/articles')
    await expect(page.locator('h1', { hasText: 'Yazılarım' }).first()).toBeVisible()
  })

  test('site ayarlarında WhatsApp numarası alanı vardır', async () => {
    await page.goto('/admin/globals/site-settings')
    await expect(page.locator('input[name="whatsappNumber"]')).toBeAttached()
  })
})
