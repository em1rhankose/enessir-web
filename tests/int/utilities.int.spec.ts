import { describe, expect, it } from 'vitest'

import { buildMapEmbedUrl, buildWhatsAppUrl, isWhatsAppHidden } from '@/lib/navigation'
import { getReadingMinutes } from '@/utilities/format'
import { formatSlug } from '@/utilities/formatSlug'

describe('formatSlug', () => {
  it('Türkçe karakterleri dönüştürür', () => {
    expect(formatSlug('Kaygı Bozukluğu Nedir?')).toBe('kaygi-bozuklugu-nedir')
    expect(formatSlug('Çocuklarda Öfke ve Şiddet')).toBe('cocuklarda-ofke-ve-siddet')
  })

  it('büyük İ ve I harflerini Türkçe kurallarına göre küçültür', () => {
    expect(formatSlug('İLİŞKİLERDE IŞIK')).toBe('iliskilerde-isik')
  })

  it('noktalama işaretlerini kaldırır ve fazla boşlukları tek tireye indirir', () => {
    expect(formatSlug('  Terapi:   İlk Seans!  ')).toBe('terapi-ilk-seans')
    expect(formatSlug('Uyku -- ve -- Stres')).toBe('uyku-ve-stres')
  })
})

describe('WhatsApp', () => {
  it('hazır mesajlı wa.me bağlantısı üretir', () => {
    expect(buildWhatsAppUrl('905321234567', 'Merhaba, randevu')).toBe(
      'https://wa.me/905321234567?text=Merhaba%2C+randevu',
    )
  })

  it('mesaj yoksa sadece numarayı kullanır', () => {
    expect(buildWhatsAppUrl('905321234567')).toBe('https://wa.me/905321234567')
  })

  it('makale listesi ve makale sayfalarında gizlenir, diğer sayfalarda görünür', () => {
    expect(isWhatsAppHidden('/makaleler')).toBe(true)
    expect(isWhatsAppHidden('/makaleler/kaygi-nedir')).toBe(true)
    expect(isWhatsAppHidden('/')).toBe(false)
    expect(isWhatsAppHidden('/iletisim')).toBe(false)
    expect(isWhatsAppHidden('/ben-kimim')).toBe(false)
  })
})

describe('buildMapEmbedUrl', () => {
  it('adresi URL içinde güvenli şekilde kodlar', () => {
    expect(buildMapEmbedUrl('Kadıköy, İstanbul')).toContain('q=Kad%C4%B1k%C3%B6y%2C%20%C4%B0stanbul')
  })
})

describe('getReadingMinutes', () => {
  const content = (words: number) => ({
    root: { children: [{ children: [{ text: Array(words).fill('kelime').join(' ') }] }] },
  })

  it('kelime sayısından okuma süresini hesaplar (200 kelime/dk)', () => {
    expect(getReadingMinutes(content(1000))).toBe(5)
  })

  it('en az 1 dakika döner', () => {
    expect(getReadingMinutes(content(10))).toBe(1)
    expect(getReadingMinutes(null)).toBe(1)
  })
})
