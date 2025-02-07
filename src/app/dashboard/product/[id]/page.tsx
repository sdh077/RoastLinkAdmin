import React from 'react'
import { createClient } from '@/lib/supabase/server';
import Heading from '@/components/heading';
import { IProduct } from '@/interface/product';
import EditOptionForm from './edit-option-form ';
import EditForm from './edit-form';


const getProductById = async (id: string): Promise<{ data: IProduct }> => {
  const supabase = await createClient()
  const { data } = await supabase.from('goods').select('*').eq('id', id).single()
  return { data }
}
const getProductOptionById = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('goods_selection').select('*').eq('goods_id', id)
}
const getProductCategoryOptionById = async (categoryId: string, productId: string) => {
  const supabase = await createClient()
  return await supabase.from('goods_category_option').select('*,goods_selection(*)')
    .eq('goods_category_id', categoryId)
    .eq('goods_selection.goods_id', productId)
}

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { id } = await params;
  const { data: product } = await getProductById(id);
  const { data: options } = await getProductOptionById(id)
  const { data: categoryOptions } = await getProductCategoryOptionById(product.category_id, id)
  if (options && categoryOptions)
    return (
      <div>
        <Heading>{product.name}</Heading>
        <div>{product.description}</div>

        <EditForm product={product} />
        {categoryOptions && <EditOptionForm productOptions={options} categoryOptions={categoryOptions} />}
      </div>
    )
}

export default page