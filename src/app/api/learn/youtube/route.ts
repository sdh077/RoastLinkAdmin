import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'business' } }
)

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabase().from('learn_youtube').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
