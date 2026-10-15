import type { Field } from 'payload'

/** Soru–cevap listesi. Sitede açılır-kapanır liste olarak ve Google için FAQ şemasıyla gösterilir. */
export const faqField = (overrides: { name?: string; label?: string; description?: string } = {}): Field => ({
  name: overrides.name ?? 'faqs',
  label: overrides.label ?? 'Sık sorulan sorular',
  type: 'array',
  labels: { singular: 'Soru', plural: 'Sorular' },
  admin: {
    description:
      overrides.description ??
      'Danışanların gerçekten sorduğu sorular. Kısa ve doğrudan cevaplar hem Google’da hem yapay zekâ aramalarında öne çıkar.',
  },
  fields: [
    { name: 'question', label: 'Soru', type: 'text', required: true },
    { name: 'answer', label: 'Cevap', type: 'textarea', required: true },
  ],
})
