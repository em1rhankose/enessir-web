const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** "2026-10-14T..." -> "14 Ekim 2026" */
export const formatDate = (value?: string | null) => (value ? dateFormatter.format(new Date(value)) : '')

type LexicalNode = { text?: unknown; children?: unknown }

const collectText = (node: LexicalNode): string => {
  const ownText = typeof node.text === 'string' ? node.text : ''
  const children = Array.isArray(node.children) ? node.children : []
  return [ownText, ...children.map((child) => collectText(child as LexicalNode))].join(' ')
}

/** Zengin metin içeriğinden tahmini okuma süresi (dakika). Ortalama 200 kelime/dakika. */
export const getReadingMinutes = (content?: { root: LexicalNode } | null) => {
  if (!content) return 1
  const words = collectText(content.root).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
