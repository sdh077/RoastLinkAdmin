import { ICategory, ICategoryOption, ICategoryOptionItem } from '@/interface/product'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import EditForm from './edit-form'
import EditOptionForm from './edit-option-form '

type Props = ICategoryOption & { category_option_item: ICategoryOptionItem[] }

const getCategory = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('category')
    .select('*, category_option(*)', { count: 'estimated' })
    .eq('id', id)
    .returns<ICategory>()
    .single()
}
const getCategoryOption = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('category_option')
    .select('*, category_option_item(*)', { count: 'estimated' })
    .eq('category_id', id)
    .returns<Props[]>()
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: category, error } = await getCategory(id)
  const { data: categoryOptions, error: error2 } = await getCategoryOption(id)
  if (error || !category || error2 || !categoryOptions) return <div>잘못된 접근</div>
  return (
    <div className='flex flex-col gap-8'>
      <EditForm category={category} />
      <EditOptionForm categoryOptions={categoryOptions} />
    </div>
  )
}