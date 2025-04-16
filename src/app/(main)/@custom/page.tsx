import SectionTitle from '@/components/root/SectionTitle'
import { Button } from '@/components/ui/button'
import { Custom, Order, OrderShop } from '@/interface/business'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getOrderNumber } from '@/lib/utils'

const getOrder = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase
    .from('custom_order')
    .select('*, shop(*)')
    .eq('user_id', user.user?.id)
    .order('created_at', { ascending: false })
    .returns<OrderShop[]>()
}
const OrderCard = ({ order }: { order: OrderShop }) => {
  console.log(order)
  return (
    <div>
      {order.created_at.slice(0, 10)}
      <Card className="flex w-full">
        <CardHeader className='w-[80%]'>
          <CardTitle className='border-b-[2px] py-2 text-2xl'>{order.status}</CardTitle>
          <div className='flex flex-col gap-4 mt-2'>
            <div>
              {order.products.map(product =>
                <div key={product.product.id}>
                  {product.product.product.name} / {product.count}개
                </div>
              )}
            </div>
            <div className='flex gap-2'>
              <span className='text-lg font-semibold'>{order.price}원</span>
              <span>/</span>
              <span className='text-muted-foreground'>주문번호 {getOrderNumber(order)}</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 justify-center">
          <div>{order.shop.name}</div>
          <Button>문의하기</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
const Page = async () => {
  const { data, error } = await getOrder()
  return (
    <div>
      <SectionTitle>
        <div className='flex justify-between'>
          주문내역
        </div>
      </SectionTitle>
      <div className='my-8 flex flex-col gap-8'>
        {data && data.map(order =>
          <OrderCard order={order} key={order.id} />
        )}
      </div>

    </div>
  )
}

export default Page