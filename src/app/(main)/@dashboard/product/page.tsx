import { CategoryMenu } from '@/components/category-menu';
import Heading from '@/components/heading';
import CustomPagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ICategory, IProduct } from '@/interface/product';
import { PAGE_SIZE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';
import React from 'react'

type Prop = ICategory & { product: IProduct[] }

const getProduct = async (page: string = '1') => {
  const supabase = await createClient()
  const session = await supabase.auth.getUser()
  return await supabase
    .from('category')
    .select('*, product(*)', { count: 'estimated' })
    .eq('user_id', session.data.user?.id)
    .returns<Prop[]>()
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { pageNo } = await searchParams
  const category = (await searchParams).category as string ?? '0'
  const { data: categories, count } = await getProduct(pageNo as string)
  return (
    <>
      <div>
        <div className='flex justify-between'>
          <Heading>상품 페이지</Heading>
          <CategoryMenu categories={categories ?? []} />
        </div>
        <Table className='h-full'>
          <TableHeader>
            <TableRow>
              <TableHead >Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>status</TableHead>
              <TableHead>상태변경</TableHead>
            </TableRow>
          </TableHeader>
          {categories && (categories?.length || category) && <TableBody>
            {categories[category as unknown as number]?.product.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.is_delete ? '판매중지' : '판매중'}</TableCell>
                <TableCell><Link href={`/product/${product.id}`}><Button>수정</Button></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>}
        </Table>
      </div>
      <div className='flex justify-end container'>
        <div>
          <Link href={'/product/create'}>
            <Button>상품 추가</Button>
          </Link>
        </div>
      </div>
    </>
  )
}


export default page