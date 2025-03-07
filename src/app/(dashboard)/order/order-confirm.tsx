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
import { updateStatus } from '@/lib/utils'
import ExcelInvoice from '@/components/excel-invoice'
import { ExcelModal } from './excel-modal'



const OrderConfirm = ({
  orders,
}: {
  orders: OrderCustom[]
}) => {

  return (
    <div className='my-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>주문번호</TableHead>
            <TableHead>주문일</TableHead>
            <TableHead>결제 금액</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>송장번호</TableHead>
            <TableHead>선택</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.created_at?.slice(0, 10).replaceAll('-', '') + order.id}</TableCell>
              <TableCell>{order.created_at?.slice(0, 10)}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>[{order.custom.name}] {order.name}</TableCell>
              <TableCell><InvoiceInput id={order.id} /></TableCell>
              <TableCell>
                <WholeDetail order={order} />
                {/* <Link href={`/dashboard/contact/${contact.id}`}><BiRightArrow /></Link> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-end'><ExcelModal orders={orders} /></div>
    </div>
  )
}

export function InvoiceInput({ id }: { id: number }) {
  const router = useRouter()
  const [open, onOpenChange] = useState(false)
  const [invoice, setInvoice] = useState('')

  const update = async () => {
    const supabase = await createClient()
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