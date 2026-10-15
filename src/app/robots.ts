import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/lib/queries'
import { getServerUrl } from '@/utilities/getServerUrl'

/** /robots.txt — Site Ayarları'ndaki "arama motorlarında görünsün" seçeneğine göre. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()

  if (!settings.allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${getServerUrl()}/sitemap.xml`,
  }
}
