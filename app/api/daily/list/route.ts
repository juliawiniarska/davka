import { NextResponse } from 'next/server'
import cloudinary from '@/cloudinary'
import { todayTag, isClosed } from '@/daily'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const admin = url.searchParams.get('admin') === '1'

    const { tag, plNow } = todayTag()

    if (!admin && isClosed(plNow)) {
      return NextResponse.json({ status: 'closed', images: [] })
    }

    const res = await cloudinary.api.resources_by_tag(tag, {
      resource_type: 'image',
      max_results: 100,
      context: true,
    })

    const images = (res.resources || []).map((r: any) => ({
      id: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
    }))

    if (!images.length) {
      return NextResponse.json({ status: admin ? 'ok' : 'empty', images: [] })
    }

    return NextResponse.json({ status: 'ok', images })
  } catch (e) {
    return NextResponse.json({ status: 'error', images: [] }, { status: 500 })
  }
}
