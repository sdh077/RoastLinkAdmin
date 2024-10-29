import { createClient } from '@/lib/supabase/server'
import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PAGE_SIZE } from '@/lib/constants'
import CustomPagination from '@/components/Pagination'
import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'

const getUsers = async (pageNo: string = '1') => {
  const supabase = await createClient()
  const page = Number(pageNo)
  return await supabase.from('contact_business')
    .select('*', { count: 'estimated' })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .returns<{ id: number, name: string, phone: string, description: string, purpose: 'sample' | 'tasting', shop: string, shop_no: string, address: string }[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { pageNo } = await searchParams
  const { data: users, count } = await getUsers(pageNo as string)
  if (!users) return <></>
  return (
    <>
      <div>
        <Heading>신청 페이지</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >이름</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>사업자</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>목적</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.shop}</TableCell>
                <TableCell>{user.shop_no}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between container'>
        <div />
        <CustomPagination total={Math.ceil((count ?? users.length) / PAGE_SIZE)} />
        <div>
          <Button>업체 추가</Button>
        </div>
      </div>
    </>
  )
}

export default page
