'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Saniye cinsinden gecikme; yan yana öğelerin sırayla belirmesi için. */
  delay?: number
}

/** İçeriği, ekrana girdiğinde aşağıdan yukarı hafifçe belirerek gösterir. */
export const Reveal = ({ children, className, delay = 0 }: RevealProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
)
