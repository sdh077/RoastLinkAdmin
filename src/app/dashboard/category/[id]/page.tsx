import { ICategory, ICategoryOption } from '@/interface/product'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import EditForm from './edit-form'
import EditOptionForm from './edit-option-form '

const getCategory = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('goods_category')
    .select('*, goods_category_option(*)', { count: 'estimated' })
    .eq('id', id)
    .returns<ICategory>()
    .single()
}
const getCategoryOption = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('goods_category_option')
    .select('*', { count: 'estimated' })
    .eq('goods_category_id', id)
    .returns<ICategoryOption[]>()
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
    <div>

      <EditForm category={category} />
      <EditOptionForm categoryOptions={categoryOptions} />
    </div>
  )
}