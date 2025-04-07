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
import { departSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie'
import { getUserFromToken } from '@/lib/utils'

const DepartForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof departSchema>>({
    resolver: zodResolver(departSchema),
    defaultValues: {
      depart: '',
      name: '',
      tel: '',
      fare_type: '',
      box_type: '',
      fare: 0,
      fare_add: 0
    }
  })

  const onSubmit = async (values: z.infer<typeof departSchema>) => {
    try {
      const response = await fetch("/api/depart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }), // ✅ 토큰과 데이터 함께 전송
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/depart"); // 성공 시 이동
      } else {
        toast({ title: data.error || "등록 실패" }); // 오류 메시지 표시
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
      toast({ title: "서버 오류 발생" });
    }
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
                보내는분
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='보내는분'
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
          name={"depart"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                집화예정점소
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='집화예정점소'
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
                보내는 분 전화번호
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder='보내는 분 전화번호'
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
              <FormLabel>운임구분</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="타입 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="선불">선불</SelectItem>
                  <SelectItem value="후불">후불</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="box_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>박스타입</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="타입 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="극소">극소</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"fare"}
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                기본운임
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  required
                  placeholder='기본운임'
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
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-base font-normal text-dark-500'>
                기타운임
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  required
                  placeholder='기타운임'
                  {...field}
                  className='book-form_input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='book-form_btn text-white'>
          상품 추가
        </Button>
      </form>
    </Form>
  )
}

export default DepartForm