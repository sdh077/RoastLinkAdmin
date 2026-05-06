import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const ext = file.name.split('.').pop()
  const path = `learn/${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, arrayBuffer, { contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path)
  return NextResponse.json({ url: publicUrl })
}
