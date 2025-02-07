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

// import { useToast } from '@/hooks/use-toast'

type Props = ICategoryOption & { goods_selection: IProductOption[] }
function EditOptionForm({ productOptions, categoryOptions }: { productOptions: IProductOption[], categoryOptions: Props[] }) {
  console.log(productOptions)
  return (
    <>
      <div>
        <div className='my-8 border-b-2'></div>
        {categoryOptions.map(categoryOption =>
          <div key={categoryOption.id}>
            <div>{categoryOption.title}</div>
            <CreateOption categoryOption={categoryOption} />
          </div>
        )}
      </div>
    </>
  )
}
export function CreateOption({ categoryOption }: { categoryOption: Props }) {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { goods_selection: selections } = categoryOption

  const form = useForm<z.infer<typeof productOptionSchema>>({
    resolver: zodResolver(productOptionSchema),
    defaultValues: selections.length ?
      {
        text: selections[0].text,
        goods_id: id,
        goods_category_option_id: categoryOption.id.toString()
      }
      :
      {
        text: '',
        goods_id: id,
        goods_category_option_id: categoryOption.id.toString()
      }
  })

  const onSubmit = async (values: z.infer<typeof productOptionSchema>) => {
    const supabase = await createClient()
    const { error } = selections.length ?
      await supabase
        .from('goods_selection')
        .update(values)
        .eq('id', selections[0].id)
        .select()
      :
      await supabase
        .from('goods_selection')
        .insert(values)
        .select()
    if (!error) router.refresh();
  }

  return (
    <>
      <Form {...form} key={categoryOption.id}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-4 gap-2">
          <div className="font-medium ">
            {categoryOption.content === '' ?
              <FormField
                control={form.control}
                name={"text"}
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
                {categoryOption.type === 'single' ?
                  <div>
                    <FormField
                      control={form.control}
                      name="text"
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
                              {categoryOption.content.split(',').map(o =>
                                <SelectItem key={o} value={o}>{o}</SelectItem>
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
                      name="text"
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
                              {categoryOption.content.split(',').map(o =>
                                <SelectItem key={o} value={o}>{o}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
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