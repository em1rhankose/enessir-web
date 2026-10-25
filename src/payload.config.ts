import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { ContactMessages } from './collections/ContactMessages'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { getEmailAdapter } from './email'
import { About } from './globals/About'
import { CounselingCenter } from './globals/CounselingCenter'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' | Enes Sir Yönetim Paneli',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { tr },
    fallbackLanguage: 'tr',
  },
  collections: [Services, Articles, Media, ContactMessages, Users],
  globals: [HomePage, CounselingCenter, About, SiteSettings],
  editor: lexicalEditor(),
  email: getEmailAdapter(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Veritabanı yapısı otomatik değiştirilmez; her değişiklik src/migrations altında bir migration
    // dosyasıyla yapılır (npm run migrate:create / npm run migrate). Böylece canlıda da aynı adımlar uygulanır.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    // Canlıda site açılırken uygulanmamış migration'lar otomatik çalıştırılır.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Vercel'de dosya sistemi kalıcı olmadığı için yüklenen görseller Vercel Blob'da saklanır.
    // Token yoksa (bilgisayar, VPS) eklenti kapalıdır ve görseller diske yazılır.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Dosya adları korunur (mevcut görseller aynı adlarla aktarılabilir).
      addRandomSuffix: false,
      collections: {
        // Görseller Payload üzerinden değil, doğrudan Blob'un CDN'inden sunulur (daha hızlı).
        media: { disablePayloadAccessControl: true },
      },
    }),
  ],
})
