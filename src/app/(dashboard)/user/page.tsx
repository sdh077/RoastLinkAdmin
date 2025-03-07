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
import Link from 'next/link'

const getUsers = async (pageNo: string = '1') => {
  const supabase = await createClient()
  const page = Number(pageNo)
  return await supabase.from('custom')
    .select('*, shop_custom(*)', { count: 'estimated' })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .returns<{ id: number, name: string, email: string, address: string }[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { pageNo } = await searchParams
  const { data: users, count } = await getUsers(pageNo as string)
  console.log(users)
  if (!users) return <></>
  return (
    <>
      <div>
        <Heading>업체 관리 페이지</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >업체명</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>설정</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell><Link href={`/user/${user.id}`}>선택</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between container'>
        <div />
        <CustomPagination total={Math.ceil((count ?? users.length) / PAGE_SIZE)} />
        <div>
          <Link href={'/user/create'}>
            <Button>업체 추가</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default page
