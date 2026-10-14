import Image from 'next/image'
import Link from 'next/link'

import { ArticleCard } from '@/components/ArticleCard'
import { ContactSection } from '@/components/ContactSection'
import { Hero } from '@/components/home/Hero'
import { ArrowRightIcon, LeafIcon } from '@/components/Icons'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import {
  getAbout,
  getCounselingCenter,
  getHomePage,
  getLatestArticles,
  getSiteSettings,
} from '@/lib/queries'
import { getImage } from '@/utilities/media'

export default async function HomePage() {
  const [home, center, about, articles, settings] = await Promise.all([
    getHomePage(),
    getCounselingCenter(),
    getAbout(),
    getLatestArticles(3),
    getSiteSettings(),
  ])

  const heroImage = getImage(home.heroImage, 'hero')
  // Portre şeffaf PNG olduğu için orijinal dosya kullanılır; Next.js zaten ekrana uygun boyutu üretir.
  const heroPortrait = getImage(home.heroPortrait)
  const centerImage = getImage(center.gallery?.[0], 'card')
  const aboutPhoto = getImage(about.photo, 'card')

  return (
    <>
      <Hero
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        buttonText={home.heroButtonText}
        image={heroImage}
        portrait={heroPortrait}
      />

      {/* Danışma Merkezimiz */}
      <section id="danisma-merkezimiz" className="py-24 md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Danışma Merkezimiz" title={center.title} description={center.summary} />

            {center.services && center.services.length > 0 && (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {center.services.slice(0, 4).map((service) => (
                  <li key={service.id ?? service.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                      <LeafIcon className="size-4" />
                    </span>
                    <span className="pt-1 font-medium text-ink">{service.title}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/danisma-merkezimiz" className="btn-outline mt-10">
              Merkezimizi Tanıyın
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-4 -z-10 rotate-2 rounded-[2.5rem] bg-sage-100" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage-200">
                {centerImage ? (
                  <Image
                    src={centerImage.src}
                    alt={centerImage.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-sage-500">
                    <LeafIcon className="size-16" />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ben Kimim */}
      <section id="ben-kimim" className="bg-sand py-24 md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal className="order-last lg:order-first">
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-t-full rounded-b-[2rem] bg-sage-200 lg:max-w-none">
              {aboutPhoto && (
                <Image
                  src={aboutPhoto.src}
                  alt={aboutPhoto.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <SectionHeading eyebrow="Ben Kimim" title={about.fullName} />
            {about.jobTitle && <p className="mt-2 text-lg font-medium text-sage-600">{about.jobTitle}</p>}
            {about.summary && (
              <p className="mt-6 text-lg leading-relaxed whitespace-pre-line text-muted">{about.summary}</p>
            )}
            <Link href="/ben-kimim" className="btn-outline mt-10">
              Hikâyemi Okuyun
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Son Makaleler */}
      <section id="makaleler" className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Makaleler" title={home.articlesHeading || 'Son Makaleler'} />
            <Link
              href="/makaleler"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-sage-600 hover:text-sage-800"
            >
              Tüm makaleler
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>

          {articles.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Reveal key={article.id} delay={index * 0.12} className="h-full">
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-muted">Yakında burada makaleler yer alacak.</p>
          )}
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="bg-sand py-24 md:py-32">
        <div className="container-page">
          <ContactSection settings={settings} heading={home.contactHeading || 'Bize Ulaşın'} />
        </div>
      </section>
    </>
  )
}
