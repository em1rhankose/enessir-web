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

export const paragraph = (value: string) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
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

export const bulletList = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    children: [text(item)],
  })),
})

export const richText = (...children: object[]) => ({
  root: {
    ...base,
    type: 'root',
    children: children as { type: string; version: number; [k: string]: unknown }[],
  },
})
