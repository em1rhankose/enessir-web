import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-sand pt-24">
      <div className="container-page text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl text-ink md:text-5xl">Aradığınız sayfa bulunamadı</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          Sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilirsiniz.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Ana Sayfaya Dön
        </Link>
      </div>
    </section>
  )
}
