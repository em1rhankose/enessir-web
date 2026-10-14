import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

type RichTextProps = {
  data?: unknown
  className?: string
}

/** Admin panelde zengin metin editörüyle yazılan içeriği, sitenin yazı stiliyle gösterir. */
export const RichText = ({ data, className = '' }: RichTextProps) => {
  if (!data) return null

  return (
    <PayloadRichText
      data={data as SerializedEditorState}
      className={`prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-ink prose-p:text-ink/85 prose-a:text-sage-600 prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-sage-300 prose-blockquote:font-serif prose-blockquote:text-sage-800 prose-li:marker:text-sage-400 ${className}`}
    />
  )
}
