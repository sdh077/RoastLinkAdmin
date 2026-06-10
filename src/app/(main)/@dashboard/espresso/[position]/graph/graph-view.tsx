"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { IArchive } from "@/interface/archive"
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

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 1, currentYear]
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

const NUMERIC_KEYS = [
  "온도", "습도", "머신 물온도(Temp.)", "분쇄도(grind size)",
  "Dose in", "Out time(sec)", "Out", "향미 CVA 정동평가",
  "단맛", "쓴맛", "신맛", "짠맛", "무게감", "질감 (좋음이 5)",
]

const SUBJECTS = [
  { label: "hometown", value: "hometown", color: "#2563eb" },
  { label: "morgan", value: "morgan", color: "#16a34a" },
  { label: "decaf", value: "decaf", color: "#ea580c" },
]

type ArchivePoint = { date: string; content: Record<string, string | number | boolean> }

function lastDay(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function GraphView({ position }: { position: string }) {
  const now = new Date()
  const [startYear, setStartYear] = useState(currentYear)
  const [startMonth, setStartMonth] = useState(1)
  const [endYear, setEndYear] = useState(currentYear)
  const [endMonth, setEndMonth] = useState(now.getMonth() + 1)

  const [activeSubjects, setActiveSubjects] = useState<string[]>(["hometown", "morgan", "decaf"])
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["분쇄도(grind size)"])
  const [subjectData, setSubjectData] = useState<Record<string, ArchivePoint[]>>({})
  const [loading, setLoading] = useState(false)

  const [applied, setApplied] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay(currentYear, now.getMonth() + 1)).padStart(2, "0")}`,
  })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const result: Record<string, ArchivePoint[]> = {}
      for (const subject of SUBJECTS) {
        const { data } = await supabase
          .from("archive")
          .select("date, content")
          .eq("page", "espresso")
          .eq("position", position)
          .eq("subject", subject.value)
          .gte("date", applied.startDate)
          .lte("date", applied.endDate)
          .order("date", { ascending: true })
          .returns<Pick<IArchive, "date" | "content">[]>()
        result[subject.value] = (data ?? []).map(a => ({
          date: a.date?.slice(5) ?? "",
          content: a.content,
        }))
      }
      setSubjectData(result)
    } finally {
      setLoading(false)
    }
  }, [position, applied])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleApply = () => {
    setApplied({
      startDate: `${startYear}-${String(startMonth).padStart(2, "0")}-01`,
      endDate: `${endYear}-${String(endMonth).padStart(2, "0")}-${String(lastDay(endYear, endMonth)).padStart(2, "0")}`,
    })
  }

  const toggleSubject = (val: string) =>
    setActiveSubjects(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val])

  const toggleMetric = (val: string) =>
    setActiveMetrics(prev => prev.includes(val) ? prev.filter(m => m !== val) : [...prev, val])

  const buildChartData = (metric: string) => {
    const dateSet = new Set<string>()
    activeSubjects.forEach(s => subjectData[s]?.forEach(p => dateSet.add(p.date)))
    return Array.from(dateSet).sort().map(date => {
      const point: Record<string, string | number> = { date }
      activeSubjects.forEach(s => {
        const found = subjectData[s]?.find(p => p.date === date)
        if (found) {
          const val = found.content[metric]
          if (val !== undefined && val !== "" && typeof val !== "boolean") {
            point[s] = Number(val)
          }
        }
      })
      return point
    })
  }

  return (
    <div>
      {/* 날짜 범위 */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <Select value={String(startYear)} onValueChange={v => setStartYear(Number(v))}>
          <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}년</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(startMonth)} onValueChange={v => setStartMonth(Number(v))}>
          <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-sm">~</span>
        <Select value={String(endYear)} onValueChange={v => setEndYear(Number(v))}>
          <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}년</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(endMonth)} onValueChange={v => setEndMonth(Number(v))}>
          <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="sm" onClick={handleApply}>조회</Button>
      </div>

      {/* 서브젝트 토글 */}
      <div className="flex gap-2 mb-4">
        {SUBJECTS.map(s => (
          <button
            key={s.value}
            onClick={() => toggleSubject(s.value)}
            className="px-3 py-1 rounded-full text-sm border transition-colors"
            style={
              activeSubjects.includes(s.value)
                ? { backgroundColor: s.color, borderColor: s.color, color: "#fff" }
                : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 지표 토글 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {NUMERIC_KEYS.map(k => (
          <button
            key={k}
            onClick={() => toggleMetric(k)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              activeMetrics.includes(k)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* 그래프 */}
      {loading ? (
        <div className="h-[260px] flex items-center justify-center text-muted-foreground">로딩 중...</div>
      ) : activeMetrics.length === 0 ? (
        <p className="text-sm text-muted-foreground">요소를 선택해주세요</p>
      ) : (
        <div className="flex flex-col gap-10">
          {activeMetrics.map(metric => (
            <div key={metric}>
              <p className="text-sm font-semibold mb-2">{metric}</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={buildChartData(metric)} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Legend />
                  {SUBJECTS.filter(s => activeSubjects.includes(s.value)).map(s => (
                    <Line
                      key={s.value}
                      type="monotone"
                      dataKey={s.value}
                      name={s.label}
                      stroke={s.color}
                      dot={{ r: 3 }}
                      connectNulls={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
