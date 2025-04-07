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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BookForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      use_yn: true,
      eng_title: '',
      display: 'both'
    }
  })

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const supabase = await createClient()
    const session = await supabase.auth.getSession()
    if (!session.data.session?.user.id) {
      return
    }
    const { error } = await supabase
      .from('category')
      .insert({
        ...values,
        user_id: session.data.session?.user.id
      }
      )
      .select()
    if (!error) router.push('/category')
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

        <div>
          <FormField
            control={form.control}
            name="display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>타겟</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="타입 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="www">웹</SelectItem>
                    <SelectItem value="business">비즈니스</SelectItem>
                    <SelectItem value="both">둘다</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className='book-form_btn text-white'>
          카테고리 추가
        </Button>
      </form>
    </Form>
  )
}

export default BookForm