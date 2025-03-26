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

const getArchives = async () => {
  const supabase = await createClient()
  return await supabase.from('archive').select('*').eq('page', 'espresso').returns<IArchive[]>()
}

const page = async () => {
  const { data: archives } = await getArchives()
  if (!archives) return <></>
  return (
    <div>
      <Link href={'/espresso/create'}>
        <Button>기록하기</Button>
      </Link>
      <Accordion type="single" collapsible className="w-full">
        {archives.map(archive =>
          <AccordionItem value={`${archive.id}`} key={archive.id}>
            <AccordionTrigger>{archive.date?.slice(0, 10)} {archive.subject} {archive.time}</AccordionTrigger>
            <AccordionContent>
              {Object.entries(archive.content).map(([key, value]) =>
                <div key={archive.id + key} className='grid grid-cols-2'>
                  <div>{key}</div>
                  <div>{value as string}</div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

export default page