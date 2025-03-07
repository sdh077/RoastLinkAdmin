'use client'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import React, { useState } from 'react'
import { WholeDetail } from './whole-detail'
import { OrderCustom } from '@/interface/business'
import { Checkbox } from '@/components/ui/checkbox'



const WholesaleList = ({
  orders,
}: {
  orders: OrderCustom[]
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>상태</TableHead>
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
            <TableCell><Badge variant={order.status === '요청' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
            <TableCell>{order.created_at?.slice(0, 10)}</TableCell>
            <TableCell>{order.price}</TableCell>
            <TableCell>[{order.custom.name}] {order.name}</TableCell>
            <TableCell>{order.invoice}</TableCell>
            <TableCell>
              <WholeDetail order={order} />
              {/* <Link href={`/dashboard/contact/${contact.id}`}><BiRightArrow /></Link> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default WholesaleList