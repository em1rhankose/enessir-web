import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { ServiceCard } from '@/components/ServiceCard'
import { getServices, getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()])
  // Yer adına ek getirmek ("Kadıköy'de", "İstanbul'da") ünlü uyumu gerektirdiği için ek kullanılmaz.
  const location = [settings.district, settings.city].filter(Boolean).join(', ')
  const names = services.map((service) => service.title).join(', ')
  return buildPageMetadata({
    title: 'Hizmetler',
    description: `Psikolojik danışmanlık hizmetleri${location ? ` — ${location}` : ''}${names ? `: ${names}.` : '.'}`,
    path: '/hizmetler',
  })
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <PageHeader
        eyebrow="Hizmetler"
        title="Size nasıl yardımcı olabiliriz?"
        description="Her hizmetin detaylarını, sürecin nasıl işlediğini ve sık sorulan soruları ilgili sayfada bulabilirsiniz."
      />

      <section className="py-20 md:py-24">
        <div className="container-page">
          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={(index % 3) * 0.1} className="h-full">
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted">Hizmet bilgileri yakında eklenecek.</p>
          )}
        </div>
      </section>
    </>
  )
}
