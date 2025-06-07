'use client'
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { makeYYYYMMDD } from '@/lib/utils';
import { EspressoCalendar } from '../espresso-calendar';
import { Checkbox } from '@/components/ui/checkbox';

export default function EspressoPage() {
  const [on, setOn] = useState(false)
  const [roastingDate, setRoastingDate] = useState<Date | null>(new Date())
  const [date, setDate] = useState<Date | null>(new Date())
  const [time, setTime] = useState<string | undefined>(undefined)
  const [tabValue, setTabValue] = useState<string>('morgan')
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState(0)

  useEffect(() => {
    const name = localStorage.getItem("name");
    setName(name ?? '');
    const userId = localStorage.getItem("shop_user_id");
    setUserId(Number(userId ?? 0))
  }, []);
  const archive: { [x: string]: [type: string, def: any] } = {
    "온도": ["number", 20], //숫자
    "습도": ["number", 0], //숫자
    "머신 물온도(Temp.)": ["number", 92],
    "분쇄도(grind size)": ["number", 7.2],
    "프리인퓨전 여부": ["boolean", false],
    "Dose in": ["text", ""],
    "Out time(sec)": ["text", ""],
    "Out": ["text", ""],
    "머신압력": ["text", "9"],
    "향미 CVA 정동평가": ["select", [4, 5, 6, 7, 8, 9]], // 1,2,3,4,5 
    "단맛": ["select", [1, 2, 3, 4, 5]], // 1,2,3,4,5 
    "쓴맛": ["select", [1, 2, 3, 4, 5]], // 1,2,3,4,5
    "신맛": ["select", [1, 2, 3, 4, 5]], // 1,2,3,4,5
    "짠맛": ["select", [1, 2, 3, 4, 5]], // 1,2,3,4,5
    "무게감": ["select", [1, 2, 3, 4, 5]],// 1,2,3,4,5
    "질감 (좋음이 5)": ["select", [1, 2, 3, 4, 5]],// 1,2,3,4,5
    "그라인더": ["select", ["메저로버", "미토스1", "ek43"]],// 1,2,3,4,5
    "메모": ["text", ""],// 1,2,3,4,5
  }
  type Props = { [x: string]: string | number | boolean }
  const initialObj: Props = {};

  Object.entries(archive).forEach(([key, [type, def]]) => {
    if (Array.isArray(def)) {
      initialObj[key] = def[0]; // 배열이면 첫 번째 값
    } else {
      initialObj[key] = def;
    }
  });

  const [obj, setObj] = useState<Props>(initialObj);
  const addAchive = async () => {
    setOn(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('archive')
        .insert({
          content: obj, subject: tabValue, time, page: 'espresso',
          date: date ? makeYYYYMMDD(date) : null,
          roasting_date: roastingDate ? makeYYYYMMDD(roastingDate) : null,
          shop_user_id: userId,
          name
        })
      if (!error) {
        toast({
          title: "수정이 완료되었습니다.",
        })
        window.location.href = '/espresso'
      } else {
        toast({
          title: "수정이 실패했습니다",
          description: error.message
        })
      }
    } finally {
      setOn(false)
    }
  }

  return (
    <div>
      <div className='flex justify-between my-4'>
        <EspressoCalendar date={date} setDate={setDate} />
        <SelectTime time={time} setTime={setTime} />
        <Button onClick={addAchive} disabled={on}>기록</Button>
      </div>
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
        defaultValue="morgan"
        className="w-full"
      >
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
        <div >
          <div>로스팅 날짜</div>
          <div>
            <EspressoCalendar date={roastingDate} setDate={setRoastingDate} />
          </div>
        </div>
        {Object.entries(obj).map(([key, value]) => {
          if (archive[key][0] === "text" || archive[key][0] === "number") return (
            <div key={key}>
              <div>{key}</div>
              <div><Input type={archive[key][0]} value={value as string} onChange={e => setObj(prev => ({
                ...prev,
                [key]: e.target.value
              }))}
              /></div>
            </div>
          )
          else if (archive[key][0] === "select") return (
            <div key={key} className='flex gap-4'>
              <div>{key}</div>
              <div>
                <select value={value as string} onChange={e => setObj(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                >
                  {archive[key][1].map((i: number) =>
                    <option key={`${key}-${i}`}>{i}</option>
                  )}
                </select>
              </div>
            </div>
          )
          else if (archive[key][0] === "boolean")
            return (
              <div key={key} className='flex gap-4'>
                <div>{key}</div>
                <div>
                  <Checkbox

                    checked={Boolean(value)}
                    onCheckedChange={e => setObj(prev => ({
                      ...prev,
                      [key]: Boolean(e)
                    }))}
                  />
                </div>
              </div>
            )
        }

        )}
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

const ArchiveDatePicker = ({ date, setDate }: { date: Date | null, setDate: React.Dispatch<React.SetStateAction<Date | null>> }) => {
  return (
    <div className="flex gap-8 items-center">
      <Label htmlFor="startDate">기록일 선택</Label>
      <DatePicker
        id="startDate"
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="yyyy-MM-dd"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    </div>
  );
};
