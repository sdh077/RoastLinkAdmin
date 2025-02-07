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
import { productSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ICategory, IProduct } from '@/interface/product'
import { Checkbox } from '@/components/ui/checkbox'

function EditForm({ product }: { product: IProduct }) {
  const router = useRouter()
  const [category, setCategory] = useState<ICategory[]>([])
  console.log(product)
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
      category_id: product.category_id.toString()
    }
  })
  useEffect(() => {
    const getCategory = async () => {
      const supabase = await createClient()
      const { data } = await supabase.from('goods_category').select('*', { count: 'estimated' })
        .returns<ICategory[]>()
      if (data)
        setCategory(data)
    }
    getCategory()
  }, [])

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('goods')
      .update({ ...values })
      .eq('id', product.id)
      .select()
    if (!error) router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                상품명
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='상품명'
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
          name={"eng_name"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                영어 이름
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='영어 이름'
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
          name={"description"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                description
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='description'
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
          name={"img"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                이미지 링크
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='이미지 링크'
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
          name={"content"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                링크
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='이미지 링크'
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
          name={"price"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                price
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  required
                  placeholder='price'
                  {...field}
                  value={field.value.toString()}
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                  className='book-form_input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"is_delete"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                노출금지
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="타입 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {category.map(item =>
                      <SelectItem key={`item${item.id}`} value={item.id.toString()}>{item.title}</SelectItem>
                    )}
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

export default EditForm