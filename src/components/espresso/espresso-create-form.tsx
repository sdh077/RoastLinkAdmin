'use client'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { makeYYYYMMDD } from '@/lib/utils'
import { EspressoCalendar } from './espresso-calendar'

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

type ArchiveObj = { [x: string]: string | number | boolean }

const initialObj: ArchiveObj = Object.fromEntries(
  Object.entries(archive).map(([key, [, def]]) => [key, Array.isArray(def) ? def[0] : def])
)

export function EspressoCreateForm({ position, redirectTo }: { position: string, redirectTo: string }) {
  const [on, setOn] = useState(false)
  const [roastingDate, setRoastingDate] = useState<Date | null>(new Date())
  const [date, setDate] = useState<Date | null>(new Date())
  const [time, setTime] = useState<string | undefined>(undefined)
  const [tabValue, setTabValue] = useState<string>('morgan')
  const [name, setName] = useState<string>('')
  const [userId, setUserId] = useState(0)
  const [obj, setObj] = useState<ArchiveObj>(initialObj)

  useEffect(() => {
    setName(localStorage.getItem("name") ?? '')
    setUserId(Number(localStorage.getItem("shop_user_id") ?? 0))
  }, [])

  const addAchive = async () => {
    setOn(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('archive').insert({
        content: obj,
        subject: tabValue,
        time,
        page: 'espresso',
        date: date ? makeYYYYMMDD(date) : null,
        roasting_date: roastingDate ? makeYYYYMMDD(roastingDate) : null,
        shop_user_id: userId,
        name,
        position,
      })
      if (!error) {
        toast({ title: "수정이 완료되었습니다." })
        window.location.href = redirectTo
      } else {
        toast({ title: "수정이 실패했습니다", description: error.message })
      }
    } finally {
      setOn(false)
    }
  }

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setObj(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className='flex justify-between my-4'>
        <EspressoCalendar date={date} setDate={setDate} />
        <SelectTime time={time} setTime={setTime} />
        <Button onClick={addAchive} disabled={on}>기록</Button>
      </div>
      <Tabs value={tabValue} onValueChange={setTabValue} defaultValue="morgan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="morgan">morgan</TabsTrigger>
          <TabsTrigger value="hometown">hometown</TabsTrigger>
          <TabsTrigger value="decaf">decaf</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className='my-4'>
        <div>
          작성자: <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <div>로스팅 날짜</div>
          <EspressoCalendar date={roastingDate} setDate={setRoastingDate} />
        </div>
        {Object.entries(obj).map(([key, value]) => {
          const [type, def] = archive[key]
          if (type === "text" || type === "number") return (
            <div key={key}>
              <div>{key}</div>
              <Input type={type} value={value as string} onChange={setField(key)} />
            </div>
          )
          if (type === "select") return (
            <div key={key} className='flex gap-4'>
              <div>{key}</div>
              <select value={value as string} onChange={setField(key)}>
                {def.map((i: number | string) => <option key={`${key}-${i}`}>{i}</option>)}
              </select>
            </div>
          )
          if (type === "boolean") return (
            <div key={key} className='flex gap-4'>
              <div>{key}</div>
              <Checkbox
                checked={Boolean(value)}
                onCheckedChange={e => setObj(prev => ({ ...prev, [key]: Boolean(e) }))}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SelectTime({ time, setTime }: { time: string | undefined, setTime: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  return (
    <Select value={time} onValueChange={setTime}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="세팅 시간" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>세팅 시간</SelectLabel>
          <SelectItem value="아침">아침</SelectItem>
          <SelectItem value="미들">미들</SelectItem>
          <SelectItem value="오후">오후</SelectItem>
          <SelectItem value="저녁">저녁</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
