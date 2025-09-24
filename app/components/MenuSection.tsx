'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import WaveDivider2 from './WaveDivider2'

type MenuImg = { src: string; alt: string }

const menuImages: MenuImg[] = [
  { src: '/menu1.png', alt: 'Menu kawiarni Davka – kawa specialty, matcha, śniadania i lody rzemieślnicze' },
  { src: '/menu2.png', alt: 'Menu kawiarni Davka – domowe słodkości, drinki, piwo Peroni, wino' },
]


export default function MenuSection() {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const last = menuImages.length - 1

  const openAt = useCallback((i: number) => { setIdx(i); setOpen(true) }, [])
  const close  = useCallback(() => setOpen(false), [])
  const prev   = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next   = useCallback(() => setIdx(i => Math.min(last, i + 1)), [last])

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft'  && idx > 0)   prev()
      if (e.key === 'ArrowRight' && idx < last) next()
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, idx, last, close, prev, next])

  return (
<section
  id="menu"
  className="relative bg-coffeeBeige text-coffeeDark pt-0 pb-28 md:pb-24 overflow-hidden"
>
      <h2
        className="text-3xl md:text-5xl font-black tracking-wide text-center mb-10"
        style={{ fontFamily: '"Londrina Shadow", serif' }}
      >
        MENU
      </h2>
      <h3 className="sr-only">Oferta kawiarni Davka – kawa, matcha, lody, śniadania, drinki</h3>

      <div className="sr-only">
  Menu kawiarni Davka obejmuje: kawa specialty, matcha, lody rzemieślnicze, śniadania,
  domowe słodkości, drinki, piwo Peroni oraz wino.
</div>


      <div className="relative mx-auto max-w-6xl px-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 items-center justify-items-center">
          <figure
            className="relative w-full max-w-[360px] md:max-w-[400px] aspect-[3/4] rounded-xl border border-[#caa77d]/50 bg-[#fff8ec]
                       shadow-[0_8px_22px_rgba(0,0,0,0.08)] md:-rotate-2 md:translate-y-1 hover:scale-[1.01] transition"
          >
            <span className="pointer-events-none absolute -top-3 left-6 z-20 h-5 w-20 rotate-[-6deg] rounded-[3px] bg-[#c7a87a] drop-shadow-md" />
            <span className="pointer-events-none absolute -top-2 right-10 z-20 h-4 w-16 rotate-3 rounded-[3px] bg-[#c7a87a] drop-shadow-md" />

            <Image
              src={menuImages[0].src}
              alt={menuImages[0].alt}
              fill
              className="object-cover rounded-xl cursor-zoom-in z-10"
              onClick={() => openAt(0)}
              priority
            />
          </figure>

          <figure
            className="relative w-full max-w-[360px] md:max-w-[400px] aspect-[3/4] rounded-xl border border-[#caa77d]/50 bg-[#fff8ec]
                       shadow-[0_8px_22px_rgba(0,0,0,0.08)] md:rotate-2 md:-translate-y-1 md:-ml-3 hover:scale-[1.01] transition"
          >
            <span className="pointer-events-none absolute -top-3 right-6 z-20 h-5 w-20 rotate-3 rounded-[3px] bg-[#c7a87a] drop-shadow-md" />
            <span className="pointer-events-none absolute -top-2 left-10 z-20 h-4 w-16 rotate-[-5deg] rounded-[3px] bg-[#c7a87a] drop-shadow-md" />

            <Image
              src={menuImages[1].src}
              alt={menuImages[1].alt}
              fill
              className="object-cover rounded-xl cursor-zoom-in z-10"
              onClick={() => openAt(1)}
            />
          </figure>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-[2px] flex items-center justify-center"
          onClick={close}
        >
          <div className="relative w-[92vw] h-[88vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={menuImages[idx].src}
              alt={menuImages[idx].alt}
              fill
              sizes="92vw"
              className="object-contain select-none"
              priority
            />

            <button
              aria-label="Zamknij podgląd"
              onClick={close}
              className="absolute top-3 right-3 h-10 w-10 rounded-full border border-white/50 bg-black/30 text-white text-2xl 
                         hover:bg-black/50 transition flex items-center justify-center"
            >
              ×
            </button>

            {idx > 0 && (
              <button
                aria-label="Poprzednia strona menu"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 border-coffeeBeige/80 text-coffeeBeige 
                           bg-black/25 hover:bg-black/45 transition flex items-center justify-center text-2xl"
              >
                ‹
              </button>
            )}

            {idx < last && (
              <button
                aria-label="Następna strona menu"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 border-coffeeBeige/80 text-coffeeBeige 
                           bg-black/25 hover:bg-black/45 transition flex items-center justify-center text-2xl"
              >
                ›
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/35 text-white text-sm">
              {idx + 1} / {menuImages.length}
            </div>
          </div>
        </div>
      )}

      <WaveDivider2
        top="fill-coffeeBeige"
        bottom="fill-coffeeDark"
        className="absolute bottom-0 w-full"
      />
    </section>
  )
}