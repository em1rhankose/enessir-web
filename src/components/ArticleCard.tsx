import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/components/Icons'
import type { Article } from '@/payload-types'
import { formatDate, getReadingMinutes } from '@/utilities/format'
import { getImage } from '@/utilities/media'

export const ArticleCard = ({ article }: { article: Article }) => {
  const image = getImage(article.coverImage, 'card')

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(36,48,45,0.06)] ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(36,48,45,0.28)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs font-medium tracking-wide text-muted">
          <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
          <span className="mx-2">·</span>
          {getReadingMinutes(article.content)} dk okuma
        </p>
        <h3 className="mt-3 text-xl leading-snug text-ink md:text-[1.35rem]">
          {/* Bağlantı tüm kartı kaplar; kartın her yerine tıklanabilir. */}
          <Link href={`/makaleler/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sage-600">
          Devamını oku
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
