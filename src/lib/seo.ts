import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/queries'
import { getImage } from '@/utilities/media'

type SeoGroup = {
  title?: string | null
  description?: string | null
  image?: unknown
} | null

type PageMetadataOptions = {
  /** Admin paneldeki sayfa bazlı SEO alanları; boş olanlar için aşağıdaki varsayılanlar kullanılır. */
  seo?: SeoGroup
  title: string
  description?: string | null
  image?: unknown
  /** Sayfanın adresi, örn. "/hizmetler/cift-terapisi" (kanonik adres için). */
  path: string
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  /** Ana sayfa gibi, başlığın sonuna site adı eklenmeyecek sayfalar için. */
  absoluteTitle?: boolean
}

/**
 * Sayfa başlığı, açıklaması, kanonik adresi ve paylaşım önizlemesi.
 * Öncelik: admin paneldeki SEO alanı → sayfanın kendi içeriği → site geneli varsayılan.
 */
export const buildPageMetadata = async ({
  seo,
  title,
  description,
  image,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
}: PageMetadataOptions): Promise<Metadata> => {
  const settings = await getSiteSettings()

  const finalTitle = seo?.title || title
  const finalDescription = seo?.description || description || settings.seoDescription || undefined
  const shareImage =
    getImage(seo?.image, 'hero') ?? getImage(image, 'hero') ?? getImage(settings.defaultShareImage, 'hero')

  return {
    title: absoluteTitle ? { absolute: finalTitle } : finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: finalTitle,
      description: finalDescription,
      url: path,
      siteName: settings.siteName,
      locale: 'tr_TR',
      publishedTime: publishedTime ?? undefined,
      modifiedTime: modifiedTime ?? undefined,
      images: shareImage
        ? [{ url: shareImage.src, width: shareImage.width, height: shareImage.height, alt: shareImage.alt }]
        : undefined,
    },
    twitter: { card: shareImage ? 'summary_large_image' : 'summary' },
  }
}
