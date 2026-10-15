# Canlı ortam imajı. docker-compose.prod.yml ile kullanılır (bkz. DEPLOY.md).
#
# Sayfalar build sırasında veritabanından okunarak önceden üretildiği için build, veritabanı ayaktayken
# yapılır. Şifreler imaja gömülmez: .env dosyası build sırasında BuildKit "secret" olarak geçici okunur.

FROM node:22.20.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1) Bağımlılıklar — package.json değişmedikçe önbellekten gelir.
FROM base AS deps
# .npmrc: bilgisayardakiyle aynı npm ayarları (legacy-peer-deps), yoksa npm ci kilit dosyasıyla uyuşmaz.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# 2) Derleme
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# BUILD_DATABASE_URL: build sırasında veritabanına sunucu üzerinden (127.0.0.1) erişim adresi.
RUN --mount=type=secret,id=env,target=/run/secrets/env \
    set -a && . /run/secrets/env && set +a && \
    DATABASE_URL="${BUILD_DATABASE_URL:-$DATABASE_URL}" npm run build

# 3) Çalışan imaj — sadece gerekli dosyalar, root olmayan kullanıcı.
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Yüklenen görseller bu klasöre yazılır; compose'da kalıcı birim olarak bağlanır.
RUN mkdir -p media && chown nextjs:nodejs media

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
