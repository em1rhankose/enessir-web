import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import type { Media } from '@/payload-types'
import {
  getCropAspectRatio,
  getCropStyle,
  isFramedShape,
  parseCrop,
  scaleSizes,
  type ImageCrop,
} from '@/utilities/crop'
import { getImage, isMedia } from '@/utilities/media'

type MediaFrameProps = {
  media: unknown
  /** Görselin ekranda kaplayacağı genişlik; tarayıcı buna göre uygun boyutu indirir. */
  sizes: string
  /** "Olduğu gibi" gösterimde kullanılacak hazır boyut. */
  size?: keyof NonNullable<Media['sizes']>
  priority?: boolean
  /**
   * Görselin çerçeveye yerleşimi: cover çerçeveyi doldurur (fazlası kırpılır),
   * contain görselin tamamını alt kenara oturtarak sığdırır (dekupe portre).
   */
  fit?: 'cover' | 'contain'
  /** "Olduğu gibi" ve "Serbest" gösterimdeki çerçeve (oran, köşe yuvarlaklığı vb.). */
  className?: string
  /** Kare/yuvarlak gösterimde çerçevenin boyutu. */
  shapedClassName?: string
  /** Görselin kendisine eklenecek sınıflar (örn. üzerine gelince büyüme efekti). */
  imageClassName?: string
  /** Görsel yoksa çerçevenin içinde gösterilecek içerik. */
  fallback?: ReactNode
}

/** Admin panelde görsel için seçilen alanı döner (serbest, kare veya yuvarlak); "olduğu gibi" ise null. */
export const getMediaCrop = (media: unknown): ImageCrop | null => (isMedia(media) ? parseCrop(media.crop) : null)

/** Kare veya yuvarlak çerçeve seçildiyse o kırpmayı döner. */
export const getFramedCrop = (media: unknown): ImageCrop | null => {
  const crop = getMediaCrop(media)
  return crop && isFramedShape(crop.shape) ? crop : null
}

/** Görselin seçilen alanını, alanın kendi oranını koruyarak çizer. */
const CroppedImage = ({
  media,
  crop,
  sizes,
  priority,
  imageClassName,
}: {
  media: Media
  crop: ImageCrop
  sizes: string
  priority?: boolean
  imageClassName: string
}) => (
  <div style={getCropStyle(crop)} className={imageClassName}>
    <Image
      src={media.url as string}
      alt={media.alt}
      fill
      priority={priority}
      // Seçilen alan büyütülerek gösterildiği için görselin tamamı çerçeveden büyük çizilir.
      sizes={scaleSizes(sizes, 100 / crop.width)}
      className="object-fill"
    />
  </div>
)

/**
 * Sitedeki tüm fotoğraflar bu bileşenle gösterilir; admin panelde seçilen gösterime uyar:
 * olduğu gibi, serbest seçilen alan (çerçevesiz) ya da seçilen alan kare/yuvarlak.
 */
export const MediaFrame = ({
  media,
  sizes,
  size,
  priority,
  fit = 'cover',
  className = '',
  shapedClassName = 'w-full',
  imageClassName = '',
  fallback,
}: MediaFrameProps) => {
  const crop = getMediaCrop(media)

  if (crop && isMedia(media) && media.url) {
    if (isFramedShape(crop.shape)) {
      return (
        <div
          className={`relative aspect-square overflow-hidden bg-sage-100 ${
            crop.shape === 'circle' ? 'rounded-full' : 'rounded-[2rem]'
          } ${shapedClassName}`}
        >
          <CroppedImage
            media={media}
            crop={crop}
            sizes={sizes}
            priority={priority}
            imageClassName={imageClassName}
          />
        </div>
      )
    }

    if (media.width && media.height) {
      const ratio = getCropAspectRatio(crop, media.width, media.height)
      // Seçilen alanın kutusu, çerçevenin genişlik (cqw) ve yüksekliğine (cqh) göre boyutlanır:
      // cover çerçeveyi tam doldurur, contain tamamen sığıp alt kenara oturur.
      const box: CSSProperties =
        fit === 'cover'
          ? {
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `max(100cqw, calc(100cqh * ${ratio.toFixed(4)}))`,
            }
          : {
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: `min(100cqw, calc(100cqh * ${ratio.toFixed(4)}))`,
            }

      return (
        <div className={`relative overflow-hidden ${className}`} style={{ containerType: 'size' }}>
          <div className="absolute overflow-hidden" style={{ ...box, aspectRatio: ratio }}>
            <CroppedImage
              media={media}
              crop={crop}
              sizes={sizes}
              priority={priority}
              imageClassName={imageClassName}
            />
          </div>
        </div>
      )
    }
  }

  const image = getImage(media, size)
  const focalPoint =
    isMedia(media) && typeof media.focalX === 'number' && typeof media.focalY === 'number'
      ? `${media.focalX}% ${media.focalY}%`
      : undefined

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`${fit === 'cover' ? 'object-cover' : 'object-contain object-bottom'} ${imageClassName}`}
          style={fit === 'cover' ? { objectPosition: focalPoint } : undefined}
        />
      ) : (
        fallback
      )}
    </div>
  )
}
