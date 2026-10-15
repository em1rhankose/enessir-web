import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    // Geliştirmede şema değişikliklerini dev sunucusu uygular. Aynı anda çalışan betikler
    // (PAYLOAD_DB_PUSH=false ile) şemaya dokunmaz; iki işlem aynı değişikliği uygulamaya çalışıp çakışmaz.
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
  }),
  sharp,
  plugins: [],
})
