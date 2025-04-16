'use client'
import * as React from "react"

import { cn, updateStatus } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OrderCustom } from "@/interface/business"
import { useRouter } from "next/navigation"

export function ConfirmModal({ order }: { order: OrderCustom }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const confirmOrder = () => {
    updateStatus(order.id, { status: '배송완료' })
    setOpen(false)
    router.refresh()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">배송 완료 처리</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] h-[20vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>배송 완료 처리</DialogTitle>
          <DialogDescription>
            {/* {order.invoice}  */}
            {order.products.map(p => p.product.product.name + ' ' + p.product.product.price).join(' // ')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter onClick={confirmOrder}>
          <Button>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}