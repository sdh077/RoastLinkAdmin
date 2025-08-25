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

const getArchives = async (date: string, position: string) => {
  const supabase = await createClient()
  let q = supabase.from('archive').select('*, shop_user(*)').eq('page', 'espresso').eq('position', position)
    .order('id', { ascending: false })
  if (date) q = q.eq('date', date)
  console.log(q)
  return await q
    .returns<IArchive[]>()
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ position: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { date } = await searchParams
  const { position } = await params
  const { data: archives } = await getArchives(date as string, position)
  console.log(archives)
  if (!archives) return <></>
  return (
    <div>
      <div className='flex justify-between'>
        <Link href={`/espresso/${position}/create`}>
          <Button>기록하기</Button>
        </Link>
        <EspressoCalendar />
      </div>
      <Accordion type="single" collapsible className="w-full">
        {archives.map(archive =>
          <AccordionItem value={`${archive.id}`} key={archive.id}>
            <AccordionTrigger>{archive.date?.slice(0, 10)} {archive.subject} {archive.time} {!!archive.name ? archive.name : archive.shop_user?.name}</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2'>
                <div>로스팅 날짜</div>
                <div>{archive.roasting_date}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>기록자</div>
                <div>{!!archive.name ? archive.name : archive.shop_user?.name}</div>
              </div>
              {Object.entries(archive.content).map(([key, value]) =>
                <div key={archive.id + key} className='grid grid-cols-2'>
                  <div>{key}</div>
                  <div>{typeof value === "boolean" ?
                    value ? '사용' : '미사용'
                    :
                    value as string}</div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

