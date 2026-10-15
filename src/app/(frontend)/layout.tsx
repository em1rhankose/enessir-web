import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { MotionProvider } from '@/components/MotionProvider'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getAbout, getServices, getSiteSettings } from '@/lib/queries'
import { businessSchema, websiteSchema } from '@/lib/structuredData'
import { getServerUrl } from '@/utilities/getServerUrl'
import { getImage } from '@/utilities/media'
import './styles.css'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const shareImage = getImage(settings.defaultShareImage, 'hero')

  return {
    metadataBase: new URL(getServerUrl()),
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDescription ?? undefined,
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      siteName: settings.siteName,
      images: shareImage
        ? [{ url: shareImage.src, width: shareImage.width, height: shareImage.height, alt: shareImage.alt }]
        : undefined,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, about, services] = await Promise.all([getSiteSettings(), getAbout(), getServices()])
  const baseUrl = getServerUrl()

  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-cream text-ink">
        {/* Her sayfada: site ve işletme bilgisi (adres, konum, hizmetler) — arama motorları için. */}
        <JsonLd data={[websiteSchema(settings, baseUrl), businessSchema(settings, about, services, baseUrl)]} />
        <MotionProvider>
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-sage-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            İçeriğe geç
          </a>
          <Header siteName={settings.siteName} />
          <main id="main">{children}</main>
          <Footer settings={settings} services={services} />
          {settings.whatsappNumber && (
            <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} />
          )}
        </MotionProvider>
      </body>
    </html>
  )
}
