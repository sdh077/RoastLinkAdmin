"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { IArchive } from "@/interface/archive"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 1, currentYear]
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]

const SUBJECTS = [
  { label: "hometown", value: "hometown", color: "#2563eb" },
  { label: "morgan",   value: "morgan",   color: "#16a34a" },
  { label: "decaf",    value: "decaf",    color: "#ea580c" },
]

// 온도/습도를 제외한 나머지 수치 지표
const OVERLAY_METRICS = [
  { key: "머신 물온도(Temp.)", label: "물온도", color: "#f59e0b" },
  { key: "분쇄도(grind size)",  label: "분쇄도", color: "#8b5cf6" },
  { key: "Dose in",             label: "Dose in", color: "#06b6d4" },
  { key: "Out time(sec)",       label: "추출시간", color: "#ec4899" },
  { key: "Out",                 label: "Out",    color: "#10b981" },
  { key: "향미 CVA 정동평가",   label: "향미평가", color: "#f97316" },
  { key: "단맛",  label: "단맛",  color: "#84cc16" },
  { key: "쓴맛",  label: "쓴맛",  color: "#6366f1" },
  { key: "신맛",  label: "신맛",  color: "#14b8a6" },
  { key: "무게감", label: "무게감", color: "#a855f7" },
  { key: "질감 (좋음이 5)", label: "질감", color: "#0ea5e9" },
]

type Point = { date: string; 온도?: number; 습도?: number; [k: string]: string | number | undefined }

