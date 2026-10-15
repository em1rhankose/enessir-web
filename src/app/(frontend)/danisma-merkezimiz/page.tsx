import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowRightIcon } from '@/components/Icons'
import { MediaFrame } from '@/components/MediaFrame'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { ServiceCard } from '@/components/ServiceCard'
import { getCounselingCenter, getServices } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'
import { isMedia } from '@/utilities/media'

export async function generateMetadata(): Promise<Metadata> {
  const center = await getCounselingCenter()
  return buildPageMetadata({
    seo: center.seo,
    title: 'Danışma Merkezimiz',
    description: center.summary,
    image: center.gallery?.[0],
    path: '/danisma-merkezimiz',
  })
}

export default async function CounselingCenterPage() {
  const [center, services] = await Promise.all([getCounselingCenter(), getServices()])
  const gallery = (center.gallery ?? []).filter(isMedia)

  return (
    <>
      <PageHeader eyebrow="Danışma Merkezimiz" title={center.title} description={center.summary} />

      {center.content && (
        <section className="py-20 md:py-24">
          <Reveal className="container-page max-w-3xl">
            <RichText data={center.content} />
          </Reveal>
        </section>
      )}

      {services.length > 0 && (
        <section className="bg-sand py-20 md:py-24">
          <div className="container-page">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Hizmetler</p>
                <h2 className="mt-3 text-3xl text-ink md:text-4xl">Size nasıl yardımcı olabiliriz?</h2>
              </div>
              <Link
                href="/hizmetler"
                className="inline-flex shrink-0 items-center gap-2 font-semibold text-sage-600 hover:text-sage-800"
              >
                Tüm hizmetler
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={(index % 3) * 0.1} className="h-full">
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="container-page grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((media, index) => (
              <Reveal key={media.id} delay={(index % 3) * 0.1}>
                <MediaFrame
                  media={media}
                  size="card"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] rounded-3xl bg-sage-100"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
