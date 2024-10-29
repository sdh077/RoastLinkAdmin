import React from 'react'
import { Product } from '../page';
import { createClient } from '@/lib/supabase/server';
import Heading from '@/components/heading';


const getProductById = async (id: string): Promise<{ data: Product }> => {
  const supabase = await createClient()
  const { data } = await supabase.from('goods').select('*').eq('id', id).single()
  return { data }
}

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { id } = await params;
  const { data } = await getProductById(id);
  console.log(data)
  return (
    <div>
      <Heading>{data.name}</Heading>
      <div>{data.description}</div>
    </div>
  )
}

export default page