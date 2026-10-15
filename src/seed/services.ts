import { bulletList, heading, paragraph, richText } from './lexical'

/** Örnek hizmetler ve sorular — yer tutucudur; admin panelden gerçek içerikle değiştirilmelidir. */

const serviceContent = (intro: string, forWhom: string[], process: string) =>
  richText(
    paragraph(intro),
    heading('Kimler için uygun?'),
    bulletList(forWhom),
    heading('Süreç nasıl işliyor?'),
    paragraph(process),
    paragraph('Bu metin örnek içeriktir ve admin panelden gerçek içerikle değiştirilmelidir.'),
  )

export const sampleServices = [
  {
    title: 'Bireysel Terapi',
    order: 1,
    summary: 'Yetişkinlere yönelik, kişinin ihtiyaçlarına göre planlanan, birebir yürütülen terapi süreci.',
    content: serviceContent(
      'Bireysel terapi, yaşadığınız zorlukları güvenli ve yargısız bir ortamda bir uzmanla birlikte ele aldığınız süreçtir.',
      ['Kaygı, stres ve yoğun duygularla baş etmekte zorlananlar', 'İlişki ve iletişim sorunları yaşayanlar', 'Kendini daha iyi tanımak isteyenler'],
      'İlk görüşmede ihtiyaçlarınız ve hedefleriniz konuşulur; ardından düzenli seanslarla süreç birlikte planlanır.',
    ),
    faqs: [
      { question: 'Bir seans ne kadar sürer?', answer: 'Seanslar genellikle 50 dakika sürer.' },
      { question: 'Kaç seans gerekir?', answer: 'Kişiye ve ihtiyaca göre değişir; ilk görüşmelerde birlikte değerlendirilir.' },
    ],
  },
  {
    title: 'Çift Terapisi',
    order: 2,
    summary: 'İlişkide iletişim, güven ve uyum sorunlarını iki tarafın birlikte katıldığı görüşmelerle ele alan süreç.',
    content: serviceContent(
      'Çift terapisi, partnerlerin birbirini daha iyi anlamasına ve ilişkideki tıkanıklıkları birlikte çözmesine yardımcı olur.',
      ['Sık tartışan veya iletişim kuramayan çiftler', 'Güven sorunu yaşayan çiftler', 'Önemli bir karar aşamasındaki çiftler'],
      'Görüşmeler çoğunlukla iki partnerin birlikte katılımıyla yapılır; gerektiğinde bireysel görüşmeler de planlanır.',
    ),
    faqs: [
      { question: 'Partnerim gelmek istemezse ne yapabilirim?', answer: 'Süreç bireysel görüşmelerle başlayabilir; ilişkiye dair konular yine ele alınabilir.' },
    ],
  },
  {
    title: 'Ergen Danışmanlığı',
    order: 3,
    summary: 'Ergenlik döneminin duygusal, sosyal ve akademik zorluklarında gençlere ve ailelerine destek.',
    content: serviceContent(
      'Ergenlik, hızlı değişimlerin yaşandığı bir dönemdir. Danışmanlık, gencin bu dönemi daha sağlıklı geçirmesine destek olur.',
      ['Sınav kaygısı yaşayan gençler', 'Arkadaşlık ve aile ilişkilerinde zorlananlar', 'Duygu düzenlemede güçlük yaşayanlar'],
      'Görüşmeler gençle birebir yürütülür; uygun görülen aralıklarla aileyle de görüşme yapılır.',
    ),
    faqs: [],
  },
  {
    title: 'Online Terapi',
    order: 4,
    summary: 'Bulunduğunuz yerden, güvenli görüntülü görüşme ile yüz yüze terapiyle aynı nitelikte destek.',
    content: serviceContent(
      'Online terapi, yoğun tempo veya mesafe nedeniyle merkeze gelemeyenler için etkili bir seçenektir.',
      ['Şehir dışında veya yurt dışında yaşayanlar', 'Yoğun çalışma saatleri olanlar', 'Evden görüşmeyi daha rahat bulanlar'],
      'Görüşmeler güvenli bir görüntülü görüşme bağlantısıyla, sessiz ve size ait bir ortamda yapılır.',
    ),
    faqs: [
      { question: 'Online terapi yüz yüze kadar etkili mi?', answer: 'Araştırmalar pek çok konuda online terapinin yüz yüze görüşmelere yakın etkililikte olduğunu göstermektedir.' },
    ],
  },
  {
    title: 'Kaygı ve Stres',
    order: 5,
    summary: 'Günlük hayatı zorlaştıran kaygı, endişe ve stresle baş etme becerilerini geliştirmeye yönelik çalışma.',
    content: serviceContent(
      'Kaygı doğal bir duygudur; ancak yoğunlaştığında günlük işlevselliği etkileyebilir. Terapi, kaygıyı anlamaya ve yönetmeye yardımcı olur.',
      ['Sürekli endişe hâlinde olanlar', 'Panik atak yaşayanlar', 'Stresle baş etmekte zorlananlar'],
      'Kaygıyı tetikleyen durumlar birlikte incelenir ve günlük hayatta uygulanabilir baş etme yolları geliştirilir.',
    ),
    faqs: [],
  },
  {
    title: 'Yas Danışmanlığı',
    order: 6,
    summary: 'Bir kayıp sonrası yas sürecinin sağlıklı şekilde yaşanmasına eşlik eden destek.',
    content: serviceContent(
      'Yas, kayba verilen doğal bir tepkidir. Danışmanlık, bu sürecin yalnız yaşanmamasına ve anlamlandırılmasına yardımcı olur.',
      ['Yakınını kaybedenler', 'Ayrılık veya boşanma sonrası zorlananlar', 'Uzun süren yas tepkileri yaşayanlar'],
      'Görüşmeler kişinin kendi hızında, kaybın anlamını ve hayata etkisini birlikte ele alarak ilerler.',
    ),
    faqs: [],
  },
]

export const sampleHomeFaqs = [
  {
    question: 'İlk görüşmede neler konuşulur?',
    answer:
      'İlk görüşmede sizi terapiye getiren konuları, beklentilerinizi ve hayatınızla ilgili genel bilgileri konuşuruz. Ardından size uygun bir çalışma planı birlikte oluşturulur.',
  },
  {
    question: 'Görüşmeler gizli mi?',
    answer: 'Evet. Görüşmelerde paylaşılan her şey mesleki etik ilkeler ve gizlilik kuralları çerçevesinde korunur.',
  },
  {
    question: 'Online görüşme yapılabiliyor mu?',
    answer: 'Evet, yüz yüze görüşmelerin yanı sıra güvenli görüntülü görüşme ile online seanslar da yapılmaktadır.',
  },
  {
    question: 'Randevu nasıl alabilirim?',
    answer: 'İletişim formunu doldurabilir, telefonla arayabilir veya WhatsApp üzerinden mesaj gönderebilirsiniz.',
  },
]
