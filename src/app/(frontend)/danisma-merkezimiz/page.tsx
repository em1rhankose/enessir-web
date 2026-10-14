import type { Metadata } from 'next'
import Image from 'next/image'

import { LeafIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { getCounselingCenter } from '@/lib/queries'
import { getImage } from '@/utilities/media'

export async function generateMetadata(): Promise<Metadata> {
  const center = await getCounselingCenter()
  return {
    title: 'Danışma Merkezimiz',
    description: center.summary ?? undefined,
  }
}

export default async function CounselingCenterPage() {
  const center = await getCounselingCenter()
  const gallery = (center.gallery ?? []).map((media) => getImage(media, 'card')).filter((image) => image !== null)

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

      {center.services && center.services.length > 0 && (
        <section className="bg-sand py-20 md:py-24">
          <div className="container-page">
            <Reveal>
              <p className="eyebrow">Hizmetler</p>
              <h2 className="mt-3 text-3xl text-ink md:text-4xl">Size nasıl yardımcı olabiliriz?</h2>
            </Reveal>
            <div role="list" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {center.services.map((service, index) => (
                <Reveal key={service.id ?? service.title} delay={(index % 3) * 0.1} className="h-full">
                  <div role="listitem" className="h-full rounded-3xl bg-white p-7 ring-1 ring-line">
                    <span className="flex size-11 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                      <LeafIcon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-xl text-ink">{service.title}</h3>
                    {service.description && (
                      <p className="mt-3 leading-relaxed text-muted">{service.description}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <Reveal key={image.src} delay={(index % 3) * 0.1}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sage-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
