'use client'

import Image from 'next/image'
import { useMemo, useState, useEffect, useRef } from 'react'

type PrevImg = { id: string; url: string }

function pluralPlik(n: number) {
  const m10 = n % 10, m100 = n % 100
  if (n === 1) return 'plik'
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return 'pliki'
  return 'plików'
}
function pluralDuplikat(n: number) {
  const m10 = n % 10, m100 = n % 100
  if (n === 1) return 'duplikat'
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return 'duplikaty'
  return 'duplikatów'
}

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)

  async function onLogin(e?: React.FormEvent) {
    e?.preventDefault()
    if (!token.trim()) { setLoginError('Podaj hasło.'); return }
    setLoggingIn(true); setLoginError(null)
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error('Nieprawidłowe hasło')
      setAuthed(true)
    } catch (err: any) {
      setLoginError(err?.message || 'Nieprawidłowe hasło')
    } finally {
      setLoggingIn(false)
    }
  }

  const [files, setFiles] = useState<File[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [showPreview, setShowPreview] = useState(false)
  const [prevLoading, setPrevLoading] = useState(false)
  const [prevImgs, setPrevImgs] = useState<PrevImg[]>([])
  const [prevError, setPrevError] = useState<string | null>(null)

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    []
  )

  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach(u => URL.revokeObjectURL(u)), [previews])

  function onAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || [])
    if (!picked.length) return
    const existing = new Set(files.map(f => f.name))
    const uniqued: File[] = []
    let dup = 0
    for (const f of picked) {
      if (existing.has(f.name)) { dup++; continue }
      existing.add(f.name); uniqued.push(f)
    }
    setFiles(prev => [...prev, ...uniqued])
    if (inputRef.current) inputRef.current.value = ''
    setMsg(dup > 0 ? `Pominięto ${dup} ${pluralDuplikat(dup)} nazw.` : null)
  }
  function removeAt(i: number) { setFiles(prev => prev.filter((_, idx) => idx !== i)) }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!files.length) { setMsg('Wybierz zdjęcia.'); return }
    setMsg(null); setUploading(true); setUploadedCount(0)

    let ok = 0
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('files', files[i])
      fd.append('token', token)

      try {
        const res = await fetch('/api/daily/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Błąd uploadu')
        ok += (data?.count ?? 1) > 0 ? 1 : 0
      } catch (err: any) {
        setMsg(err?.message || 'Błąd wysyłki'); setUploading(false); return
      } finally {
        setUploadedCount(i + 1)
      }
    }

    setUploading(false)
    setMsg(`Wgrano ${ok} z ${files.length} ${pluralPlik(files.length)}.`)
    setFiles([])
  }

  const percent = files.length ? Math.round((uploadedCount / files.length) * 100) : 0

  async function openPreview() {
    setShowPreview(true); setPrevLoading(true); setPrevError(null)
    try {
      const res = await fetch('/api/daily/list?admin=1', {
        cache: 'no-store',
        headers: { 'x-admin-token': token },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Błąd pobierania podglądu')
      setPrevImgs((data?.images || []) as PrevImg[])
    } catch (e: any) {
      setPrevError(e?.message || 'Nie udało się pobrać listy.')
    } finally {
      setPrevLoading(false)
    }
  }

  async function deleteImg(publicId: string) {
    if (!confirm('Usunąć to zdjęcie?')) return
    try {
      const res = await fetch('/api/daily/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, publicId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Błąd usuwania')
      setPrevImgs(prev => prev.filter(i => i.id !== publicId))
    } catch (e: any) {
      alert(e?.message || 'Nie udało się usunąć zdjęcia.')
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-coffeeDark text-coffeeBeige flex items-center justify-center p-6">
        <form onSubmit={onLogin}
          className="bg-coffeeDark/60 border border-coffeeBeige/30 rounded-2xl p-8 w-full max-w-md space-y-5 shadow-lg">
          <h1 className="text-2xl font-extrabold text-center">Panel — Witryna dnia</h1>
          <p className="text-center text-sm opacity-80">Podaj hasło, aby kontynuować.</p>

          <input
            type="password"
            placeholder="Hasło"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full bg-transparent border border-coffeeBeige/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coffeeBeige/40"
          />
          {loginError && <p className="text-sm text-red-300 text-center">{loginError}</p>}

          <button disabled={loggingIn}
            className="w-full bg-coffeeBeige text-coffeeDark px-4 py-2 rounded font-bold hover:opacity-90 transition disabled:opacity-60">
            {loggingIn ? 'Sprawdzam…' : 'Zaloguj'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-coffeeDark text-coffeeBeige flex items-center justify-center p-6">
      <form onSubmit={onSubmit}
        className="bg-coffeeDark/60 border border-coffeeBeige/30 rounded-2xl p-8 w-full max-w-3xl space-y-6 shadow-lg">

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold">
            Witryna dnia — upload <span className="opacity-80 font-semibold">({todayLabel})</span>
          </h1>

          <div className="flex items-center gap-3">
            <button type="button" onClick={openPreview}
              className="text-sm bg-coffeeBeige text-coffeeDark px-3 py-1.5 rounded font-bold hover:opacity-90 transition">
              Podgląd / edycja
            </button>
            <button type="button"
              className="text-sm opacity-80 hover:opacity-100 underline"
              onClick={() => { setAuthed(false); setToken(''); setFiles([]); setMsg(null) }}>
              Wyloguj
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm opacity-90">Wybierz zdjęcia (możesz dodawać kilka razy — lista się sumuje)</label>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={onAddFiles}
              className="w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-coffeeBeige file:px-3 file:py-2 file:text-coffeeDark file:font-bold hover:file:opacity-90"
            />
            {files.length > 0 && (
              <span className="text-xs opacity-75 whitespace-nowrap">
                {files.length} {pluralPlik(files.length)} w kolejce
              </span>
            )}
          </div>
        </div>

        {!!files.length && (
          <div className="grid grid-cols-4 gap-3">
            {files.map((f, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-coffeeBeige/20">
                <img src={previews[i]} alt={f.name} className="block w-full h-28 object-cover" />
                <button type="button" onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                  Usuń
                </button>
                <div className="px-2 py-1 text-[10px] truncate opacity-80">{f.name}</div>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Wysyłanie…</span>
              <span>{uploadedCount} / {files.length} ({percent}%)</span>
            </div>
            <div className="h-2 w-full bg-coffeeBeige/20 rounded">
              <div className="h-2 bg-coffeeBeige rounded transition-[width] duration-300" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            disabled={uploading || files.length === 0}
            className="bg-coffeeBeige text-coffeeDark px-5 py-2 rounded font-bold disabled:opacity-60 hover:opacity-90 transition"
          >
            {uploading ? 'Wgrywam…' : 'Wyślij dzisiejsze zdjęcia'}
          </button>
          {msg && <p className="text-sm opacity-90">{msg}</p>}
        </div>
      </form>

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-coffeeDark text-coffeeBeige w-full max-w-4xl rounded-2xl p-6 border border-coffeeBeige/30 shadow-xl relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Dzisiejsze zdjęcia ({todayLabel})</h2>
              <button className="text-sm opacity-80 hover:opacity-100" onClick={() => setShowPreview(false)}>✕ Zamknij</button>
            </div>

            {prevLoading && <p>Ładowanie…</p>}
            {prevError && <p className="text-red-300">{prevError}</p>}

            {!prevLoading && !prevError && (
              prevImgs.length ? (
                <div className="grid grid-cols-4 gap-3">
                  {prevImgs.map(img => (
                    <div key={img.id} className="relative rounded-lg overflow-hidden border border-coffeeBeige/20">
                      <Image src={img.url} alt="" width={300} height={500} className="w-full h-40 object-cover" />
                      <button
                        onClick={() => deleteImg(img.id)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded"
                        title="Usuń zdjęcie"
                      >
                        🚫
                      </button>
                    </div>
                  ))}
                </div>
              ) : <p className="opacity-80">Brak zdjęć na dzisiaj.</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
