import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MotionProvider } from '@/components/MotionProvider'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSiteSettings } from '@/lib/queries'
import { getServerUrl } from '@/utilities/getServerUrl'
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
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-cream text-ink">
        <MotionProvider>
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-sage-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            İçeriğe geç
          </a>
          <Header siteName={settings.siteName} />
          <main id="main">{children}</main>
          <Footer settings={settings} />
          {settings.whatsappNumber && (
            <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} />
          )}
        </MotionProvider>
      </body>
    </html>
  )
}
