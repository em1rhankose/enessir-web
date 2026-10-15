import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqList } from '@/components/FaqList'
import { ArrowLeftIcon } from '@/components/Icons'
import { JsonLd } from '@/components/JsonLd'
import { MediaFrame } from '@/components/MediaFrame'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { ServiceCard } from '@/components/ServiceCard'
import { getServiceBySlug, getServices, getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'
import { faqSchema, serviceSchema } from '@/lib/structuredData'
import { getServerUrl } from '@/utilities/getServerUrl'
import { isMedia } from '@/utilities/media'

/** Yayınlanmış hizmetlerin sayfaları build sırasında önceden üretilir; yenileri ilk ziyarette üretilir. */
export async function generateStaticParams() {
  const services = await getServices()
  return services.filter((service) => service.slug).map((service) => ({ slug: service.slug as string }))
}

export async function generateMetadata({ params }: PageProps<'/hizmetler/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}

  return buildPageMetadata({
    seo: service.seo,
    title: service.title,
    description: service.summary,
    image: service.image,
    path: `/hizmetler/${slug}`,
  })
}

export default async function ServicePage({ params }: PageProps<'/hizmetler/[slug]'>) {
  const { slug } = await params
  const [service, services, settings] = await Promise.all([getServiceBySlug(slug), getServices(), getSiteSettings()])

  if (!service) notFound()

  const otherServices = services.filter((item) => item.id !== service.id).slice(0, 3)
  const baseUrl = getServerUrl()

  return (
    <>
      <JsonLd data={[serviceSchema(service, settings, baseUrl), faqSchema(service.faqs)]} />

      <PageHeader
        eyebrow="Hizmetler"
        title={service.title}
        description={
          <>
            <p>{service.summary}</p>
            <Link
              href="/hizmetler"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:text-sage-800"
            >
              <ArrowLeftIcon className="size-4" />
              Tüm hizmetler
            </Link>
          </>
        }
      />

      <section className="py-20 md:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[7fr_4fr] lg:gap-20">
          <Reveal>
            {service.content ? (
              <RichText data={service.content} />
            ) : (
              <p className="text-lg leading-relaxed text-muted">{service.summary}</p>
            )}

            {service.faqs && service.faqs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl text-ink">Sık Sorulan Sorular</h2>
                <div className="mt-8">
                  <FaqList faqs={service.faqs} />
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="space-y-6 lg:sticky lg:top-28">
              {isMedia(service.image) && (
                <MediaFrame
                  media={service.image}
                  size="card"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="aspect-[4/3] rounded-3xl bg-sage-100"
                />
              )}
              <div className="rounded-3xl bg-sage-50 p-7 ring-1 ring-sage-100">
                <p className="font-serif text-2xl text-ink">Randevu almak ister misiniz?</p>
                <p className="mt-3 text-muted">
                  {service.title} hakkında sorularınız için bizimle iletişime geçebilirsiniz.
                </p>
                <Link href="/iletisim" className="btn-primary mt-6 w-full">
                  Randevu Al
                </Link>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {otherServices.length > 0 && (
        <section aria-labelledby="other-services" className="border-t border-line bg-sand py-20">
          <div className="container-page">
            <h2 id="other-services" className="text-3xl text-ink">
              Diğer hizmetler
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherServices.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
