import Heading from '@/components/heading';
import CustomPagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PAGE_SIZE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';
import React from 'react'

export type Product = {
  id: number
  created_at: string;
  name: string;
  eng_name: string;
  roasting: string;
  green: string;
  description: string;
  flavor: string;
  content: string;
  shipping_id: string;
  category_id: string;
  img: string;
  type: string;
  price: number;
  is_delete: boolean
}

const getProduct = async (page: string = '1') => {
  const pageNo = Number(page);
  const supabase = await createClient()
  return await supabase.from('goods').select('id, name, description,price,is_delete', { count: 'estimated' })
    .range((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE - 1)
    .returns<Product[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { pageNo } = await searchParams
  const { data: products, count } = await getProduct(pageNo as string)
  if (!products?.length) return <></>
  return (
    <>
      <div>
        <Heading>상품 페이지</Heading>
        <Table className='h-full'>
          <TableHeader>
            <TableRow>
              <TableHead >Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>status</TableHead>
              <TableHead>상태변경</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.is_delete ? '판매중지' : '판매중'}</TableCell>
                <TableCell><Link href={`/dashboard/product/${product.id}`}><Button>수정</Button></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between container'>
        <div />
        <CustomPagination total={Math.ceil((count ?? products.length) / PAGE_SIZE)} />
        <div>
          <Button>상품 추가</Button>
        </div>
      </div>
    </>
  )
}

export default page