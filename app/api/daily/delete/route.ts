import { NextResponse } from 'next/server'
import cloudinary from '@/cloudinary'

export async function POST(req: Request) {
  try {
    const { token, publicId } = await req.json()
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!publicId) {
      return NextResponse.json({ error: 'Brak publicId' }, { status: 400 })
    }

    await cloudinary.api.delete_resources([publicId], { resource_type: 'image' })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Błąd usuwania' }, { status: 500 })
  }
}
