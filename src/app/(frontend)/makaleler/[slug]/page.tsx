import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { AuthorBox } from '@/components/AuthorBox'
import { ArrowLeftIcon } from '@/components/Icons'
import { JsonLd } from '@/components/JsonLd'
import { getFramedCrop, MediaFrame } from '@/components/MediaFrame'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { getAbout, getAllArticleSlugs, getArticleBySlug, getLatestArticles } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'
import { articleSchema } from '@/lib/structuredData'
import { formatDate, getReadingMinutes } from '@/utilities/format'
import { getServerUrl } from '@/utilities/getServerUrl'
import { isMedia } from '@/utilities/media'

/** Yayınlanmış makalelerin sayfaları build sırasında önceden üretilir; yenileri ilk ziyarette üretilir. */
export async function generateStaticParams() {
  const articles = await getAllArticleSlugs()
  return articles.filter((article) => article.slug).map((article) => ({ slug: article.slug as string }))
}

export async function generateMetadata({ params }: PageProps<'/makaleler/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return buildPageMetadata({
    seo: article.seo,
    title: article.title,
    description: article.excerpt,
    image: article.coverImage,
    path: `/makaleler/${slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  })
}

/** Makale yayından en az bir gün sonra düzenlendiyse güncelleme tarihi gösterilir. */
const wasUpdatedLater = (publishedAt?: string | null, updatedAt?: string | null) =>
  Boolean(publishedAt && updatedAt) &&
  new Date(updatedAt as string).getTime() - new Date(publishedAt as string).getTime() > 24 * 60 * 60 * 1000

export default async function ArticlePage({ params }: PageProps<'/makaleler/[slug]'>) {
  const { slug } = await params
  const [article, about] = await Promise.all([getArticleBySlug(slug), getAbout()])

  if (!article) notFound()

  const otherArticles = (await getLatestArticles(4)).filter((item) => item.id !== article.id).slice(0, 3)

  return (
    <article>
      <JsonLd data={articleSchema(article, getServerUrl())} />
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
              <span className="mx-2">·</span>
              {about.fullName}
              {wasUpdatedLater(article.publishedAt, article.updatedAt) && (
                <>
                  <br />
                  Son güncelleme: <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </>
              )}
            </p>
          </Reveal>
        </div>
      </header>

      {isMedia(article.coverImage) && (
        <div className="bg-gradient-to-b from-sand from-50% to-cream to-50%">
          <div className="container-page max-w-5xl">
            {getFramedCrop(article.coverImage) ? (
              // Kare/yuvarlak seçildiyse şekil kapak alanının ortasında gösterilir.
              <div className="flex aspect-[16/9] items-center justify-center rounded-[2rem] bg-sage-100 p-6 md:p-10">
                <MediaFrame
                  media={article.coverImage}
                  priority
                  sizes="(min-width: 1024px) 28rem, 60vw"
                  shapedClassName="h-full w-auto"
                />
              </div>
            ) : (
              <MediaFrame
                media={article.coverImage}
                size="hero"
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="aspect-[16/9] rounded-[2rem] bg-sage-100"
              />
            )}
          </div>
        </div>
      )}

      <div className="container-page max-w-3xl py-16 md:py-20">
        <RichText data={article.content} />

        <AuthorBox about={about} />

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
