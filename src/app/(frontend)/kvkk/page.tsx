import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  robots: { index: false },
}

export default async function KvkkPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHeader eyebrow="Yasal" title="KVKK Aydınlatma Metni" />
      <section className="py-20">
        <div className="container-page max-w-3xl">
          {settings.kvkkText ? (
            <RichText data={settings.kvkkText} />
          ) : (
            <p className="text-lg text-muted">
              Aydınlatma metni hazırlanmaktadır. Kişisel verilerinizle ilgili sorularınız için bizimle iletişime
              geçebilirsiniz.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
