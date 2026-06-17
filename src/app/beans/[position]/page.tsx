import { createClient } from '@supabase/supabase-js'
import { IArchive } from '@/interface/archive'
import { BeansTabs } from '../beans-tabs'
import { notFound } from 'next/navigation'

const SUBJECTS = ['morgan', 'hometown', 'decaf'] as const
type Subject = typeof SUBJECTS[number]

const POSITION_LABEL: Record<string, string> = {
  ep: '은평',
  os: '서소문',
}

const VALID_POSITIONS = Object.keys(POSITION_LABEL)

async function getLatestBySubject(position: string): Promise<Record<Subject, IArchive | null>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'business' } }
  )

  const results = await Promise.all(
    SUBJECTS.map(subject =>
      supabase.from('archive')
        .select('*, shop_user(*)')
        .eq('page', 'espresso')
        .eq('position', position)
        .eq('subject', subject)
        .order('id', { ascending: false })
        .limit(1)
        .returns<IArchive[]>()
        .then(({ data }) => [subject, data?.[0] ?? null] as const)
    )
  )

  return Object.fromEntries(results) as Record<Subject, IArchive | null>
}

export default async function BeansPositionPage({ params }: { params: Promise<{ position: string }> }) {
  const { position } = await params
  if (!VALID_POSITIONS.includes(position)) notFound()

  const latestBySubject = await getLatestBySubject(position)
  const label = POSITION_LABEL[position]

  return (
    <main className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
      <div className="flex gap-3 mb-4">
        {VALID_POSITIONS.map(p => (
          <a
            key={p}
            href={`/beans/${p}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              p === position
                ? 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground border-border hover:border-foreground'
            }`}
          >
            {POSITION_LABEL[p]}
          </a>
        ))}
      </div>
      <h1 className="text-2xl font-bold mb-1">{label} 오늘의 원두</h1>
      <p className="text-muted-foreground text-sm mb-6">각 원두의 최신 에스프레소 세팅 기록입니다</p>
      <BeansTabs latestBySubject={latestBySubject} />
    </main>
  )
}
