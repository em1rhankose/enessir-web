import type { ReactNode } from 'react'

import { Reveal } from '@/components/Reveal'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
}

/** Ana sayfa dışındaki sayfaların üst kısmı. */
export const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => (
  <section className="relative overflow-hidden bg-sand pt-36 pb-16 md:pt-44 md:pb-20">
    <div
      aria-hidden="true"
      className="absolute -top-24 -right-24 size-96 rounded-full bg-sage-100 opacity-70 blur-3xl"
    />
    <div className="container-page relative">
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight text-ink md:text-6xl">{title}</h1>
        {description && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</div>}
      </Reveal>
    </div>
  </section>
)
