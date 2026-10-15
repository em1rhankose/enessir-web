import type { Metadata } from 'next'

import { ContactSection } from '@/components/ContactSection'
import { PageHeader } from '@/components/PageHeader'
import { getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'

export const generateMetadata = (): Promise<Metadata> =>
  buildPageMetadata({
    title: 'İletişim',
    description: 'Randevu ve bilgi almak için iletişim formunu doldurun, arayın veya WhatsApp’tan yazın.',
    path: '/iletisim',
  })

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHeader eyebrow="İletişim" title="Bize Ulaşın" />
      <section className="py-20 md:py-24">
        <div className="container-page">
          <ContactSection settings={settings} />
        </div>
      </section>
    </>
  )
}
