'use client'

import { FieldLabel, useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, type PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import {
  getCropAspectRatio,
  getCropStyle,
  isFramedShape,
  parseCrop,
  type CropShape,
  type ImageCrop,
} from '@/utilities/crop'

const shapes: { value: CropShape; label: string }[] = [
  { value: 'original', label: 'Olduğu gibi' },
  { value: 'free', label: 'Serbest' },
  { value: 'square', label: 'Kare' },
  { value: 'circle', label: 'Yuvarlak' },
]

const round = (value: number) => Math.round(value * 100) / 100

/** Görselin ortasında, sığabilen en büyük karenin %90'ı kadar bir seçim. */
const centeredSquare = (width: number, height: number): PercentCrop => {
  const base = width >= height ? { unit: '%' as const, height: 90 } : { unit: '%' as const, width: 90 }
  return centerCrop(makeAspectCrop(base, 1, width, height), width, height)
}

const fullImage: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 }

/** Seçim piksel cinsinden kare mi? (Yüzdeler görselin en ve boyuna göre olduğu için doğrudan karşılaştırılamaz.) */
const isSquareSelection = (area: PercentCrop, width: number, height: number) =>
  Math.abs(area.width * width - area.height * height) <= 0.02 * Math.min(area.width * width, area.height * height)

/** Seçilen şekle uygun alan: serbestte mevcut seçim (yoksa görselin tamamı), kare/yuvarlakta kare bir seçim. */
const areaForShape = (shape: CropShape, current: PercentCrop | undefined, width: number, height: number) => {
  if (shape === 'free') return current ?? fullImage
  if (current && isSquareSelection(current, width, height)) return current
  return centeredSquare(width, height)
}

/**
 * Medya kaydında görselin sitede nasıl gösterileceğini seçme aracı: olduğu gibi,
 * serbest seçilen alan (çerçevesiz) ya da istenen alan seçilerek kare / yuvarlak.
 */
