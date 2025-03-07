import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import { ContactDetail } from '../contact-detail'
import { WholeDetail } from './whole-detail'
import Heading from '@/components/heading'
import { StatusFilter } from '@/components/status-filter'
import { statusType } from '@/lib/constants'
import { OrderCustom } from '@/interface/business'
import WholesaleList from './wholesale-list'
import OrderApplication from './order-application'
import OrderConfirm from './order-confirm'
import { cookies } from "next/headers";
import { getUserFromToken } from '@/lib/utils'

const getOrders = async (status: string) => {
  const token = (await cookies()).get("token")?.value;
  const shop = await getUserFromToken(token)

  const supabase = await createClient()
  let q = supabase.from('custom_order').select('*, custom(*)')
  if (status && status !== '0') q = q.eq('status', statusType[Number(status)])
  else q = q.in('status', statusType)
  return await q.eq('shop_id', shop.id).order('created_at', { ascending: false }).returns<OrderCustom[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { status } = await searchParams
  const { data: orders, error } = await getOrders(status as string)
  console.log(orders)
  return (
    <div>
      <div className='flex justify-between'>
        <Heading>{status ? statusType[Number(status)] : '전체 주문'}</Heading>
        <StatusFilter statusType={statusType} />
      </div>
      {orders &&
        <div>
          {(status === '0' || !status) && <WholesaleList orders={orders} />}
          {status === '1' && <OrderApplication orders={orders} />}
          {status === '2' && <OrderConfirm orders={orders} />}
          {status === '3' && <WholesaleList orders={orders} />}
          {status === '4' && <WholesaleList orders={orders} />}
        </div>
      }
    </div>
  )
}

export default page