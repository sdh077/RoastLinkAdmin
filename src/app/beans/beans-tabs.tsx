'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { IArchive } from '@/interface/archive'

const SUBJECTS = ['morgan', 'hometown', 'decaf'] as const
type Subject = typeof SUBJECTS[number]

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

export function BeansTabs({ latestBySubject }: {
  latestBySubject: Record<Subject, IArchive | null>
}) {
  return (
    <Tabs defaultValue="morgan" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {SUBJECTS.map(s => (
          <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
        ))}
      </TabsList>

      {SUBJECTS.map(subject => {
        const archive = latestBySubject[subject]
        return (
          <TabsContent key={subject} value={subject}>
            {!archive ? (
              <div className="text-center text-muted-foreground py-12">기록이 없습니다</div>
            ) : (
              <div className="border rounded-2xl p-5 space-y-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg capitalize">{subject}</div>
                    {archive.roasting_date && (
                      <div className="text-sm text-muted-foreground">로스팅 {archive.roasting_date}</div>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{archive.date?.slice(0, 10)}</div>
                    <div>{archive.time && `${archive.time} · `}{archive.name || archive.shop_user?.name}</div>
                  </div>
                </div>

                {/* 핵심 수치 */}
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
                  <div className="grid grid-cols-4 gap-2">
                    {TASTE_KEYS.map(key => archive.content[key] !== undefined && (
                      <div key={key} className="flex flex-col items-center bg-muted rounded-lg p-2">
                        <div className="text-xs text-muted-foreground text-center">{LABEL_MAP[key] ?? key}</div>
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
              </div>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
