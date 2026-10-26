export const navItems = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/danisma-merkezimiz', label: 'Ofisimiz' },
  { href: '/ben-kimim', label: 'Ben Kimim' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/iletisim', label: 'İletişim' },
] as const

/** WhatsApp ikonunun gizlendiği sayfalar: makale listesi ve her makalenin kendi sayfası. */
export const isWhatsAppHidden = (pathname: string) =>
  pathname === '/makaleler' || pathname.startsWith('/makaleler/')

export const buildWhatsAppUrl = (number: string, message?: string | null) => {
  const url = new URL(`https://wa.me/${number}`)
  if (message) url.searchParams.set('text', message)
  return url.toString()
}

export const buildMapEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=tr`
