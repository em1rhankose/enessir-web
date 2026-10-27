import { getAbout, getAllArticleSlugs, getServices, getSiteSettings } from '@/lib/queries'
import { getServerUrl } from '@/utilities/getServerUrl'

/**
 * /llms.txt — ChatGPT, Gemini, Perplexity gibi yapay zekâ arama motorları için sitenin özeti
 * (https://llmstxt.org). İçerik admin panelden otomatik üretilir; elle güncellemek gerekmez.
 * İçerik değiştiğinde site önbelleğiyle birlikte yenilenir.
 */
export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = getServerUrl()
  const [settings, about, services, articles] = await Promise.all([
    getSiteSettings(),
    getAbout(),
    getServices(),
    getAllArticleSlugs(),
  ])

  const location = [settings.district, settings.city].filter(Boolean).join(', ')
  const contact = [
    settings.phone && `Telefon: ${settings.phone}`,
    settings.email && `E-posta: ${settings.email}`,
    settings.address && `Adres: ${settings.address.replace(/\s*\n\s*/g, ', ')}`,
    settings.workingHours && `Çalışma saatleri: ${settings.workingHours}`,
  ].filter(Boolean)

  const lines = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.seoDescription ?? `${about.fullName}, ${about.jobTitle ?? 'psikolog'}.`}`,
    '',
    `${about.fullName}${about.jobTitle ? `, ${about.jobTitle}` : ''}${location ? ` — ${location}` : ''}.`,
    about.summary ?? '',
    '',
    '## Sayfalar',
    `- [Ben Kimim](${baseUrl}/ben-kimim): ${about.fullName} hakkında, eğitim ve sertifikalar`,
    `- [Ofisimiz](${baseUrl}/ofisimiz): Ofis ve çalışma yöntemi`,
    `- [Hizmetler](${baseUrl}/hizmetler): Verilen tüm hizmetler`,
    `- [Makaleler](${baseUrl}/makaleler): Ruh sağlığı üzerine yazılar`,
    `- [İletişim](${baseUrl}/iletisim): Randevu ve iletişim bilgileri`,
  ]

  if (services.length > 0) {
    lines.push('', '## Hizmetler')
    for (const service of services) {
      lines.push(`- [${service.title}](${baseUrl}/hizmetler/${service.slug}): ${service.summary}`)
    }
  }

  if (articles.length > 0) {
    lines.push('', '## Makaleler')
    for (const article of articles) {
      lines.push(`- [${article.title}](${baseUrl}/makaleler/${article.slug})`)
    }
  }

  if (contact.length > 0) {
    lines.push('', '## İletişim', ...contact.map((item) => `- ${item}`))
  }

  return new Response(`${lines.join('\n').trim()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
