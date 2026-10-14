import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { ArrowLeftIcon } from '@/components/Icons'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { getAllArticleSlugs, getArticleBySlug, getLatestArticles } from '@/lib/queries'
import { formatDate, getReadingMinutes } from '@/utilities/format'
import { getImage } from '@/utilities/media'

/** Yayınlanmış makalelerin sayfaları build sırasında önceden üretilir; yenileri ilk ziyarette üretilir. */
export async function generateStaticParams() {
  const articles = await getAllArticleSlugs()
  return articles.filter((article) => article.slug).map((article) => ({ slug: article.slug as string }))
}

export async function generateMetadata({ params }: PageProps<'/makaleler/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const image = getImage(article.coverImage, 'card')

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/makaleler/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt ?? undefined,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: PageProps<'/makaleler/[slug]'>) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const cover = getImage(article.coverImage, 'hero')
  const otherArticles = (await getLatestArticles(4)).filter((item) => item.id !== article.id).slice(0, 3)

  return (
    <article>
      <header className="bg-sand pt-32 pb-14 md:pt-40">
        <div className="container-page max-w-3xl">
          <Reveal>
            <Link
              href="/makaleler"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:text-sage-800"
            >
              <ArrowLeftIcon className="size-4" />
              Tüm makaleler
            </Link>
            <h1 className="mt-6 text-4xl leading-tight text-ink md:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{article.excerpt}</p>
            <p className="mt-6 text-sm font-medium text-muted">
              <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
              <span className="mx-2">·</span>
              {getReadingMinutes(article.content)} dk okuma
            </p>
          </Reveal>
        </div>
      </header>

      {cover && (
        <div className="bg-gradient-to-b from-sand from-50% to-cream to-50%">
          <div className="container-page max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-sage-100">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container-page max-w-3xl py-16 md:py-20">
        <RichText data={article.content} />

        <aside className="mt-16 rounded-3xl bg-sage-50 p-8 ring-1 ring-sage-100 md:p-10">
          <p className="font-serif text-2xl text-ink">Bu konuda konuşmak ister misiniz?</p>
          <p className="mt-3 text-muted">
            Yaşadıklarınızı bir uzmanla paylaşmak, ilk adımı atmanın en güçlü yoludur.
          </p>
          <Link href="/iletisim" className="btn-primary mt-6">
            Randevu Al
          </Link>
        </aside>
      </div>

      {otherArticles.length > 0 && (
        <section aria-labelledby="other-articles" className="border-t border-line py-20">
          <div className="container-page">
            <h2 id="other-articles" className="text-3xl text-ink">
              Diğer makaleler
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
