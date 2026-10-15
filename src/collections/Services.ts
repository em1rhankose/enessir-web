import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access'
import { faqField } from '@/fields/faq'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidateSite'

/**
 * Verilen hizmetler. Her kayıt sitede kendi sayfasını (/hizmetler/<slug>) oluşturur;
 * ana sayfa, Danışma Merkezimiz sayfası, alt bilgi ve site haritası listeyi buradan alır.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Hizmet',
    plural: 'Hizmetler',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', '_status', 'updatedAt'],
    group: 'İçerik',
    description: 'Her hizmet sitede kendi sayfasıyla görünür. Sıralamayı "Sıra" alanıyla belirleyebilirsiniz.',
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
  defaultSort: 'order',
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      label: 'Hizmet adı',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      label: 'Kısa açıklama',
      type: 'textarea',
      required: true,
      maxLength: 220,
      admin: {
        description: 'Hizmet kartlarında ve listelerde görünen 1–2 cümle.',
      },
    },
    {
      name: 'image',
      label: 'Görsel',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Detaylı içerik',
      type: 'richText',
      admin: {
        description: 'Bu hizmet kimler için, süreç nasıl işliyor, seanslar nasıl geçiyor gibi konular.',
      },
    },
    faqField(),
    seoField(),
    slugField(),
    {
      name: 'order',
      label: 'Sıra',
      type: 'number',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: 'Küçük sayı önce gösterilir.',
      },
    },
  ],
}
