'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import WaveDivider3 from './WaveDivider3'

type Img = { id: string; url: string; width: number; height: number }
type Payload = { status: 'ok'|'empty'|'closed'|'error'; images: Img[] }

const VIEW_H = 420
const WAVE_PX = 128
const SPEED = 60
const PAUSE_MS_DESKTOP = 120_000

const visibleCount = (isMobile: boolean) => (isMobile ? 1 : 4)
const pauseMs = (isMobile: boolean) => (isMobile ? 3000 : PAUSE_MS_DESKTOP)
const shouldShowArrows = (imgs: Img[], isMobile: boolean) =>
  imgs.length > (isMobile ? 1 : 4)

type Lang = 'pl'|'en'|'de'
const TEXTS: Record<Lang, {
  title: string; subtitle: string; empty: string; closed: string; prev: string; next: string
}> = {
  pl: {
    title: 'WITRYNA DNIA',
    subtitle: 'Każdego dnia tworzymy coś nowego, dlatego codziennie sprawdzaj naszą witrynę tutaj lub na Instagramie davka.nysa',
    empty: 'Nowa witryna się tworzy, dlatego przedstawiamy nasze przykładowe pyszności',
    closed: 'Oferta może być już niektualna, zaglądnij tutaj jutro lub odwiedź nas i sprawdź sam!',
    prev: 'Poprzednie',
    next: 'Następne',
  },
  en: {
    title: 'SHOWCASE OF THE DAY',
    subtitle: 'We create something new every day, so check our showcase here or on Instagram at davka.nysa every day',
    empty: 'The new showcase is being prepared, so we are presenting our sample treats',
    closed: 'The offer may already be outdated, check back here tomorrow or visit us and see for yourself!',
    prev: 'Previous',
    next: 'Next',
  },
  de: {
    title: 'TAGESAUSSTELLUNG',
    subtitle: 'Wir schaffen jeden Tag etwas Neues, deshalb schau dir unsere Vitrine hier oder auf Instagram unter davka.nysa jeden Tag an',
    empty: 'Die neue Vitrine wird gerade erstellt, daher zeigen wir unsere Beispiel-Leckereien',
    closed: 'Das Angebot könnte bereits nicht mehr aktuell sein, schau morgen hier wieder vorbei oder besuche uns und überzeug dich selbst!',
    prev: 'Zurück',
    next: 'Weiter',
  }
}

const FALLBACK_IMAGES: Img[] = [
  { id: 'f1', url: '/fallback1.jpg', width: 1200, height: 800 },
  { id: 'f2', url: '/fallback2.jpg', width: 1200, height: 800 },
  { id: 'f3', url: '/fallback3.jpg', width: 1200, height: 800 },
  { id: 'f4', url: '/fallback4.jpg', width: 1200, height: 800 },
]

