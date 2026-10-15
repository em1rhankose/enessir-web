'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { submitContactForm, type ContactFormState } from '@/actions/contact'
import { CheckIcon } from '@/components/Icons'

const initialState: ContactFormState = { status: 'idle' }

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/60 transition-colors outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 aria-invalid:border-red-400'

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  ) : null

export const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start rounded-3xl bg-sage-50 p-8 ring-1 ring-sage-100">
        <span className="flex size-12 items-center justify-center rounded-full bg-sage-600 text-white">
          <CheckIcon className="size-6" />
        </span>
        <p className="mt-5 font-serif text-2xl text-ink">Mesajınız iletildi</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    )
  }

  const errors = state.errors ?? {}
  const values = state.values ?? {}

  return (
    // Hata sonrası formun yazılanlarla yeniden çizilmesi için key değişir.
    <form action={formAction} noValidate className="space-y-5" key={JSON.stringify(values)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink">
            Ad Soyad <span className="text-clay">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={inputClass}
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-ink">
            Telefon
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={inputClass}
          />
          <FieldError id="contact-phone-error" message={errors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink">
          E-posta <span className="text-clay">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={inputClass}
        />
        <FieldError id="contact-email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">
          Mesajınız <span className="text-clay">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`contact-message-hint${errors.message ? ' contact-message-error' : ''}`}
          className={`${inputClass} resize-y`}
        />
        {/* KVKK: sağlık verisi özel nitelikli veridir; form yoluyla toplanmaması için ziyaretçi uyarılır. */}
        <p id="contact-message-hint" className="mt-1.5 text-xs leading-relaxed text-muted">
          Lütfen sağlık durumunuzla ilgili ayrıntıları burada paylaşmayın; bunları görüşmede konuşacağız.
        </p>
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* Spam koruması: ekranda görünmez, sadece botlar doldurur. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="contact-website">Web siteniz</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            name="kvkk"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.kvkk)}
            aria-describedby={errors.kvkk ? 'contact-kvkk-error' : undefined}
            className="mt-1 size-4 shrink-0 accent-sage-600"
          />
          {/* Aydınlatma tek taraflı bilgilendirmedir; "kabul/onay" değil "okudum" beyanı alınır (açık rıza ile karıştırılmaz). */}
          <span>
            Kişisel verilerimin işlenmesine ilişkin{' '}
            <Link href="/kvkk" target="_blank" className="font-medium text-sage-700 underline underline-offset-2">
              Aydınlatma Metni
            </Link>
            ’ni okudum.
          </span>
        </label>
        <FieldError id="contact-kvkk-error" message={errors.kvkk} />
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {isPending ? 'Gönderiliyor…' : 'Mesajı Gönder'}
      </button>
    </form>
  )
}
