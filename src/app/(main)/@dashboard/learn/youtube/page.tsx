import { createClient } from '@supabase/supabase-js'
import { YoutubeList } from './youtube-list'

export interface IYoutube {
  id: number
  title: string
  youtube_url: string
  description: string | null
  order: number
  created_at: string
}

async function getYoutubes() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'business' } }
  )
  const { data } = await supabase
    .from('learn_youtube')
    .select('*')
    .order('order', { ascending: true })
    .returns<IYoutube[]>()
  return data ?? []
}

export default async function YoutubePage() {
  const items = await getYoutubes()
  return (
    <div>
      <h1 className='text-xl font-bold mb-6'>유튜브 링크 관리</h1>
      <YoutubeList initial={items} />
    </div>
  )
}
