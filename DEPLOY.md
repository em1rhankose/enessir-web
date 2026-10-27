# Yayına Alma Rehberi

Site bir VPS üzerinde Docker ile çalışır: **site + PostgreSQL + Caddy (otomatik HTTPS) + gece yedeği**.

## Gereksinimler

- **VPS:** Ubuntu 24.04, en az **2 GB RAM** (4 GB önerilir), 20 GB disk. Paylaşımlı (cPanel) hosting uygun değildir.
- **Domain:** DNS ayarlarına erişim.

## 1. Domain'i sunucuya yönlendirme

Domain sağlayıcınızın DNS panelinde iki kayıt ekleyin (`SUNUCU_IP` = VPS'in IP adresi):

| Tür | Ad | Değer |
| --- | --- | --- |
| A | `@` | `SUNUCU_IP` |
| A | `www` | `SUNUCU_IP` |

DNS'in yayılması birkaç dakika ile birkaç saat sürebilir. Kontrol: `ping alanadiniz.com`

## 2. Sunucu hazırlığı

```bash
ssh root@SUNUCU_IP

# Güncellemeler ve Docker
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# Güvenlik duvarı: sadece SSH, HTTP ve HTTPS
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable
```

## 3. Projeyi sunucuya alma

Depo private olduğu için sunucuya **sadece okuma yetkili** bir anahtar (deploy key) tanımlanır:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

Çıkan satırı GitHub'da **depo → Settings → Deploy keys → Add deploy key** ekranına yapıştırın (yazma yetkisi vermeyin). Sonra:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
EOF

git clone git@github.com:em1rhankose/enessir-web.git /opt/enessir
cd /opt/enessir
```

## 4. Ayarlar

```bash
cp .env.production.example .env
openssl rand -hex 24   # veritabanı şifresi için
openssl rand -hex 32   # PAYLOAD_SECRET için
nano .env
```

Doldurulacaklar: `DOMAIN`, `NEXT_PUBLIC_SERVER_URL`, `POSTGRES_PASSWORD` (ve aynı şifre `DATABASE_URL` ile `BUILD_DATABASE_URL` içinde), `PAYLOAD_SECRET`, varsa `SMTP_*`.

## 5. Mevcut içeriği taşıma (bilgisayardan sunucuya)

Admin panelden bilgisayarda girilen içerik ve fotoğraflar sunucuya taşınır. **Boş bir siteyle başlanacaksa bu adım atlanır.**

**Bilgisayarda** (proje klasöründe, geliştirme veritabanı açıkken):

```bash
docker compose exec -T db pg_dump -U enessir -d enessir --no-owner > icerik.sql
scp icerik.sql root@SUNUCU_IP:/opt/enessir/
scp -r media root@SUNUCU_IP:/opt/enessir/media-yukle
```

**Sunucuda:**

```bash
cd /opt/enessir
docker compose -f docker-compose.prod.yml up -d db
docker compose -f docker-compose.prod.yml exec -T db psql -U enessir -d enessir < icerik.sql
```

Fotoğraflar 6. adımdan sonra kopyalanır.

## 6. İlk kurulum

```bash
cd /opt/enessir
docker compose -f docker-compose.prod.yml up -d db
docker buildx build --load --network host --allow network.host --secret id=env,src=.env -t enessir-web .
docker compose -f docker-compose.prod.yml up -d --no-build
```

- İmaj `docker compose build` yerine `docker buildx` ile derlenir: Compose v5, derlemenin veritabanına bağlanması için gereken ağ iznini (`network.host`) vermiyor.
- İlk derleme birkaç dakika sürer. Veritabanı boşsa tablolar bu sırada otomatik oluşturulur.
- Caddy ilk istekte HTTPS sertifikasını otomatik alır.

5. adımda içerik taşındıysa fotoğrafları kopyalayın:

```bash
docker compose -f docker-compose.prod.yml cp media-yukle/. app:/app/media
# Kopyalanan dosyaların sahibi sitenin kullanıcısı olmalı (yoksa fotoğraf değiştirilirken eskisi silinemez).
docker compose -f docker-compose.prod.yml exec -u root app chown -R nextjs:nodejs /app/media
rm -rf media-yukle icerik.sql
```

`https://alanadiniz.com/admin` adresini açın. İçerik taşınmadıysa ilk admin hesabını oluşturun.

## 7. Kontrol listesi

- [ ] `https://alanadiniz.com` açılıyor, tarayıcıda kilit simgesi var
- [ ] `http://` ve `www.` adresleri ana adrese yönleniyor
- [ ] İletişim formu mesajı admin panelde görünüyor (SMTP girildiyse e-posta da geliyor)
- [ ] Site Ayarları'nda WhatsApp numarası, adres ve harita konumu doğru
- [ ] Gerçek içerikler hazır olunca: **Site Ayarları → "Site Google ve diğer arama motorlarında görünsün"** açılır
- [ ] Ardından site [Google Search Console](https://search.google.com/search-console)'a eklenir ve `https://alanadiniz.com/sitemap.xml` gönderilir

## Güncelleme (yeni kod yayına alma)

```bash
cd /opt/enessir
git pull
docker buildx build --load --network host --allow network.host --secret id=env,src=.env -t enessir-web .
docker compose -f docker-compose.prod.yml up -d --no-build
# Her derleme ~260 MB'lık yeni bir imaj oluşturur; kullanılmayan eski imajları ve derleme önbelleğini sil.
docker image prune -f
docker builder prune -f --filter until=168h
```

Veritabanında yapı değişikliği varsa (yeni migration) site açılırken otomatik uygulanır. Geçiş sırasında site birkaç saniye kesintiye uğrar.

## Yedekler

- Her gece **03:00**'te alınır, son **14 gün** saklanır: `/opt/enessir/backups`
- Yedekleri ayrıca sunucu dışına almak önerilir:
  `scp root@SUNUCU_IP:/opt/enessir/backups/*.sql.gz ./yedekler/`

**Yedekten geri dönme:**

```bash
cd /opt/enessir
docker compose -f docker-compose.prod.yml stop app
docker compose -f docker-compose.prod.yml exec -T db psql -U enessir -d postgres \
  -c "DROP DATABASE enessir;" -c "CREATE DATABASE enessir OWNER enessir;"
gunzip -c backups/enessir-YYYY-AA-GG_HHMM.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T db psql -U enessir -d enessir
docker compose -f docker-compose.prod.yml start app
```

Not: Yüklenen fotoğraflar `media` Docker biriminde tutulur ve veritabanı yedeğine dahil değildir. Onların yedeği için:
`docker compose -f docker-compose.prod.yml cp app:/app/media ./media-yedek`

## Faydalı komutlar

```bash
docker compose -f docker-compose.prod.yml ps            # servislerin durumu
docker compose -f docker-compose.prod.yml logs -f app   # site logları
docker compose -f docker-compose.prod.yml restart app   # siteyi yeniden başlat
```
