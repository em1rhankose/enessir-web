import Link from 'next/link'

import { MediaFrame } from '@/components/MediaFrame'
import type { About } from '@/payload-types'

/**
 * Makalenin yazarı: sağlık içeriklerinde Google, içeriğin bir uzman tarafından yazıldığına
 * dair açık işaretler arar (E-E-A-T). Bilgiler admin paneldeki "Ben Kimim" sayfasından gelir.
 */
export const AuthorBox = ({ about }: { about: About }) => (
  <aside
    aria-label="Yazar hakkında"
    className="mt-16 flex flex-col gap-6 rounded-3xl bg-white p-7 ring-1 ring-line sm:flex-row sm:items-center md:p-8"
  >
    <MediaFrame
      media={about.photo}
      size="thumbnail"
      sizes="96px"
      className="size-24 shrink-0 rounded-full bg-sage-100"
      shapedClassName="size-24 shrink-0"
    />
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-sage-500 uppercase">Yazar</p>
      <p className="mt-1 font-serif text-2xl text-ink">{about.fullName}</p>
      {about.jobTitle && <p className="text-sm font-medium text-sage-600">{about.jobTitle}</p>}
      {about.summary && <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{about.summary}</p>}
      <Link href="/ben-kimim" className="mt-3 inline-block text-sm font-semibold text-sage-700 hover:text-sage-900">
        Daha fazla bilgi →
      </Link>
    </div>
  </aside>
)
