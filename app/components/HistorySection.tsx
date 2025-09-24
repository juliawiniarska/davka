'use client'

import Image from 'next/image'
import WaveDivider from './WaveDivider'
import WaveDivider2 from './WaveDivider2'
import { useEffect, useMemo, useRef, useState } from 'react'

type Lang = 'pl' | 'en' | 'de'

const DICT: Record<
  Lang,
  { title: string; paras: string[]; signature: string; altSignature: string }
> = {
pl: {
  title: 'O NAS',
  paras: [
    'Marzyliśmy o własnej kawiarni, miejscu, w którym można zatrzymać się na chwilę i poczuć się dobrze. Pomysłów i przepisów nie brakowało, nawet sztućce czekały w szufladzie, ale życie na pewien czas skierowało nas w stronę mody. Potrzeba stworzenia czegoś swojego, pełnego smaku i ciepła, wciąż jednak w nas dojrzewała. W końcu wróciliśmy do tych marzeń i otworzyliśmy kawiarnię w samym sercu Nysy, przy Rynku 32. Robimy lody od podstaw z polskich składników, parzymy kawę, przygotowujemy matchę, domowe słodkości i kolorowe drinki. Wszystko naturalne, bez zbędnych dodatków, dokładnie takie, jakie sami lubimy. A to dopiero początek, bo w głowach mamy jeszcze mnóstwo pomysłów.',
    'Za tym miejscem stoi nasza rodzina: Darek, Karolina, Zosia i Grażyna. Każde z nas jest inne, ale razem tworzymy coś, co daje nam radość i mamy nadzieję, że Wam również. Wspiera nas niezastąpiona ekipa, bez której to miejsce nie miałoby swojego klimatu. Wszystko powstaje wspólnie, z sercem i po naszemu.',
  ],
  signature: 'Zapraszamy na DaVkę dobrego smaku...',
  altSignature: 'Podpis',
},
en: {
  title: 'ABOUT US',
  paras: [
    'We dreamed of having our own café, a place where you can pause for a moment and feel at ease. Ideas and recipes were plentiful, even the cutlery was waiting in the drawer, but for a while life took us into the world of fashion. Still, the need to create something of our own, full of flavour and warmth, kept growing inside us. Eventually we returned to those dreams and opened a café in the very heart of Nysa, at Rynek 32. We make ice cream from scratch using Polish ingredients, brew coffee, prepare matcha, homemade sweets and colourful drinks. Everything is natural, without unnecessary additives, exactly the way we like it ourselves. And this is just the beginning, because our heads are still full of ideas.',
    'Behind this place stands our family: Darek, Karolina, Zosia and Grażyna. Each of us is different, but together we create something that brings us joy and hopefully to you as well. We are supported by an invaluable team, without whom this place would not have its unique atmosphere. Everything is created together, with heart and in our own way.',
  ],
  signature: 'Come and visit DaVka for a taste of goodness...',
  altSignature: 'Signature',
},
de: {
  title: 'ÜBER UNS',
  paras: [
    'Wir träumten von einem eigenen Café, einem Ort, an dem man für einen Moment verweilen und sich wohlfühlen kann. Ideen und Rezepte hatten wir reichlich, sogar das Besteck wartete schon in der Schublade, doch das Leben führte uns zunächst in die Modebranche. Der Wunsch, etwas Eigenes zu schaffen, voller Geschmack und Wärme, wuchs jedoch weiter in uns. Schließlich kehrten wir zu diesen Träumen zurück und eröffneten ein Café im Herzen von Nysa, am Rynek 32. Wir machen Eis von Grund auf mit polnischen Zutaten, brühen Kaffee, bereiten Matcha, hausgemachte Süßigkeiten und bunte Drinks zu. Alles ist natürlich, ohne unnötige Zusätze, genau so, wie wir es selbst mögen. Und das ist erst der Anfang, denn wir haben noch viele Ideen im Kopf.',
    'Hinter diesem Ort steht unsere Familie: Darek, Karolina, Zosia und Grażyna. Jeder von uns ist anders, aber zusammen schaffen wir etwas, das uns Freude bereitet und hoffentlich auch euch. Unterstützt werden wir von einem unverzichtbaren Team, ohne das dieser Ort nicht seine besondere Atmosphäre hätte. Alles entsteht gemeinsam, mit Herz und auf unsere eigene Art.',
  ],
  signature: 'Besucht uns bei DaVka für guten Geschmack...',
  altSignature: 'Signatur',
},

}

