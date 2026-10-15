# Psikolog Enes Sir — Web Sitesi

[![CI](https://github.com/em1rhankose/enessir-web/actions/workflows/ci.yml/badge.svg)](https://github.com/em1rhankose/enessir-web/actions/workflows/ci.yml)

Bir psikolog için geliştirilmiş, içeriği tamamen yönetim panelinden düzenlenebilen, hız ve arama motoru görünürlüğü için optimize edilmiş kurumsal web sitesi.

**Teknolojiler:** Next.js 16 (App Router) · React 19 · TypeScript · Payload CMS 3 · PostgreSQL 17 · Tailwind CSS 4 · Motion · Docker · Caddy · Vitest · Playwright · GitHub Actions

## Özellikler

**Ziyaretçi tarafı**

- Ana sayfada ilk açılışta şeffaf, kaydırınca dolan başlık çubuğu; arka planı kaldırılmış portrenin zeminle bütünleştiği karşılama alanı
- Ana sayfada akan bölümler: Karşılama → Danışma Merkezimiz → Ben Kimim → Son 3 makale → Sık sorulan sorular → İletişim
- Her hizmet için ayrı sayfa (`/hizmetler/...`), makale listesi ve makale sayfaları (yazar kutusu, okuma süresi)
- İletişim sayfasında solda form, sağda Google Haritalar; makale sayfaları dışında her yerde WhatsApp butonu
- KVKK onaylı iletişim formu: sunucu tarafı doğrulama, honeypot ve hız sınırı ile spam koruması, e-posta bildirimi
- Kaydırdıkça beliren animasyonlar ("hareketi azalt" tercihine uyar), mobil uyumlu ve erişilebilir yapı

**SEO ve GEO (yapay zekâ aramaları)**

- schema.org yapılandırılmış veri: işletme (adres, konum, çalışma saatleri, hizmetler), kişi, makale, hizmet, SSS
- Sayfa bazlı başlık / açıklama / paylaşım görseli, kanonik adresler, `sitemap.xml`, `robots.txt`, `llms.txt`
- İçerik hazır olana kadar siteyi arama motorlarına kapatan ayar

**Yönetim paneli (`/admin`)**

- Türkçe arayüz, aydınlık tema; tüm sayfa içerikleri, hizmetler, makaleler, SSS ve site ayarları
- Taslak/yayın akışı, başlıktan otomatik Türkçe uyumlu URL
- Her görsel için gösterim aracı: olduğu gibi, serbest alan (çerçevesiz), kare veya yuvarlak kırpma — orijinal dosya değişmez
- Arka planı kaldırılmış PNG'lerin boş kenarlarını otomatik kırpma
- Gelen kutusu: iletişim formu mesajları (sadece adminler görebilir); 5 hatalı girişte hesap kilidi

## Mimari

```
src/
├── app/
│   ├── (frontend)/        # Ziyaretçilerin gördüğü site
│   └── (payload)/         # Yönetim paneli ve REST/GraphQL API
├── collections/           # Hizmetler, Makaleler, Medya, İletişim Mesajları, Kullanıcılar
├── globals/               # Site Ayarları, Ana Sayfa, Danışma Merkezimiz, Ben Kimim
├── fields/                # Ortak alanlar (SEO, SSS, URL)
├── access/                # Erişim kuralları
├── hooks/                 # Site önbelleğini tazeleme, şeffaf PNG kırpma
├── migrations/            # Veritabanı yapı değişiklikleri (sürümlü)
├── components/            # Arayüz bileşenleri (+ admin paneli kırpma aracı)
├── lib/                   # Veri sorguları, SEO meta verisi, yapılandırılmış veri
├── utilities/             # Saf yardımcı fonksiyonlar
└── seed/                  # Örnek içerik
```

**Önemli kararlar**

- **Statik üretim + anında tazeleme:** Sayfalar build sırasında üretilip önbellekten sunulur. Admin panelde bir içerik değişince `revalidatePath` ile ilgili sayfalar bir sonraki ziyarette yeniden üretilir — hem hız hem güncellik.
- **Sürümlü veritabanı değişiklikleri:** Şema otomatik değiştirilmez; her değişiklik `src/migrations` altında bir migration dosyasıdır ve canlıda site açılırken otomatik uygulanır.
- **Veriye doğrudan erişim:** Sayfalar Payload Local API ile HTTP isteği olmadan veritabanından okur.
- **Güvenlik:** Taslaklar ve iletişim mesajları dışarıya kapalı; güvenlik başlıkları; konteyner root olmayan kullanıcıyla çalışır; şifreler imaja gömülmez.
- **Görsel kırpma tahribatsız:** Seçilen alan yüzde olarak saklanır; tüm görsel boyutlarında aynı bölge gösterilir.

## Geliştirme

Gereksinimler: Node.js 22, Docker

```bash
npm install
cp .env.example .env      # PAYLOAD_SECRET değerini değiştirin
docker compose up -d      # PostgreSQL (localhost:5433)
npm run migrate           # tabloları oluşturur
npm run seed              # isteğe bağlı: örnek içerik
npm run dev               # http://localhost:3000  ·  admin: /admin
```

Veri modelinde değişiklik yaptıktan sonra: `npm run migrate:create -- aciklama` ve `npm run migrate`.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Canlı derleme ve çalıştırma |
| `npm run migrate` · `migrate:create` · `migrate:status` | Veritabanı migration'ları |
| `npm run seed` | Örnek içerik yükler (veritabanında makale yoksa) |
| `npm run lint` | ESLint |
| `npm run test:int` | Birim, erişim ve görsel işleme testleri (Vitest) |
| `npm run test:e2e` | Uçtan uca tarayıcı testleri (Playwright) |
| `npm run generate:types` | Veri modelinden TypeScript tiplerini üretir |

## Testler

- **Birim:** slug üretimi, WhatsApp kuralları, okuma süresi, görsel kırpma hesapları
- **Entegrasyon:** erişim kuralları (taslaklar, mesajlar, ayarlar), şeffaf PNG kırpma
- **Uçtan uca:** başlık çubuğu, bölüm sırası, makale ve hizmet sayfaları, yapılandırılmış veri, WhatsApp, iletişim formu, 404, yönetim paneli

İlk kez çalıştırmadan önce: `npx playwright install chromium`. Tüm testler her gönderimde GitHub Actions'ta da çalışır.

## Yayına alma

Docker ile tek sunucuda: site + PostgreSQL + Caddy (otomatik HTTPS) + gece yedeği. Adım adım rehber: **[DEPLOY.md](DEPLOY.md)**
