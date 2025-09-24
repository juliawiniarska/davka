'use client'

import { useEffect, useMemo, useState } from 'react'
import WaveDivider from './WaveDivider'
import Script from 'next/script'

type Lang = 'pl' | 'en' | 'de'

const DICT: Record<
  Lang,
  {
    mapsCta: string
    srSocial: string
    fb: string
    ig: string
    hours: { monfri: string; sat: string; sun: string }
    copiedMsg: string
  }
> = {
  pl: {
    mapsCta: 'Otwórz w Mapach Google',
    srSocial: 'Social media',
    fb: 'Facebook',
    ig: 'Instagram',
    hours: {
      monfri: 'Pn–Pt: 10:00–20:00',
      sat: 'Sob: 10:00–20:00',
      sun: 'Nd: 11:00–20:00',
    },
    copiedMsg: 'Adres email został skopiowany',
  },
  en: {
    mapsCta: 'Open in Google Maps',
    srSocial: 'Social media',
    fb: 'Facebook',
    ig: 'Instagram',
    hours: {
      monfri: 'Mon–Fri: 10:00–20:00',
      sat: 'Sat: 10:00–20:00',
      sun: 'Sun: 11:00–20:00',
    },
    copiedMsg: 'Email address copied',
  },
  de: {
    mapsCta: 'In Google Maps öffnen',
    srSocial: 'Soziale Medien',
    fb: 'Facebook',
    ig: 'Instagram',
    hours: {
      monfri: 'Mo–Fr: 10:00–20:00',
      sat: 'Sa: 10:00–20:00',
      sun: 'So: 11:00–20:00',
    },
    copiedMsg: 'E-Mail-Adresse kopiert',
  },
}

