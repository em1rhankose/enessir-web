import { bulletList, heading, paragraph, richText } from './lexical'

/**
 * İnternet sitesi ve iletişim formu için KVKK aydınlatma metni (6698 s. Kanun m.10 ve
 * Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ).
 * Taslaktır; yayından önce bir hukukçu tarafından kontrol edilmelidir.
 */
type KvkkInfo = {
  fullName: string
  title: string
  address: string
  email: string
  phone?: string | null
  /** Metnin yürürlük/güncelleme tarihi, örn. "16 Ekim 2026" */
  date: string
}

export const buildKvkkText = ({ fullName, title, address, email, phone, date }: KvkkInfo) =>
  richText(
    paragraph([
      'Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“Kanun”) 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, ',
      { bold: 'internet sitemizi ziyaret eden ve iletişim formu, telefon, e-posta veya WhatsApp aracılığıyla bizimle iletişime geçen kişileri' },
      ' bilgilendirmek amacıyla hazırlanmıştır.',
    ]),

    heading('1. Veri sorumlusu'),
    paragraph([
      'Kişisel verileriniz, veri sorumlusu sıfatıyla ',
      { bold: `${title} ${fullName}` },
      ' (“Veri Sorumlusu”) tarafından işlenmektedir.',
    ]),
    bulletList([
      ['Adres: ', address],
      ['E-posta: ', email],
      ...(phone ? [['Telefon: ', phone]] : []),
    ]),

    heading('2. İşlenen kişisel veriler'),
    bulletList([
      [{ bold: 'Kimlik: ' }, 'ad ve soyad'],
      [{ bold: 'İletişim: ' }, 'e-posta adresi, telefon numarası (isteğe bağlı)'],
      [{ bold: 'Talep bilgisi: ' }, 'iletişim formuna veya mesajınıza yazdığınız içerik'],
      [
        { bold: 'İşlem güvenliği: ' },
        'formun kötüye kullanımını (spam) önlemek için IP adresiniz geçici olarak işlenir; kalıcı olarak kaydedilmez',
      ],
    ]),
    paragraph([
      { bold: 'Önemli: ' },
      'İletişim formu yalnızca randevu ve bilgi talepleri içindir. Sağlık durumunuz, tanı veya tedavi bilgileriniz gibi ',
      { bold: 'özel nitelikli kişisel verilerinizi form veya mesaj yoluyla paylaşmamanızı rica ederiz' },
      '; bu bilgiler gerekli olduğunda görüşme sırasında, mesleki gizlilik kuralları çerçevesinde ve Kanun’un 6. maddesine uygun olarak ayrıca alınır. Yine de paylaşılması halinde bu bilgiler yalnızca talebinize yanıt verilmesi amacıyla kullanılır ve başka bir amaçla işlenmez.',
    ]),

    heading('3. Kişisel verilerin toplanma yöntemi'),
    paragraph(
      'Kişisel verileriniz; internet sitesindeki iletişim formunu doldurmanız ya da telefon, e-posta veya WhatsApp üzerinden bizimle iletişime geçmeniz yoluyla, elektronik ortamda ve kısmen otomatik yollarla toplanmaktadır.',
    ),

    heading('4. İşleme amaçları ve hukuki sebepleri'),
    paragraph('Kişisel verileriniz aşağıdaki amaçlarla ve Kanun’un 5. maddesinde belirtilen hukuki sebeplere dayanarak işlenir:'),
    bulletList([
      [
        { bold: 'Randevu talebinizin alınması ve randevunun planlanması — ' },
        'bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (m.5/2-c)',
      ],
      [
        { bold: 'Soru ve bilgi taleplerinizin yanıtlanması, sizinle iletişim kurulması — ' },
        'temel hak ve özgürlüklerinize zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (m.5/2-f)',
      ],
      [
        { bold: 'İnternet sitesinin ve formun güvenliğinin sağlanması, kötüye kullanımın önlenmesi — ' },
        'veri sorumlusunun meşru menfaati (m.5/2-f)',
      ],
      [
        { bold: 'Yetkili kurum ve kuruluşların bilgi taleplerinin karşılanması — ' },
        'veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (m.5/2-ç) ve kanunlarda açıkça öngörülmesi (m.5/2-a)',
      ],
      [
        { bold: 'Olası uyuşmazlıklarda hakların tesisi, kullanılması veya korunması — ' },
        'bir hakkın tesisi, kullanılması veya korunması için zorunlu olması (m.5/2-e)',
      ],
    ]),
    paragraph('Kişisel verileriniz pazarlama, reklam veya profil oluşturma amacıyla kullanılmaz.'),

    heading('5. Kişisel verilerin aktarılması'),
    paragraph('Kişisel verileriniz yalnızca yukarıdaki amaçlarla sınırlı olarak ve gerektiği ölçüde aşağıdaki kişi ve kuruluşlara aktarılabilir:'),
    bulletList([
      [
        { bold: 'Hizmet sağlayıcılar: ' },
        'internet sitesinin barındırıldığı sunucu hizmeti ve e-posta hizmet sağlayıcısı (verilerinizi yalnızca bizim adımıza ve talimatlarımız doğrultusunda işleyen veri işleyenler olarak)',
      ],
      [{ bold: 'Yetkili kamu kurum ve kuruluşları: ' }, 'kanunen yetkili oldukları hallerde ve talepleri üzerine'],
      [{ bold: 'Hukuk danışmanları: ' }, 'olası bir uyuşmazlıkta hakların korunması amacıyla'],
    ]),
    paragraph(
      'Kişisel verileriniz Türkiye’de bulunan sunucularda saklanır ve yurt dışına aktarılmaz.',
    ),

    heading('6. Üçüncü taraf hizmetler ve çerezler'),
    paragraph(
      'İnternet sitemiz, ziyaretçileri takip eden, reklam veya analiz amaçlı çerez kullanmaz. Ancak sitede bulunan bazı içerikler üçüncü taraflarca sağlanmaktadır:',
    ),
    bulletList([
      [
        { bold: 'Google Haritalar: ' },
        'iletişim bölümündeki harita Google tarafından sağlanır. Harita görüntülendiğinde Google, kendi gizlilik politikası kapsamında IP adresiniz gibi bazı bilgileri işleyebilir ve çerez yerleştirebilir. Bu işleme Google’ın sorumluluğundadır.',
      ],
      [
        { bold: 'WhatsApp: ' },
        'WhatsApp bağlantısına tıklamanız halinde WhatsApp uygulamasına yönlendirilirsiniz; bu iletişim WhatsApp’ın (Meta) kendi gizlilik koşullarına tabidir.',
      ],
    ]),

    heading('7. Saklama süresi'),
    paragraph(
      'İletişim formu ve mesajlar yoluyla iletilen kişisel verileriniz, talebinizin sonuçlanmasından itibaren en fazla 1 (bir) yıl saklanır ve bu sürenin sonunda silinir veya anonim hale getirilir. Talebiniz bir danışmanlık sürecine dönüşürse, bu süreçte elde edilen veriler mesleki mevzuatta öngörülen süreler boyunca ayrıca ve gizlilik kuralları çerçevesinde saklanır. Kanuni bir uyuşmazlık veya yetkili makam talebi söz konusu olduğunda veriler, ilgili süreç tamamlanana kadar saklanabilir.',
    ),

    heading('8. Haklarınız'),
    paragraph('Kanun’un 11. maddesi uyarınca veri sorumlusuna başvurarak:'),
    bulletList([
      'kişisel verilerinizin işlenip işlenmediğini öğrenme,',
      'işlenmişse buna ilişkin bilgi talep etme,',
      'işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,',
      'yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
      'eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme,',
      'Kanun’un 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
      'düzeltme, silme ve yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
      'işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,',
      'kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
    ]),
    paragraph('haklarına sahipsiniz.'),

    heading('9. Başvuru yöntemi'),
    paragraph(
      'Haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’e uygun olarak; kimliğinizi tespit edici bilgileri içeren ve imzalı bir dilekçe ile yukarıdaki adrese şahsen veya noter aracılığıyla, güvenli elektronik imza veya mobil imza ile ya da daha önce tarafımıza bildirdiğiniz ve kayıtlı e-posta adresinizden yukarıdaki e-posta adresine iletebilirsiniz.',
    ),
    paragraph(
      'Başvurunuz, niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurulu’nca belirlenen tarifedeki ücret alınabilir. Başvurunuzun reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde cevap verilmemesi halinde Kanun’un 14. maddesi uyarınca Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsiniz.',
    ),

    paragraph([{ bold: 'Son güncelleme: ' }, date]),
  )
