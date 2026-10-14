# Psikolog Enes Sir — Web Sitesi

Bir psikolog için geliştirilmiş, içeriği tamamen yönetim panelinden düzenlenebilen kurumsal web sitesi.

**Teknolojiler:** Next.js 16 (App Router) · React 19 · TypeScript · Payload CMS 3 · Tailwind CSS 4 · Motion · SQLite (geliştirme) / PostgreSQL (canlı) · Vitest · Playwright

## Özellikler

**Ziyaretçi tarafı**

- Ana sayfada ilk açılışta şeffaf, kaydırınca dolan başlık çubuğu
- Ana sayfada menü sırasıyla akan bölümler: Karşılama → Danışma Merkezimiz → Ben Kimim → Son 3 makale → İletişim
- Kaydırdıkça beliren animasyonlar (işletim sisteminde "hareketi azalt" açıksa kapanır)
- Makale listesi (sayfalamalı) ve her makale için ayrı sayfa; okuma süresi, ilgili makaleler
- İletişim sayfasında solda form, sağda Google Haritalar
- Sitenin her yerinde (makale sayfaları hariç) sabit WhatsApp butonu
- KVKK onaylı iletişim formu; sunucu tarafı doğrulama, honeypot ve hız sınırı ile spam koruması
- SEO: sayfa bazlı başlık ve açıklamalar, Open Graph, `sitemap.xml`, `robots.txt`
- Mobil uyumlu, erişilebilir (anlamlı HTML, klavye ile gezinme, "içeriğe geç" bağlantısı)

**Yönetim paneli (`/admin`)**

- Türkçe arayüz, aydınlık tema
- Makaleler: taslak/yayın akışı, başlıktan otomatik Türkçe uyumlu URL, kapak görseli, zengin metin editörü
- Sayfa içerikleri: Ana Sayfa, Danışma Merkezimiz, Ben Kimim
- Site Ayarları: WhatsApp numarası ve hazır mesajı, iletişim bilgileri, harita konumu, sosyal medya, KVKK metni
- Gelen kutusu: iletişim formundan gelen mesajlar (sadece adminler görebilir)
- Yüklenen görsellerin otomatik farklı boyutları (kart, kapak, küçük resim)

## Mimari

Tek bir Next.js uygulaması içinde iki bölüm bulunur:

```
src/
├── app/
│   ├── (frontend)/        # Ziyaretçilerin gördüğü site
│   └── (payload)/         # Yönetim paneli ve REST/GraphQL API (Payload tarafından yönetilir)
├── collections/           # Veri modelleri: Makaleler, Medya, İletişim Mesajları, Kullanıcılar
├── globals/               # Tek kayıtlık içerikler: Site Ayarları, Ana Sayfa, Danışma Merkezimiz, Ben Kimim
├── access/                # Erişim kuralları (kim neyi okuyabilir/değiştirebilir)
├── hooks/                 # İçerik değişince site önbelleğini tazeleyen hook'lar
├── actions/               # Server Action'lar (iletişim formu)
├── components/            # Arayüz bileşenleri
├── lib/                   # Veri sorguları ve gezinme yardımcıları
├── utilities/             # Saf yardımcı fonksiyonlar (slug, tarih, görsel)
├── seed/                  # Örnek içerik betiği
└── payload.config.ts      # Payload ana ayarları
```

**Önemli kararlar**

- **Statik üretim + anında tazeleme:** Sayfalar build sırasında önceden üretilir ve önbellekten sunulur. Admin panelde bir içerik değiştiğinde `afterChange` hook'u `revalidatePath` çağırır; site bir sonraki ziyarette güncel içerikle yeniden üretilir. Böylece hem hız hem güncellik sağlanır.
- **Veriye doğrudan erişim:** Sayfalar Payload'ın Local API'sini kullanır; HTTP isteği olmadan doğrudan veritabanından okunur.
- **Güvenlik:** Ziyaretçiler yalnızca yayınlanmış makaleleri görebilir; iletişim mesajları dış API'ye kapalıdır ve kayıtlar yalnızca sunucu tarafındaki form işleyicisi üzerinden oluşturulur.

## Kurulum

Gereksinim: Node.js 20.18+ (önerilen 22)

```bash
npm install
cp .env.example .env      # PAYLOAD_SECRET değerini değiştirin
npm run dev               # http://localhost:3000
```

İlk açılışta `http://localhost:3000/admin` adresinden ilk admin hesabını oluşturun.

Tasarımı örnek içerikle görmek için (veritabanında makale yoksa çalışır, mevcut içeriği değiştirmez):

```bash
npm run seed
```

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Canlı derleme ve çalıştırma |
| `npm run seed` | Örnek içerik yükler |
| `npm run lint` | ESLint |
| `npm run test:int` | Birim ve erişim kuralı testleri (Vitest) |
| `npm run test:e2e` | Uçtan uca tarayıcı testleri (Playwright) |
| `npm run generate:types` | Veri modelinden TypeScript tiplerini üretir |

## Testler

- **Birim testleri:** slug üretimi, WhatsApp bağlantısı ve görünürlük kuralı, okuma süresi
- **Erişim testleri:** ziyaretçinin mesajları ve taslakları görememesi, ayarları değiştirememesi
- **Uçtan uca testler:** şeffaf başlık çubuğu, bölüm sırası, makale kartları, WhatsApp kuralları, iletişim formu doğrulaması ve gönderimi, 404 sayfası, yönetim paneli

İlk kez çalıştırmadan önce: `npx playwright install chromium`
