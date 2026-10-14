import type { Field } from 'payload'

import { formatSlug } from '@/utilities/formatSlug'

/**
 * URL alanı. Boş bırakılırsa `sourceField` (varsayılan: başlık) üzerinden otomatik üretilir;
 * elle yazılırsa o da aynı kurallarla temizlenir.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  label: 'URL (slug)',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Boş bırakırsanız başlıktan otomatik oluşturulur.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return formatSlug(value)

        const source = data?.[sourceField]
        if (typeof source === 'string') return formatSlug(source)

        return value
      },
    ],
  },
})
