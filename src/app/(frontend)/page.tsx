import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/ArticleCard'
import { ContactSection } from '@/components/ContactSection'
import { FaqList } from '@/components/FaqList'
import { Hero } from '@/components/home/Hero'
import { ArrowRightIcon, LeafIcon } from '@/components/Icons'
import { JsonLd } from '@/components/JsonLd'
import { getFramedCrop, MediaFrame } from '@/components/MediaFrame'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import {
  getAbout,
  getCounselingCenter,
  getHomePage,
  getLatestArticles,
  getServices,
  getSiteSettings,
} from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'
import { faqSchema } from '@/lib/structuredData'
import { getImage, isMedia } from '@/utilities/media'

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return buildPageMetadata({
    seo: home.seo,
    title: settings.siteName,
    description: settings.seoDescription,
    path: '/',
    absoluteTitle: true,
  })
}

export default async function HomePage() {
  const [home, center, about, articles, settings, services] = await Promise.all([
    getHomePage(),
    getCounselingCenter(),
    getAbout(),
    getLatestArticles(3),
    getSiteSettings(),
    getServices(),
  ])

  const heroImage = getImage(home.heroImage, 'hero')
  const heroPortrait = isMedia(home.heroPortrait) ? home.heroPortrait : null
  // Ofisimiz galerisinin ilk fotoğrafı ana sayfada da kullanılır.
  const centerMedia = center.gallery?.[0]
  const centerCrop = getFramedCrop(centerMedia)

  return (
    <>
      <Hero
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        buttonText={home.heroButtonText}
        image={heroImage}
        portrait={heroPortrait}
      />

      {/* Ofisimiz */}
      <section id="ofisimiz" className="py-24 md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Ofisimiz" title={center.title} description={center.summary} />

            {services.length > 0 && (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {services.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <Link href={`/hizmetler/${service.slug}`} className="group flex gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600 transition-colors group-hover:bg-sage-600 group-hover:text-white">
                        <LeafIcon className="size-4" />
                      </span>
                      <span className="pt-1 font-medium text-ink underline-offset-4 group-hover:underline">
                        {service.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/ofisimiz" className="btn-outline mt-10">
              Merkezimizi Tanıyın
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div
                aria-hidden="true"
                className={`absolute -inset-4 -z-10 rotate-2 bg-sage-100 ${
                  centerCrop?.shape === 'circle' ? 'rounded-full' : 'rounded-[2.5rem]'
                }`}
              />
              <MediaFrame
                media={centerMedia}
                size="card"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/5] rounded-[2rem] bg-sage-200"
                fallback={
                  <div className="flex size-full items-center justify-center text-sage-500">
                    <LeafIcon className="size-16" />
                  </div>
                }
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ben Kimim */}
      <section id="ben-kimim" className="bg-sand py-24 md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal className="order-last lg:order-first">
            <MediaFrame
              media={about.photo}
              size="card"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="mx-auto aspect-[3/4] max-w-sm rounded-t-full rounded-b-[2rem] bg-sage-200 lg:max-w-none"
              shapedClassName="mx-auto w-full max-w-sm lg:max-w-none"
            />
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

      {/* Son yazılar */}
      <section id="makaleler" className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Yazılarım" title={home.articlesHeading || 'Son Yazılarım'} />
            <Link
              href="/makaleler"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-sage-600 hover:text-sage-800"
            >
              Tüm yazılarım
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
            <p className="mt-12 text-muted">Yakında burada yazılarım yer alacak.</p>
          )}
        </div>
      </section>

      {/* Sıkça Sorulan Sorular: yazıların devamında, aynı zemin üzerinde */}
      {home.faqs && home.faqs.length > 0 && (
        <section id="sss" aria-labelledby="sss-baslik" className="pb-24 md:pb-32">
          <JsonLd data={faqSchema(home.faqs)} />
          <div className="container-page grid gap-10 lg:grid-cols-[4fr_7fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Merak Edilenler</p>
              <h2 id="sss-baslik" className="mt-3 text-3xl leading-tight text-ink md:text-5xl">
                {home.faqHeading || 'Sıkça Sorulan Sorular'}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqList faqs={home.faqs} />
            </Reveal>
          </div>
        </section>
      )}

      {/* İletişim */}
      <section id="iletisim" className="bg-sand py-24 md:py-32">
        <div className="container-page">
          <ContactSection settings={settings} heading={home.contactHeading || 'Bize Ulaşın'} />
        </div>
      </section>
    </>
  )
}
