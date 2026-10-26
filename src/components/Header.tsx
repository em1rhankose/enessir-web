'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CloseIcon, MenuIcon } from '@/components/Icons'
import { navItems } from '@/lib/navigation'

const SCROLL_THRESHOLD = 40

// İletişim sayfasına zaten "Randevu Al" butonu gidiyor; menüde ayrıca gösterilmez.
const headerNavItems = navItems.filter((item) => item.href !== '/iletisim')

export const Header = ({ siteName }: { siteName: string }) => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ana sayfanın en üstünde başlık şeffaftır; sadece yazılar görünür.
  const isTransparent = pathname === '/' && !isScrolled && !isMenuOpen

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent text-white'
          : 'bg-cream/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={closeMenu}
          className={`font-serif text-xl font-medium tracking-tight md:text-2xl ${
            isTransparent ? 'drop-shadow-sm' : ''
          }`}
        >
          {siteName}
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-8 lg:flex">
          {headerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`relative text-[0.95rem] font-medium transition-opacity hover:opacity-100 ${
                isActive(item.href) ? 'opacity-100' : 'opacity-75'
              } after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-all ${
                isActive(item.href) ? 'after:w-full' : 'after:w-0 hover:after:w-full'
              } ${isTransparent ? 'drop-shadow-sm' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/iletisim"
          className={`hidden rounded-full px-5 py-2 text-sm font-semibold transition-colors lg:inline-flex ${
            isTransparent
              ? 'border border-white/70 hover:bg-white hover:text-ink'
              : 'bg-sage-600 text-white hover:bg-sage-700'
          }`}
        >
          Randevu Al
        </Link>

        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobil menü" className="border-t border-line bg-cream lg:hidden">
          <ul className="container-page flex flex-col py-4">
            {headerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`block py-3 text-lg ${
                    isActive(item.href) ? 'font-semibold text-sage-700' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/iletisim" onClick={closeMenu} className="btn-primary w-full">
                Randevu Al
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
