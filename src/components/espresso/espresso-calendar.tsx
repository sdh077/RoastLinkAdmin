"use client"

import { CalendarIcon } from "lucide-react"
import { cn, makeYYYYMMDD } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { useRouterPush } from "@/hooks/use-create-query-string"

export function EspressoCalendar({ date, setDate }: { date?: Date | null, setDate?: React.Dispatch<React.SetStateAction<Date | null>> }) {
  const [_d, _setD] = useState<Date | undefined>(undefined)
  const _date = date ?? _d
  const _setDate = setDate ?? _setD
  const pushPathname = useRouterPush()
  const handleDate = (value: Date | undefined) => {
    if (!value) return
    if (!date) pushPathname('date', makeYYYYMMDD(value))
    _setDate(value)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] md:w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? makeYYYYMMDD(date) : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={_date}
          onSelect={value => handleDate(value)}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
