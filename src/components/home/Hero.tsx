'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

import { ChevronDownIcon } from '@/components/Icons'

type HeroImage = { src: string; alt: string }

type HeroProps = {
  title: string
  subtitle?: string | null
  buttonText?: string | null
  image?: HeroImage | null
  /** Arka planı olmayan (şeffaf) PNG portre; verilirse sağda, alt kenara oturmuş şekilde gösterilir. */
  portrait?: HeroImage | null
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
})

export const Hero = ({ title, subtitle, buttonText, image, portrait }: HeroProps) => (
  <section className="relative overflow-hidden bg-sage-800 text-white">
    {image ? (
      <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover" />
    ) : (
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800" />
        <div className="absolute -top-32 -left-24 size-[32rem] rounded-full bg-sage-400/40 blur-3xl" />
        <div className="absolute -right-24 -bottom-40 size-[36rem] rounded-full bg-clay/30 blur-3xl" />
      </div>
    )}

    {/* Görselin üstündeki karartma: şeffaf başlık çubuğu ve yazılar her görselde okunur kalır. */}
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/50"
    />

    {/* Portre varken yazılar biraz daha geniş bir alanda, hafifçe sola kayık durur. */}
    <div
      className={`relative grid min-h-[100svh] ${
        portrait
          ? 'mx-auto w-full max-w-[80rem] grid-rows-[auto_1fr] px-5 pt-28 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-1 lg:gap-8 lg:pt-0'
          : 'container-page items-center pt-24 pb-28'
      }`}
    >
      <div className={portrait ? 'self-center pb-8 lg:pb-0' : ''}>
        <motion.p {...fadeUp(0.1)} className="eyebrow text-sage-100!">
          Psikolojik Danışmanlık
        </motion.p>
        <motion.h1
          {...fadeUp(0.25)}
          className={`mt-5 max-w-3xl leading-[1.05] font-normal ${
            portrait ? 'text-5xl md:text-7xl' : 'text-5xl md:text-7xl lg:text-8xl'
          }`}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p {...fadeUp(0.4)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            {subtitle}
          </motion.p>
        )}
        <motion.div {...fadeUp(0.55)} className="mt-10 flex flex-wrap gap-4">
          <Link href="/iletisim" className="btn-primary">
            {buttonText || 'Randevu Al'}
          </Link>
          <Link
            href="#danisma-merkezimiz"
            className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 font-semibold transition-colors hover:bg-white hover:text-ink"
          >
            Bizi Tanıyın
          </Link>
        </motion.div>
      </div>

      {portrait && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="relative h-[46svh] min-h-72 self-end lg:h-[88svh]"
        >
          {/* Portreyi zeminden ayıran yumuşak ışık halesi. */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 aspect-square w-[85%] max-w-xl -translate-x-1/2 translate-y-1/4 rounded-full bg-sage-300/35 blur-3xl"
          />
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          />
        </motion.div>
      )}
    </div>

    {!portrait && (
      <a
        href="#danisma-merkezimiz"
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80 motion-reduce:animate-none"
      >
        <ChevronDownIcon className="size-7" />
      </a>
    )}
  </section>
)
