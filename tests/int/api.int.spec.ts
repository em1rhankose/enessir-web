import { getPayload, Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

let payload: Payload

// Testler Next.js dışında çalıştığı için site önbelleğini temizleme hook'u atlanır.
const context = { disableRevalidate: true }

describe('Erişim kuralları', () => {
  let draftArticleId: number | undefined
  let messageId: number | undefined

  beforeAll(async () => {
    payload = await getPayload({ config: await config })

    const media = await payload.find({ collection: 'media', limit: 1 })
    const coverImage = media.docs[0]?.id

    if (coverImage) {
      const draft = await payload.create({
        collection: 'articles',
        context,
        draft: true,
        data: {
          title: 'Test Taslak Makale',
          excerpt: 'Taslak makale ziyaretçilere görünmemeli.',
          coverImage,
          content: {
            root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 },
          },
          _status: 'draft',
        },
      })
      draftArticleId = draft.id
    }

    const message = await payload.create({
      collection: 'contact-messages',
      data: {
        name: 'Test Kişi',
        email: 'test@ornek.com',
        message: 'Bu bir test mesajıdır.',
        kvkkConsent: true,
      },
    })
    messageId = message.id
  })

  afterAll(async () => {
    if (draftArticleId) await payload.delete({ collection: 'articles', id: draftArticleId, context })
    if (messageId) await payload.delete({ collection: 'contact-messages', id: messageId })
  })

  it('ziyaretçi iletişim mesajlarını okuyamaz', async () => {
    await expect(
      payload.find({ collection: 'contact-messages', overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('ziyaretçi taslak makaleleri göremez', async ({ skip }) => {
    if (!draftArticleId) skip()

    const result = await payload.find({
      collection: 'articles',
      overrideAccess: false,
      where: { id: { equals: draftArticleId } },
    })
    expect(result.totalDocs).toBe(0)
  })

  it('ziyaretçi site ayarlarını okuyabilir ama değiştiremez', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
    expect(settings.siteName).toBeTruthy()

    await expect(
      payload.updateGlobal({ slug: 'site-settings', overrideAccess: false, data: { siteName: 'X' } }),
    ).rejects.toThrow()
  })

  it('makale başlığından otomatik Türkçe uyumlu slug üretilir', async ({ skip }) => {
    if (!draftArticleId) skip()

    const article = await payload.findByID({ collection: 'articles', id: draftArticleId!, draft: true })
    expect(article.slug).toBe('test-taslak-makale')
  })
})
