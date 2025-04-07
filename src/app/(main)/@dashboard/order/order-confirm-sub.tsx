'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { orderSubSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ICategory, IProduct } from '@/interface/product'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { OrderSub } from '@/interface/business'

function OrderConfirmSub({ sub }: { sub: OrderSub }) {
  const router = useRouter()
  const form = useForm<z.infer<typeof orderSubSchema>>({
    resolver: zodResolver(orderSubSchema),
    defaultValues: {
      ...sub,
    }
  })

  const onSubmit = async (values: z.infer<typeof orderSubSchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('custom_order_sub')
      .update({ ...values })
      .eq('id', sub.id)
      .select()
    if (!error) {
      toast({
        title: '수정 완료',
      })
      router.refresh()
    }
    else {
      console.log(error)
      toast({
        title: error.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-end gap-4'>
        <div className="grid grid-cols-3 gap-4 items-end">
          <FormField
            control={form.control}
            name={"box"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  박스 수량
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type='number'
                    placeholder='박스 개수를 적어주세요'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="box_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>박스 타입</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="타입 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'극소'}>극소</SelectItem>
                    <SelectItem value={'소'}>소</SelectItem>
                    <SelectItem value={'중'}>중</SelectItem>
                    <SelectItem value={'대'}>대</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"box_items"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  내품수량
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder='박스 한개에 몇개가 들어가는지 적어주세요'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"fare"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  운임비
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type='number'
                    placeholder='운임비를 적어주세요'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"fare_add"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  추가 운임비
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type='number'
                    placeholder='추가 운임비를 적어주세요'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fare_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>운임 구분</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="운임 구분" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'선불'}>선불</SelectItem>
                    <SelectItem value={'후불'}>후불</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className='book-form_btn text-white'>
          상품 수정
        </Button>
      </form>
    </Form>
  )
}

export default OrderConfirmSub