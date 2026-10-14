import Link from 'next/link'

import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, socialIcons } from '@/components/Icons'
import { navItems } from '@/lib/navigation'
import type { SiteSetting } from '@/payload-types'

export const Footer = ({ settings }: { settings: SiteSetting }) => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-sage-900 text-sage-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-white">{settings.siteName}</p>
          {settings.seoDescription && (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage-200">{settings.seoDescription}</p>
          )}
          {settings.socialLinks && settings.socialLinks.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {settings.socialLinks.map((link) => {
                const Icon = socialIcons[link.platform]
                return (
                  <li key={link.id ?? link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="flex size-10 items-center justify-center rounded-full border border-sage-700 transition-colors hover:border-sage-300 hover:text-white"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <nav aria-label="Alt menü">
          <p className="eyebrow text-sage-300!">Sayfalar</p>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-sage-300!">İletişim</p>
          <ul className="mt-5 space-y-4 text-sm">
            {settings.phone && (
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-start gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.workingHours && (
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 size-4 shrink-0 text-sage-300" />
                <span>{settings.workingHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-sage-800">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-sage-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.siteName}. Tüm hakları saklıdır.
          </p>
          <Link href="/kvkk" className="hover:text-white">
            KVKK Aydınlatma Metni
          </Link>
        </div>
      </div>
    </footer>
  )
}
