import type { Field } from 'payload'

/**
 * Sayfa bazında arama motoru ve paylaşım ayarları. Boş bırakılan alanlarda sayfanın kendi
 * başlığı, özeti ve görseli kullanılır; yani doldurmak zorunlu değildir.
 */
export const seoField = (): Field => ({
  name: 'seo',
  label: 'SEO (Google ve paylaşım önizlemesi)',
  type: 'group',
  admin: {
    description: 'Boş bırakırsanız sayfanın kendi başlığı ve özeti kullanılır.',
  },
  fields: [
    {
      name: 'title',
      label: 'Arama sonucu başlığı',
      type: 'text',
      maxLength: 60,
      admin: {
        description: 'Google’da mavi bağlantı olarak görünen başlık (en fazla 60 karakter). Sonuna site adı otomatik eklenir.',
      },
    },
    {
      name: 'description',
      label: 'Arama sonucu açıklaması',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description:
          'Başlığın altında görünen 1–2 cümle (en fazla 160 karakter). Anahtar kelimeleri liste olarak değil, doğal bir cümle içinde kullanın.',
      },
    },
    {
      name: 'image',
      label: 'Paylaşım görseli',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Bağlantı WhatsApp veya sosyal medyada paylaşıldığında görünen görsel (ideal 1200×630 px).',
      },
    },
  ],
})
