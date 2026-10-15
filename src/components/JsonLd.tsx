/** Yapılandırılmış veriyi sayfaya ekler. Ziyaretçiye görünmez; sadece arama motorları okur. */
export const JsonLd = ({ data }: { data: Record<string, unknown> | null | (Record<string, unknown> | null)[] }) => {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean)
  if (items.length === 0) return null

  return (
    <script
      type="application/ld+json"
      // İçerikte "</script>" geçse bile etiketin erken kapanmaması için "<" kaçışlanır.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, '\\u003c'),
      }}
    />
  )
}
