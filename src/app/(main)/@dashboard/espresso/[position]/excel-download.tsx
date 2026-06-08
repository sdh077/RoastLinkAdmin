"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import * as XLSX from "xlsx"
import { IArchive } from "@/interface/archive"

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

const CONTENT_KEYS = [
  "온도",
  "습도",
  "머신 물온도(Temp.)",
  "분쇄도(grind size)",
  "프리인퓨전 여부",
  "Dose in",
  "Out time(sec)",
  "Out",
  "머신압력",
  "향미 CVA 정동평가",
  "단맛",
  "쓴맛",
  "신맛",
  "짠맛",
  "무게감",
  "질감 (좋음이 5)",
  "그라인더",
  "메모",
]
const SUBJECTS = [
  { label: "hometown", value: "hometown" },
  { label: "morgan", value: "morgan" },
  { label: "decaf", value: "decaf" },
]

export function ExcelDownload({ position }: { position: string }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [startMonth, setStartMonth] = useState(1)
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    console.log('first')
    try {
      const supabase = createClient()
      const startDate = `${year}-${String(startMonth).padStart(2, "0")}-01`
      const lastDay = new Date(year, endMonth, 0).getDate()
      const endDate = `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

      const workbook = XLSX.utils.book_new()

      for (const subject of SUBJECTS) {
        const { data, error } = await supabase
          .from("archive")
          .select("*, shop_user(*)")
          .eq("page", "espresso")
          .eq("position", position)
          .eq("subject", subject.value)
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: true })
          .returns<IArchive[]>()
        console.log('??', error, data)
        if (!data || data.length === 0) {
          const ws = XLSX.utils.aoa_to_sheet([["데이터 없음"]])
          XLSX.utils.book_append_sheet(workbook, ws, subject.label)
          continue
        }

        const headers = ["기록일", "로스팅날짜", "세팅시간", "기록자", ...CONTENT_KEYS]

        const rows = data.map((archive) => {
          const name = archive.name || archive.shop_user?.name || ""
          const contentValues = CONTENT_KEYS.map((key) => {
            const val = archive.content[key]
            if (typeof val === "boolean") return val ? "사용" : "미사용"
            return val ?? ""
          })
          return [archive.date, archive.roasting_date, archive.time, name, ...contentValues]
        })

        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
        XLSX.utils.book_append_sheet(workbook, ws, subject.label)
      }

      XLSX.writeFile(workbook, `에스프레소_${position}_${year}년_${startMonth}-${endMonth}월.xlsx`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
        <SelectTrigger className="w-[90px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[currentYear - 1, currentYear].map((y) => (
            <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(startMonth)} onValueChange={(v) => setStartMonth(Number(v))}>
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-sm">~</span>

      <Select value={String(endMonth)} onValueChange={(v) => setEndMonth(Number(v))}>
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleDownload} disabled={loading} variant="outline" size="sm">
        {loading ? "다운로드 중..." : "엑셀 다운"}
      </Button>
    </div>
  )
}
