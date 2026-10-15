import Link from 'next/link'

import { ArrowRightIcon, LeafIcon } from '@/components/Icons'
import type { Service } from '@/payload-types'

export const ServiceCard = ({ service }: { service: Service }) => (
  <article className="group relative flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(36,48,45,0.28)]">
    <span className="flex size-11 items-center justify-center rounded-full bg-sage-100 text-sage-600">
      <LeafIcon className="size-5" />
    </span>
    <h3 className="mt-5 text-xl text-ink">
      {/* Bağlantı tüm kartı kaplar; kartın her yerine tıklanabilir. */}
      <Link href={`/hizmetler/${service.slug}`} className="after:absolute after:inset-0">
        {service.title}
      </Link>
    </h3>
    <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>
    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sage-600">
      Detaylı bilgi
      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
    </span>
  </article>
)
