import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

export const ChevronDownIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const MenuIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const PhoneIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
)

export const MailIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const MapPinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const ClockIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const CheckIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="m5 12 5 5L20 7" />
  </svg>
)

export const LeafIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" />
    <path d="M5 19c3-4 6-6 10-8" />
  </svg>
)

export const WhatsAppIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.67 2.77 9.38 9.38 0 0 1 2.77 6.68c0 5.2-4.24 9.44-9.45 9.44zm8.04-17.49A11.3 11.3 0 0 0 12.05.67C5.78.67.68 5.77.67 12.03c0 2 .52 3.96 1.52 5.68L.57 23.33l5.75-1.5a11.36 11.36 0 0 0 5.73 1.46h.01c6.26 0 11.36-5.1 11.37-11.36a11.3 11.3 0 0 0-3.33-8.04z" />
  </svg>
)

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

export const LinkedInIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
)

export const YouTubeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
  </svg>
)

export const XIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M4 4l16 16M20 4 4 20" />
  </svg>
)

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </svg>
)

export const socialIcons = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  x: XIcon,
  facebook: FacebookIcon,
}
