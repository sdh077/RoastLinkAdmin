'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
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
import { Input } from "@/components/ui/input"
import { categorySchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import { ICategory } from '@/interface/product'

function EditForm({ category }: { category: ICategory }) {
  const router = useRouter()

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category.title,
      use_yn: category.use_yn,
      eng_title: category.eng_title,
      use_main: category.use_main,
    }
  })

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('goods_category')
      .update(values)
      .eq('id', category.id)
      .select()
    if (!error) router.push('/dashboard/category')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                카테고리 이름
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='카테고리 이름'
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
          name={"eng_title"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                영어 이름
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='카테고리 영어 이름'
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
          name={"use_yn"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                사용여부
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

        <Button type="submit" className='book-form_btn text-white'>
          카테고리 변경
        </Button>
      </form>
    </Form>
  )
}

export default EditForm