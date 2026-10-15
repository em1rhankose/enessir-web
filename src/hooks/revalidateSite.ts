import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/**
 * Site sayfaları hız için önceden üretilip önbellekte tutulur.
 * Admin panelde bir içerik değiştiğinde önbelleği temizleriz; sayfalar bir sonraki
 * ziyarette güncel içerikle yeniden üretilir.
 *
 * Tüm siteyi tazeliyoruz çünkü içerikler birden çok sayfada görünüyor
 * (örn. bir makale hem ana sayfada hem makaleler sayfasında); site küçük olduğu için maliyeti düşük.
 */
const revalidateAll = (req: PayloadRequest) => {
  // Seed gibi Next.js dışında çalışan betiklerde önbellek yoktur; bu bayrakla atlanır.
  if (req.context.disableRevalidate) return

  try {
    revalidatePath('/', 'layout')
    // Sayfa düzeninin dışındaki otomatik üretilen dosyalar.
    revalidatePath('/sitemap.xml')
    revalidatePath('/robots.txt')
    revalidatePath('/llms.txt')
  } catch (error) {
    req.payload.logger.warn({ err: error, msg: 'Site önbelleği temizlenemedi' })
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateAll(req)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateAll(req)
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateAll(req)
  return doc
}
