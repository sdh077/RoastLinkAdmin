'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { IArchive } from '@/interface/archive'
import { EspressoCalendar } from './espresso-calendar'
import { makeYYYYMMDD } from '@/lib/utils'

const archive: { [x: string]: [type: string, def: any] } = {
  "온도": ["number", 20],
  "습도": ["number", 0],
  "머신 물온도(Temp.)": ["number", 92],
  "분쇄도(grind size)": ["number", 7.2],
  "프리인퓨전 여부": ["boolean", false],
  "Dose in": ["text", ""],
  "Out time(sec)": ["text", ""],
  "Out": ["text", ""],
  "머신압력": ["text", "9"],
  "향미 CVA 정동평가": ["select", [4, 5, 6, 7, 8, 9]],
  "단맛": ["select", [1, 2, 3, 4, 5]],
  "쓴맛": ["select", [1, 2, 3, 4, 5]],
  "신맛": ["select", [1, 2, 3, 4, 5]],
  "짠맛": ["select", [1, 2, 3, 4, 5]],
  "무게감": ["select", [1, 2, 3, 4, 5]],
  "질감 (좋음이 5)": ["select", [1, 2, 3, 4, 5]],
  "그라인더": ["select", ["메저로버", "미토스1", "ek43"]],
  "메모": ["text", ""],
}

const SUBJECTS = ['morgan', 'hometown', 'decaf']
const TIMES = ['아침', '미들', '오후', '저녁']

export function ArchiveEditDialog({ data }: { data: IArchive }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(data.name || '')
  const [subject, setSubject] = useState(data.subject)
  const [time, setTime] = useState<string | undefined>(data.time || undefined)
  const [date, setDate] = useState<Date | null>(data.date ? new Date(data.date) : null)
  const [roastingDate, setRoastingDate] = useState<Date | null>(data.roasting_date ? new Date(data.roasting_date) : null)
  const [obj, setObj] = useState<{ [x: string]: string | number | boolean }>({ ...data.content })

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setObj(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/archive/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: obj,
          subject,
          time,
          name,
          date: date ? makeYYYYMMDD(date) : null,
          roasting_date: roastingDate ? makeYYYYMMDD(roastingDate) : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast({ title: '수정 완료' })
      setOpen(false)
      router.refresh()
    } catch {
      toast({ title: '수정에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/archive/${data.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: '삭제 완료' })
      setOpen(false)
      router.refresh()
    } catch {
      toast({ title: '삭제에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='h-6 text-xs'>수정</Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>기록 수정</DialogTitle>
        </DialogHeader>

        <div className='space-y-3 text-sm'>
          {/* 기본 정보 */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div className='text-muted-foreground mb-1'>원두</div>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className='w-full border rounded px-2 py-1.5 text-sm'
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className='text-muted-foreground mb-1'>세팅 시간</div>
              <select
                value={time ?? ''}
                onChange={e => setTime(e.target.value || undefined)}
                className='w-full border rounded px-2 py-1.5 text-sm'
              >
                <option value=''>-</option>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div className='text-muted-foreground mb-1'>기록일</div>
              <EspressoCalendar date={date} setDate={setDate} />
            </div>
            <div>
              <div className='text-muted-foreground mb-1'>로스팅 날짜</div>
              <EspressoCalendar date={roastingDate} setDate={setRoastingDate} />
            </div>
          </div>

          <div>
            <div className='text-muted-foreground mb-1'>작성자</div>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className='border-t pt-3 space-y-2'>
            {Object.entries(obj).map(([key, value]) => {
              const [type, def] = archive[key] ?? ['text', '']
              return (
                <div key={key} className='grid grid-cols-2 gap-2 items-center'>
                  <div className='text-muted-foreground'>{key}</div>
                  <div>
                    {type === 'boolean' ? (
                      <Checkbox
                        checked={Boolean(value)}
                        onCheckedChange={v => setObj(prev => ({ ...prev, [key]: Boolean(v) }))}
                      />
                    ) : type === 'select' ? (
                      <select
                        value={String(value)}
                        onChange={setField(key)}
                        className='w-full border rounded px-2 py-1 text-sm'
                      >
                        {def.map((i: number | string) => <option key={i}>{i}</option>)}
                      </select>
                    ) : (
                      <Input type={type} value={value as string} onChange={setField(key)} className='h-7 text-sm' />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex justify-between pt-2'>
          <Button variant='destructive' size='sm' onClick={handleDelete} disabled={saving}>삭제</Button>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => setOpen(false)}>취소</Button>
            <Button size='sm' onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
