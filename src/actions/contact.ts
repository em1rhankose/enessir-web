'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export type ContactFormField = 'name' | 'email' | 'phone' | 'message' | 'kvkk'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<ContactFormField, string>>
  /** Hata durumunda ziyaretçinin yazdıkları kaybolmasın diye geri gönderilir. */
  values?: Partial<Record<Exclude<ContactFormField, 'kvkk'>, string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d\s()-]{7,20}$/

// Basit hız sınırı: aynı IP adresinden 10 dakikada en fazla 5 mesaj.
// Sunucu belleğinde tutulur; tek sunuculu küçük bir site için yeterlidir.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }
const submissions = new Map<string, number[]>()

const isRateLimited = (ip: string) => {
  const now = Date.now()
  const recent = (submissions.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs)
  submissions.set(ip, [...recent, now])
  return recent.length >= RATE_LIMIT.max
}

const getText = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: getText(formData, 'name'),
    email: getText(formData, 'email'),
    phone: getText(formData, 'phone'),
    message: getText(formData, 'message'),
  }

  // Gizli "tuzak" alan: gerçek ziyaretçiler görmez, botlar doldurur. Bota başarılı gibi görünür.
  if (getText(formData, 'website')) {
    return { status: 'success', message: 'Mesajınız alındı.' }
  }

  const errors: ContactFormState['errors'] = {}
  if (values.name.length < 2 || values.name.length > 100) errors.name = 'Lütfen adınızı ve soyadınızı yazın.'
  if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Lütfen geçerli bir e-posta adresi yazın.'
  if (values.phone && !PHONE_PATTERN.test(values.phone)) errors.phone = 'Lütfen geçerli bir telefon numarası yazın.'
  if (values.message.length < 10) errors.message = 'Mesajınız en az 10 karakter olmalı.'
  if (values.message.length > 3000) errors.message = 'Mesajınız en fazla 3000 karakter olabilir.'
  if (formData.get('kvkk') !== 'on') errors.kvkk = 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Lütfen işaretli alanları kontrol edin.', errors, values }
  }

  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
    return {
      status: 'error',
      message: 'Kısa sürede çok fazla mesaj gönderildi. Lütfen biraz sonra tekrar deneyin.',
      values,
    }
  }

  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'contact-messages',
      data: { ...values, phone: values.phone || undefined, kvkkConsent: true },
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'İletişim mesajı kaydedilemedi' })
    return {
      status: 'error',
      message: 'Mesajınız şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.',
      values,
    }
  }

  // E-posta bildirimi başarısız olsa bile mesaj kaydedildiği için ziyaretçiye hata göstermiyoruz.
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings.email) {
      await payload.sendEmail({
        to: settings.email,
        replyTo: values.email,
        subject: `Yeni iletişim mesajı: ${values.name}`,
        text: [
          `Ad Soyad: ${values.name}`,
          `E-posta: ${values.email}`,
          `Telefon: ${values.phone || '-'}`,
          '',
          values.message,
        ].join('\n'),
      })
    }
  } catch (error) {
    payload.logger.warn({ err: error, msg: 'İletişim mesajı e-posta bildirimi gönderilemedi' })
  }

  return {
    status: 'success',
    message: 'Mesajınız için teşekkürler. En kısa sürede size dönüş yapacağız.',
  }
}
