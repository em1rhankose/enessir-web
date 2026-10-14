import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

/**
 * SMTP ile e-posta gönderimi (iletişim formu bildirimi, şifre sıfırlama).
 * Gmail, Yandex veya domain'in kurumsal e-postası; sadece .env'deki SMTP_* değerleri girilir.
 * SMTP_HOST tanımlı değilse Payload e-postaları gönderilmez, sadece sunucu loguna yazılır.
 */
export const getEmailAdapter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_ADDRESS, SMTP_FROM_NAME } = process.env

  if (!SMTP_HOST) return undefined

  const port = Number(SMTP_PORT) || 587

  return nodemailerAdapter({
    defaultFromAddress: SMTP_FROM_ADDRESS || SMTP_USER || '',
    defaultFromName: SMTP_FROM_NAME || 'Psikolog Enes Sir',
    transportOptions: {
      host: SMTP_HOST,
      port,
      // 465 doğrudan şifreli bağlantı kullanır; 587 bağlantı kurulduktan sonra şifrelemeye geçer.
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    },
  })
}