export default function DailyShowcase() {
  const [data, setData] = useState<Payload>({ status: 'empty', images: [] })
  const [lang, setLang] = useState<Lang>('pl')
  const [isMobile, setIsMobile] = useState(false)

  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef(0)
  const dirRef = useRef<1 | -1>(1)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  const phaseRef = useRef<'forward'|'backward'|'pause'|'idle'>('pause')
  const pauseTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => setIsMobile(window.innerWidth < 768)
      check()
      window.addEventListener('resize', check)
      return () => window.removeEventListener('resize', check)
    }
  }, [])

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

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch('/api/daily/list', { cache: 'no-store' })
        const json: Payload = await res.json()
        if (active) setData(json)
      } catch {
        if (active) setData({ status: 'error', images: [] })
      }
    }
    load()
    const t = setInterval(load, 60_000)
    return () => { active = false; clearInterval(t) }
  }, [])

  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()

  let displayStatus: Payload['status'] = data.status
  let imgs = data.images ?? []
  const count = imgs.length

  const inLateWindow = h >= 21 && h <= 23
  if (h === 0 && m >= 1) displayStatus = 'empty'
  if (inLateWindow && count > 0) displayStatus = 'ok'

  const useFallback =
    displayStatus === 'empty' || displayStatus === 'error' || count === 0

  if (useFallback) imgs = FALLBACK_IMAGES

  type SubKey = 'subtitle' | 'closed' | 'empty'
  let subtitleKey: SubKey = 'subtitle'
  if (displayStatus === 'empty' || useFallback) subtitleKey = 'empty'
  else if (inLateWindow && count > 0) subtitleKey = 'closed'

  const stepPx = () => {
    const vp = viewportRef.current
    if (!vp) return 0
    return vp.clientWidth / visibleCount(isMobile)
  }
  const maxPos = () => Math.max(0, (imgs.length - visibleCount(isMobile)) * stepPx())

  useEffect(() => {
    posRef.current = 0
    dirRef.current = 1
    updateEdges()
    applyTransform()
    startPauseCycle()
  }, [imgs.length, isMobile])

  const updateEdges = () => {
    if (!shouldShowArrows(imgs, isMobile)) {
      setAtStart(false)
      setAtEnd(false)
      return
    }
    const pos = posRef.current
    const max = maxPos()
    setAtStart(pos <= 1)
    setAtEnd(pos >= max - 1)
  }

  const applyTransform = () => {
    const el = trackRef.current
    if (!el) return
    el.style.transform = `translate3d(-${posRef.current}px,0,0)`
  }

  const startForward = () => {
    phaseRef.current = 'forward'
    dirRef.current = 1
    lastTsRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }
  const startBackward = () => {
    phaseRef.current = 'backward'
    dirRef.current = -1
    lastTsRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }
  const startPauseCycle = () => {
    phaseRef.current = 'pause'
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = window.setTimeout(() => {
      startForward()
    }, pauseMs(isMobile))
  }

  const tick = (ts: number) => {
    const phase = phaseRef.current
    if (phase !== 'forward' && phase !== 'backward') {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    if (lastTsRef.current == null) lastTsRef.current = ts
    const dt = (ts - lastTsRef.current) / 1000
    lastTsRef.current = ts

    const max = maxPos()
    const v = SPEED * (phase === 'forward' ? 1 : -1)
    let pos = posRef.current + v * dt

    if (phase === 'forward' && pos >= max) {
      pos = max
      posRef.current = pos
      applyTransform()
      updateEdges()
      startBackward()
      return
    }
    if (phase === 'backward' && pos <= 0) {
      pos = 0
      posRef.current = pos
      applyTransform()
      updateEdges()
      startPauseCycle()
      return
    }

    posRef.current = pos
    applyTransform()
    updateEdges()
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const shell = viewportRef.current?.parentElement?.parentElement
    if (!shell) return
    const onEnter = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      phaseRef.current = 'idle'
    }
    const onLeave = () => {
      if (pauseTimerRef.current) return
      startForward()
    }
    shell.addEventListener('mouseenter', onEnter)
    shell.addEventListener('mouseleave', onLeave)
    return () => {
      shell.removeEventListener('mouseenter', onEnter)
      shell.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      const max = maxPos()
      posRef.current = Math.min(posRef.current, max)
      applyTransform()
      updateEdges()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [imgs.length, isMobile])

  const nudge = (dir: -1 | 1) => {
    const max = maxPos()
    if (max <= 0) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    phaseRef.current = 'idle'

    const step = stepPx()
    const start = posRef.current
    const target = Math.min(max, Math.max(0, start + dir * step))
    const t0 = performance.now()
    const dur = 360
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      posRef.current = start + (target - start) * easeOutCubic(p)
      applyTransform()
      updateEdges()
      if (p < 1) requestAnimationFrame(animate)
      else startPauseCycle()
    }
    requestAnimationFrame(animate)
  }

  const t = TEXTS[lang]

  if (useFallback) {
    return (
      <section
        id="daily"
        className="relative text-coffeeDark pt-2 isolate overflow-x-hidden"
        style={{
          paddingTop: isMobile ? 0 : 8,
          paddingBottom: isMobile ? WAVE_PX + 24 : WAVE_PX + 8
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10"
          style={{
            height: `calc(100% - ${WAVE_PX}px)`,
            backgroundImage: isMobile ? 'url(/backm2.png)' : 'url(/back2.png)',
            backgroundSize: isMobile ? 'cover' : '100% 100%',
            backgroundPosition: isMobile ? 'center top' : 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#f4e6c9',
          }}
        />
        <TitlePaper title={t.title} subtitle={t[subtitleKey]} />
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div
            className="relative rounded-3xl border border-white/25 bg-white/5 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_rgba(0,0,0,0.08)]"
            style={{ height: VIEW_H }}
          >
            <div className="absolute inset-0 rounded-3xl p-4">
              <div className="absolute inset-4 rounded-2xl border border-white/20 pointer-events-none" />
              <div ref={viewportRef} className="overflow-hidden h-full">
                <div
                  ref={trackRef}
                  className="flex will-change-transform h-full [backface-visibility:hidden] [transform:translateZ(0)]"
                >
                  {FALLBACK_IMAGES.map((img) => (
                    <div key={img.id} className="basis-full md:basis-1/4 shrink-0 px-2 h-full">
                      <div className="relative h-full rounded-2xl overflow-hidden bg-white/6 border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] [backface-visibility:hidden] [transform:translateZ(0)]">
                        <Image
                          src={img.url}
                          alt="Witryna dnia kawiarni Davka – świeże wypieki, kawa specialty, matcha i desery"
                          fill
                          quality={100}
                          sizes="25vw"
                          className="object-cover"
                          priority
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.0) 45%)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-[#f4e6c9]">
          <WaveDivider3 flip className="w-full" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="daily"
      className="relative text-coffeeDark pt-2 isolate"
      style={{     paddingBottom: isMobile ? WAVE_PX + 24 : WAVE_PX + 8
 }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10"
        style={{
          height: `calc(100% - ${WAVE_PX}px)`,
          backgroundImage: isMobile ? 'url(/backm2.png)' : 'url(/back2.png)',
          backgroundSize: isMobile ? 'cover' : '100% 100%',
          backgroundPosition: isMobile ? 'center top' : 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f4e6c9',
        }}
      />
      <TitlePaper title={t.title} subtitle={t.subtitle} />
      <div className="relative mx-auto max-w-6xl px-6 z-10">
        <div
          className="relative rounded-3xl border border-white/25 bg-white/5 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_rgba(0,0,0,0.08)]"
          style={{ height: VIEW_H }}
        >
          <div className="absolute inset-0 rounded-3xl p-4">
            <div className="absolute inset-4 rounded-2xl border border-white/20 pointer-events-none" />
            {shouldShowArrows(imgs, isMobile) && (
              <>
                <Arrow side="left" disabled={atStart} onClick={() => nudge(-1)} label={t.prev} />
                <Arrow side="right" disabled={atEnd} onClick={() => nudge(1)} label={t.next} />
              </>
            )}
            <div ref={viewportRef} className="overflow-hidden h-full">
              <div
                ref={trackRef}
                className="flex will-change-transform h-full [backface-visibility:hidden] [transform:translateZ(0)]"
              >
                {imgs.map((img) => (
                  <div key={img.id} className="basis-full md:basis-1/4 shrink-0 px-2 h-full">
                    <div className="relative h-full rounded-2xl overflow-hidden bg-white/6 border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] [backface-visibility:hidden] [transform:translateZ(0)]">
                      <Image
                        src={img.url}
                        alt="Witryna dnia kawiarni Davka – świeże wypieki, kawa specialty, matcha i desery"
                        fill
                        quality={100}
                        sizes="100vw md:25vw"
                        className="object-cover"
                        priority
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.0) 45%)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-[#f4e6c9]">
        <WaveDivider3 flip className="w-full" />
      </div>
    </section>
  )
}

function TitlePaper({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative mx-auto w-90 max-w-4xl text-center mb-4">
      <h2
        className="text-3xl md:text-5xl font-black tracking-wide"
        style={{ fontFamily: "'Londrina Shadow', serif" }}
      >
        {title}
      </h2>
      <div className="sr-only">
        Nasza codzienna witryna obejmuje kawę specialty, matchę, lody rzemieślnicze,
        świeże śniadania, domowe ciasta, drinki, piwo Peroni oraz wino.
      </div>
      {subtitle && (
        <p className="mt-3 md:mt-4 text-xs md:text-sm opacity-80 font-sans">
          {subtitle.split('davka.nysa').map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <a
                  href="https://www.instagram.com/davka.nysa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:opacity-80 transition"
                  aria-label="Instagram kawiarni Davka"
                  title="Instagram kawiarni Davka"
                >
                  davka.nysa
                </a>
              )}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

function Arrow({
  side, disabled, onClick, label
}: { side: 'left' | 'right'; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => { if (!disabled) onClick() }}
      aria-label={label}
      disabled={disabled}
      className={[
        'absolute top-1/2 -translate-y-1/2 z-20',
        side === 'left' ? 'left-2' : 'right-2',
        'px-3 h-10 min-w-10 rounded-md border-2 bg-transparent backdrop-blur-[1px]',
        disabled
          ? 'border-white/30 text-white/40 cursor-not-allowed opacity-60'
          : 'border-coffeeBeige text-coffeeBeige hover:opacity-90',
        'transition-all duration-200'
      ].join(' ')}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  )
}
