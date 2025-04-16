'use client'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Cart, Order, Sale } from "@/interface/business"
import React, { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import SectionTitle from "@/components/root/SectionTitle"
import { Input } from "@/components/ui/input"
import ShipmentDatePicker from "./shipment-date"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { makeYYYYMMDD } from "@/lib/utils"


const OrderTable = ({ products }: { products: Sale[] }) => {
  const init = products.reduce<Cart[]>((cur, p) => {
    cur.push({ count: 0, price: p.price ?? p.product.price_sale, product: p })
    return cur
  }, [])
  const [items, setItems] = useState<Cart[]>(init)
  const totalPrice = items.filter(item => item.count).reduce((cur, item) => cur + item.price * item.count, 0)
  const handleCount = (id: number, oper: number) => {
    setItems(items.map(item => item.product.id === id ? { ...item, count: item.count + oper } : item))
  }
  const [open, onOpenChange] = useState(false)

  const [date, setDate] = useState<Date | null>(null)
  const [memo, setMemo] = useState<string>('')
  const handleOrder = async () => {
    if (totalPrice === 0) return
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    const order = {
      status: '주문신청',
      name: '',
      price: totalPrice,
      products: items,
      user_id: user.user?.id!,
      invoice: null,
      delivery: null,
      start_date: date ? makeYYYYMMDD(date) : null,
      shop_id: 1,
      memo
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/order`, {
      method: 'POST',
      body: JSON.stringify(order)
    }).then(res => {
      toast({
        title: '주문이 되었습니다.'
      })
      onOpenChange(false)
    }).catch(error => toast({
      title: '주문에 실패했습니다.',
      description: error
    }))
  }

  return (
    <div className='w-full h-[90vh] flex flex-col justify-between'>
      <div className="">
        <SectionTitle>
          <div className="flex justify-between">
            신규 주문
          </div>
        </SectionTitle>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="">주문 가능 상품</TableHead>
              <TableHead className="w-[200px]">가격</TableHead>
              <TableHead className="w-[200px]">수량</TableHead>
              <TableHead className="w-[200px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.product.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => {
                      if (item.count > 0)
                        handleCount(item.product.id, -1)
                    }
                    }>-</button>
                    {item.count}
                    <button onClick={() => handleCount(item.product.id, 1)}>+</button>
                  </div>
                </TableCell>
                <TableCell>{item.count * item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="flex justify-between items-center gap-16 text-base">
          <div className="w-100 flex gap-8 items-center">
            <Label htmlFor="memo">배송 메모</Label>
            <Input value={memo} onChange={e => setMemo(e.target.value)} id="memo" className="w-400" />
          </div>
          <ShipmentDatePicker date={date} setDate={setDate} />
          <div>
            <div>Total {totalPrice}원</div>
          </div>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild><Button>주문하기</Button></DialogTrigger>
            <DialogContent className="w-80">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  <span>
                    {items.filter(item => item.count).map(item =>
                      <span key={item.product.id} className="flex justify-between">
                        <span>{item.product.product.name}</span>
                        <span>{item.count}개 {item.price}원</span>
                        <span>{item.count * item.price}개 </span>
                      </span>
                    )}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" onClick={() => handleOrder()}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default OrderTable