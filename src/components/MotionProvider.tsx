'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/** İşletim sisteminde "hareketi azalt" açık olan ziyaretçilere animasyon gösterilmez. */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
)
