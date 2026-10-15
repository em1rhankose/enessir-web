// @vitest-environment node
// Görsel yükleme gerçek Node.js ortamı ister; jsdom'un Uint8Array'i Payload'ın dosya kontrolünü geçemez.
import { getPayload, Payload } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

let payload: Payload
const createdIds: number[] = []

// Testler Next.js dışında çalıştığı için site önbelleğini temizleme hook'u atlanır.
const context = { disableRevalidate: true }

/** 400x400 tuval ortasına 100x200'lük dolu bir dikdörtgen çizer. */
type Color = { r: number; g: number; b: number; alpha: number }

const makeImage = (background: Color, format: 'png' | 'jpeg') =>
  sharp({ create: { width: 400, height: 400, channels: 4, background } })
    .composite([
      {
        input: { create: { width: 100, height: 200, channels: 4, background: '#618372' } },
        left: 150,
        top: 100,
      },
    ])
    .toFormat(format)
    .toBuffer()

const upload = async (data: Buffer, name: string, mimetype: string) => {
  const doc = await payload.create({
    collection: 'media',
    context,
    data: { alt: 'Test görseli' },
    file: { data, name, mimetype, size: data.length },
  })
  createdIds.push(doc.id)
  return doc
}

describe('Şeffaf PNG kırpma', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of createdIds) await payload.delete({ collection: 'media', id, context })
  })

  it('şeffaf PNG etrafındaki boş alanı kırpar', async () => {
    const doc = await upload(
      await makeImage({ r: 0, g: 0, b: 0, alpha: 0 }, 'png'),
      'test-seffaf.png',
      'image/png',
    )
    expect(doc.width).toBe(100)
    expect(doc.height).toBe(200)
  })

  it('kenarı düz renkli normal fotoğrafa dokunmaz', async () => {
    const doc = await upload(
      await makeImage({ r: 255, g: 255, b: 255, alpha: 1 }, 'jpeg'),
      'test-foto.jpg',
      'image/jpeg',
    )
    expect(doc.width).toBe(400)
    expect(doc.height).toBe(400)
  })

  it('şeffaflığı olmayan PNG’ye dokunmaz', async () => {
    const opaque = await sharp(await makeImage({ r: 255, g: 255, b: 255, alpha: 1 }, 'png'))
      .removeAlpha()
      .png()
      .toBuffer()
    const doc = await upload(opaque, 'test-opak.png', 'image/png')
    expect(doc.width).toBe(400)
    expect(doc.height).toBe(400)
  })
})
