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
  auth: {
    // Şifre tahmin saldırılarına karşı: 5 hatalı denemeden sonra hesap 10 dakika kilitlenir.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    // E-posta ve şifre alanlarını `auth: true` otomatik ekler.
    {
      name: 'name',
      label: 'Ad Soyad',
      type: 'text',
    },
  ],
}
