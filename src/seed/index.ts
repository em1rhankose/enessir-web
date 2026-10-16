/**
 * Örnek içerik betiği: `npm run seed`
 *
 * Boş bir veritabanını, tasarımın değerlendirilebilmesi için örnek içerikle doldurur.
 * Veritabanında zaten makale varsa hiçbir şeyi değiştirmeden durur; gerçek içerik ezilmez.
 * Tüm metinler yer tutucudur ve admin panelden gerçek içerikle değiştirilmelidir.
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { generateImage, palettes } from './images'
import { buildKvkkText } from './kvkk'
import { bulletList, heading, paragraph, quote, richText } from './lexical'
import { sampleHomeFaqs, sampleServices } from './services'

// Betik Next.js dışında çalıştığı için site önbelleğini temizleme hook'u atlanır.
const context = { disableRevalidate: true }

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

const seed = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'articles' })
  if (existing.totalDocs > 0) {
    payload.logger.warn('Veritabanında zaten makale var; örnek içerik yüklenmedi.')
    process.exit(0)
  }

  payload.logger.info('Örnek görseller oluşturuluyor...')

  const createImage = async (name: string, alt: string, palette: keyof typeof palettes, seedValue: number) => {
    const data = await generateImage(palettes[palette], seedValue)
    return payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/jpeg', name: `${name}.jpg`, size: data.length },
      context,
    })
  }

  const imageSpecs: Parameters<typeof createImage>[] = [
    ['karsilama', 'Yumuşak yeşil tonlarda soyut arka plan', 'dusk', 7],
    ['merkez-1', 'Danışma merkezinin sakin bekleme alanı', 'sand', 11],
    ['merkez-2', 'Terapi odası', 'mist', 23],
    ['merkez-3', 'Merkezin girişi', 'clay', 31],
    ['portre', 'Psikolog Enes Sir portresi', 'sage', 43],
    ['makale-kaygi', 'Kaygıyı simgeleyen soyut görsel', 'sage', 101],
    ['makale-terapi', 'İlk terapi seansını simgeleyen soyut görsel', 'sand', 202],
    ['makale-sinir', 'Sınırları simgeleyen soyut görsel', 'clay', 303],
    ['makale-uyku', 'Uykuyu simgeleyen soyut görsel', 'mist', 404],
  ]

  // Sırayla yüklenir: paralel yüklemede Payload aynı dosya adını iki kez seçip çakışabiliyor.
  const images = []
  for (const spec of imageSpecs) images.push(await createImage(...spec))
  const [heroImage, centerImage1, centerImage2, centerImage3, aboutPhoto, ...articleImages] = images

  payload.logger.info('Sayfa içerikleri yazılıyor...')

  await payload.updateGlobal({
    slug: 'site-settings',
    context,
    data: {
      siteName: 'Psikolog Enes Sir',
      whatsappNumber: '905000000000',
      whatsappMessage: 'Merhaba, randevu almak istiyorum.',
      phone: '+90 500 000 00 00',
      email: 'iletisim@ornek.com',
      address: 'Örnek Mahallesi, Örnek Sokak No: 1\nKadıköy / İstanbul',
      mapQuery: 'Kadıköy, İstanbul',
      workingHours: 'Pazartesi – Cumartesi, 09:00 – 19:00',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
      kvkkText: buildKvkkText({
        fullName: 'Enes Sir',
        title: 'Psikolog',
        address: 'Örnek Mahallesi, Örnek Sokak No: 1, Kadıköy / İstanbul',
        email: 'iletisim@ornek.com',
        phone: '+90 500 000 00 00',
        date: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      }),
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    context,
    data: {
      heroTitle: 'Kendinize alan açın.',
      heroSubtitle:
        'Bireysel terapi ve psikolojik danışmanlıkla, kendinizi daha iyi anlamanız için güvenli ve yargısız bir alan.',
      heroImage: heroImage.id,
      heroButtonText: 'Randevu Al',
      articlesHeading: 'Son Makaleler',
      contactHeading: 'Bize Ulaşın',
      faqs: sampleHomeFaqs,
    },
  })

  await payload.updateGlobal({
    slug: 'counseling-center',
    context,
    data: {
      title: 'Güvenle konuşabileceğiniz bir alan',
      summary:
        'Merkezimizde her danışanın hikâyesini kendine özgü kabul ediyor, süreci birlikte ve sizin hızınızda planlıyoruz.',
      content: richText(
        paragraph(
          'Danışma merkezimiz, kendinizi rahat ve güvende hissedebileceğiniz sakin bir ortamda hizmet vermektedir. Görüşmeler yüz yüze veya çevrim içi olarak yapılabilir.',
        ),
        heading('Nasıl çalışıyoruz?'),
        paragraph(
          'İlk görüşmede sizi neyin getirdiğini ve beklentilerinizi konuşuruz. Ardından ihtiyaçlarınıza uygun bir çalışma planı birlikte oluşturulur.',
        ),
        bulletList([
          'Görüşmeler yaklaşık 50 dakika sürer.',
          'Paylaştığınız her şey gizlilik ilkesi çerçevesinde korunur.',
          'Süreç boyunca hedeflerinizi düzenli olarak birlikte değerlendiririz.',
        ]),
      ),
      gallery: [centerImage1.id, centerImage2.id, centerImage3.id],
    },
  })

  await payload.updateGlobal({
    slug: 'about',
    context,
    data: {
      fullName: 'Enes Sir',
      jobTitle: 'Psikolog',
      photo: aboutPhoto.id,
      summary:
        'Danışanlarımla, yaşadıkları zorlukları anlamlandırabilecekleri ve kendi güçlerini yeniden keşfedebilecekleri bir süreç yürütmeyi amaçlıyorum. (Bu metin örnek içeriktir.)',
      biography: richText(
        paragraph(
          'Bu bölüm örnek içeriktir ve admin panelden gerçek biyografiyle değiştirilmelidir.',
        ),
        paragraph(
          'Psikoloji eğitimimin ardından farklı yaş gruplarıyla çalışarak klinik deneyim kazandım. Terapide, danışanın kendi hikâyesinin uzmanı olduğuna inanıyor ve süreci iş birliği içinde yürütüyorum.',
        ),
        quote('Değişim, kendimize merakla bakabildiğimiz anda başlar.'),
        paragraph(
          'Çalışmalarımda kanıta dayalı yaklaşımları temel alıyor, her danışanın ihtiyacına göre süreci şekillendiriyorum.',
        ),
      ),
      qualifications: [
        { title: 'Psikoloji Lisans', institution: 'Örnek Üniversitesi', year: '2016' },
        { title: 'Klinik Psikoloji Yüksek Lisans', institution: 'Örnek Üniversitesi', year: '2019' },
        { title: 'Bilişsel Davranışçı Terapi Eğitimi', institution: 'Örnek Eğitim Kurumu', year: '2021' },
      ],
    },
  })

  payload.logger.info('Örnek makaleler yazılıyor...')

  const articles = [
    {
      title: 'Kaygı Ne Zaman Sorun Olur?',
      excerpt:
        'Kaygı hepimizin yaşadığı doğal bir duygu. Peki ne zaman günlük hayatı zorlaştıran bir soruna dönüşür ve neler yapılabilir?',
      coverImage: articleImages[0].id,
      publishedAt: daysAgo(3),
      content: richText(
        paragraph(
          'Kaygı, bizi olası tehlikelere karşı uyaran ve harekete geçiren doğal bir duygudur. Bir sınav öncesi hissedilen gerginlik, dikkatimizi toplamamıza yardımcı olabilir.',
        ),
        heading('Doğal kaygı ile sorun olan kaygı arasındaki fark'),
        paragraph(
          'Kaygı; durumla orantısız, uzun süreli ve günlük işlevselliği etkileyen bir hâl aldığında destek almayı düşünmek faydalı olabilir.',
        ),
        bulletList([
          'Endişelerin kontrol edilemez hissettirmesi',
          'Uyku düzeninin bozulması',
          'Kaçınma davranışlarının artması',
          'Bedensel belirtiler: çarpıntı, nefes darlığı, kas gerginliği',
        ]),
        heading('Neler yardımcı olabilir?'),
        paragraph(
          'Düzenli nefes egzersizleri, fiziksel aktivite ve uyku düzenine dikkat etmek ilk adımlar olabilir. Kaygı yaşamınızı belirgin şekilde etkiliyorsa bir uzmandan destek almak en doğru yoldur.',
        ),
        quote('Kaygıyı yok etmeye çalışmak yerine onu anlamak, çoğu zaman daha iyi bir başlangıçtır.'),
      ),
    },
    {
      title: 'Terapiye Başlamak: İlk Seansta Neler Olur?',
      excerpt:
        'Terapiye başlamayı düşünüyor ama ilk görüşmede ne olacağını merak ediyor musunuz? İlk seansa dair bilmeniz gerekenler.',
      coverImage: articleImages[1].id,
      publishedAt: daysAgo(12),
      content: richText(
        paragraph(
          'Terapiye başlamak cesaret isteyen bir adımdır. İlk seansla ilgili belirsizlik, bu adımı atmayı zorlaştırabilir.',
        ),
        heading('İlk görüşmede neler konuşulur?'),
        paragraph(
          'İlk seans genellikle tanışma ve ihtiyaçların anlaşılması üzerine kuruludur. Sizi terapiye getiren konular, beklentileriniz ve hayatınızla ilgili genel bilgiler konuşulur.',
        ),
        heading('Hazırlık yapmanız gerekir mi?'),
        paragraph(
          'Özel bir hazırlık gerekmez. Yine de neden destek almak istediğinizi kısaca düşünmek ve aklınıza gelen soruları not etmek faydalı olabilir.',
        ),
        bulletList([
          'Gizlilik nasıl sağlanıyor?',
          'Görüşmeler ne sıklıkla yapılacak?',
          'Süreç yaklaşık ne kadar sürebilir?',
        ]),
        paragraph('Unutmayın: terapistinizle aranızdaki güven ilişkisi, sürecin en önemli parçalarından biridir.'),
      ),
    },
    {
      title: 'Sınır Koymak Neden Bu Kadar Zor?',
      excerpt:
        '“Hayır” demekte zorlanıyor, başkalarının ihtiyaçlarını hep kendinizinkinden önce mi tutuyorsunuz? Sağlıklı sınırlar üzerine.',
      coverImage: articleImages[2].id,
      publishedAt: daysAgo(26),
      content: richText(
        paragraph(
          'Sınırlar, kendimizi ve ilişkilerimizi korumamızı sağlayan görünmez çizgilerdir. Ancak birçoğumuz sınır koymayı bencillikle karıştırırız.',
        ),
        heading('Sınır koymayı zorlaştıran nedir?'),
        paragraph(
          'Reddedilme korkusu, suçluluk duygusu ve çatışmadan kaçınma isteği sınır koymayı zorlaştıran yaygın nedenlerdir.',
        ),
        heading('Küçük adımlarla başlamak'),
        bulletList([
          'İhtiyaçlarınızı fark etmek ve adlandırmak',
          'Açık ve sakin bir dille ifade etmek',
          'Her isteğe hemen yanıt vermek zorunda olmadığınızı hatırlamak',
        ]),
        quote('Sağlıklı sınırlar, ilişkileri uzaklaştırmaz; onları daha güvenli kılar.'),
      ),
    },
    {
      title: 'Uyku ve Ruh Sağlığı Arasındaki Bağ',
      excerpt:
        'Yetersiz uyku ruh hâlimizi nasıl etkiler? Uyku ile duygusal iyi oluş arasındaki ilişkiye ve uyku düzenini destekleyen alışkanlıklara bakalım.',
      coverImage: articleImages[3].id,
      publishedAt: daysAgo(41),
      content: richText(
        paragraph(
          'Uyku, bedenimiz kadar zihnimiz için de bir onarım sürecidir. Yetersiz uyku; dikkat, duygu düzenleme ve stresle baş etme becerilerimizi doğrudan etkiler.',
        ),
        heading('İki yönlü bir ilişki'),
        paragraph(
          'Ruh sağlığındaki zorluklar uykuyu bozabilir; bozulan uyku da bu zorlukları artırabilir. Bu döngüyü fark etmek, değişimin ilk adımıdır.',
        ),
        heading('Uyku düzenini destekleyen alışkanlıklar'),
        bulletList([
          'Her gün aynı saatlerde yatıp kalkmak',
          'Yatmadan önce ekran süresini azaltmak',
          'Akşam saatlerinde kafein tüketimini sınırlamak',
          'Yatak odasını serin, karanlık ve sessiz tutmak',
        ]),
        paragraph('Uyku sorunları uzun süredir devam ediyorsa bir uzmana danışmanız önerilir.'),
      ),
    },
  ]

  for (const article of articles) {
    await payload.create({
      collection: 'articles',
      context,
      data: { ...article, _status: 'published' },
    })
  }

  payload.logger.info('Örnek hizmetler yazılıyor...')

  for (const service of sampleServices) {
    await payload.create({
      collection: 'services',
      context,
      data: { ...service, _status: 'published' },
    })
  }

  payload.logger.info('Örnek içerik başarıyla yüklendi.')
  process.exit(0)
}

// `payload run` betiği import ettikten sonra süreci kapattığı için tamamlanmasını burada bekliyoruz.
try {
  await seed()
} catch (error) {
  console.error(error)
  process.exit(1)
}
