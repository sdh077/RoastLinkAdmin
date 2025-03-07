"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Contact } from "@/interface/contact"
import { createClient } from "@/lib/supabase/client"
import { Custom, Order, OrderCustom } from "@/interface/business"
import { updateStatus } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


export function WholeDetail({
  order,
}: {
  order: OrderCustom
}) {
  const router = useRouter()
  const update = async () => {
    const supabase = await createClient()
    const { result, error } = await updateStatus(order.id, { status: '주문취소' })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">상세정보</Button>
      </DrawerTrigger>
      <DrawerContent >
        {order && <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>[{order.status}] {order.custom.name} - {order.name}</DrawerTitle>
          </DrawerHeader>
          <div className="relative z-20 py-4 lg:py-8">
            <div className="px-8">
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                주소  {order.custom.address}
              </p>
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                금액 {order.price}
              </p>
              <div>
                {order.products.map((product, idx) =>
                  <div key={`product${idx}`}>{product.product.product.name} - {product.count}</div>
                )}
              </div>
              <hr className="my-8" />
              <Button onClick={update}>주문 취소</Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">닫기</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
        }
      </DrawerContent>
    </Drawer>
  )
}