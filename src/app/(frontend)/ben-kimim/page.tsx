import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { getAbout } from '@/lib/queries'
import { getImage } from '@/utilities/media'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  return {
    title: 'Ben Kimim',
    description: about.summary ?? `${about.fullName} – ${about.jobTitle ?? 'Psikolog'}`,
  }
}

export default async function AboutPage() {
  const about = await getAbout()
  const photo = getImage(about.photo, 'card')

  return (
    <>
      <PageHeader eyebrow="Ben Kimim" title={about.fullName} description={about.jobTitle} />

      <section className="py-20 md:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[4fr_7fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2rem] bg-sage-200">
                {photo && (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <Link href="/iletisim" className="btn-primary mt-8 w-full">
                Randevu Al
              </Link>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              {about.biography ? (
                <RichText data={about.biography} />
              ) : (
                about.summary && <p className="text-lg leading-relaxed text-muted">{about.summary}</p>
              )}
            </Reveal>

            {about.qualifications && about.qualifications.length > 0 && (
              <Reveal delay={0.15} className="mt-16">
                <h2 className="text-3xl text-ink">Eğitim ve Sertifikalar</h2>
                <ol className="mt-8 space-y-6 border-l border-sage-200 pl-8">
                  {about.qualifications.map((item) => (
                    <li key={item.id ?? item.title} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 -left-[2.3rem] size-3 rounded-full bg-sage-500 ring-4 ring-cream"
                      />
                      {item.year && <p className="text-sm font-semibold text-sage-600">{item.year}</p>}
                      <p className="mt-1 text-lg font-medium text-ink">{item.title}</p>
                      {item.institution && <p className="text-muted">{item.institution}</p>}
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