function AutoJustifyText({
  children,
  className = '',
  lang = 'pl',
}: {
  children: string
  className?: string
  lang?: 'pl' | 'en' | 'de'
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pDesktopRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const el = pDesktopRef.current
    if (!wrap || !el) return
    const compute = () => {
      const cs = window.getComputedStyle(el)
      const fs = parseFloat(cs.fontSize)
      const naturalLH = cs.lineHeight === 'normal' ? fs * 1.5 : parseFloat(cs.lineHeight)
      const lines = Math.max(1, Math.round(el.scrollHeight / naturalLH))
      const targetH = wrap.clientHeight || el.scrollHeight
      const targetLH = targetH / lines
      const minLH = fs * 1.25
      const maxLH = fs * 2.2
      el.style.lineHeight = `${Math.max(minLH, Math.min(maxLH, targetLH))}px`
      ;(el.style as any).textAlignLast = 'start'
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(wrap)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [children])

  return (
    <div ref={wrapRef} className={`h-full ${className}`}>
<p
  className="md:hidden text-[15px] leading-[2.4] text-justify [text-justify:inter-word] hyphens-none [text-align-last:start] [word-spacing:0.04em] m-0"
  lang={lang}
  style={{ WebkitHyphens: 'none' as any, textWrap: 'pretty' as any }}
>
  {children}
</p>


      <p
        ref={pDesktopRef}
        className="hidden md:block text-[16px] text-left md:text-justify hyphens-none m-0"
        lang={lang}
        style={{ WebkitHyphens: 'none' as any, textWrap: 'balance' as any }}
      >
        {children}
      </p>
    </div>
  )
}





export default function HistorySection() {
  const [lang, setLang] = useState<Lang>('pl')

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem('lang') as Lang | null
        if (saved === 'pl' || saved === 'en' || saved === 'de') setLang(saved)
      } catch {}
    }
    read()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lang') read()
    }
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as Lang | undefined
      if (detail === 'pl' || detail === 'en' || detail === 'de') {
        setLang(detail)
        try { localStorage.setItem('lang', detail) } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('davka:lang', onCustom as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('davka:lang', onCustom as EventListener)
    }
  }, [])

  const t = useMemo(() => DICT[lang], [lang])

  return (
<section id="about" className="relative bg-coffeeBeige text-coffeeDark px-1 md:px-6 pt-10 pb-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1.6px) 0 0/11px 11px' }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-6xl">
<h2
  className="text-3xl md:text-5xl font-black tracking-wide mb-5 md:mb-8 mx-4 md:mx-0"
  style={{ fontFamily: 'Londrina Shadow, serif' }}
>
  {t.title}
</h2>


<div className="md:flex md:gap-12">
  {/* TEKST */}
  <div className="md:basis-5/12 md:h-[440px] px-4 md:px-0 mx-0 md:mx-0">
    <AutoJustifyText lang={lang} className="h-full">
      {t.paras[0]}
    </AutoJustifyText>
  </div>

  {/* OBRAZEK */}
  <div className="md:basis-7/12 mt-4 md:mt-0 -mx-1 md:mx-0">
    <div className="overflow-hidden rounded-2xl h-[420px] md:h-[440px]">
      <Image
        src="/d5.jpg"
  alt="Kawiarnia Davka w Nysie – kawa specialty, matcha i lody rzemieślnicze"
        width={1400}
        height={900}
        className="w-full h-full object-cover object-center scale-[0.9] md:scale-100 rounded-2xl"
        priority
      />
    </div>
  </div>
</div>



<div className="md:flex md:gap-12 mt-2 md:mt-8">
<div className="md:basis-5/12 -mx-1 md:mx-0">
    <div className="overflow-hidden rounded-2xl h-[420px] md:h-[440px]">
      <Image
        src="/d15.jpg"
  alt="Śniadania i domowe wypieki w kawiarni Davka, Rynek 32 Nysa"
        width={900}
        height={900}
        className="w-full h-full object-cover object-center scale-[0.9] md:scale-100 rounded-2xl"
        priority
      />
    </div>
  </div>


<div className="md:basis-7/12 mt-4 md:mt-0 mx-1 md:mx-0">
  <div className="grid grid-cols-2 gap-4 md:h-[440px]">
    <div className="flex h-full flex-col justify-between px-1 md:px-0">
      <AutoJustifyText lang={lang} className="flex-1">
        {t.paras[1]}
      </AutoJustifyText>
      <p className="italic mt-4 md:mt-0">{t.signature}</p>
    </div>

    <div className="overflow-hidden rounded-2xl h-full">
      <Image
        src="/d8.jpg"
  alt="Drinki i piwo Peroni serwowane w kawiarni Davka Nysa"
        width={700}
        height={900}
        className="w-full h-full object-cover object-center rounded-2xl"
      />
    </div>
        </div>
        </div>

        </div>
      </div>

<div className="relative z-0 mt-16 md:mt-20 -mx-[50vw] left-1/2 right-1/2 w-screen">
  <div className="relative w-screen overflow-hidden">
    <Image
      src="/d12.jpg"
  alt="Wnętrze kawiarni Davka Nysa – klimatyczne miejsce z winem i słodkościami"
      width={2400}
      height={1200}
      className="w-screen h-[360px] md:h-[520px] object-cover object-center "
      priority
    />
    <div className="absolute bottom-0 left-0 w-full">
      <WaveDivider2
        top="fill-coffeeBeige"
        bottom="fill-coffeeBeige"
        heightClass="h-[clamp(36px,7vw,120px)]"
      />
    </div>
  </div>
  <WaveDivider2
    top="fill-coffeeTan"
    bottom="fill-coffeeBeige"
    className="-mt-[clamp(36px,7vw,120px)]"
    heightClass="h-[clamp(36px,7vw,120px)]"
  />
</div>



      <div className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 w-screen">
        <WaveDivider flip className="w-full" />
      </div>
    </section>
  )
}
