import { describe, expect, it } from 'vitest'

import { buildMapEmbedUrl, buildWhatsAppUrl, isWhatsAppHidden } from '@/lib/navigation'
import { getCropAspectRatio, getCropStyle, parseCrop, scaleSizes } from '@/utilities/crop'
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

describe('görsel kırpma', () => {
  it('geçerli kare/yuvarlak seçimi kabul eder', () => {
    expect(parseCrop({ shape: 'circle', x: 10, y: 20, width: 50, height: 40 })).toEqual({
      shape: 'circle',
      x: 10,
      y: 20,
      width: 50,
      height: 40,
    })
  })

  it('serbest seçimi kabul eder ve gerçek piksel oranını hesaplar', () => {
    const crop = parseCrop({ shape: 'free', x: 0, y: 20, width: 100, height: 50 })
    expect(crop?.shape).toBe('free')
    // 800x600 görselin tamamı genişlikte, yarısı yükseklikte: 800 / 300
    expect(getCropAspectRatio(crop!, 800, 600)).toBeCloseTo(800 / 300)
  })

  it('"olduğu gibi" ve bozuk değerleri reddeder (görsel olduğu gibi gösterilir)', () => {
    expect(parseCrop(null)).toBeNull()
    expect(parseCrop({ shape: 'original' })).toBeNull()
    expect(parseCrop({ shape: 'square' })).toBeNull()
    expect(parseCrop({ shape: 'square', x: -5, y: 0, width: 50, height: 50 })).toBeNull()
    expect(parseCrop({ shape: 'triangle', x: 0, y: 0, width: 50, height: 50 })).toBeNull()
  })

  it('seçilen alanı çerçeveyi dolduracak şekilde büyütüp kaydırır', () => {
    // Görselin sağ alt çeyreği seçildi: görsel 2 kat büyür ve yarısı kadar sola/yukarı kayar.
    expect(getCropStyle({ shape: 'square', x: 50, y: 50, width: 50, height: 50 })).toMatchObject({
      left: '-100%',
      top: '-100%',
      width: '200%',
      height: '200%',
    })
  })

  it('tarayıcıya büyütme oranında daha büyük görsel indirmesini söyler', () => {
    expect(scaleSizes('(min-width: 1024px) 32rem, 80vw', 2)).toBe(
      '(min-width: 1024px) calc(32rem * 2.00), calc(80vw * 2.00)',
    )
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
