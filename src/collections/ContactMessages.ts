import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * İletişim formundan gelen mesajlar.
 * Kayıtlar formun sunucu tarafı kodu üzerinden oluşturulur; dışarıya açık bir API ile
 * kimse doğrudan kayıt ekleyemez veya okuyamaz.
 */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'İletişim Mesajı',
    plural: 'İletişim Mesajları',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'isRead', 'createdAt'],
    group: 'Gelen Kutusu',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Ad Soyad',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: 'E-posta',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          label: 'Telefon',
          type: 'text',
        },
      ],
    },
    {
      name: 'message',
      label: 'Mesaj',
      type: 'textarea',
      required: true,
    },
    {
      name: 'kvkkConsent',
      label: 'Aydınlatma metnini okuduğunu belirtti',
      type: 'checkbox',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isRead',
      label: 'Okundu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
