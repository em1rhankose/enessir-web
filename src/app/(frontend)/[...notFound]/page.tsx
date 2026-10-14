import { notFound } from 'next/navigation'

/**
 * Projede iki ayrı kök layout (site ve admin paneli) olduğu için eşleşmeyen adresler
 * buraya düşer ve sitenin kendi 404 sayfası (not-found.tsx) başlık/alt bilgiyle gösterilir.
 */
export default function CatchAllNotFound() {
  notFound()
}
