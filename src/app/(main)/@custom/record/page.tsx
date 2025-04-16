import { createClient } from "@/lib/supabase/server"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EstimateModal } from "./modal"
import { OrderCustom } from "@/interface/business"
import Heading from "@/components/heading"
import { StatusFilter } from "@/components/main/status-filter"
import { cancelStatusType, statusType } from "@/lib/constants"
import { DeliveryModal } from "@/components/main/delivery-modal"
import { Button } from "@/components/ui/button"
import CustomPagination from "@/components/Pagination"

const statusList = [...statusType, ...cancelStatusType]

const getOrders = async (status: string) => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  let q = supabase.from('custom_order').select('*, custom(*)', { count: 'estimated' })
  if (status && status !== '0') q = q.eq('status', statusList[Number(status)])
  else q = q.in('status', statusList)
  return await q.eq('user_id', user.user?.id).order('created_at', { ascending: false }).returns<OrderCustom[]>()
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { status } = await searchParams
  const { data: invoices, count } = await getOrders(status as string)
  return (
    <div>
      <div className='flex justify-between'>
        <Heading>{status ? statusList[Number(status)] : '전체 주문'}</Heading>
        <StatusFilter statusType={statusList} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>주문일</TableHead>
            <TableHead>희망출고일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>금액</TableHead>
            <TableHead>송장번호</TableHead>
            <TableHead>택배 위치 확인</TableHead>
            <TableHead>상세내용</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices && invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.created_at?.slice(0, 10)}</TableCell>
              <TableCell className="font-medium">{invoice.start_date?.slice(0, 10)}</TableCell>
              <TableCell className="font-medium">{invoice.status}</TableCell>
              <TableCell>{invoice.price}</TableCell>
              <TableCell>{invoice.invoice ?? ''}</TableCell>
              <TableCell>{invoice.invoice && <DeliveryModal invoice={invoice.invoice} />}</TableCell>
              <TableCell><EstimateModal invoice={invoice} /></TableCell>
              <TableCell>
                {invoice.status === '주문신청' && <Button>주문취소</Button>}
                {invoice.status === '배송중' && <Button>배송완료</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomPagination total={count ?? 0} />
    </div>
  )
}
