'use client'

import { usePathname } from 'next/navigation'

import { WhatsAppIcon } from '@/components/Icons'
import { buildWhatsAppUrl, isWhatsAppHidden } from '@/lib/navigation'

type WhatsAppButtonProps = {
  number: string
  message?: string | null
}

/** Sağ altta sabit duran WhatsApp butonu; numara admin paneldeki Site Ayarları'ndan gelir. */
export const WhatsAppButton = ({ number, message }: WhatsAppButtonProps) => {
  const pathname = usePathname()

  if (isWhatsAppHidden(pathname)) return null

  return (
    <a
      href={buildWhatsAppUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden mesaj gönderin"
      className="group fixed right-5 bottom-5 z-40 flex items-center md:right-8 md:bottom-8"
    >
      <span className="pointer-events-none mr-3 hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
        WhatsApp ile yazın
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25 motion-reduce:hidden" />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  )
}
