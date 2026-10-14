import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const CounselingCenter: GlobalConfig = {
  slug: 'counseling-center',
  label: 'Danışma Merkezimiz',
  admin: {
    group: 'Sayfalar',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      label: 'Başlık',
      type: 'text',
      required: true,
      defaultValue: 'Danışma Merkezimiz',
    },
    {
      name: 'summary',
      label: 'Kısa tanıtım',
      type: 'textarea',
      admin: {
        description: 'Ana sayfadaki bölümde görünen kısa metin.',
      },
    },
    {
      name: 'content',
      label: 'Detaylı içerik',
      type: 'richText',
      admin: {
        description: 'Danışma Merkezimiz sayfasında görünen uzun metin.',
      },
    },
    {
      name: 'services',
      label: 'Hizmetler',
      type: 'array',
      labels: { singular: 'Hizmet', plural: 'Hizmetler' },
      fields: [
        { name: 'title', label: 'Hizmet adı', type: 'text', required: true },
        { name: 'description', label: 'Açıklama', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      label: 'Fotoğraflar',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
