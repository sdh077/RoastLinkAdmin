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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { productOptionSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

import { ICategoryOption, IProductOption } from '@/interface/product'
import { toast } from '@/hooks/use-toast'

// import { useToast } from '@/hooks/use-toast'

type Props = ICategoryOption & { category_option_item: IProductOption[] }
function EditOptionForm({ productOptions, categoryOptions }: { productOptions: IProductOption[], categoryOptions: Props[] }) {
  return (
    <>
      <div>
        <div className='my-8 border-b-2'></div>
        <div className='grid grid-cols-4 gap-8'>
          {categoryOptions.map(categoryOption => {
            const productOption = productOptions.find(po => po.category_option_id === categoryOption.id)
            if (productOption)
              return (
                <div key={categoryOption.id} className='border p-2'>
                  <div>{categoryOption.title}</div>
                  {/* {categoryOption.type === 'input' && <div>{productOption.content}</div>} */}
                  {categoryOption.type === 'radio' && <div>
                    {categoryOption.category_option_item.find(co => co.id === Number(productOption.content))?.content}
                  </div>}
                </div>
              )
            return (
              <div key={categoryOption.id} className='border p-2'>
                <div>{categoryOption.title}</div>
                <CreateOption categoryOption={categoryOption} />
              </div>
            )
          }
          )}
        </div>
      </div>
    </>
  )
}
export function CreateOption({ categoryOption }: { categoryOption: Props }) {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { category_option_item: selections } = categoryOption
  const form = useForm<z.infer<typeof productOptionSchema>>({
    resolver: zodResolver(productOptionSchema),
    defaultValues:
    {
      price: 0,
      price_sale: 0,
      content: '',
      is_delete: false,
      is_view: true,
      product_id: Number(id),
      category_option_id: categoryOption.id,
    }
  })

  const onSubmit = async (values: z.infer<typeof productOptionSchema>) => {
    const supabase = await createClient()
    const { error } =
      await supabase
        .from('product_option')
        .insert(values)
        .select()
    if (!error) router.refresh();
    else toast({
      title: error.message,
    })
  }

  return (
    <>
      <Form {...form} key={categoryOption.id}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="font-medium ">
            {categoryOption.content === '' ?
              <FormField
                control={form.control}
                name={"content"}
                render={({ field }) => (
                  <FormItem className=''>
                    <FormLabel className='text-base font-normal text-dark-500 w-full'>
                      text
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder='text'
                        {...field}
                        className='book-form_input w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              :
              <>
                {categoryOption.type === 'radio' ?
                  <div>
                    <FormField
                      control={form.control}
                      name="category_option_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>타입</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="타입 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOption.category_option_item.map(item =>
                                <SelectItem key={item.id} value={item.id.toString()}>{item.content}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  :
                  <div>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>타입</FormLabel>
                          <Input
                            required
                            placeholder='text'
                            {...field}
                            className='book-form_input w-full'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                }
              </>
            }
          </div>
          <div className="text-right">
            <Button type="submit" className='book-form_btn text-white'>
              제출
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
export default EditOptionForm