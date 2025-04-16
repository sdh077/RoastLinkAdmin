
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/server"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmModal } from "./modal"
import { OrderCustom } from "@/interface/business"
import Heading from "@/components/heading"
import Image from "next/image"


const getOrders = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  let q = supabase.from('custom_order').select('*, custom(*)').eq('status', '배송중')
  return await q.eq('user_id', user.user?.id).order('created_at', { ascending: false }).returns<OrderCustom[]>()
}

export default async function Page() {
  const { data: confirms } = await getOrders()
  return (
    <div>
      <div className='flex justify-between'>
        <Heading>배송 확인</Heading>
      </div>
      <div className="flex flex-col gap-16">
        {confirms && confirms.map((order) => (
          <ItemCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

function ItemCard({ order }: { order: OrderCustom }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{order.created_at?.slice(0, 10)}{order.name}</CardTitle>
            <CardDescription>송장번호 - {order.invoice}</CardDescription>
          </div>
          <ConfirmModal order={order} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              {order.products.map(product =>
                <div key={product.product.id} className="flex gap-8">
                  <Image src={product.product.product.img} width={100} height={100} alt="item" />
                  <div>
                    <div>{product.product.product.name}</div>
                    <div>{product.price}원</div>
                    <div>{product.count}개</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
      </CardFooter>
    </Card>
  )
}
