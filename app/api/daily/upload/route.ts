import { NextResponse } from 'next/server'
import cloudinary from '@/cloudinary'
import { todayTag } from '@/daily'

function uploadBuffer(buffer: Buffer, tag: string) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'witryna-dnia',
        tags: [tag],
      },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export async function POST(req: Request) {
  const form = await req.formData()

  const token = form.get('token')?.toString()
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const files = form.getAll('files') as File[]
  if (!files.length) {
    return NextResponse.json({ ok: false, error: 'Brak plików' }, { status: 400 })
  }

  const { tag } = todayTag()
  const uploaded: any[] = []

  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer())
    const res: any = await uploadBuffer(buf, tag)
    uploaded.push(res)
  }

  return NextResponse.json({ ok: true, count: uploaded.length })
}
