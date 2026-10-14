import type { MetadataRoute } from 'next'

import { getAllArticleSlugs } from '@/lib/queries'
import { getServerUrl } from '@/utilities/getServerUrl'

/** Google'ın sitedeki sayfaları bulması için site haritası (/sitemap.xml). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerUrl()
  const articles = await getAllArticleSlugs()

  const staticPages = ['', '/danisma-merkezimiz', '/ben-kimim', '/makaleler', '/iletisim'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  const articlePages = articles
    .filter((article) => article.slug)
    .map((article) => ({
      url: `${baseUrl}/makaleler/${article.slug}`,
      lastModified: new Date(article.updatedAt),
    }))

  return [...staticPages, ...articlePages]
}
