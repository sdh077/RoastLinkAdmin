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
  return await supabase.from('profile')
    .select('*', { count: 'estimated' })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .returns<{ id: number, name: string, email: string }[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { pageNo } = await searchParams
  const { data: users, count } = await getUsers(pageNo as string)
  if (!users) return <></>
  return (
    <>
      <div>
        <Heading>업체 관리 페이지</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
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
