import type { CollectionBeforeOperationHook } from 'payload'
import sharp from 'sharp'

/**
 * Arka planı kaldırılmış (şeffaf) PNG yüklendiğinde etrafındaki boş şeffaf alanı kırpar.
 * Böylece portre, görseldeki boşluklar yüzünden sitede küçük görünmez.
 *
 * Sadece şeffaflığı olan PNG'lere uygulanır: normal fotoğrafların kenarı düz renkli olsa bile
 * (örn. açık gökyüzü) yanlışlıkla kırpılmaz.
 */
export const trimTransparentImage: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args

  const file = req.file
  if (!file?.data?.length || file.mimetype !== 'image/png') return args

  try {
    const { hasAlpha, width, height } = await sharp(file.data).metadata()
    if (!hasAlpha) return args

    const { data, info } = await sharp(file.data)
      // Tamamen şeffaf kenarları kırp; threshold, arka plan silme araçlarının bıraktığı çok hafif gölgeleri tolere eder.
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
      .png({ compressionLevel: 9 })
      .toBuffer({ resolveWithObject: true })

    if (info.width === width && info.height === height) return args

    file.data = data
    file.size = data.length

    req.payload.logger.info(
      `Şeffaf kenarlar kırpıldı: ${file.name} ${width}x${height} -> ${info.width}x${info.height}`,
    )
  } catch (error) {
    // Kırpma başarısız olursa görsel olduğu gibi yüklenir; yükleme engellenmez.
    req.payload.logger.warn({ err: error, msg: `Şeffaf kenarlar kırpılamadı: ${file.name}` })
  }

  return args
}
