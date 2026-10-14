import sharp from 'sharp'

type Palette = { from: string; to: string; blobs: string[] }

/** Örnek içerik için telif sorunu olmayan, sitenin renk paletinde soyut görseller üretir. */
export const palettes: Record<string, Palette> = {
  sage: { from: '#3f574b', to: '#a3bcae', blobs: ['#c8d7ce', '#7d9d8c', '#f2ece3'] },
  sand: { from: '#e4ddd2', to: '#faf7f2', blobs: ['#c8d7ce', '#c0805f', '#a3bcae'] },
  clay: { from: '#a96a4b', to: '#f2ece3', blobs: ['#e3ebe6', '#c0805f', '#618372'] },
  dusk: { from: '#2b3a33', to: '#618372', blobs: ['#c0805f', '#c8d7ce', '#4c6a5b'] },
  mist: { from: '#c8d7ce', to: '#faf7f2', blobs: ['#7d9d8c', '#e4ddd2', '#c0805f'] },
}

export const generateImage = async (palette: Palette, seed: number, width = 1600, height = 1200) => {
  // Basit, tekrarlanabilir rastgelelik: aynı seed her zaman aynı görseli üretir.
  let state = seed
  const random = () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }

  const blobs = palette.blobs
    .map((color) => {
      const cx = Math.round(random() * width)
      const cy = Math.round(random() * height)
      const r = Math.round((0.25 + random() * 0.3) * width)
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.55" />`
    })
    .join('')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${palette.from}" />
          <stop offset="1" stop-color="${palette.to}" />
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="${Math.round(width / 12)}" /></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <g filter="url(#blur)">${blobs}</g>
    </svg>`

  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}
