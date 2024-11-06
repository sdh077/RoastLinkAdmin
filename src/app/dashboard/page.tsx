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
import { BiRightArrow } from 'react-icons/bi'
import Link from 'next/link'
import { Contact } from '@/interface/contact'
import { Badge } from '@/components/ui/badge'
import TableFilter from '@/components/table-filter'



const getContacts = async (pageNo: string = '1', q: string) => {
  const supabase = await createClient()
  const page = Number(pageNo)
  let query = supabase.from('contact_business')
    .select('*', { count: 'estimated' })
  if (q === '요청' || q === '완료')
    query = query.eq('status', q)

  return await query
    .order('id', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .returns<Contact[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { pageNo, q } = await searchParams
  const { data: contacts, count } = await getContacts(pageNo as string, q as string)
  if (!contacts) return <></>
  return (
    <>
      <div>
        <div className='flex justify-between'>
          <Heading>신청 페이지</Heading>
          <TableFilter />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상태</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>목적</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>메모</TableHead>
              <TableHead>선택</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.length && contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell><Badge variant={contact.status === '요청' ? 'default' : 'secondary'}>{contact.status}</Badge></TableCell>
                <TableCell>{contact.created_at?.slice(0, 10)}</TableCell>
                <TableCell>{contact.purpose === 'sample' ? '샘플요청' : '테이스팅'}</TableCell>
                <TableCell>[{contact.shop}] {contact.name}</TableCell>
                <TableCell>{contact.memo}</TableCell>
                <TableCell><Link href={`/dashboard/contact/${contact.id}`}><BiRightArrow /></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between container'>
        <CustomPagination total={Math.ceil((count ?? contacts.length) / PAGE_SIZE)} />

      </div>
    </>
  )
}

export default page
