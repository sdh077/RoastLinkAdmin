'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ICategory, IProduct } from '@/interface/product'
import { toast } from '@/hooks/use-toast'
import { productSchema } from '@/lib/validations'

type FormValues = z.infer<typeof productSchema>

const TEXT_FIELDS: { name: keyof FormValues; label: string; placeholder?: string }[] = [
  { name: 'name', label: '상품명', placeholder: '상품명을 입력하세요' },
  { name: 'eng_name', label: '영문명', placeholder: 'Product name' },
  { name: 'description', label: '설명', placeholder: '상품 설명' },
  { name: 'link', label: '링크', placeholder: 'https://' },
  { name: 'image', label: '이미지 링크', placeholder: 'https://...' },
]

export function ProductForm({ initial }: { initial?: IProduct }) {
  const router = useRouter()
  const [categories, setCategories] = useState<ICategory[]>([])
  const isEdit = !!initial

  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? { ...initial, category_id: initial.category_id.toString() }
      : { name: '', eng_name: '', description: '', image: '', price: 0, price_sale: 0, is_delete: false, category_id: '0', link: '' },
  })

  useEffect(() => {
    createClient().from('category').select('*').returns<ICategory[]>()
      .then(({ data }) => data && setCategories(data))
  }, [])

  const onSubmit = async (values: FormValues) => {
    if (values.category_id === '0') {
      toast({ title: '카테고리를 선택해주세요' })
      return
    }
    const supabase = createClient()
    const payload = { ...values, category_id: Number(values.category_id) }
    const { error } = isEdit
      ? await supabase.from('product').update(payload).eq('id', initial!.id).select()
      : await supabase.from('product').insert([payload]).select()

    if (error) {
      toast({ title: '저장에 실패했습니다', description: error.message })
      return
    }
    toast({ title: isEdit ? '수정 완료' : '상품이 추가되었습니다' })
    isEdit ? router.refresh() : router.push('/product')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          {TEXT_FIELDS.map(({ name, label, placeholder }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>정가</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='0' {...field} value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price_sale'
            render={({ field }) => (
              <FormItem>
                <FormLabel>할인가</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='0' {...field} value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4 items-end'>
          <FormField
            control={form.control}
            name='category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='카테고리 선택' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>{item.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='is_delete'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2 pb-2'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className='!mt-0'>노출 중지</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit'>{isEdit ? '수정' : '상품 추가'}</Button>
      </form>
    </Form>
  )
}
