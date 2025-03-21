'use client'
import ExcelInvoice from "@/components/excel-invoice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { OrderCustom } from "@/interface/business"
import { IDepart } from "@/interface/depart"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import * as React from "react"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { getOrderNumber } from "@/lib/utils"


export function ExcelModal({
  orders,
}: {
  orders: OrderCustom[]
}) {
  const [departs, setDeparts] = useState<IDepart[]>([])
  const [date, setDate] = useState<Date | null>(null);
  const [choice, setChoice] = useState<number>(0)
  const depart = departs.find(d => d.id === choice)
  const departDate = date ? format(date, "yyyy-MM-dd") : "없음"
  useEffect(() => {
    const getDeparts = async () => {
      try {
        const response = await fetch("/api/depart");

        const data = await response.json();

        if (response.ok) {
          setDeparts(data)
        } else {
          toast({ title: '배송지가 없습니다' }); // 오류 메시지 표시
        }
      } catch (error) {
        console.error("서버 요청 오류:", error);
        toast({ title: "서버 오류 발생" });
      }
    }
    getDeparts()
  }, [])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">엑셀 다운로드</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              {orders.map(order =>
                <span key={order.id}>{getOrderNumber(order)} {order.box}개</span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <select value={choice} onChange={e => setChoice(Number(e.target.value))}>
          {departs.map(depart =>
            <option value={depart.id} key={depart.id}>{depart.name}</option>
          )}
        </select>
        <div className="p-4">
          <label>날짜 선택:</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd" // 출력 형식 지정
            className="border p-2"
          />
        </div>
        <DialogFooter>
          <ExcelInvoice orders={orders} depart={depart ?? departs[0]} disabled={choice !== 0} depart_dt={departDate} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
