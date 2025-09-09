export function getPlNow() {
  const now = new Date()
  return new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }))
}

export function todayTag() {
  const plNow = getPlNow()
  const y = plNow.getFullYear()
  const m = String(plNow.getMonth() + 1).padStart(2, '0')
  const d = String(plNow.getDate()).padStart(2, '0')
  const prefix = process.env.DAILY_TAG_PREFIX || 'witryna-'
  return { tag: `${prefix}${y}-${m}-${d}`, plNow }
}

export function isClosed(plNow: Date) {
  const closing = Number(process.env.CLOSING_HOUR_PL || 21)
  return plNow.getHours() >= closing
}
