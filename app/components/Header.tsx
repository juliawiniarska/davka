'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import WaveDivider2 from '../components/WaveDivider2'

const VWave = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 120 600" preserveAspectRatio="none" className={`w-[6px] h-full ${flip ? 'rotate-180' : ''}`}>
    <path d="M120 0 C80 100 80 200 120 300 C160 400 160 500 120 600 L0 600 L0 0 Z" className="fill-coffeeDark" />
  </svg>
)

type Lang = 'pl' | 'en' | 'de'

const DICT: Record<Lang, {
  nav: { about: string; daily: string; menu: string; contact: string },
  alt: { left: string; center: string; right: string },
  ui:  { code: string, full: string }
}> = {
  pl: {
    nav: { about: 'nasza historia', daily: 'Witryna dnia', menu: 'Menu', contact: 'Kontakt' },
    alt: { left: 'Lewy napój', center: 'Środkowe zdjęcie', right: 'Prawy napój' },
    ui:  { code: 'PL', full: 'Polski' },
  },
  en: {
    nav: { about: 'About us', daily: 'Daily showcase', menu: 'Menu', contact: 'Contact' },
    alt: { left: 'Left drink', center: 'Center image', right: 'Right drink' },
    ui:  { code: 'ENG', full: 'English' },
  },
  de: {
    nav: { about: 'Über uns', daily: 'Tages-Showcase', menu: 'Menü', contact: 'Kontakt' },
    alt: { left: 'Linkes Getränk', center: 'Zentrales Bild', right: 'Rechtes Getränk' },
    ui:  { code: 'GER', full: 'Deutsch' },
  },
}

const FLAG_SRC: Record<Lang, string> = {
  pl: '/f1.png',
  en: '/f2.png',
  de: '/f3.png',
}

const otherLangs = (current: Lang): Lang[] => {
  if (current === 'pl') return ['en', 'de']
  if (current === 'en') return ['pl', 'de']
  return ['pl', 'en']
}

export default function Header() {
  const navRef = useRef<HTMLDivElement | null>(null)
  const [lang, setLang] = useState<Lang>('pl')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useMemo(() => DICT[lang], [lang])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null
      if (saved === 'pl' || saved === 'en' || saved === 'de') setLang(saved)
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const navH = navRef.current?.offsetHeight ?? 72
    const y = el.getBoundingClientRect().top + window.scrollY - navH
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  const onLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      scrollToId(id)
      history.replaceState(null, '', `#${id}`)
      setMenuOpen(false)
    },
    [scrollToId]
  )

  return (
    <header className="relative w-full min-h-[90vh] bg-coffeeDark text-coffeeBeige overflow-hidden">
      <nav ref={navRef} className="relative z-30 bg-coffeeDark border-b border-coffeeBeige/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Otwórz menu"
          >
            <span className="w-6 h-0.5 bg-coffeeBeige"></span>
            <span className="w-6 h-0.5 bg-coffeeBeige"></span>
            <span className="w-6 h-0.5 bg-coffeeBeige"></span>
          </button>

          <ul className="hidden md:flex gap-8 text-base md:text-xl uppercase tracking-wider font-londrina mx-auto">
            <li>
              <a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="text-coffeeBeige hover:opacity-80">
                {t.nav.about}
              </a>
            </li>
            <li>
              <a href="#daily" onClick={(e) => onLinkClick(e, 'daily')} className="text-coffeeBeige hover:opacity-80">
                {t.nav.daily}
              </a>
            </li>
            <li>
              <a href="#menu" onClick={(e) => onLinkClick(e, 'menu')} className="text-coffeeBeige hover:opacity-80">
                {t.nav.menu}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => onLinkClick(e, 'contact')} className="text-coffeeBeige hover:opacity-80">
                {t.nav.contact}
              </a>
            </li>
          </ul>

          <div className="group relative inline-block text-sm md:text-base font-londrina text-coffeeBeige">
            <div className="flex items-center gap-0 pointer-events-none">
              <Image src={FLAG_SRC[lang]} alt={t.ui.code} width={45} height={45} className="object-contain" />
              <span>{t.ui.code}</span>
              <span className="text-xs">▼</span>
            </div>

            <div
              className="absolute right-0 mt-2 w-28 bg-coffeeDark border border-coffeeBeige/30 rounded shadow-lg
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40
                         pointer-events-auto"
            >
              <ul className="p-2 space-y-1">
                {otherLangs(lang).map((l) => (
                  <li
                    key={l}
                    className="flex items-center gap-1 hover:opacity-80 cursor-pointer"
                    onClick={() => {
                      setLang(l)
                      try { localStorage.setItem('lang', l) } catch {}
                      window.dispatchEvent(new CustomEvent('davka:lang', { detail: l }))
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setLang(l)
                        try { localStorage.setItem('lang', l) } catch {}
                        window.dispatchEvent(new CustomEvent('davka:lang', { detail: l }))
                      }
                    }}
                  >
                    <Image src={FLAG_SRC[l]} alt={DICT[l].ui.code} width={45} height={45} className="object-contain" />
                    <span>{DICT[l].ui.code}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </nav>

      {/* ——— MOBILE MENU ——— */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-coffeeDark text-coffeeBeige z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setMenuOpen(false)}
          aria-label="Zamknij menu"
        >
          ✕
        </button>
        <ul className="flex flex-col gap-6 p-8 text-lg font-londrina uppercase">
          <li><a href="#about" onClick={(e) => onLinkClick(e, 'about')}>{t.nav.about}</a></li>
          <li><a href="#daily" onClick={(e) => onLinkClick(e, 'daily')}>{t.nav.daily}</a></li>
          <li><a href="#menu" onClick={(e) => onLinkClick(e, 'menu')}>{t.nav.menu}</a></li>
          <li><a href="#contact" onClick={(e) => onLinkClick(e, 'contact')}>{t.nav.contact}</a></li>
        </ul>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row pt-0 h-[calc(90vh-4rem)] overflow-hidden">
        <div className="relative h-[33%] md:h-auto md:flex-[1_1_25%]">
          <Image
            src="/1234.png"
            alt={t.alt.left}
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover object-[50%_45%] md:object-center"
            priority
          />
          <div className="hidden md:block absolute right-0 top-0 h-full">
            <VWave flip />
          </div>
        </div>

        <div className="relative h-[33%] md:h-auto md:flex-[1_1_50%] mt-[4px] md:mt-0">
          <Image
            src="/davka.webp"
            alt={t.alt.center}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative h-[33%] md:h-auto md:flex-[1_1_25%] mt-[4px] md:mt-0 ">
          <div className="hidden md:block absolute left-0 top-0 h-full z-10 pointer-events-none">
            <VWave />
          </div>
          <Image
            src="/3.png"
            alt={t.alt.right}
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover object-[50%_75%] md:object-center "
            priority
          />
        </div>
      </div>

      <WaveDivider2
        top="fill-coffeeDark"
        bottom="fill-coffeeBeige"
        className="absolute bottom-0 w-full z-20"
      />
    </header>
  )
}
