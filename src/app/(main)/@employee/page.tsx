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
import { makeYYYYMMDD } from '@/lib/utils'
import SignOut from './sign-out'

const getArchives = async (date: string) => {
  const supabase = await createClient()
  let q = supabase.from('archive').select('*, shop_user(*)').eq('page', 'espresso')
    .order('id', { ascending: false })
  if (date) q = q.eq('date', date)
  return await q
    .returns<IArchive[]>()
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { date } = await searchParams
  const { data: archives } = await getArchives(date as string)
  if (!archives) return <></>
  return (
    <div>
      <div className='flex justify-between'>
        <Link href={'/create'}>
          <Button>기록하기</Button>
        </Link>
        <EspressoCalendar />
      </div>
      <Accordion type="single" collapsible className="w-full">
        {archives.map(archive =>
          <AccordionItem value={`${archive.id}`} key={archive.id}>
            <AccordionTrigger>{archive.date?.slice(0, 10)} {archive.subject} {archive.time} {'이름'}</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2'>
                <div>로스팅 날짜</div>
                <div>{archive.roasting_date}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>기록자</div>
                <div>{archive.shop_user?.name}</div>
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
