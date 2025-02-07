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
import { categoryOptionSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

import { ICategoryOption } from '@/interface/product'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
function EditOptionForm({ categoryOptions }: { categoryOptions: ICategoryOption[] }) {
  return (
    <>
      <div>
        <div>
          <div className='grid grid-cols-4'>
            <div className="">옵션명</div>
            <div>사용여부</div>
            <div>타입</div>
            <div className="text-right"></div>
          </div>
        </div>
        {categoryOptions.map((categoryOption) => (
          <EditOptionRow categoryOption={categoryOption} key={categoryOption.id} />
        ))}
        <div className='my-8 border-b-2'></div>
        <CreateOptionRow />
      </div>
    </>
  )


}
export function EditOptionRow({ categoryOption }: { categoryOption: ICategoryOption }) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof categoryOptionSchema>>({
    resolver: zodResolver(categoryOptionSchema),
    defaultValues: {
      ...categoryOption
    }
  })

  const onSubmit = async (values: z.infer<typeof categoryOptionSchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('goods_category_option')
      .update(values)
      .eq('id', categoryOption.id)
      .select()
    if (!error) {
      router.refresh();
      toast({
        title: "업데이트 완료",
      })
    }
    else {
      toast({
        title: "업데이트 실패",
        description: error.message
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className='grid grid-cols-4'>
          <div className="font-medium">
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem className='flex gap-1'>
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

          </div>
          <div>
            <FormField
              control={form.control}
              name={"use_yn"}
              render={({ field }) => (
                <FormItem className='flex gap-1'>
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
          </div>
          <div>
            {categoryOption.type}
          </div>
          <div className="font-medium ">
            <FormField
              control={form.control}
              name={"content"}
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel className='text-base font-normal text-dark-500 w-full'>
                    필드 선택시
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=',로 구별해주세요'
                      {...field}
                      className='book-form_input w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="text-right">
            <Button type="submit" className='book-form_btn text-white'>
              카테고리 옵션 변경
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
export function CreateOptionRow() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const form = useForm<z.infer<typeof categoryOptionSchema>>({
    resolver: zodResolver(categoryOptionSchema),
    defaultValues: {
      title: '',
      use_yn: true,
      goods_category_id: Number(id),
      type: 'text',
      content: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof categoryOptionSchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('goods_category_option')
      .insert(values)
      .select()
    if (!error) router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-4 gap-2">
        <div className="font-medium ">
          <FormField
            control={form.control}
            name={"title"}
            render={({ field }) => (
              <FormItem className=''>
                <FormLabel className='text-base font-normal text-dark-500 w-full'>
                  카테고리명
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder='카테고리 이름'
                    {...field}
                    className='book-form_input w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
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
        </div>
        <div>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>타입</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="타입 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">single</SelectItem>
                    <SelectItem value="multi">multi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="font-medium ">
          <FormField
            control={form.control}
            name={"content"}
            render={({ field }) => (
              <FormItem className=''>
                <FormLabel className='text-base font-normal text-dark-500 w-full'>
                  필드 선택시
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=',로 구별해주세요'
                    {...field}
                    className='book-form_input w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="text-right">
          <Button type="submit" className='book-form_btn text-white'>
            카테고리 옵션 추가
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditOptionForm