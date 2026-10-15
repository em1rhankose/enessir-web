import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/ArticleCard'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { getArticlesPage } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'

export const generateMetadata = (): Promise<Metadata> =>
  buildPageMetadata({
    title: 'Makaleler',
    description: 'Ruh sağlığı, ilişkiler ve kişisel gelişim üzerine bir psikoloğun kaleminden yazılar.',
    path: '/makaleler',
  })

export default async function ArticlesPage({ searchParams }: PageProps<'/makaleler'>) {
  const { sayfa } = await searchParams
  const requestedPage = Number(Array.isArray(sayfa) ? sayfa[0] : sayfa)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const { docs: articles, totalPages, hasPrevPage, hasNextPage } = await getArticlesPage(page)

  const pageHref = (target: number) => (target === 1 ? '/makaleler' : `/makaleler?sayfa=${target}`)

  return (
    <>
      <PageHeader
        eyebrow="Makaleler"
        title="Yazılar ve Düşünceler"
        description="Ruh sağlığı, ilişkiler ve kendimizi anlamak üzerine yazılar."
      />

      <section className="py-20 md:py-24">
        <div className="container-page">
          {articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Reveal key={article.id} delay={(index % 3) * 0.1} className="h-full">
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted">Henüz yayınlanmış bir makale bulunmuyor.</p>
          )}

          {totalPages > 1 && (
            <nav aria-label="Sayfalar" className="mt-16 flex items-center justify-center gap-2">
              {hasPrevPage && (
                <Link
                  href={pageHref(page - 1)}
                  aria-label="Önceki sayfa"
                  className="flex size-11 items-center justify-center rounded-full ring-1 ring-line hover:bg-white"
                >
                  <ArrowLeftIcon className="size-4" />
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((target) => (
                <Link
                  key={target}
                  href={pageHref(target)}
                  aria-current={target === page ? 'page' : undefined}
                  className={`flex size-11 items-center justify-center rounded-full text-sm font-semibold ${
                    target === page ? 'bg-sage-600 text-white' : 'ring-1 ring-line hover:bg-white'
                  }`}
                >
                  {target}
                </Link>
              ))}
              {hasNextPage && (
                <Link
                  href={pageHref(page + 1)}
                  aria-label="Sonraki sayfa"
                  className="flex size-11 items-center justify-center rounded-full ring-1 ring-line hover:bg-white"
                >
                  <ArrowRightIcon className="size-4" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
