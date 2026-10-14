import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidateSite'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Makale',
    plural: 'Makaleler',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    group: 'İçerik',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      label: 'Başlık',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      label: 'Özet',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: {
        description: 'Makale kartlarında ve Google arama sonuçlarında görünen kısa açıklama.',
      },
    },
    {
      name: 'coverImage',
      label: 'Kapak görseli',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      label: 'İçerik',
      type: 'richText',
      required: true,
    },
    slugField(),
    {
      name: 'publishedAt',
      label: 'Yayın tarihi',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMMM yyyy',
        },
        description: 'Boş bırakırsanız yayınladığınız gün atanır.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
  ],
}
