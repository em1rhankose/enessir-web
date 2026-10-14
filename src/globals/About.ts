import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/revalidateSite'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Ben Kimim',
  admin: {
    group: 'Sayfalar',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fullName',
          label: 'Ad Soyad',
          type: 'text',
          required: true,
          defaultValue: 'Enes Sir',
        },
        {
          name: 'jobTitle',
          label: 'Unvan',
          type: 'text',
          defaultValue: 'Psikolog',
        },
      ],
    },
    {
      name: 'photo',
      label: 'Fotoğraf',
      type: 'upload',
      relationTo: 'media',
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
      name: 'biography',
      label: 'Biyografi',
      type: 'richText',
      admin: {
        description: 'Ben Kimim sayfasında görünen uzun metin.',
      },
    },
    {
      name: 'qualifications',
      label: 'Eğitim ve sertifikalar',
      type: 'array',
      labels: { singular: 'Kayıt', plural: 'Kayıtlar' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Başlık', type: 'text', required: true },
            { name: 'institution', label: 'Kurum', type: 'text' },
            { name: 'year', label: 'Yıl', type: 'text' },
          ],
        },
      ],
    },
  ],
}
