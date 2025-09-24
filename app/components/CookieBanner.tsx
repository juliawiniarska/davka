'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Typ zgody
type Consent = {
  necessary: boolean
  analytics: boolean
}

// Klucz w localStorage
const LS_KEY = 'cookie-consent-v3' // zmiana wersji = ponowne pytanie
const CONSENT_VALIDITY_DAYS = 365

// Rozszerzamy typ window, żeby nie było błędu z dataLayer
declare global {
  interface Window {
    dataLayer: any[]
  }
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [consent, setConsent] = useState<Consent | null>(null)

  // sprawdzamy, czy w localStorage jest już zapis
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { consent: Consent; timestamp: number }
        const now = Date.now()
        const diffDays = (now - parsed.timestamp) / (1000 * 60 * 60 * 24)

        if (diffDays > CONSENT_VALIDITY_DAYS) {
          // zgoda wygasła → pokaż baner
          setOpen(true)
        } else {
          setConsent(parsed.consent)
        }
      } else {
        setOpen(true) // brak zapisu → pokaż baner
      }
    } catch {
      setOpen(true)
    }
  }, [])

  // nasłuch na event "open-cookie-prefs"
  useEffect(() => {
    const openPrefs = () => {
      setOpen(true) // pokaż baner
      setPrefsOpen(true) // od razu tryb ustawień
    }
    window.addEventListener("open-cookie-prefs", openPrefs)
    return () => window.removeEventListener("open-cookie-prefs", openPrefs)
  }, [])

  // Ładowanie Google Analytics tylko po zgodzie
  useEffect(() => {
    if (consent?.analytics) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', 'G-XXXXXXXXXX')
    }
  }, [consent])

  const saveConsent = (c: Consent) => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          consent: c,
          timestamp: Date.now(),
        })
      )
    } catch {}
    setConsent(c)
    setOpen(false)
    setPrefsOpen(false)
  }

  if (prefsOpen) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3">
        <div className="mx-auto max-w-2xl rounded-2xl border border-coffeeDark bg-coffeeBeige p-5 shadow-lg">
          <h2 className="font-bold text-coffeeDark mb-3">Ustawienia cookies</h2>
          <form className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked disabled />
              <span>Niezbędne (wymagane do działania strony)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={consent?.analytics || false}
                onChange={(e) =>
                  setConsent({
                    necessary: true,
                    analytics: e.target.checked,
                  })
                }
              />
              <span>Analityczne (Google Analytics)</span>
            </label>
          </form>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setPrefsOpen(false)}
              className="px-4 h-10 rounded-xl border border-coffeeDark/20 bg-white hover:bg-white/80 transition"
            >
              Anuluj
            </button>
            <button
              onClick={() =>
                saveConsent({
                  necessary: true,
                  analytics: consent?.analytics || false,
                })
              }
              className="px-4 h-10 rounded-xl bg-coffeeDark text-coffeeBeige hover:opacity-90 transition"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3">
      <div className="mx-auto max-w-6xl rounded-2xl border border-coffeeDark bg-coffeeBeige/95 backdrop-blur p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <p className="text-sm leading-snug text-coffeeDark">
            Używamy plików cookie niezbędnych do działania strony oraz – za Twoją
            zgodą – do analityki (Google Analytics). Szczegóły znajdziesz w&nbsp;
            <Link
              href="/polityka-prywatnosci"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              Polityce prywatności
            </Link>.
          </p>

          <div className="flex gap-2 md:ml-auto">
            <button
              onClick={() => setPrefsOpen(true)}
              className="px-4 h-10 rounded-xl border border-coffeeDark/20 bg-white hover:bg-white/80 transition"
            >
              Ustawienia
            </button>
            <button
              onClick={() => saveConsent({ necessary: true, analytics: false })}
              className="px-4 h-10 rounded-xl border border-coffeeDark/20 bg-white hover:bg-white/80 transition"
            >
              Odrzuć
            </button>
            <button
              onClick={() => saveConsent({ necessary: true, analytics: true })}
              className="px-4 h-10 rounded-xl bg-coffeeDark text-coffeeBeige hover:opacity-90 transition"
            >
              Akceptuj
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}