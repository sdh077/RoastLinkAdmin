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
import { customerSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

const BookForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: '',
      password: '',
      address: '',
      name: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    const supabase = await createClient()
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })
      if (error) {
        toast({
          title: '유저 추가에 실패했습니다',
          description: error.message
        })
        return
      }
      const { error: error2 } = await supabase.from('custom')
        .insert({
          id: data.user?.id,
          rank: 0,
          address: values.address,
          name: values.name
        })
      if (error2) {
        toast({
          title: '유저 추가에 실패했습니다',
          description: error2?.message
        })
        return
      }
      const session = await supabase.auth.getUser()
      const { error: error3 } = await supabase.from('shop_custom')
        .insert({
          shop_id: 1,
          custom_id: data.user?.id
        })

      if (error3) {
        toast({
          title: '유저 추가에 실패했습니다',
          description: error3?.message
        })
        return
      }
      toast({
        title: '유저가 생성되었습니다.',
      })
      router.push(`/user/${data.user?.id}`)
    } catch (error) {
      toast({
        title: '유저 추가에 실패했습니다',
        description: error as string
      })
    } finally {
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                이메일
              </FormLabel>
              <FormControl>
                <Input
                  type='email'
                  required
                  placeholder='이메일'
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
          name={"password"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                임시 비밀번호
              </FormLabel>
              <FormControl>
                <Input
                  type='password'
                  required
                  placeholder=''
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
          name={"name"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                상호명
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='가게 명을 적어주세요'
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
                주소
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='가게 주소를 적어주세요'
                  {...field}
                  className='book-form_input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='book-form_btn text-white'>
          유저 추가
        </Button>
      </form>
    </Form>
  )
}

export default BookForm