import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ICategory } from '@/interface/product';
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';
import React from 'react'
import UpdateUse from './update-use';



const getCategory = async () => {
  const supabase = await createClient()
  return await supabase.from('category').select('*', { count: 'estimated' })
    .returns<ICategory[]>()
}

const page = async () => {
  const { data: categorys } = await getCategory()
  if (!categorys?.length) return <></>
  return (
    <>
      <div>
        <Heading>카테고리 페이지</Heading>
        <Table className='h-full'>
          <TableHeader>
            <TableRow>
              <TableHead >Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>status</TableHead>
              <TableHead>노출영역</TableHead>
              <TableHead>상태변경</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorys.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.title}</TableCell>
                <TableCell>{category.eng_title}</TableCell>
                <TableCell><UpdateUse category={category} /></TableCell>
                <TableCell>{category.display}</TableCell>
                <TableCell><Link href={`/category/${category.id}`}><Button>수정</Button></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-end container'>
        <Link href={'/category/create'}>
          <Button>카테고리 추가</Button>
        </Link >
      </div>
    </>
  )
}

export default page