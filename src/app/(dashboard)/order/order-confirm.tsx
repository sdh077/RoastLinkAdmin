'use client'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import React, { useState } from 'react'
import { WholeDetail } from './whole-detail'
import { OrderCustom } from '@/interface/business'
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



const OrderConfirm = ({
  orders,
}: {
  orders: OrderCustom[]
}) => {
  const [selects, setSelects] = useState<OrderCustom[]>([])
  const handleSelects = (order: OrderCustom) => {
    const newSelects = selects.map(select => select.id).includes(order.id) ? selects.filter(select => select.id !== order.id) : [...selects, order]
    setSelects(newSelects)
  }

  return (
    <div className='my-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>선택</TableHead>
            <TableHead>주문번호</TableHead>
            <TableHead>주문일</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>박스 수</TableHead>
            <TableHead>송장번호</TableHead>
            <TableHead>선택</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox checked={selects.map(select => select.id).includes(order.id)}
                  onCheckedChange={() => handleSelects(order)} /></TableCell>
              <TableCell>{getOrderNumber(order)}</TableCell>
              <TableCell>{order.created_at?.slice(0, 10)}</TableCell>
              <TableCell>[{order.custom.name}] {order.name}</TableCell>
              <TableCell><OrderBoxInput id={order.id} box={order.box} /></TableCell>
              <TableCell><InvoiceInput id={order.id} /></TableCell>
              <TableCell>
                <WholeDetail order={order} />
                {/* <Link href={`/dashboard/contact/${contact.id}`}><BiRightArrow /></Link> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-end'><ExcelModal orders={selects} /></div>
    </div>
  )
}
function OrderBoxInput({ id, box }: { id: number, box: number }) {
  const [value, setValue] = useState(box)
  const router = useRouter()
  const handleValue = (i: number) => {
    if (i < 1) return
    setValue(i)
  }
  const updateBox = async () => {
    const { result, error } = await updateStatus(id, { box: value })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
  }
  return (
    <div className='flex gap-4'>

      <Input value={value} onChange={e => handleValue(Number(e.target.value))} className='w-12' type='number' />
      <Button variant={'outline'} onClick={updateBox}>수정</Button>
    </div>
  )
}
export function InvoiceInput({ id }: { id: number }) {
  const router = useRouter()
  const [open, onOpenChange] = useState(false)
  const [invoice, setInvoice] = useState('')

  const update = async () => {
    const { result, error } = await updateStatus(id, { status: '배송중', invoice })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      onOpenChange(false)
      router.refresh()
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">송장번호 입력</Button>
      </DialogTrigger>
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
              value={invoice}
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