import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/revalidateSite'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Ana Sayfa',
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
      type: 'collapsible',
      label: 'Karşılama alanı',
      fields: [
        {
          name: 'heroTitle',
          label: 'Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Kendinize alan açın.',
        },
        {
          name: 'heroSubtitle',
          label: 'Alt başlık',
          type: 'textarea',
          defaultValue:
            'Bireysel terapi ve psikolojik danışmanlıkla, kendinizi daha iyi anlamanız için güvenli bir alan.',
        },
        {
          name: 'heroImage',
          label: 'Arka plan görseli',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'heroPortrait',
          label: 'Portre fotoğrafı',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Karşılama alanının sağında görünür. Arka planı kaldırılmış (şeffaf) PNG, dikey, ideal 1500×2000 px (en az 1200×1600 px), 5 MB altı. Kenarlardaki boşluğu kırpın; alt kenar bel/göğüs hizasından düz kesilmiş olsun.',
          },
        },
        {
          name: 'heroButtonText',
          label: 'Buton metni',
          type: 'text',
          defaultValue: 'Randevu Al',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bölüm başlıkları',
      admin: {
        description: 'Ana sayfada aşağı kaydırdıkça görünen bölümlerin başlıkları.',
      },
      fields: [
        {
          name: 'articlesHeading',
          label: 'Makaleler bölümü başlığı',
          type: 'text',
          defaultValue: 'Son Makaleler',
        },
        {
          name: 'contactHeading',
          label: 'İletişim bölümü başlığı',
          type: 'text',
          defaultValue: 'Bize Ulaşın',
        },
      ],
    },
  ],
}