export const ImageCropField: JSONFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<ImageCrop | { shape: 'original' } | null>({ path })
  const file = useFormFields(([fields]) => fields.file?.value)
  const { savedDocumentData } = useDocumentInfo()

  // Yeni seçilen dosya henüz kaydedilmediyse tarayıcıdaki kopyası, değilse kayıtlı görsel gösterilir.
  const objectUrl = useMemo(() => (file instanceof File ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }, [objectUrl])
  const savedUrl = typeof savedDocumentData?.url === 'string' ? savedDocumentData.url : null
  const src = objectUrl ?? savedUrl

  const shape: CropShape =
    value?.shape === 'free' || value?.shape === 'square' || value?.shape === 'circle' ? value.shape : 'original'
  const savedCrop = parseCrop(value)

  const [selection, setSelection] = useState<PercentCrop | undefined>(
    savedCrop ? { unit: '%', ...savedCrop } : undefined,
  )
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const initializedFile = useRef<string | null>(null)

  const save = (nextShape: CropShape, area?: PercentCrop) => {
    if (nextShape === 'original' || !area) {
      setValue(nextShape === 'original' ? null : { shape: nextShape })
      return
    }
    setValue({
      shape: nextShape,
      x: round(area.x),
      y: round(area.y),
      width: round(area.width),
      height: round(area.height),
    })
  }

  const selectShape = (nextShape: CropShape) => {
    if (nextShape === 'original') {
      save('original')
      return
    }
    if (!imageSize) {
      save(nextShape)
      return
    }
    const area = areaForShape(nextShape, selection, imageSize.width, imageSize.height)
    setSelection(area)
    save(nextShape, area)
  }

  const onImageLoad = (image: HTMLImageElement) => {
    const { naturalWidth: width, naturalHeight: height } = image
    // Aynı boyut tekrar gelirse önceki değer korunur; React gereksiz yeniden çizim yapmaz.
    setImageSize((previous) =>
      previous?.width === width && previous?.height === height ? previous : { width, height },
    )

    // Yeni dosya seçildiğinde eski seçim ona uymaz: seçimi her yeni dosya için bir kez ortadan başlat.
    // Kayıtlı görselde ise mevcut seçime asla dokunma; seçim yoksa ortadan bir başlangıç ver.
    if (objectUrl) {
      if (initializedFile.current === objectUrl) return
      initializedFile.current = objectUrl
    } else if (selection) {
      return
    }

    const area = shape === 'free' ? fullImage : centeredSquare(width, height)
    setSelection(area)
    if (shape !== 'original') save(shape, area)
  }

  // Görsel tarayıcı önbelleğinden, bileşen sayfaya bağlanmadan önce yüklenmiş olabilir; bu durumda
  // onLoad hiç tetiklenmez. Görsel zaten hazırsa yükleme işlemi burada elle çalıştırılır.
  const imageRef = (image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) onImageLoad(image)
  }

  const preview = shape !== 'original' ? parseCrop(value) : null
  const previewRatio =
    preview && imageSize ? getCropAspectRatio(preview, imageSize.width, imageSize.height) : 1

  return (
    <div style={styles.wrapper}>
      <FieldLabel label={field.label} path={path} />
      <p style={styles.description}>
        Fotoğrafın sitede nasıl görüneceğini seçin. Çerçeveyi sürükleyerek ve köşelerinden boyutlandırarak
        hangi kısmın görüneceğini belirleyin. Orijinal dosya değişmez.
        <br />
        <strong>Serbest:</strong> istediğiniz alanı seçin, çerçevesiz gösterilir (arka planı kaldırılmış
        fotoğraflar site zeminiyle bütünleşir). <strong>Kare / Yuvarlak:</strong> seçilen alan çerçeve içinde
        gösterilir.
      </p>

      <div role="radiogroup" aria-label="Gösterim şekli" style={styles.buttons}>
        {shapes.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={shape === option.value}
            onClick={() => selectShape(option.value)}
            style={{ ...styles.button, ...(shape === option.value ? styles.buttonActive : {}) }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!src && <p style={styles.description}>Önce bir görsel seçin.</p>}

      {src && (
        <div style={styles.editor}>
          <div style={styles.cropArea}>
            {shape === 'original' ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin önizlemesi; optimizasyon gerekmez
              <img src={src} alt="" style={styles.image} ref={imageRef} onLoad={(event) => onImageLoad(event.currentTarget)} />
            ) : (
              <ReactCrop
                crop={selection}
                aspect={isFramedShape(shape) ? 1 : undefined}
                circularCrop={shape === 'circle'}
                keepSelection
                ruleOfThirds
                minWidth={40}
                onChange={(_, percentCrop) => setSelection(percentCrop)}
                onComplete={(_, percentCrop) => save(shape, percentCrop)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- kırpma aracı ham <img> ister */}
                <img src={src} alt="" style={styles.image} ref={imageRef} onLoad={(event) => onImageLoad(event.currentTarget)} />
              </ReactCrop>
            )}
          </div>

          {preview && (
            <div style={styles.previewColumn}>
              <span style={styles.previewLabel}>Sitede görünüm</span>
              <div
                style={
                  preview.shape === 'free'
                    ? {
                        ...styles.preview,
                        ...styles.previewFree,
                        aspectRatio: previewRatio,
                        width: previewRatio >= 1 ? '160px' : 'auto',
                        height: previewRatio >= 1 ? 'auto' : '160px',
                      }
                    : { ...styles.preview, borderRadius: preview.shape === 'circle' ? '9999px' : '12px' }
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- admin önizlemesi */}
                <img src={src} alt="" style={{ ...getCropStyle(preview), maxWidth: 'none' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  wrapper: { marginBottom: 'var(--base)' },
  description: {
    margin: '0 0 calc(var(--base) * 0.75)',
    color: 'var(--theme-elevation-500)',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  buttons: { display: 'flex', gap: '8px', marginBottom: 'var(--base)', flexWrap: 'wrap' },
  button: {
    padding: '8px 16px',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--theme-elevation-200)',
    background: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
  },
  buttonActive: {
    background: '#4c6a5b',
    borderColor: '#4c6a5b',
    color: '#ffffff',
  },
  editor: { display: 'flex', gap: 'calc(var(--base) * 1.5)', alignItems: 'flex-start', flexWrap: 'wrap' },
  cropArea: {
    maxWidth: '520px',
    flex: '1 1 320px',
    // Şeffaf görsellerin kenarları görünsün diye dama deseni.
    backgroundColor: '#f3f6f4',
    backgroundImage:
      'linear-gradient(45deg, #e3ebe6 25%, transparent 25%), linear-gradient(-45deg, #e3ebe6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e3ebe6 75%), linear-gradient(-45deg, transparent 75%, #e3ebe6 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  image: { display: 'block', maxWidth: '100%', maxHeight: '520px' },
  previewColumn: { display: 'flex', flexDirection: 'column', gap: '8px' },
  previewLabel: { fontSize: '12px', fontWeight: 600, color: 'var(--theme-elevation-600)' },
  preview: {
    position: 'relative',
    width: '140px',
    height: '140px',
    overflow: 'hidden',
    // Sitedeki çerçevenin zemin rengi (sage-100); şeffaf görsellerde önizleme siteyle aynı görünsün.
    background: '#e3ebe6',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
  },
  // Serbest: çerçevesiz; ana sayfa karşılama alanının yeşil zemini üzerinde gösterilir.
  previewFree: {
    background: 'linear-gradient(135deg, #3f574b, #4c6a5b 50%, #34473e)',
    borderRadius: '8px',
    boxShadow: 'none',
  },
}
