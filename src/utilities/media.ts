import type { Media } from '@/payload-types'

type ImageSize = keyof NonNullable<Media['sizes']>

/** Payload ilişkili alanları ya id (sayı) ya da dolu nesne olarak döner; nesne olup olmadığını kontrol eder. */
export const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in value

/**
 * Görselin istenen boyuttaki sürümünün bilgilerini döner; o boyut yoksa (örn. orijinal görsel
 * zaten küçükse) orijinali kullanır.
 */
export const getImage = (media: unknown, size?: ImageSize) => {
  if (!isMedia(media) || !media.url) return null

  const variant = size ? media.sizes?.[size] : undefined

  if (variant?.url && variant.width && variant.height) {
    return { src: variant.url, width: variant.width, height: variant.height, alt: media.alt }
  }

  return {
    src: media.url,
    width: media.width ?? 1200,
    height: media.height ?? 800,
    alt: media.alt,
  }
}
