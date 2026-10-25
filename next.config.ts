import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/** Tarayıcıya gönderilen güvenlik başlıkları; tüm sayfalar ve admin paneli için geçerlidir. */
const securityHeaders = [
  // Site sadece HTTPS üzerinden açılsın (canlıda Caddy HTTPS sağlar).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Site başka sitelerin içine gömülemesin (clickjacking koruması).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Tarayıcı dosya türünü tahmin etmeye çalışmasın.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Başka sitelere giderken tam adres değil, sadece alan adı paylaşılsın.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Sitenin ihtiyacı olmayan tarayıcı izinleri tamamen kapalı.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
]

const nextConfig: NextConfig = {
  // Docker imajı için: çalışması gereken dosyalar .next/standalone altında toplanır (küçük imaj, hızlı açılış).
  // Vercel kendi çıktı biçimini kullandığı için orada kapalıdır.
  output: process.env.VERCEL ? undefined : 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    // Vercel'de görseller Vercel Blob'dan gelir.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
