import type { CSSProperties } from 'react'

export type CropShape = 'original' | 'square' | 'circle'

/**
 * Admin panelde seçilen gösterim şekli ve alanı. Alan, orijinal görselin yüzdesi olarak tutulur;
 * böylece görselin her boyuttaki kopyasında (küçük resim, kart, büyük) aynı bölge gösterilir.
 */
export type ImageCrop = {
  shape: CropShape
  /** Seçilen alanın sol üst köşesi ve boyutu, 0–100 arası yüzde. */
  x: number
  y: number
  width: number
  height: number
}

const isNumberInRange = (value: unknown, min: number, max: number) =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max

/**
 * Veritabanındaki ham değeri doğrular. Kare/yuvarlak dışındaki ya da bozuk değerler için null döner;
 * bu durumda görsel "olduğu gibi" gösterilir.
 */
export const parseCrop = (value: unknown): ImageCrop | null => {
  if (typeof value !== 'object' || value === null) return null

  const { shape, x, y, width, height } = value as Record<string, unknown>
  if (shape !== 'square' && shape !== 'circle') return null
  if (!isNumberInRange(x, 0, 100) || !isNumberInRange(y, 0, 100)) return null
  if (!isNumberInRange(width, 1, 100) || !isNumberInRange(height, 1, 100)) return null

  return { shape, x: x as number, y: y as number, width: width as number, height: height as number }
}

/**
 * Seçilen alanın çerçeveyi tam doldurması için görselin çerçeve içindeki konumu ve boyutu.
 * Örn. görselin %50'si seçildiyse görsel çerçevenin 2 katı büyüklüğünde çizilir ve kaydırılır.
 */
export const getCropStyle = (crop: ImageCrop): CSSProperties => ({
  position: 'absolute',
  left: `${(-crop.x / crop.width) * 100}%`,
  top: `${(-crop.y / crop.height) * 100}%`,
  width: `${(100 / crop.width) * 100}%`,
  height: `${(100 / crop.height) * 100}%`,
})

/** Kırpma nedeniyle görsel çerçeveden büyük çizildiğinde tarayıcıya doğru boyutu indirmesini söyler. */
export const scaleSizes = (sizes: string, factor: number) =>
  sizes
    .split(',')
    .map((entry) => {
      const trimmed = entry.trim()
      const match = trimmed.match(/^(\(.*\))\s+(.+)$/)
      const [condition, length] = match ? [match[1], match[2]] : ['', trimmed]
      return `${condition ? `${condition} ` : ''}calc(${length} * ${factor.toFixed(2)})`
    })
    .join(', ')
