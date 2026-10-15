import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

/**
 * Sitenin Payload'dan veri okuduğu tek yer.
 * `cache` aynı istek içinde aynı sorgunun tekrar çalışmasını engeller
 * (örn. site ayarları hem layout'ta hem sayfada okunduğunda veritabanına bir kez gidilir).
 */
const getPayloadClient = () => getPayload({ config })

/** Ziyaretçiler sadece yayınlanmış makaleleri görür. */
const publishedOnly: Where = { _status: { equals: 'published' } }

export const ARTICLES_PER_PAGE = 9

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHomePage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home-page', depth: 1 })
})

export const getCounselingCenter = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'counseling-center', depth: 1 })
})

export const getAbout = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about', depth: 1 })
})

export const getLatestArticles = cache(async (limit = 3) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: publishedOnly,
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return result.docs
})

export const getArticlesPage = cache(async (page = 1) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'articles',
    where: publishedOnly,
    sort: '-publishedAt',
    limit: ARTICLES_PER_PAGE,
    page,
    depth: 1,
  })
})

export const getArticleBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { and: [publishedOnly, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
})

export const getAllArticleSlugs = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: publishedOnly,
    pagination: false,
    depth: 0,
    select: { slug: true, title: true, updatedAt: true },
  })
  return result.docs
}

/** Yayınlanmış tüm hizmetler, admin paneldeki "Sıra" alanına göre. */
export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: publishedOnly,
    sort: ['order', 'title'],
    pagination: false,
    depth: 1,
  })
  return result.docs
})

export const getServiceBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { and: [publishedOnly, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
})
