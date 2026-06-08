"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { IArchive } from "@/interface/archive"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

const NUMERIC_KEYS = [
  "온도",
  "습도",
  "머신 물온도(Temp.)",
  "분쇄도(grind size)",
  "Dose in",
  "Out time(sec)",
  "Out",
  "향미 CVA 정동평가",
  "단맛",
  "쓴맛",
  "신맛",
  "짠맛",
  "무게감",
  "질감 (좋음이 5)",
]

const SUBJECTS = [
  { label: "hometown", value: "hometown" },
  { label: "morgan", value: "morgan" },
  { label: "decaf", value: "decaf" },
]

type ChartPoint = { date: string; value: number | null }

function SubjectChart({ position, subject, startDate, endDate }: {
  position: string
  subject: string
  startDate: string
  endDate: string
}) {
  const [data, setData] = useState<ChartPoint[]>([])
  const [metric, setMetric] = useState(NUMERIC_KEYS[3]) // 분쇄도 기본값
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: archives } = await supabase
        .from("archive")
        .select("date, content")
        .eq("page", "espresso")
        .eq("position", position)
        .eq("subject", subject)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true })
        .returns<Pick<IArchive, "date" | "content">[]>()

      if (!archives) return
      setData(
        archives.map((a) => ({
          date: a.date?.slice(5),
          value: a.content[metric] !== undefined && a.content[metric] !== ""
            ? Number(a.content[metric])
            : null,
        }))
      )
    } finally {
      setLoading(false)
    }
  }, [position, subject, startDate, endDate, metric])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <div className="mb-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUMERIC_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">로딩 중...</div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">데이터 없음</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip formatter={(v) => [v, metric]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={metric}
              stroke="#2563eb"
              dot={{ r: 3 }}
              connectNulls={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function GraphView({ position }: { position: string }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [startMonth, setStartMonth] = useState(1)
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1)
  const [applied, setApplied] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date(currentYear, new Date().getMonth() + 1, 0).getDate()).padStart(2, "0")}`,
  })

  const handleApply = () => {
    const lastDay = new Date(year, endMonth, 0).getDate()
    setApplied({
      startDate: `${year}-${String(startMonth).padStart(2, "0")}-01`,
      endDate: `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    })
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-6">
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

        <Button size="sm" onClick={handleApply}>조회</Button>
      </div>

      <Tabs defaultValue="hometown">
        <TabsList className="grid w-full grid-cols-3">
          {SUBJECTS.map((s) => (
            <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
          ))}
        </TabsList>
        {SUBJECTS.map((s) => (
          <TabsContent key={s.value} value={s.value}>
            <SubjectChart
              position={position}
              subject={s.value}
              startDate={applied.startDate}
              endDate={applied.endDate}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
