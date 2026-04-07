'use client'
import { useState } from 'react'
import { IArchive } from '@/interface/archive'

const LABEL_MAP: Record<string, string> = {
  '온도': '온도 (°C)',
  '습도': '습도 (%)',
  '머신 물온도(Temp.)': '물온도 (°C)',
  '분쇄도(grind size)': '분쇄도',
  '프리인퓨전 여부': '프리인퓨전',
  'Dose in': 'Dose in (g)',
  'Out time(sec)': '추출 시간 (sec)',
  'Out': 'Out (g)',
  '머신압력': '머신압력 (bar)',
  '향미 CVA 정동평가': '향미 평가',
  '단맛': '단맛',
  '쓴맛': '쓴맛',
  '신맛': '신맛',
  '짠맛': '짠맛',
  '무게감': '무게감',
  '질감 (좋음이 5)': '질감',
  '그라인더': '그라인더',
}

const HIGHLIGHT_KEYS = ['분쇄도(grind size)', 'Dose in', 'Out time(sec)', 'Out', '머신 물온도(Temp.)']
const TASTE_KEYS = ['향미 CVA 정동평가', '단맛', '쓴맛', '신맛', '짠맛', '무게감', '질감 (좋음이 5)']

export function BeanCardPublic({ subject, archive }: {
  subject: string
  archive: IArchive | null
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm">
      <button
        className="w-full text-left p-5 flex justify-between items-center hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div>
          <div className="font-semibold text-lg capitalize">{subject}</div>
          {archive ? (
            <div className="text-sm text-muted-foreground mt-0.5">
              {archive.roasting_date && <>로스팅 {archive.roasting_date} · </>}
              {archive.date?.slice(0, 10)} 기록
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mt-0.5">기록 없음</div>
          )}
        </div>
        <span className="text-muted-foreground text-lg">{open ? '↑' : '↓'}</span>
      </button>

      {open && archive && (
        <div className="px-5 pb-5 space-y-4 border-t pt-4">
          {/* 하이라이트 수치 */}
          <div className="grid grid-cols-3 gap-3">
            {HIGHLIGHT_KEYS.map(key => archive.content[key] !== undefined && (
              <div key={key} className="bg-muted rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">{LABEL_MAP[key] ?? key}</div>
                <div className="font-bold text-base">{String(archive.content[key])}</div>
              </div>
            ))}
          </div>

          {/* 기타 정보 */}
          <div className="space-y-1.5 text-sm">
            {Object.entries(archive.content)
              .filter(([key]) => !HIGHLIGHT_KEYS.includes(key) && !TASTE_KEYS.includes(key) && key !== '메모')
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{LABEL_MAP[key] ?? key}</span>
                  <span className="font-medium">
                    {typeof value === 'boolean' ? (value ? '사용' : '미사용') : String(value)}
                  </span>
                </div>
              ))}
          </div>

          {/* 맛 평가 */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">맛 평가</div>
            <div className="grid grid-cols-3 gap-2">
              {TASTE_KEYS.map(key => archive.content[key] !== undefined && (
                <div key={key} className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground">{LABEL_MAP[key] ?? key}</div>
                  <div className="font-semibold">{String(archive.content[key])}</div>
                </div>
              ))}
            </div>
          </div>

          {archive.content['메모'] && (
            <div className="text-sm text-muted-foreground border-t pt-3">
              메모: {archive.content['메모']}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-right">
            {archive.time && `${archive.time} · `}
            {archive.name || archive.shop_user?.name}
          </div>
        </div>
      )}
    </div>
  )
}
