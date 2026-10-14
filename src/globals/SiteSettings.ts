import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Ayarları',
  admin: {
    group: 'Ayarlar',
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
      name: 'siteName',
      label: 'Site adı',
      type: 'text',
      required: true,
      defaultValue: 'Psikolog Enes Sir',
    },
    {
      name: 'seoDescription',
      label: 'Site açıklaması (SEO)',
      type: 'textarea',
      maxLength: 160,
      defaultValue:
        'Psikolog Enes Sir ile bireysel terapi ve psikolojik danışmanlık. Randevu ve bilgi için iletişime geçin.',
      admin: {
        description: 'Google arama sonuçlarında site adının altında görünen kısa açıklama (en fazla 160 karakter).',
      },
    },
    {
      type: 'collapsible',
      label: 'WhatsApp',
      fields: [
        {
          name: 'whatsappNumber',
          label: 'WhatsApp numarası',
          type: 'text',
          admin: {
            description:
              'Ülke koduyla, sadece rakam: örn. 905321234567. Boş bırakılırsa WhatsApp ikonu gizlenir.',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return true
            return /^\d{10,15}$/.test(value) || 'Sadece rakam girin, ülke koduyla birlikte (örn. 905321234567).'
          },
        },
        {
          name: 'whatsappMessage',
          label: 'Hazır mesaj',
          type: 'text',
          defaultValue: 'Merhaba, randevu almak istiyorum.',
          admin: {
            description: 'WhatsApp açıldığında mesaj kutusunda hazır yazılı gelecek metin.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'İletişim bilgileri',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'phone', label: 'Telefon', type: 'text' },
            { name: 'email', label: 'E-posta', type: 'email' },
          ],
        },
        { name: 'address', label: 'Adres', type: 'textarea' },
        {
          name: 'mapQuery',
          label: 'Harita konumu',
          type: 'text',
          admin: {
            description:
              'Google Haritalar\'da aranacak adres veya koordinat (örn. "41.0082,28.9784"). İletişim sayfasındaki harita bunu gösterir.',
          },
        },
        { name: 'workingHours', label: 'Çalışma saatleri', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Sosyal medya',
      type: 'array',
      labels: { singular: 'Hesap', plural: 'Hesaplar' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              label: 'Platform',
              type: 'select',
              required: true,
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'Facebook', value: 'facebook' },
              ],
            },
            { name: 'url', label: 'Bağlantı', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Yasal',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'kvkkText',
          label: 'KVKK aydınlatma metni',
          type: 'richText',
          admin: {
            description:
              'İletişim formundaki onay kutusunun bağlantı verdiği sayfa. Metnin bir hukukçu tarafından kontrol edilmesi önerilir.',
          },
        },
      ],
    },
  ],
}
