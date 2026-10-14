type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string | null
  align?: 'left' | 'center'
}

export const SectionHeading = ({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) => (
  <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    <p className="eyebrow">{eyebrow}</p>
    <h2 className="mt-3 text-3xl leading-tight text-ink md:text-5xl">{title}</h2>
    {description && <p className="mt-5 text-lg leading-relaxed whitespace-pre-line text-muted">{description}</p>}
  </div>
)
