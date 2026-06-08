'use client'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IArchive } from '@/interface/archive'

const SUBJECTS = ['morgan', 'hometown', 'decaf'] as const
type Subject = typeof SUBJECTS[number]

const SKIP_KEYS = ['메모']

export function BeanCard({ latestBySubject }: {
  latestBySubject: Record<Subject, IArchive | null>
}) {
  const [subject, setSubject] = useState<Subject>('morgan')
  const archive = latestBySubject[subject]

  return (
    <div className='border rounded-xl p-4 mb-4'>
      <Tabs value={subject} onValueChange={v => setSubject(v as Subject)}>
        <TabsList className='grid w-full grid-cols-3 mb-4'>
          {SUBJECTS.map(s => (
            <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!archive ? (
        <div className='text-muted-foreground text-sm text-center py-4'>기록이 없습니다</div>
      ) : (
        <div className='space-y-1 text-sm'>
          <div className='flex justify-between text-muted-foreground mb-2'>
            <span>{archive.date?.slice(0, 10)}</span>
            <span>{archive.time} · {archive.name || archive.shop_user?.name}</span>
          </div>
          {archive.roasting_date && (
            <Row label='로스팅 날짜' value={archive.roasting_date} />
          )}
          {Object.entries(archive.content)
            .filter(([key]) => !SKIP_KEYS.includes(key))
            .map(([key, value]) => (
              <Row
                key={key}
                label={key}
                value={typeof value === 'boolean' ? (value ? '사용' : '미사용') : String(value)}
              />
            ))}
          {archive.content['메모'] && (
            <div className='mt-2 pt-2 border-t text-muted-foreground'>
              메모: {archive.content['메모']}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='font-medium'>{value}</span>
    </div>
  )
}
