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
import { updateStatus } from '@/lib/utils'



const OrderApplication = ({
  orders,
}: {
  orders: OrderCustom[]
}) => {
  const router = useRouter()
  const [selects, setSelects] = useState<number[]>([])
  const handleSelects = (id: number) => {
    const newSelects = selects.includes(id) ? selects.filter(select => select !== id) : [...selects, id]
    setSelects(newSelects)
  }

  const update = async () => {
    const supabase = await createClient()
    const { error } = await updateStatus(selects, { status: '주문확인' })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
  }

  return (
    <div className='my-4'>
      <div className='flex justify-end'>
        <Button onClick={update}>주문 확인</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>선택</TableHead>
            <TableHead>주문일</TableHead>
            <TableHead>결제 금액</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>선택</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox checked={selects.includes(order.id)}
                  onCheckedChange={() => handleSelects(order.id)} /></TableCell>
              <TableCell>{order.created_at?.slice(0, 10)}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>[{order.custom.name}] {order.name}</TableCell>
              <TableCell>
                <WholeDetail order={order} />
                {/* <Link href={`/dashboard/contact/${contact.id}`}><BiRightArrow /></Link> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrderApplication