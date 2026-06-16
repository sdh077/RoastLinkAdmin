import { createClient } from '@/lib/supabase/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IArchive } from '@/interface/archive'
import { EspressoCalendar } from './espresso-calendar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ArchiveEditDialog } from '@/components/espresso/archive-edit-dialog'

const POSITION_LABEL: Record<string, string> = { ep: '은평본점', os: '온선재' }

const getArchives = async (date: string, position: string) => {
  const supabase = await createClient()
  let q = supabase.from('archive').select('*, shop_user(*)').eq('page', 'espresso')
    .order('id', { ascending: false })
  if (date) q = q.eq('date', date)
  if (position) q = q.eq('position', position)
  return await q.returns<IArchive[]>()
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { date, position = 'ep' } = await searchParams
  const { data: archives } = await getArchives(date as string, position as string)
  if (!archives) return <></>
  return (
    <div>
      <div className='flex justify-between'>
        <SidebarTrigger />
        <div className='flex gap-2'>
          <Link href={'/create'}>
            <Button>기록하기</Button>
          </Link>
          <Link href={`/graph?position=${position}`}>
            <Button variant="outline">그래프보기</Button>
          </Link>
        </div>
        <EspressoCalendar />
      </div>

      {/* position 탭 */}
      <div className='flex gap-2 my-3'>
        {[{ label: '은평본점 (ep)', value: 'ep' }, { label: '온선재 (os)', value: 'os' }].map(p => (
          <Link key={p.value} href={`/?position=${p.value}${date ? `&date=${date}` : ''}`}>
            <button
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${position === p.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border'
                }`}
            >
              {p.label}
            </button>
          </Link>
        ))}
      </div>

      <Accordion type="single" collapsible className="w-full">
        {archives.map(archive =>
          <AccordionItem value={`${archive.id}`} key={archive.id}>
            <AccordionTrigger>
              {archive.date?.slice(0, 10)}{' '}
              {POSITION_LABEL[archive.position] ?? archive.position}{' '}
              {archive.subject}{' '}
              {archive.time}{' '}
              {archive.name || archive.shop_user?.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex justify-end mb-2'>
                <ArchiveEditDialog data={archive} />
              </div>
              <div className='grid grid-cols-2'>
                <div>위치</div>
                <div>{POSITION_LABEL[archive.position] ?? archive.position}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>로스팅 날짜</div>
                <div>{archive.roasting_date}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>기록자</div>
                <div>{archive.name || archive.shop_user?.name}</div>
              </div>
              {Object.entries(archive.content).map(([key, value]) =>
                <div key={archive.id + key} className='grid grid-cols-2'>
                  <div>{key}</div>
                  <div>{typeof value === "boolean" ? (value ? '사용' : '미사용') : value as string}</div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