function lastDay(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function toNum(v: unknown): number | undefined {
  if (v === undefined || v === "" || typeof v === "boolean") return undefined
  const n = Number(v)
  return isNaN(n) ? undefined : n
}

export function GraphView({ position }: { position: string }) {
  const now = new Date()
  const [startYear, setStartYear] = useState(currentYear)
  const [startMonth, setStartMonth] = useState(1)
  const [endYear, setEndYear] = useState(currentYear)
  const [endMonth, setEndMonth] = useState(now.getMonth() + 1)
  const [applied, setApplied] = useState({
    start: `${currentYear}-01-01`,
    end: `${currentYear}-${String(now.getMonth()+1).padStart(2,"0")}-${String(lastDay(currentYear, now.getMonth()+1)).padStart(2,"0")}`,
  })

  const [activeSubjects, setActiveSubjects] = useState<string[]>(["hometown"])
  const [activeOverlays, setActiveOverlays] = useState<string[]>(["분쇄도(grind size)"])
  const [chartData, setChartData] = useState<Point[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      // 선택된 subject 모두 fetch
      const allPoints: Map<string, Point> = new Map()

      for (const subj of activeSubjects) {
        const { data } = await supabase
          .from("archive")
          .select("date, content")
          .eq("page", "espresso")
          .eq("position", position)
          .eq("subject", subj)
          .gte("date", applied.start)
          .lte("date", applied.end)
          .order("date", { ascending: true })
          .returns<Pick<IArchive, "date" | "content">[]>()

        for (const row of data ?? []) {
          const d = row.date?.slice(5) ?? ""
          if (!allPoints.has(d)) allPoints.set(d, { date: d })
          const pt = allPoints.get(d)!

          // 온도·습도는 subject 구분 없이 해당 날짜 최신값으로 덮어씀
          pt["온도"] = toNum(row.content["온도"]) ?? pt["온도"]
          pt["습도"] = toNum(row.content["습도"]) ?? pt["습도"]

          // 오버레이 지표는 subject별로 키 분리
          for (const m of OVERLAY_METRICS) {
            const colKey = activeSubjects.length > 1 ? `${m.key}__${subj}` : m.key
            const v = toNum(row.content[m.key])
            if (v !== undefined) pt[colKey] = v
          }
        }
      }

      setChartData(Array.from(allPoints.values()).sort((a, b) => a.date.localeCompare(b.date)))
    } finally {
      setLoading(false)
    }
  }, [position, applied, activeSubjects])

  useEffect(() => { fetchData() }, [fetchData])

  const handleApply = () => setApplied({
    start: `${startYear}-${String(startMonth).padStart(2,"0")}-01`,
    end: `${endYear}-${String(endMonth).padStart(2,"0")}-${String(lastDay(endYear, endMonth)).padStart(2,"0")}`,
  })

  const toggle = <T,>(set: T[], val: T) =>
    set.includes(val) ? set.filter(s => s !== val) : [...set, val]

  return (
    <div className="space-y-5">
      {/* 날짜 범위 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={String(startYear)} onValueChange={v => setStartYear(Number(v))}>
          <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}년</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(startMonth)} onValueChange={v => setStartMonth(Number(v))}>
          <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map((m,i) => <SelectItem key={i+1} value={String(i+1)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-sm">~</span>
        <Select value={String(endYear)} onValueChange={v => setEndYear(Number(v))}>
          <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}년</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(endMonth)} onValueChange={v => setEndMonth(Number(v))}>
          <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map((m,i) => <SelectItem key={i+1} value={String(i+1)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="sm" onClick={handleApply}>조회</Button>
      </div>

      {/* 원두 선택 */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">원두</p>
        <div className="flex gap-2">
          {SUBJECTS.map(s => (
            <button
              key={s.value}
              onClick={() => setActiveSubjects(prev => toggle(prev, s.value))}
              className="px-3 py-1 rounded-full text-sm border transition-colors"
              style={activeSubjects.includes(s.value)
                ? { backgroundColor: s.color, borderColor: s.color, color: "#fff" }
                : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
              }
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* 오버레이 지표 선택 */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">함께 볼 지표 (선 그래프 · 우측 Y축)</p>
        <div className="flex gap-2 flex-wrap">
          {OVERLAY_METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setActiveOverlays(prev => toggle(prev, m.key))}
              className="px-2.5 py-1 rounded text-xs border transition-colors"
              style={activeOverlays.includes(m.key)
                ? { backgroundColor: m.color, borderColor: m.color, color: "#fff" }
                : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
              }
            >{m.label}</button>
          ))}
        </div>
      </div>

      {/* 범례 설명 */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-300" /> 온도 (막대 · 좌축)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-300" /> 습도 (막대 · 좌축)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-purple-400" /> 선택 지표 (선 · 우축)
        </span>
      </div>

      {/* 차트 */}
      {loading ? (
        <div className="h-[380px] flex items-center justify-center text-muted-foreground">로딩 중...</div>
      ) : chartData.length === 0 ? (
        <div className="h-[380px] flex items-center justify-center text-muted-foreground">데이터가 없습니다</div>
      ) : (
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />

            {/* 좌측 Y축: 온도·습도 */}
            <YAxis
              yAxisId="env"
              orientation="left"
              tick={{ fontSize: 11 }}
              domain={[0, 100]}
              label={{ value: "온도/습도", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af" }}
            />
            {/* 우측 Y축: 오버레이 지표 */}
            <YAxis
              yAxisId="metric"
              orientation="right"
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
              label={{ value: "지표값", angle: 90, position: "insideRight", fontSize: 10, fill: "#9ca3af" }}
            />

            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={(value, name) => [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            {/* 온도·습도 막대 */}
            <Bar yAxisId="env" dataKey="온도" name="온도(°C)" fill="#fca5a5" opacity={0.7} barSize={14} />
            <Bar yAxisId="env" dataKey="습도" name="습도(%)"  fill="#93c5fd" opacity={0.7} barSize={14} />

            {/* 선택한 오버레이 지표 선 */}
            {OVERLAY_METRICS.filter(m => activeOverlays.includes(m.key)).flatMap(m =>
              activeSubjects.length > 1
                ? activeSubjects.map(subj => {
                    const s = SUBJECTS.find(s => s.value === subj)!
                    return (
                      <Line
                        key={`${m.key}__${subj}`}
                        yAxisId="metric"
                        type="monotone"
                        dataKey={`${m.key}__${subj}`}
                        name={`${m.label}(${subj})`}
                        stroke={m.color}
                        strokeWidth={2}
                        strokeDasharray={subj === "morgan" ? "5 3" : subj === "decaf" ? "2 2" : undefined}
                        dot={{ r: 3, fill: m.color }}
                        connectNulls={false}
                      />
                    )
                  })
                : [
                    <Line
                      key={m.key}
                      yAxisId="metric"
                      type="monotone"
                      dataKey={m.key}
                      name={m.label}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={{ r: 3, fill: m.color }}
                      connectNulls={false}
                    />
                  ]
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
