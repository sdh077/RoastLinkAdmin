'use client'
import { Badge } from '@/components/ui/badge'
import React, { Fragment, useState } from 'react'
import { OrderCustom, OrderSub } from '@/interface/business'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Copy } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getOrderNumber, updateStatus } from '@/lib/utils'
import ExcelInvoice from '@/components/excel-invoice'
import { ExcelModal } from './excel-modal'
import { BsCheck } from 'react-icons/bs'
import OrderConfirmSub from './order-confirm-sub'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { WholeDetail } from '@/components/whole-detail'



const OrderConfirm = ({
  orders,
}: {
  orders: OrderCustom[]
}) => {
  const [selects, setSelects] = useState<OrderCustom[]>([])
  const [adding, setAdding] = useState(false)
  const router = useRouter()
  const handleSelects = (order: OrderCustom) => {
    const newSelects = selects.map(select => select.id).includes(order.id) ? selects.filter(select => select.id !== order.id) : [...selects, order]
    setSelects(newSelects)
  }
  const addSub = async (order: OrderCustom) => {
    if (adding) return
    setAdding(true)
    const supabase = await createClient()
    let { error } = await supabase
      .from('custom_order_sub')
      .insert({ custom_order_id: order.id })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
    setAdding(false)

  }

  const update = async (order: OrderCustom) => {
    const { result, error } = await updateStatus(order.id, { status: '주문취소' })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
  }
  return (
    <div className='my-4 space-y-4'>
      <div className='bg-white shadow rounded-xl p-4'>
        <div className='grid grid-cols-7 text-sm font-medium text-gray-600 border-b pb-2 mb-2'>
          <div>선택</div>
          <div>주문번호</div>
          <div>주문일</div>
          <div>이름</div>
          <div>선택</div>
          <div>박스 설정</div>
          <div></div>
        </div>

        {orders && orders.map((order) => (
          <Accordion type="single" collapsible key={order.id} className="space-y-2">
            <AccordionItem value={`order-${order.id}`}>
              <div className='grid grid-cols-7 items-center py-2 border-b border-gray-200'>
                <div>
                  <Checkbox
                    checked={selects.map(select => select.id).includes(order.id)}
                    onCheckedChange={() => handleSelects(order)}
                  />
                </div>
                <div>{getOrderNumber(order)}</div>
                <div>{order.created_at?.slice(0, 10)}</div>
                <div>[{order.custom.name}] {order.name}</div>
                <div>
                  <WholeDetail order={order} />
                </div>
                <div className='w-24'><AccordionTrigger>세부 사항 보기</AccordionTrigger></div>
                <div><Button onClick={() => update(order)}>배송완료 처리</Button></div>
              </div>


              <AccordionContent>
                {order.custom_order_sub.map(sub =>
                  <BoxInfo sub={sub} key={sub.id} />
                )}
                <div className="mt-2">
                  <Button onClick={() => addSub(order)}>박스 추가</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className='flex justify-end mt-4'>
        <ExcelModal orders={selects} />
      </div>
    </div>
  )
}

function BoxInfo({ sub }: { sub: OrderSub }) {
  return (
    <div className='flex items-start justify-between py-2 border-b border-gray-200'>
      <div><OrderConfirmSub sub={sub} /></div>
      <div><InvoiceInput id={sub.id} invoice={sub.invoice} /></div>
    </div>
  )
}

export function InvoiceInput({ id, invoice }: { id: number, invoice: string | undefined }) {
  const router = useRouter()
  const [open, onOpenChange] = useState(false)
  const [newInvoice, setInvoice] = useState(invoice!)

  const update = async () => {
    const { result, error } = await updateStatus(id, { invoice: newInvoice }, 'custom_order_sub')
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      onOpenChange(false)
      router.refresh()
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className='flex gap-2 items-center justify-end'>

        <DialogTrigger asChild>
          <Button variant="outline">{invoice ? `${invoice} - 송장번호 수정` : '송장번호 입력'}</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>송장번호를 입력해주세요</DialogTitle>
          <DialogDescription>
            입력시 자동으로 배송중으로 전환됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              송장번호
            </Label>
            <Input
              value={newInvoice}
              onChange={e => setInvoice(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={() => {
            update()
          }}>
            확인
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderConfirm