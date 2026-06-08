import { createClient } from '@supabase/supabase-js'
import { IArchive } from '@/interface/archive'
import { BeansTabs } from './beans-tabs'

const SUBJECTS = ['morgan', 'hometown', 'decaf'] as const
type Subject = typeof SUBJECTS[number]

async function getLatestBySubject(): Promise<Record<Subject, IArchive | null>> {
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
        .eq('subject', subject)
        .order('id', { ascending: false })
        .limit(1)
        .returns<IArchive[]>()
        .then(({ data }) => [subject, data?.[0] ?? null] as const)
    )
  )

  return Object.fromEntries(results) as Record<Subject, IArchive | null>
}

export default async function BeansPage() {
  const latestBySubject = await getLatestBySubject()

  return (
    <main className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">오늘의 원두</h1>
      <p className="text-muted-foreground text-sm mb-6">각 원두의 최신 에스프레소 세팅 기록입니다</p>
      <BeansTabs latestBySubject={latestBySubject} />
    </main>
  )
}
