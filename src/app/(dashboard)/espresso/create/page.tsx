'use client'
import { Label } from '@/components/ui/label';
import React, { useState } from 'react'
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

const Page = () => {
  const [on, setOn] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [tabValue, setTabValue] = useState<string>('morgan')
  const [obj, setObj] = useState<{ [x: string]: string }>({
    "Room Temperature / Humidity": "",
    "Time Since Roasting date": "",
    "CXM (Coffee Experience Manager)": "",
    "머신 물온도(Temp.)": "",
    "분쇄도(grind size)": "",
    "프리인퓨전 여부": "",
    "Dose in": "",
    "Out time(sec)": "",
    "Out": "",
    "묘사평가": "",
    "정동평가": "",
  })
  const addAchive = async () => {
    setOn(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('archive')
        .insert({ content: obj, subject: tabValue, time, page: 'espresso', date: date ? makeYYYYMMDD(date) : null })
      if (!error) {
        toast({
          title: "수정이 완료되었습니다.",
        })
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
        <ArchiveDatePicker date={date} setDate={setDate} />
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
      <div>
        {Object.entries(obj).map(([key, value]) =>
          <div key={key}>
            <div>{key}</div>
            <div><Input value={value} onChange={e => setObj(prev => ({
              ...prev,
              [key]: e.target.value
            }))}
            /></div>
          </div>
        )}
      </div>
    </div>
  )
}

function SelectTime({ time, setTime }: { time: string | undefined, setTime: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  return (
    <Select value={time} onValueChange={setTime}>
      <SelectTrigger className="w-[180px]">
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

export default Page