import type { MetadataRoute } from 'next'

import { getServerUrl } from '@/utilities/getServerUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${getServerUrl()}/sitemap.xml`,
  }
}
