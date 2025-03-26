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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cancelStatusType, statusType } from "@/lib/constants"

export function SelectStatus({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus] = React.useState(order.status)
  const update = async () => {
    const { result, error } = await updateStatus(order.id, { status })
    if (error) toast({ title: error.message })
    else {
      toast({ title: '변경되었습니다' })
      router.refresh()
    }
  }
  return (
    <div className="flex gap-2">
      <Select value={status} onValueChange={e => setStatus(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>주문 상태 변경</SelectLabel>
            {statusType.map(type =>
              <SelectItem key={type} value={type}>{type}</SelectItem>
            )}
            {cancelStatusType.map(type =>
              <SelectItem key={type} value={type}>{type}</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={update}>변경</Button>
    </div>
  )
}

export function WholeDetail({
  order,
}: {
  order: OrderCustom
}) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">상세정보</Button>
      </DrawerTrigger>
      <DrawerContent className="inset-y-0">
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
              <div>
                {order.custom_order_sub.map((sub) =>
                  <div key={sub.id}>송장번호: {sub.invoice || '미입력'} - {sub.box}박스</div>
                )}
              </div>
              <hr className="my-8" />
              <SelectStatus order={order} />
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