import Heading from "@/components/heading"
import { OrderCustom } from "@/interface/business"
import { cancelStatusType } from "@/lib/constants"
import { createClient } from "@/lib/supabase/server"
import WholesaleList from "./wholesale-list"
import { StatusFilter } from "@/components/status-filter"

const getOrders = async (status: string) => {
  const supabase = await createClient()
  let q = supabase.from('custom_order').select('*, custom(*), custom_order_sub(*)')
  if (status && status !== '0') q = q.eq('status', cancelStatusType[Number(status)])
  else q = q.in('status', cancelStatusType)
  return await q
    .order('created_at', { ascending: false })
    .order('id', { ascending: false, referencedTable: 'custom_order_sub', })
    .returns<OrderCustom[]>()
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { } = await params
  const { status } = await searchParams
  const { data: orders } = await getOrders(status as string)
  return (
    <div>
      <div className='flex justify-between'>
        <Heading>{status ? cancelStatusType[Number(status)] : '전체 취소 주문'}</Heading>
        <StatusFilter statusType={cancelStatusType} />
      </div>
      {orders &&
        <div>
          {(status === '0' || !status) && <WholesaleList orders={orders} />}
        </div>
      }
    </div>
  )
}