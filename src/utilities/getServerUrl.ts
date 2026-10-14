/** Sitenin tam adresi (örn. https://enessir.com). SEO etiketleri ve site haritası için gereklidir. */
export const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
