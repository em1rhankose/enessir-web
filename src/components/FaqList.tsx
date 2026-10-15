import { ChevronDownIcon } from '@/components/Icons'

type Faq = { id?: string | null; question: string; answer: string }

/**
 * Açılır-kapanır soru–cevap listesi. Tarayıcının kendi <details> öğesiyle çalışır;
 * JavaScript gerektirmez ve cevaplar sayfa kaynağında olduğu için arama motorları tarafından okunur.
 */
export const FaqList = ({ faqs }: { faqs: Faq[] }) => (
  <div className="divide-y divide-line rounded-3xl bg-white px-6 ring-1 ring-line md:px-8">
    {faqs.map((faq, index) => (
      <details key={faq.id ?? index} className="group py-5" open={index === 0}>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-lg text-ink marker:hidden md:text-xl [&::-webkit-details-marker]:hidden">
          <h3 className="font-normal">{faq.question}</h3>
          <ChevronDownIcon className="mt-1 size-5 shrink-0 text-sage-500 transition-transform group-open:rotate-180" />
        </summary>
        <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">{faq.answer}</p>
      </details>
    ))}
  </div>
)
