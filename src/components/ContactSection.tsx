import { ContactForm } from '@/components/ContactForm'
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/Icons'
import { Reveal } from '@/components/Reveal'
import { buildMapEmbedUrl } from '@/lib/navigation'
import type { SiteSetting } from '@/payload-types'

type ContactSectionProps = {
  settings: SiteSetting
  /** Ana sayfada bölüm başlığı gösterilir; İletişim sayfasında başlık sayfanın üstünde olduğu için gizlenir. */
  heading?: string | null
}

/** Solda iletişim formu, sağda büyük harita. Ana sayfanın en altında ve İletişim sayfasında kullanılır. */
export const ContactSection = ({ settings, heading }: ContactSectionProps) => {
  const contactItems = [
    settings.phone && {
      icon: PhoneIcon,
      label: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
    },
    settings.email && { icon: MailIcon, label: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPinIcon, label: settings.address },
    settings.workingHours && { icon: ClockIcon, label: settings.workingHours },
  ].filter(Boolean) as { icon: typeof PhoneIcon; label: string; href?: string }[]

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <Reveal>
        {heading && (
          <>
            <p className="eyebrow">İletişim</p>
            <h2 className="mt-3 text-3xl leading-tight text-ink md:text-5xl">{heading}</h2>
          </>
        )}
        <p className={`${heading ? 'mt-5' : ''} max-w-lg text-lg leading-relaxed text-muted`}>
          Sorularınız veya randevu talebiniz için formu doldurabilirsiniz. Mesajınıza en kısa sürede dönüş
          yapılacaktır.
        </p>

        {contactItems.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {contactItems.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-start gap-3 text-[0.95rem] text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <Icon className="size-4" />
                </span>
                {href ? (
                  <a href={href} className="pt-1.5 hover:text-sage-700">
                    {label}
                  </a>
                ) : (
                  <span className="pt-1.5 whitespace-pre-line">{label}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(36,48,45,0.06)] ring-1 ring-line md:p-8">
          <ContactForm />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="min-h-[420px] lg:min-h-0">
        <div className="h-full min-h-[420px] overflow-hidden rounded-3xl bg-sage-100 ring-1 ring-line lg:min-h-[640px]">
          {settings.mapQuery ? (
            <iframe
              title="Danışma merkezimizin haritadaki konumu"
              src={buildMapEmbedUrl(settings.mapQuery)}
              className="size-full min-h-[420px] border-0 lg:min-h-[640px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="flex size-full min-h-[420px] flex-col items-center justify-center gap-3 p-8 text-center text-sage-700">
              <MapPinIcon className="size-10" />
              <p>Harita konumu admin panelden (Site Ayarları) eklendiğinde burada görünecek.</p>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  )
}
