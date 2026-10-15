import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidateSite'
import { trimTransparentImage } from '@/hooks/trimTransparentImage'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medya',
    plural: 'Medya',
  },
  admin: {
    group: 'İçerik',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeOperation: [trimTransparentImage],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternatif metin',
      type: 'text',
      required: true,
      admin: {
        description: 'Görseli kısaca tarif edin. Görme engelli ziyaretçiler ve Google için önemlidir.',
      },
    },
    {
      // Şekil (olduğu gibi / kare / yuvarlak) ve seçilen alan; dosyanın kendisini değiştirmez.
      name: 'crop',
      label: 'Sitede gösterim',
      type: 'json',
      admin: {
        components: {
          Field: '@/components/admin/ImageCropField#ImageCropField',
        },
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Yüklenen her görselin otomatik üretilen farklı boyutları; sayfalar ihtiyaca göre birini kullanır.
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1920 },
    ],
  },
}
