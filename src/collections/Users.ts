import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Kullanıcı',
    plural: 'Kullanıcılar',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
    group: 'Yönetim',
  },
  auth: true,
  fields: [
    // E-posta ve şifre alanlarını `auth: true` otomatik ekler.
    {
      name: 'name',
      label: 'Ad Soyad',
      type: 'text',
    },
  ],
}
