import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Media } from '@/payload-types'
import { getCropStyle, parseCrop, scaleSizes, type ImageCrop } from '@/utilities/crop'
import { getImage, isMedia } from '@/utilities/media'

type MediaFrameProps = {
  media: unknown
  /** Görselin ekranda kaplayacağı genişlik; tarayıcı buna göre uygun boyutu indirir. */
  sizes: string
  /** "Olduğu gibi" gösterimde kullanılacak hazır boyut. */
  size?: keyof NonNullable<Media['sizes']>
  priority?: boolean
  /** "Olduğu gibi" gösterimdeki çerçeve (oran, köşe yuvarlaklığı vb.). */
  className?: string
  /** Kare/yuvarlak gösterimde çerçevenin boyutu. */
  shapedClassName?: string
  /** Görselin kendisine eklenecek sınıflar (örn. üzerine gelince büyüme efekti). */
  imageClassName?: string
  /** Görsel yoksa çerçevenin içinde gösterilecek içerik. */
  fallback?: ReactNode
}

/** Admin panelde görsel için seçilen kare/yuvarlak kırpmayı döner; "olduğu gibi" ise null. */
export const getMediaCrop = (media: unknown): ImageCrop | null => (isMedia(media) ? parseCrop(media.crop) : null)

/**
 * Sitedeki tüm fotoğraflar bu bileşenle gösterilir; admin panelde seçilen gösterime uyar:
 * olduğu gibi (bölümün kendi çerçevesinde, odak noktasına göre) ya da seçilen alan kare/yuvarlak.
 */
export const MediaFrame = ({
  media,
  sizes,
  size,
  priority,
  className = '',
  shapedClassName = 'w-full',
  imageClassName = '',
  fallback,
}: MediaFrameProps) => {
  const crop = getMediaCrop(media)

  if (crop && isMedia(media) && media.url) {
    return (
      <div
        className={`relative aspect-square overflow-hidden bg-sage-100 ${
          crop.shape === 'circle' ? 'rounded-full' : 'rounded-[2rem]'
        } ${shapedClassName}`}
      >
        <div style={getCropStyle(crop)} className={imageClassName}>
          <Image
            src={media.url}
            alt={media.alt}
            fill
            priority={priority}
            // Seçilen alan büyütülerek gösterildiği için görselin tamamı çerçeveden büyük çizilir.
            sizes={scaleSizes(sizes, 100 / crop.width)}
            className="object-fill"
          />
        </div>
      </div>
    )
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
          className={`object-cover ${imageClassName}`}
          style={{ objectPosition: focalPoint }}
        />
      ) : (
        fallback
      )}
    </div>
  )
}
