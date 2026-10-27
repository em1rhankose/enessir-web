import type { MetadataRoute } from 'next'

import { getAllArticleSlugs, getServices } from '@/lib/queries'
import { getServerUrl } from '@/utilities/getServerUrl'

/** Google'ın sitedeki sayfaları bulması için site haritası (/sitemap.xml). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerUrl()
  const [articles, services] = await Promise.all([getAllArticleSlugs(), getServices()])

  const staticPages = ['', '/ofisimiz', '/ben-kimim', '/hizmetler', '/makaleler', '/iletisim'].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    }),
  )

  const servicePages = services
    .filter((service) => service.slug)
    .map((service) => ({
      url: `${baseUrl}/hizmetler/${service.slug}`,
      lastModified: new Date(service.updatedAt),
    }))

  const articlePages = articles
    .filter((article) => article.slug)
    .map((article) => ({
      url: `${baseUrl}/makaleler/${article.slug}`,
      lastModified: new Date(article.updatedAt),
    }))

  return [...staticPages, ...servicePages, ...articlePages]
}
