/**
 * Zengin metin (Lexical) içeriğini kodla oluşturmak için küçük yardımcılar.
 * Sadece örnek içerik betiğinde kullanılır.
 */
const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }

const text = (value: string, format = 0) => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

/** Düz metin ya da kalın yazılacak parça: ['Amaç: ', { bold: 'Randevu' }] */
type Inline = string | { bold: string }

const BOLD = 1

const inlines = (value: Inline | Inline[]) =>
  (Array.isArray(value) ? value : [value]).map((part) =>
    typeof part === 'string' ? text(part) : text(part.bold, BOLD),
  )

export const paragraph = (value: Inline | Inline[]) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: inlines(value),
})

export const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  ...base,
  type: 'heading',
  tag,
  children: [text(value)],
})

export const quote = (value: string) => ({
  ...base,
  type: 'quote',
  children: [text(value)],
})

export const bulletList = (items: (Inline | Inline[])[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    children: inlines(item),
  })),
})

export const richText = (...children: object[]) => ({
  root: {
    ...base,
    type: 'root',
    children: children as { type: string; version: number; [k: string]: unknown }[],
  },
})
