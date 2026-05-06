import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'business' } }
)

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { error, data } = await supabase().from('learn_article').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = supabase()

  const { data: article } = await db.from('learn_article').select('content').eq('id', id).single()
  if (article?.content) {
    const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`
    const paths = [...article.content.matchAll(/src="([^"]+)"/g)]
      .map(m => m[1])
      .filter(url => url.startsWith(bucketUrl))
      .map(url => url.replace(bucketUrl, ''))
    if (paths.length > 0) await db.storage.from('images').remove(paths)
  }

  const { error } = await db.from('learn_article').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