export default function ContactSection() {
  const [lang, setLang] = useState<Lang>('pl')
  const [copied, setCopied] = useState(false)
  const t = useMemo(() => DICT[lang], [lang])
  const EMAIL = 'juliaaw.business@gmail.com'

  const hoursParts = useMemo(() => {
    const split = (s: string): [string, string] => {
      const m = s.match(/^(.*?:)\s*(.*)$/)
      return m ? [m[1], m[2]] as [string, string] : [s, '']
    }
    return {
      monfri: split(t.hours.monfri),
      sat: split(t.hours.sat),
      sun: split(t.hours.sun),
    }
  }, [t])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null
      if (saved === 'pl' || saved === 'en' || saved === 'de') setLang(saved)
    } catch {}
    const onLang = (e: Event) => {
      const l = (e as CustomEvent).detail
      if (l === 'pl' || l === 'en' || l === 'de') setLang(l)
    }
    window.addEventListener('davka:lang', onLang)
    return () => window.removeEventListener('davka:lang', onLang)
  }, [])

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL)
      } else {
        const ta = document.createElement('textarea')
        ta.value = EMAIL
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <section id="contact" className="relative bg-coffeeDark text-coffeeBeige pt-10 pb-8">
      <div className="absolute inset-x-0 top-0 -translate-y-full">
        <WaveDivider color="fill-coffeeDark" />
      </div>
      <h2 className="sr-only">Kontakt</h2>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <a
            href="https://maps.app.goo.gl/YZ2T9mLWVyoG2Lub9"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 hover:opacity-90 transition"
          >
            <MapPinIcon className="h-6 w-6 text-coffeeBeige/90" />
            <div>
              <div className="font-semibold">Rynek 32, 48-300 Nysa</div>
              <div className="text-sm opacity-70 group-hover:underline">{t.mapsCta}</div>
            </div>
          </a>

          <span className="hidden md:block h-6 w-px bg-white/20" />

          <a
            href="tel:+48602255050"
            aria-label="Zadzwoń do kawiarni Davka pod numer +48 602 255 050"
            className="inline-flex items-center gap-3 hover:opacity-90 transition"
          >
            <PhoneIcon className="h-6 w-6 text-coffeeBeige/90" />
            <div>
              <div className="font-semibold">+48 602 255 050</div>
            </div>
          </a>

          <span className="hidden md:block h-6 w-px bg-white/20" />

          <a
            href="mailto:davka.nysa@gmail.com"
            aria-label="Wyślij maila do kawiarni Davka davka.nysa@gmail.com"
            className="inline-flex items-center gap-3 hover:opacity-90 transition"
          >
            <MailIcon className="h-6 w-6 text-coffeeBeige/90" />
            <div>
              <div className="font-semibold">davka.nysa@gmail.com</div>
            </div>
          </a>

          <span className="hidden md:block h-6 w-px bg-white/20" />

          <div className="inline-flex items-center gap-3">
            <span className="sr-only">{t.srSocial}</span>
            <a
              href="https://www.facebook.com/profile.php?id=61573148150091"
              target="_blank"
              aria-label="Facebook kawiarni Davka"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10 transition"
            >
              <FacebookIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t.fb}</span>
            </a>
            <a
              href="https://www.instagram.com/davka.nysa/"
              target="_blank"
              aria-label="Instagram kawiarni Davka"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10 transition"
            >
              <InstagramIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t.ig}</span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-sm opacity-80">
          <div className="flex items-start gap-2">
            <ClockIcon className="h-5 w-5 mt-0.5" />

            <ul
              className="md:hidden space-y-1.5 leading-relaxed"
              itemScope
              itemType="https://schema.org/OpeningHoursSpecification"
            >
              <li className="grid grid-cols-[7ch_1fr]">
                <span>{hoursParts.monfri[0]}</span>
                <span className="pl-2 tabular-nums">{hoursParts.monfri[1]}</span>
              </li>
              <li className="grid grid-cols-[7ch_1fr]">
                <span>{hoursParts.sat[0]}</span>
                <span className="pl-2 tabular-nums">{hoursParts.sat[1]}</span>
              </li>
              <li className="grid grid-cols-[7ch_1fr]">
                <span>{hoursParts.sun[0]}</span>
                <span className="pl-2 tabular-nums">{hoursParts.sun[1]}</span>
              </li>
            </ul>

            <div className="hidden md:flex md:gap-6 md:justify-start">
              <span>{t.hours.monfri}</span>
              <span>{t.hours.sat}</span>
              <span>{t.hours.sun}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-4 text-xs opacity-60 space-y-2">
          <div className="text-center">© 2025 daVka.</div>

          <div className="text-center">
            Made by{' '}
            <button
              type="button"
              onClick={copyEmail}
              onKeyDown={(e) =>
                e.key === 'Enter' || e.key === ' ' ? (e.preventDefault(), copyEmail()) : null
              }
              className="font-bold hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-white/40 rounded-sm"
            >
              Julia Winiarska
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/polityka-prywatnosci"
              className="hover:opacity-90 transition focus:outline-none"
            >
              Polityka prywatności
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cookie-prefs'))}
              className="hover:opacity-90 transition focus:outline-none"
            >
              Ustawienia cookies
            </button>
          </div>
        </div>
      </div>

      <div
        aria-live="polite"
        className={[
          'pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-4 z-[100]',
          'transition-opacity duration-200',
          copied ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <span className="px-3 py-1 rounded-full text-[11px] bg-black/75 text-white shadow">
          {t.copiedMsg}
        </span>
      </div>

      <Script id="opening-hours" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CafeOrCoffeeShop',
          name: 'davka.',
          image: 'https://davkacafe.pl/logo.png',
          url: 'https://davkacafe.pl',
          telephone: '+48 602 255 050',
          email: 'davka.nysa@gmail.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rynek 32',
            addressLocality: 'Nysa',
            postalCode: '48-300',
            addressCountry: 'PL',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 50.47430334446845,
            longitude: 17.332278660783693,
          },
          sameAs: [
            'https://www.facebook.com/profile.php?id=61573148150091',
            'https://www.instagram.com/davka.nysa/',
          ],
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '10:00',
              closes: '20:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '20:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Sunday',
              opens: '11:00',
              closes: '20:00',
            },
          ],
        })}
      </Script>
    </section>
  )
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 5c0-1.1.9-2 2-2h2c.9 0 1.7.6 1.9 1.5l.7 2.7a2 2 0 0 1-.5 1.9l-1 1a14.5 14.5 0 0 0 6.8 6.8l1-1a2 2 0 0 1 1.9-.5l2.7.7c.9.2 1.5 1 1.5 1.9v2c0 1.1-.9 2-2 2h-1A17 17 0 0 1 3 6V5Z" />
    </svg>
  )
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 6h16v12H4z" />
      <path d="m4 6 8 7 8-7" />
    </svg>
  )
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.05 5.66 21.2 10.44 22v-7.02H7.9v-2.92h2.54V9.41c0-2.5 1.5-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.92h-2.32V22C18.34 21.2 22 17.05 22 12.06Z" />
    </svg>
  )
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm7.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" />
    </svg>
  )
}
