#!/bin/sh
# Her gece 03:00'te (sunucu saati) veritabanının sıkıştırılmış yedeğini alır,
# BACKUP_KEEP_DAYS günden eski yedekleri siler. Yedekler sunucuda ./backups klasöründedir.
set -eu

backup() {
  file="/backups/enessir-$(date +%Y-%m-%d_%H%M).sql.gz"
  pg_dump -h db -U enessir -d enessir --no-owner | gzip > "$file.tmp"
  mv "$file.tmp" "$file"
  find /backups -name 'enessir-*.sql.gz' -mtime "+${BACKUP_KEEP_DAYS}" -delete
  echo "$(date '+%Y-%m-%d %H:%M') yedek alındı: $file"
}

# Servis ilk açıldığında hemen bir yedek al, sonra her gece 03:00'i bekle.
backup
while true; do
  now=$(date +%s)
  next=$(date -d "$(date +%Y-%m-%d) 03:00" +%s 2>/dev/null || echo 0)
  [ "$next" -le "$now" ] && next=$((next + 86400))
  [ "$next" -le 86400 ] && next=$((now + 86400))
  sleep $((next - now))
  backup
done
