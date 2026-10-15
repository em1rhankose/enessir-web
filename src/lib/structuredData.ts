import type { About, Article, Service, SiteSetting } from '@/payload-types'
import { getImage } from '@/utilities/media'

/**
 * Google ve yapay zekâ arama motorlarının siteyi "kim, nerede, ne yapıyor" olarak anlaması için
 * schema.org yapılandırılmış verisi (JSON-LD). Kayıtlar @id ile birbirine bağlanır: makalenin yazarı
 * işletmede çalışan psikolog, hizmetin sağlayıcısı işletmedir.
 */

type JsonLd = Record<string, unknown>

const businessId = (baseUrl: string) => `${baseUrl}/#isletme`
const personId = (baseUrl: string) => `${baseUrl}/#psikolog`
const websiteId = (baseUrl: string) => `${baseUrl}/#site`

const absoluteUrl = (baseUrl: string, path?: string | null) =>
  path ? (path.startsWith('http') ? path : `${baseUrl}${path}`) : undefined

/** "41.0082,28.9784" gibi koordinat yazıldıysa haritadaki konumu döner. */
const parseCoordinates = (value?: string | null) => {
  const match = value?.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
  return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : undefined
}

const sameAsLinks = (settings: SiteSetting) =>
  [settings.googleBusinessUrl, ...(settings.socialLinks ?? []).map((link) => link.url)].filter(
    (url): url is string => Boolean(url),
  )

export const websiteSchema = (settings: SiteSetting, baseUrl: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': websiteId(baseUrl),
  url: baseUrl,
  name: settings.siteName,
  description: settings.seoDescription ?? undefined,
  inLanguage: 'tr-TR',
  publisher: { '@id': businessId(baseUrl) },
})

export const businessSchema = (
  settings: SiteSetting,
  about: About,
  services: Service[],
  baseUrl: string,
): JsonLd => {
  const coordinates = parseCoordinates(settings.mapQuery)
  const image = getImage(about.photo) ?? getImage(settings.defaultShareImage)

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': businessId(baseUrl),
    name: settings.siteName,
    description: settings.seoDescription ?? undefined,
    url: baseUrl,
    image: absoluteUrl(baseUrl, image?.src),
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address.replace(/\s*\n\s*/g, ', '),
          addressLocality: settings.district ?? undefined,
          addressRegion: settings.city ?? undefined,
          addressCountry: 'TR',
        }
      : undefined,
    geo: coordinates ? { '@type': 'GeoCoordinates', ...coordinates } : undefined,
    hasMap: settings.googleBusinessUrl ?? undefined,
    areaServed: [settings.district, settings.city].filter(Boolean).map((name) => ({ '@type': 'City', name })),
    // Serbest metin (örn. "Pazartesi – Cumartesi, 09:00 – 19:00"); ziyaretçiye gösterilen haliyle.
    openingHours: settings.workingHours ?? undefined,
    sameAs: sameAsLinks(settings),
    employee: { '@id': personId(baseUrl) },
    knowsLanguage: 'tr',
    makesOffer: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        url: `${baseUrl}/hizmetler/${service.slug}`,
      },
    })),
  }
}

export const personSchema = (about: About, settings: SiteSetting, services: Service[], baseUrl: string): JsonLd => {
  const photo = getImage(about.photo)
  const institutions = [
    ...new Set((about.qualifications ?? []).map((item) => item.institution).filter(Boolean)),
  ] as string[]

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(baseUrl),
    name: about.fullName,
    jobTitle: about.jobTitle ?? undefined,
    description: about.summary ?? undefined,
    image: absoluteUrl(baseUrl, photo?.src),
    url: `${baseUrl}/ben-kimim`,
    worksFor: { '@id': businessId(baseUrl) },
    alumniOf: institutions.map((name) => ({ '@type': 'EducationalOrganization', name })),
    hasCredential: (about.qualifications ?? []).map((item) => ({
      '@type': 'EducationalOccupationalCredential',
      name: item.title,
      recognizedBy: item.institution ? { '@type': 'Organization', name: item.institution } : undefined,
    })),
    knowsAbout: services.map((service) => service.title),
    sameAs: (settings.socialLinks ?? []).map((link) => link.url),
  }
}

export const articleSchema = (article: Article, baseUrl: string): JsonLd => {
  const cover = getImage(article.coverImage, 'hero')

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(baseUrl, cover?.src),
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: 'tr-TR',
    author: { '@id': personId(baseUrl) },
    publisher: { '@id': businessId(baseUrl) },
    mainEntityOfPage: `${baseUrl}/makaleler/${article.slug}`,
  }
}

export const serviceSchema = (service: Service, settings: SiteSetting, baseUrl: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.summary,
  url: `${baseUrl}/hizmetler/${service.slug}`,
  serviceType: service.title,
  provider: { '@id': businessId(baseUrl) },
  areaServed: [settings.district, settings.city].filter(Boolean).map((name) => ({ '@type': 'City', name })),
})

export const faqSchema = (faqs?: { question: string; answer: string }[] | null): JsonLd | null =>
  faqs && faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null
