'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
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

import { ICategoryOption, ICategoryOptionItem } from '@/interface/product'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
type Props = ICategoryOption & { category_option_item: ICategoryOptionItem[] }
function EditOptionForm({ categoryOptions }: { categoryOptions: Props[] }) {
  return (
    <>
      <div className='flex flex-col gap-8'>
        <CreateOptionRow />
        <div className='grid grid-cols-3 gap-16'>
          {categoryOptions.map((categoryOption) => (
            <div key={categoryOption.id} className='border rounded-md p-4 shadow-sm'>
              <EditOptionRow categoryOption={categoryOption} />
              <div className='my-4 border-t-2'></div>
              <div className=''>
                <div className='flex flex-col gap-4'>
                  {categoryOption.category_option_item.map(option =>
                    <CategoryOption key={option.id} option={option} />
                  )}
                  <CategoryOptionCreate categoryId={categoryOption.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )


}
export function EditOptionRow({ categoryOption }: { categoryOption: Props }) {
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
      .from('category_option')
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
        <div className='flex flex-col gap-4'>
          <div className="font-medium">
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
            {{
              "radio": '단일 선택',
              "checkbox": '복수 선택'
            }[categoryOption.type]}
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
function CategoryOptionCreate({ categoryId }: { categoryId: number }) {
  const [content, setContent] = useState('')
  const router = useRouter()
  const create = async () => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('category_option_item')
      .insert({ content, 'category_option_id': categoryId })
      .select()
    setContent('')
    router.refresh();
  }
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        <div>
          <Input value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>추가</Button>
        </div>
      </div>
    </div>
  )
}
function CategoryOption({ option }: { option: ICategoryOptionItem }) {
  const [use, setUse] = useState(option.use_yn)
  const changeUse = async () => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('category_option_item')
      .update({ 'use_yn': !use })
      .eq('id', option.id)
      .select()
    if (!error) setUse(!use)
  }
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        <div>
          {option.content}
        </div>
        <div>
          <Button onClick={() => changeUse()}>{use ? '노출중' : '노출중지'}</Button>
        </div>
      </div>
    </div>
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
      category_id: Number(id),
      type: 'text',
      content: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof categoryOptionSchema>) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('category_option')
      .insert(values)
      .select()
    if (!error) router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-5 gap-2 p-4 border rounded-md shadow-sm">
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
                    <SelectItem value="radio">단일 선택</SelectItem>
                    <SelectItem value="checkbox">복수 선택</SelectItem>
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