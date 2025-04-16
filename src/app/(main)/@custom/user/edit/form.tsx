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
import { userSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { toastResult } from '@/lib/utils'
import { ICustom } from '@/interface/custom'

const UserEditForm = ({ user }: { user: ICustom }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: user
  })

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    const supabase = await createClient()
    const session = await supabase.auth.getUser()
    const { name, address, business_number, business_user, tel } = values
    const { data, error } = await supabase.from('custom')
      .update({
        name, address, business_number, business_user, tel
      })
      .eq('id', session.data.user?.id)
    toastResult(error, '변경 되었습니다.', '변경에 실패하였습니다')
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
                상호명
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  required
                  placeholder='상호명'
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
          name={"address"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                가게 주소
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  required
                  placeholder='서울시...'
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
          name={"business_number"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                사업자 번호
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  required
                  placeholder='사업자 번호'
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
          name={"business_user"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                사업자 명
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  required
                  placeholder='사업자 명'
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
          name={"tel"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                연락처
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  required
                  placeholder='010-1234-1234'
                  {...field}
                  className='book-form_input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className='book-form_btn text-white'>
          저장
        </Button>
      </form>
    </Form>
  )
}

export default UserEditForm